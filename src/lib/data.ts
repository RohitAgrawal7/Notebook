import type { DiaryEntry, Note, ReportFile } from "./types";

export const notes: Note[] = [
  {
    id: "note-paper-contract",
    title: "The paper contract",
    summary:
      "A working interface should inherit the promises of a physical folio: margins, sequence, and a place for the hand to rest.",
    body: "Readers do not arrive at a document looking for chrome. They arrive looking for a place to think. The sheet, the gutter, and the red margin are not decoration — they are a contract. The left margin holds dates, pins, and asides. The body holds prose that can be read at a walking pace. Pagination is not a leftover from print; it is how memory finds its way back to a sentence. When we break that contract with infinite scroll and floating toolbars, the page stops feeling like a place and starts feeling like a feed.",
    category: "Design",
    date: "2026-09-12",
    tags: ["layout", "margins", "memory"],
    pinned: true,
  },
  {
    id: "note-three-registers",
    title: "Three registers, one spine",
    summary:
      "Notebook, diary, and report files are not three apps. They are three speeds of the same hand.",
    body: "The notebook is for capture and arrangement: short, titled, pinned, sorted by the work. The diary is for sequence: one day after another, no categories shouting for attention. The report file is for the public voice — letterhead, status, a recipient. Keep them in one binder so a thought can migrate: a diary line becomes a note, a note is filed as a report. The spine is the only navigation a reader should need to trust.",
    category: "Research",
    date: "2026-09-11",
    tags: ["information architecture", "hierarchy"],
    pinned: true,
  },
  {
    id: "note-margin-lane",
    title: "The margin as a working lane",
    summary:
      "Dates, pins, and stamps belong in the gutter — never in the sentence.",
    body: "Composition books understood this a century ago. A hard red rule keeps metadata from contaminating the reading column. On a screen the same rule still works: the eye learns that the cream column is for language and the ochre strip is for handling. Pinning a note should feel like pressing a brass tack into that strip, not like starring a card in a dashboard. If a control cannot live in the margin, it probably does not belong on the page.",
    category: "Design",
    date: "2026-09-10",
    tags: ["gutter", "pinning", "typography"],
    pinned: false,
  },
  {
    id: "note-archives-visit",
    title: "Municipal archives, Tuesday morning",
    summary:
      "Filing cabinets still teach more about retrieval than most digital folders.",
    body: "The clerk opened drawer C–F and the room smelled of manila and dust. Tabs were worn at the thumb. Inside each folder: a cover sheet, a date stamp, a thin stack in chronological order. Nothing searched. Everything could be found. The lesson is not nostalgia. It is that retrieval prefers a visible hierarchy — drawer, folder, leaf — over a single search box that forgets what you were holding. Our report section should feel like that drawer: an index first, then the document itself, still warm from the folder.",
    category: "Field",
    date: "2026-09-08",
    tags: ["archives", "filing", "observation"],
    pinned: false,
  },
  {
    id: "note-type-scale",
    title: "A type scale that can be lived in",
    summary:
      "Body at 17–19px, a true serif, line length near 62 characters. Titles should sit, not shout.",
    body: "Long reading fails when the face is a UI font pretending to be literature. Source Serif holds ink the way a metal face does: sturdy serifs, open counters, no costume. Keep the measure short enough that the eye returns without hunting. Let diary pages breathe with a slightly looser leading. Reports may tighten a point and add a hairline rule under the letterhead. Never mix more than two families on a single leaf.",
    category: "Reference",
    date: "2026-09-07",
    tags: ["type", "measure", "leading"],
    pinned: false,
  },
  {
    id: "note-pin-vs-file",
    title: "Pinning is not filing",
    summary:
      "A pin is a temporary claim. A file is a decision about where a thing lives.",
    body: "People confuse the two and the interface becomes a junk drawer of stars. A pin means: keep this in reach while the work is hot. Filing means: this thought has a folder, a code, and a status. Pins should be few, visible as ribbons on the spine, and easy to pull out. Files should appear in the report register with a stamp — draft, review, filed — so the pile has a moral order. If everything is pinned, nothing is.",
    category: "Research",
    date: "2026-09-05",
    tags: ["priority", "workflow"],
    pinned: false,
  },
];

