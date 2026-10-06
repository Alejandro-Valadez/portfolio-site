export const PROFILE = {
  name: "Alejandro Valadez",
  tagline:
    "Sophomore at the Illinois Mathematics and Science Academy focused on aerospace engineering, finance, and business. I build small software tools, run experiments, and tutor in the program that got me here.",
  badges: [
    "IMSA Class of 2029",
    "PROMISE Scholar → Tutor",
    "Aerospace Engineering, Toulouse",
  ],
  email: "alejandrovaladezmail@gmail.com",
  github: "https://github.com/Alejandro-Valadez",
  linkedin: "https://www.linkedin.com/in/alejandro-valadez",
  resume: "/alejandro-valadez-resume.pdf",
  cv: "/alejandro-valadez-cv.pdf",
  photo: "/alejandro-valadez.jpg",
  bio: [
    "I do all of this because I want to challenge myself, keep learning, and understand the world at a deeper level. My upbringing taught me resilience, hard work, and how to see things from other people's perspectives, and I bring that to the things I care about most: engineering, business, finance, and investing.",
    "School didn't always challenge me, so I went looking for it. I believe leadership is defined by action. In middle school, I served as 8th grade class president, earned a state Silver Award from the Illinois Junior Academy of Science for my research, and led an IB community project, “Avenues to Kindness,” that earned the Tim Heneghan S.O.A.R. Award. At Jones College Prep, a selective-enrollment school ranked among the best in Illinois, I commuted two hours a day, kept a 4.0 unweighted GPA, was elected Vice President of the Class of 2029, and filled my time with high-commitment activities like debate, math team, FBLA, and rocketry. What I didn't know yet was how much students were doing outside of school. None of my schools had programs that showed me that.",
    "IMSA did. I joined its PROMISE program in 7th grade and spent three years of weekend sessions and summer internships working toward the academy. Now I'm a sophomore here, and I tutor 9th graders in the same program. What I value most is the environment: world-class teachers, classes that are hard in the best way, and upperclassmen who have mentored me and pointed me toward competitions and ideas. There's a real path here to do research, get involved beyond class, and build things. Shoutout to IN2.",
    "I see the world through economics and opportunity. Since 2023, I've run a seasonal shaved ice and caramel apple stand and learned about supply chains and margins the hard way. That curiosity also goes into code: I build tools for problems I actually have, like an MCP server that lets Claude read my Canvas coursework.",
  ],
} as const;

export type FocusArea = {
  title: string;
  description: string;
};

export const FOCUS_AREAS: readonly FocusArea[] = [
  {
    title: "Aerospace Engineering",
    description:
      "On scholarship, I spent a month in Toulouse in an Airbus-partnered aerospace program, where I led my team's model rocket build at INSA Toulouse. Before that, Rocketry Club at Jones; now IMSA's AEROspace Club.",
  },
  {
    title: "Finance & Investing",
    description:
      "I've traded and invested since I was 10: index ETFs like VOO and QQQ for the long term, and options for the short term. Trading has earned me about $15,000, and losing $5,000 to emotional trades taught me to set a take-profit and stop-loss every time.",
  },
  {
    title: "Business",
    description:
      "Since 2023, I've run a shaved ice and caramel apple stand every summer and fall, from sourcing to marketing. My younger brother runs it now. I'm part of IMSA's TALENT entrepreneurship program and was in FBLA at Jones.",
  },
  {
    title: "Leadership",
    description:
      "As elected Class of 2029 Vice President at Jones, I helped run six events, including the school's first underclassmen Spring Dance. I stage-managed two musicals and now tutor 9th graders in IMSA's PROMISE program.",
  },
];

export type Project = {
  title: string;
  kind: string;
  description: string;
  tags: readonly string[];
  highlight?: string;
  links?: readonly { label: string; href: string }[];
  /** Featured projects get a card at the top of Work; `cover` picks its art. */
  featured?: { summary: string; cover: ProjectCover };
};

export type ProjectCover = "rocket" | "terminal" | "board" | "ramps";

