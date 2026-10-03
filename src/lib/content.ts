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
  photo: "/alejandro-valadez.jpg",
  bio: [
    "I'm a sophomore at the Illinois Mathematics and Science Academy, and I got here on purpose. I joined IMSA's PROMISE program in 7th grade and spent the next three years in weekend sessions and summer internships working toward the academy. Freshman year, I commuted two hours a day to Jones College Prep, finished with a 4.0 unweighted GPA, and was elected Vice President of the Class of 2029. Now I tutor 9th graders in the same PROMISE program I came up through.",
    "I see the world through economics and opportunity. From 2023 through 2026, I ran two seasonal businesses, selling shaved ice and caramel apples, and learned about supply chains and margins the hard way. Lately, that curiosity has also gone into code: I build small tools for problems I actually have, like an MCP server that lets Claude read my Canvas coursework.",
    "I believe leadership is defined by action. For my “Avenues to Kindness” project, I partnered with a disability-independence organization to deliver 90 handmade cards to its residents. The project earned the Tim Heneghan S.O.A.R. Award, one of only two given in my graduating class.",
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
      "A month in Toulouse studying aircraft engineering with doctorate-level instructors in a program run with Airbus, plus IMSA's AEROspace Club and Rocketry Club at Jones.",
  },
  {
    title: "Finance & Investing",
    description:
      "I follow markets and investing closely, an interest that started with pricing my own products. At IMSA, I take the Financial Empowerment Class.",
  },
  {
    title: "Business",
    description:
      "Three seasons running two businesses of my own, handling sourcing, pricing, and margins. I'm part of IMSA's TALENT entrepreneurship program and was in FBLA at Jones.",
  },
  {
    title: "Leadership",
    description:
      "Elected Class of 2029 Vice President, stage manager for two school musicals, and now a tutor for 9th graders in IMSA's PROMISE program.",
  },
];

export type Project = {
  title: string;
  kind: string;
  description: string;
  tags: readonly string[];
  highlight?: string;
  links?: readonly { label: string; href: string }[];
};

export const PROJECTS: readonly Project[] = [
  {
    title: "Aerospace Engineering in Toulouse",
    kind: "Program",
    description:
      "A month-long aerospace engineering program with CIEE in Toulouse, France, taught by three doctorate-level instructors in partnership with Airbus. I studied the engineering behind the A350 in the city where it's built.",
    tags: ["Aerospace", "Airbus Partnership", "Toulouse, France"],
    highlight: "Summer 2026",
  },
  {
    title: "Canvas LMS MCP Server",
    kind: "Software",
    description:
      "An MCP server that connects Claude to Canvas LMS, so I can ask what's due, pull up a rubric, or read instructor feedback in plain conversation — and submit work without leaving the chat. Covers courses, assignments, discussions, submissions, and reading .docx attachments.",
    tags: ["TypeScript", "Node.js", "Model Context Protocol", "Canvas API"],
    highlight: "Open source, MIT licensed",
    links: [{ label: "Source", href: "https://github.com/Alejandro-Valadez/canvas-mcp" }],
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
    title: "Shaved Ice & Caramel Apples",
    kind: "Entrepreneurship",
    description:
      "Two seasonal micro-businesses I launched and ran from 2023 through 2026. Handling sourcing, pricing, and profit margins myself taught me more about supply chains than any textbook, and it sparked an interest in markets and investing that I still follow.",
    tags: ["Operations", "Pricing", "Supply Chain"],
    highlight: "Three seasons, self-run",
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
    title: "Nominated Student Government Association President",
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
      "Mu Alpha Theta — Mathematics Honor Society",
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
      "Student Government Association — 2023–25",
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