export const diaryEntries: DiaryEntry[] = [
  {
    id: "diary-2026-09-08",
    date: "2026-09-08",
    weekday: "Tuesday",
    place: "City archives, lower reading room",
    title: "Dust on the tabs",
    mood: "Attentive",
    pinned: false,
    body: [
      "I signed the visitor book with a leaking fountain pen and spent the first hour pretending not to be delighted by the furniture. Oak tables. Brass lamps with green glass. A clock that does not apologize for ticking. The attendant brought me box 14 without asking what I hoped to find, which I took as a kindness.",
      "The folders were kinder than any interface I have shipped. Each one told me, before I opened it, what kind of morning I was about to have. I copied the tab language into the back of my notebook: surname, year, a single verb. Not a tag cloud. A sentence fragment you could file under.",
      "Walking home I kept thinking that software keeps offering me a search bar because it is ashamed of its shelves. I would like, for once, to be proud of the shelves.",
    ],
  },
  {
    id: "diary-2026-09-09",
    date: "2026-09-09",
    weekday: "Wednesday",
    place: "Studio, after the critique",
    title: "They asked where the pages go",
    mood: "Clarified",
    pinned: true,
    body: [
      "The critique lasted longer than the work on the table. That is usually a good sign. Mira asked the only question that mattered: if this is a notebook, where do the pages go when I am finished with a thought? I had been treating sections like destinations. She treated them like speeds.",
      "We drew the migration on tracing paper. A diary line, dated. A note, titled and pinned. A report, addressed. The same sentence can live in all three if the binder keeps the handwriting honest. I came home and rewrote the information model before dinner.",
      "Later I made tea and did not open a laptop. That felt like part of the design.",
    ],
  },
  {
    id: "diary-2026-09-11",
    date: "2026-09-11",
    weekday: "Friday",
    place: "Kitchen table, late",
    title: "The red rule",
    mood: "Quiet",
    pinned: false,
    body: [
      "Rain against the courtyard. I ruled a leftover sheet with a carpenter’s pencil and a length of bookbinder’s tape, just to see whether the old proportion still holds. It does. The body column is where I tell the truth. The margin is where I handle the truth.",
      "I keep wanting the product to smell faintly of paper. That is an unreasonable request and also the entire brief. If the screen cannot smell, it can at least refuse to flicker. No badges bouncing. No cards lifting themselves into the air. A leaf, a number, a way to turn.",
      "Tomorrow I will write the letterhead for the Q3 study and pretend I work in an office that still keeps a date stamp by the door.",
    ],
  },
  {
    id: "diary-2026-09-12",
    date: "2026-09-12",
    weekday: "Saturday",
    place: "Window seat, morning",
    title: "Two cups, one measure",
    mood: "Steady",
    pinned: false,
    body: [
      "I set the type sample next to a paperback and adjusted the size until the paperback stopped looking insulted. Nineteen pixels on this display, give or take the weather. The serif needed weight in the thins or the morning light made it disappear.",
      "Pinned the paper-contract note. It has been sitting in my head since the archives and I am tired of hunting for it. A pin should be a physical relief — the knowledge that a thought will still be on the spine when I come back from the market.",
      "The rest of the day I will leave alone. A diary that reports every hour is just another feed.",
    ],
  },
  {
    id: "diary-2026-09-13",
    date: "2026-09-13",
    weekday: "Sunday",
    place: "Studio annex",
    title: "Preparing the folio for Monday",
    mood: "Resolved",
    pinned: false,
    body: [
      "I numbered the leaves as if someone else might need to cite them. That someone is probably future me, who loses arguments with present me about where things went. Notebook pages first, because the work is still hot. Diary in calendar order, because a journal that starts at the end is a performance. Reports behind a manila index, because formality is a kind of care.",
      "If the folio is honest, Monday will not require a tour. You open the binder. You find the tab. You turn the page.",
    ],
  },
];

