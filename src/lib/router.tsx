"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { parsePath, type AppRoute } from "./routes";

type RouterValue = {
  path: string;
  route: AppRoute;
  go: (to: string) => void;
};

const RouterContext = createContext<RouterValue | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname || "/");

  const go = useCallback((to: string) => {
    const next = to.startsWith("/") ? to : `/${to}`;
    if (next === window.location.pathname) {
      window.scrollTo(0, 0);
      return;
    }
    window.history.pushState({}, "", next);
    setPath(next);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    function onPop() {
      setPath(window.location.pathname || "/");
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const value = useMemo<RouterValue>(
    () => ({ path, route: parsePath(path), go }),
    [go, path],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) throw new Error("useRouter must be used within RouterProvider");
  return context;
}