export const PROJECTS: readonly Project[] = [
  {
    title: "Aerospace Engineering in Toulouse",
    kind: "Program",
    description:
      "The summer after freshman year, I earned a scholarship to a month-long aerospace engineering program with CIEE in Toulouse, France, run in partnership with Airbus. We had classes every day with doctorate-level instructors. Over eight workshops at INSA Toulouse, a leading engineering university, I led my team in designing a model rocket in OpenRocket, then building and launching it. When our parachute failed a bench test, we reinforced the heat shield and upgraded the suspension cord, and the rocket flew straight on launch. We also walked an Airbus assembly line and toured the city's aerospace museums.",
    tags: ["Aerospace", "OpenRocket", "Team Lead", "Toulouse, France"],
    highlight: "Summer 2026 · Scholarship",
    featured: {
      summary:
        "Led my team's model rocket build over eight workshops at INSA Toulouse, in a month-long, Airbus-partnered program I attended on scholarship.",
      cover: "rocket",
    },
  },
  {
    title: "Canvas LMS MCP Server",
    kind: "Software",
    description:
      "An MCP server that connects Claude to Canvas LMS, so I can ask what's due, pull up a rubric, or read instructor feedback in plain conversation — and submit work without leaving the chat. Covers courses, assignments, discussions, submissions, and reading .docx attachments.",
    tags: ["TypeScript", "Node.js", "Model Context Protocol", "Canvas API"],
    highlight: "Open source, MIT licensed",
    links: [{ label: "Source", href: "https://github.com/Alejandro-Valadez/canvas-mcp" }],
    featured: {
      summary:
        "An open-source MCP server that lets Claude read my Canvas courses, assignments, rubrics, and feedback, and submit work from the chat.",
      cover: "terminal",
    },
  },
  {
    title: "Le Grand Tour",
    kind: "Software",
    description:
      "A multiplayer French-review board game for my IMSA French III class, where two to six players play from their phones. I built it on my own, first as a website and then as a published Roblox game scripted in Luau.",
    tags: ["TypeScript", "Multiplayer", "Roblox", "Luau"],
    links: [
      { label: "Play", href: "https://le-grand-tour.vercel.app" },
      { label: "Source", href: "https://github.com/Alejandro-Valadez/le-grand-tour" },
    ],
    featured: {
      summary:
        "A multiplayer French-review board game I built on my own, first as a website, then as a published Roblox game in Luau.",
      cover: "board",
    },
  },
  {
    title: "Runaway Ramps: Slowing Down With Science",
    kind: "Research",
    description:
      "A physics study modeled on highway runaway truck ramps. I built a ramp-and-RC-car rig and measured stopping distance on concrete, sand, gravel, and glass. Gravel stopped the car in 0.41 m, while glass took 1.21 m, roughly three times farther, which showed that surface texture drives stopping distance.",
    tags: ["Experimental Design", "Physics", "Data Analysis"],
    highlight: "IJAS State Exposition — Silver Award",
    links: [
      {
        label: "Publication",
        href: "https://www.researchgate.net/publication/414086383_Runaway_Ramps_Slowing_Down_With_Science_IJAS_2025",
      },
    ],
    featured: {
      summary:
        "Physics research on runaway truck ramps. Gravel stopped my RC car in 0.41 m; glass took 1.21 m. Silver Award at the IJAS state exposition.",
      cover: "ramps",
    },
  },
  {
    title: "Avenues to Kindness",
    kind: "Service",
    description:
      "I partnered with a disability-independence organization to design and deliver 90 handmade cards to their residents. The project earned the Tim Heneghan S.O.A.R. Award — given to two students in my graduating class — and the IB Principled Learner Award for disability advocacy.",
    tags: ["Community Partnership", "Disability Advocacy"],
    highlight: "One of two S.O.A.R. Award recipients",
  },
  {
    title: "Class of 2029 Vice President",
    kind: "Leadership",
    description:
      "Elected Vice President of the Class of 2029 at Jones College Prep. I set up and ran our meetings, listened to classmates and brought their ideas to the board, wrote our meeting reports, and wrote the mid-year and end-of-year reports to administration. Our board ran six events, including a Winter Movie Night, a Valentine's card fundraiser, and the school's first underclassmen Spring Dance. I worked with administration to get the dance approved, and it raised $3,000 for our class.",
    tags: ["Student Government", "Event Planning", "Fundraising"],
    highlight: "Spring Dance raised $3,000",
  },
  {
    title: "8th Grade Class President",
    kind: "Leadership",
    description:
      "As class president at Ebinger Elementary, I organized three dances (a Hawaiian-themed dance, a Halloween dance, and a winter formal) and helped set up and run the school's IB Nights, open houses for prospective families. I also set up partnerships with local restaurants: customers who mentioned our school got 15% off, and 15% of those sales came back to our class.",
    tags: ["Student Government", "Event Planning", "Partnerships"],
    highlight: "Three dances, restaurant fundraising",
  },
  {
    title: "Stage Manager, Two Musicals",
    kind: "Leadership",
    description:
      "I stage-managed The Lion King Jr. and Beauty and the Beast Jr. in middle school. Most of the job is handling what nobody can plan for: during one show, a set piece started to fall, and I got it back up mid-scene. Clear communication with the sound and lights crews is what made each show run.",
    tags: ["Theater", "Crew Coordination"],
  },
  {
    title: "Shaved Ice & Caramel Apples",
    kind: "Entrepreneurship",
    description:
      "Since 2023, I've run a shaved ice and caramel apple stand every summer and fall. I handled all of it: sourcing fresh local syrups, inventory, setup and teardown, storage, maintenance, and marketing. Shaved ice sold for $2 a cup and cost about 60¢ to make, bringing in around $150 a day in profit. In the fall, we sold $5 cups of apple slices topped with caramel, peanuts, candy, and chocolate, bringing in about $200 a day in profit. Yard signs, flags, and social pages with 5,000+ followers across Instagram, Facebook, Snapchat, and Nextdoor made us known around the neighborhood. In 2026, I sold part of the business to my younger brother, who runs it now, and I still earn a share of the profits.",
    tags: ["Operations", "Pricing", "Marketing"],
    highlight: "Since 2023 · now run by my brother",
  },
];