export const reports: ReportFile[] = [
  {
    id: "report-q3-readability",
    code: "FOLIO-R-14",
    title: "Interface Readability Study — Third Quarter",
    folder: "Studies",
    status: "filed",
    author: "A. Sen, Design Research",
    date: "2026-09-10",
    recipient: "Studio directors and records office",
    summary:
      "A formal account of how paginated, paper-like layouts affect reading endurance, recall, and willingness to file work, compared with continuous card feeds.",
    pinned: true,
    sections: [
      {
        heading: "1. Purpose",
        paragraphs: [
          "This study asks whether a document-centric interface — one that preserves page sequence, visible margins, and a filing index — improves the conditions under which people read and later retrieve their own writing. The question is practical. Teams are losing work not because storage fails, but because the interface offers no place that feels finished.",
        ],
      },
      {
        heading: "2. Method",
        paragraphs: [
          "Twelve practitioners kept parallel records for three weeks: a conventional notes application with infinite scroll, and a paginated folio divided into notebook, diary, and report files. Sessions were observed in the studio and, in two cases, at the municipal archives. We measured time-to-first-useful-sentence, self-reported rereading, and successful retrieval after seven days.",
        ],
      },
      {
        heading: "3. Findings",
        paragraphs: [
          "Participants reread folio pages more often and with less searching. The index-plus-leaf pattern in the report section produced the highest retrieval accuracy. Pinning was used sparingly when pins were visually costly — a ribbon on the spine rather than a hollow star — and those few pins accounted for most return visits.",
          "Several participants described the diary’s one-entry-per-page constraint as a relief. The page ending became a compositional tool. In the control application, entries lengthened without gaining shape.",
        ],
      },
      {
        heading: "4. Recommendation",
        paragraphs: [
          "Adopt a single binder with three registers. Keep pagination literal. Place priority in a spine rail, not in the prose. File finished work behind a manila index with a visible status stamp. The interface should be suitable for submission: a director should be able to print a leaf and not be embarrassed by it.",
        ],
      },
    ],
  },
  {
    id: "report-archives-field",
    code: "FOLIO-F-08",
    title: "Field Notes: Municipal Archives",
    folder: "Field",
    status: "review",
    author: "A. Sen",
    date: "2026-09-08",
    recipient: "Records office, copy to studio library",
    summary:
      "Observation of drawer–folder–leaf retrieval in a working public archive, with implications for the report-file register.",
    pinned: false,
    sections: [
      {
        heading: "1. Setting",
        paragraphs: [
          "Lower reading room, 9:40 to 12:15. Supervised access. Boxes requested by number. No public terminals at the table. The room enforces a pace that software usually tries to abolish.",
        ],
      },
      {
        heading: "2. The unit of work",
        paragraphs: [
          "A folder is the unit, not a document and not a database row. The cover sheet names the contents; the stack inside is chronological; the tab is worn at the exact height of a thumb. Digital filing that hides the folder in order to celebrate the file will always feel thinner than this.",
        ],
      },
      {
        heading: "3. Transfer to the folio",
        paragraphs: [
          "The report section should open on an index of folders, then admit one document at a time onto the desk. Status stamps — draft, review, filed — stand in for the clerk’s date stamp. Cross-reference codes remain in the letterhead so a leaf can be cited without a URL.",
        ],
      },
    ],
  },
  {
    id: "report-interaction-model",
    code: "FOLIO-S-03",
    title: "Submission: Folio Interaction Model",
    folder: "Submissions",
    status: "draft",
    author: "A. Sen, for studio review",
    date: "2026-09-13",
    recipient: "Monday desk meeting",
    summary:
      "The proposed interaction model for moving between notebook pages, diary leaves, and report files without breaking the reading line.",
    pinned: false,
    sections: [
      {
        heading: "1. Movement",
        paragraphs: [
          "Tabs change the register. Leaves turn within a register. Pins jump a reader to a known leaf. Nothing else should teleport. Arrow keys, on-page controls, and a swipe on small screens are the same gesture: the next sheet arrives from the right, the previous sheet from the left.",
        ],
      },
      {
        heading: "2. Hierarchy on the leaf",
        paragraphs: [
          "Every leaf carries an eyebrow (register and date), a title, a body set for continuous reading, and a footer with the leaf number. Notebook leaves may hold two short notes. Diary leaves hold one day. Report leaves hold either the filing index or a single addressed document.",
        ],
      },
      {
        heading: "3. Outstanding questions",
        paragraphs: [
          "Whether a two-page spread is worth the lost measure on laptop screens. Whether pins should expire. Whether a printed stylesheet is in scope for the first filing. These can wait until the binder is pleasant to sit with.",
        ],
      },
    ],
  },
  {
    id: "report-type-spec",
    code: "FOLIO-R-11",
    title: "Typographic Specification for Folio Leaves",
    folder: "Studies",
    status: "filed",
    author: "A. Sen with type desk",
    date: "2026-09-06",
    recipient: "Studio library",
    summary:
      "Binding specification for faces, measure, and paper colour so that notebook, diary, and report leaves remain one family.",
    pinned: false,
    sections: [
      {
        heading: "1. Faces",
        paragraphs: [
          "A book serif (Iowan, Palatino, or Source Serif) for every reading column. Geist for tabs, stamps, and the spine. Geist Mono for codes, leaf numbers, and the red-rule dates. No additional display face. Titles are the text face at a larger size, not a costume.",
        ],
      },
      {
        heading: "2. Colour of the sheet",
        paragraphs: [
          "Ivory, not white. A faint warm grain. Ruled lines only in the notebook register, and only in the body column. Diary sheets remain plain so the day can take its own shape. Report sheets carry a letterhead rule and a status stamp in the upper right.",
        ],
      },
      {
        heading: "3. Binding",
        paragraphs: [
          "A leather spine remains visible at every breakpoint above the small screen. On the small screen the spine collapses to a thin ledger bar; the sheet still has margins. The reader should never lose the sense that they are holding one folio.",
        ],
      },
    ],
  },
];