export type Honor = {
  date: string;
  scope?: string;
  title: string;
  org?: string;
  note?: string;
};

export const HONORS: readonly Honor[] = [
  {
    date: "Jun 2026",
    title: "4.0 Unweighted / 4.8 Weighted GPA, Freshman Year",
    org: "Jones College Prep",
  },
  {
    date: "May 2026",
    scope: "State",
    title: "Admitted, Class of 2029",
    org: "Illinois Mathematics and Science Academy",
    note: "Illinois' statewide residential public academy for students advanced in mathematics and science; admitted for sophomore year.",
  },
  {
    date: "Mar 2026",
    scope: "Regional",
    title: "Northwestern Policy Debate City Championship — Quarterfinalist",
  },
  {
    date: "Nov 2025",
    scope: "Regional",
    title: "Student Video Team Math Contest — 1st Place",
    org: "Jones College Prep",
  },
  {
    date: "Sep 2025",
    scope: "Regional",
    title: "Algebra 1 Contest — Selected Team Starter",
    org: "City of Chicago Math League",
  },
  {
    date: "Sep 2025",
    scope: "School",
    title: "Elected Vice President, Class of 2029",
    org: "Jones College Prep",
  },
  {
    date: "Jun 2025",
    scope: "State",
    title: "SEAMS Diligent Scholar Award",
    org: "Illinois Mathematics and Science Academy",
  },
  {
    date: "Jun 2025",
    scope: "State",
    title: "State Seal of Biliteracy in Spanish",
  },
  {
    date: "Jun 2025",
    title:
      "Tim Heneghan S.O.A.R. Award — Socially Active, Open-minded, Accountable, Respectful",
    note: "One of two recipients in the graduating class, for “Avenues to Kindness.”",
  },
  {
    date: "Jun 2025",
    title: "IB Principled Learner Award for Disability Advocacy",
    note: "Awarded for the “Avenues to Kindness” project.",
  },
  {
    date: "May 2025",
    scope: "State",
    title: "98th Annual State Exposition — Silver Award",
    org: "Illinois Junior Academy of Science",
    note: "For independent research, “Runaway Ramps: Slowing Down With Science.”",
  },
  {
    date: "Mar 2025",
    scope: "Regional",
    title:
      "75th Annual Chicago Exhibition of Student STEM Research — Advanced to State",
  },
  {
    date: "Feb 2025",
    scope: "Regional",
    title: "Regional STEM Exhibition — Gold Award",
  },
  {
    date: "Dec 2024",
    title: "Local Science Fair — Gold Award",
    org: "Ebinger Elementary",
  },
  {
    date: "Sep 2024",
    title: "Student Government Association President",
    org: "Ebinger Elementary",
  },
  {
    date: "Dec 2023",
    title: "IB Open-Minded Student Award",
  },
];

export type ActivityGroup = {
  heading: string;
  note: string;
  items: readonly string[];
};

export const ACTIVITIES: readonly ActivityGroup[] = [
  {
    heading: "Illinois Mathematics and Science Academy",
    note: "2026 – present",
    items: [
      "IMSA PROMISE Program — Tutor, 9th grade",
      "AEROspace Club (AERO)",
      "IMSA Society of Engineers (ISE)",
      "Physics Club",
      "Speech Team",
      "Financial Empowerment Class (FEC)",
      "IMSA Student Productions (ISP)",
      "Alma Latina",
      "TALENT (Total Applied Learning for Entrepreneurs)",
      "Intramural Sports",
    ],
  },
  {
    heading: "Jones College Prep",
    note: "2025 – 26",
    items: [
      "Student Government Association — Class of 2029 Vice President",
      "IMSA PROMISE Program — Student, 2023–26",
      "Math Team",
      "Artificial Intelligence Leaders",
      "Engineering Club",
      "Rocketry Club",
      "Debate Team",
      "Future Business Leaders of America",
      "Red Cross Club",
      "Mexican American Cultural Exploration and Expression",
      "Formula 1 Fan Club",
    ],
  },
  {
    heading: "Middle School",
    note: "2023 – 25",
    items: [
      "Science Fair — 2024–25",
      "Student Government Association — 2023–25 (President, 2024–25)",
      "MYP Community Projects — 2024–25",
      "Stage Manager, Beauty and the Beast Jr. — 2024–25",
      "Stage Manager, The Lion King Jr. — 2023–24",
      "World Club — 2023–24",
      "Soccer and basketball teams, Ebinger Elementary",
    ],
  },
];

export const SKILLS: readonly string[] = [
  "Python",
  "TypeScript",
  "JavaScript",
  "React & Next.js",
  "Node.js",
  "Git & GitHub",
  "Model Context Protocol",
  "Experimental design",
  "Data analysis",
  "Policy debate & speech",
  "Spanish — State Seal of Biliteracy",
];

// Short tool list for the "I build with" tile on the home page.
export const STACK: readonly string[] = [
  "TypeScript",
  "Python",
  "Next.js",
  "React",
  "Node.js",
  "Luau",
  "MCP",
  "Git",
  "OpenRocket",
];

export type TimelineEntry = {
  /** Shown big and sticky beside the entry. */
  period: string;
  title: string;
  body: string;
  stats?: readonly { value: string; label: string }[];
};

// Newest first. Only things that are on the record elsewhere on this page.
export const TIMELINE: readonly TimelineEntry[] = [
  {
    period: "Fall 2026",
    title: "Sophomore at IMSA",
    body: "After three years of PROMISE weekend sessions and summer internships, I started at the Illinois Mathematics and Science Academy. On Saturdays I tutor 9th graders in that same program. I joined AEROspace Club, the IMSA Society of Engineers, and TALENT, I take the Financial Empowerment Class, and I built Le Grand Tour for French III.",
    stats: [
      { value: "Class of 2029", label: "IMSA" },
      { value: "PROMISE", label: "student to tutor" },
    ],
  },
  {
    period: "Summer 2026",
    title: "Aerospace engineering in Toulouse",
    body: "On scholarship, I spent a month in Toulouse, France, in a CIEE program run with Airbus and taught by doctorate-level instructors. I led my team's model rocket through eight workshops at INSA Toulouse. The parachute failed its bench test, so we reinforced the heat shield and upgraded the suspension cord, and it flew straight. This was also the year I sold part of my business to my younger brother.",
    stats: [
      { value: "8", label: "rocket workshops" },
      { value: "1 month", label: "in France, on scholarship" },
    ],
  },
  {
    period: "2025 – 26",
    title: "Freshman year at Jones College Prep",
    body: "I commuted two hours a day, kept a 4.0 unweighted GPA, and was elected Vice President of the Class of 2029. Our board ran six events, including the school's first underclassmen Spring Dance, which I worked with administration to get approved. I also made the quarterfinals of the Northwestern Policy Debate City Championship, and in May I was admitted to IMSA.",
    stats: [
      { value: "$3,000", label: "raised by the Spring Dance" },
      { value: "4.0", label: "unweighted GPA" },
    ],
  },
  {
    period: "2024 – 25",
    title: "8th grade at Ebinger",
    body: "As class president I organized three dances, helped run the school's IB Nights, and set up restaurant partnerships that sent 15% of sales back to our class. My research on runaway truck ramps won Silver at the Illinois Junior Academy of Science state exposition, and my community project, Avenues to Kindness, earned the Tim Heneghan S.O.A.R. Award. I also stage-managed Beauty and the Beast Jr.",
    stats: [
      { value: "Silver", label: "IJAS state exposition" },
      { value: "90", label: "handmade cards delivered" },
    ],
  },
  {
    period: "2023",
    title: "PROMISE, a stage, and a shaved ice stand",
    body: "In February of 7th grade I joined IMSA's PROMISE program. That summer I opened a shaved ice stand: $2 a cup, about 60¢ to make, around $150 a day in profit. Caramel apple cups became the fall product. I stage-managed The Lion King Jr. that school year.",
    stats: [
      { value: "~$150", label: "profit on a summer day" },
      { value: "$2.00", label: "per cup, about 60¢ to make" },
    ],
  },
  {
    period: "Age 10",
    title: "My first trade",
    body: "I started trading and investing at 10. Today that means index ETFs like VOO and QQQ for the long term and options for the short term. Losing $5,000 to emotional trades taught me to set a take-profit and a stop-loss on every trade.",
    stats: [{ value: "~$15,000", label: "lifetime trading gains" }],
  },
];
