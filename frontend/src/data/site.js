const siteData = {
  meta: {
    title:
      "Yannick Deetman — Communicatiestudent (HvA), vibecoding front end, fotografie",
    description:
      "Eerstejaars communicatie student aan de HvA. Houd van strak en gestructureerd werken en dingen die echt werkelijk goed afgemaakt zijn.",
    image: "/assets/meta/og-image.svg",
    twitterHandle: "@DitIsIK",
  },
  owner: {
    name: "Yannick Deetman",
    tagline:
      "Communicatiestudent (HvA), vibecoding front end, fotografie",
    bioShort:
      "Eerstejaars communicatie student aan de HvA. Houd van strak en gestructureerd werken en dingen die echt werkelijk goed afgemaakt zijn.",
    bioLong: "(nog een placeholder)",
    location: "Amsterdam en Alkmaar, NL",
    email: "yannick.deetman@icloud.com",
    githubUsername: "DitIsIK",
    linkedinUrl: "https://share.google/hWghw0HQni8dMEci6",
    letterboxdUrl: "https://letterboxd.com/Yannick__/",
    socials: [
      { label: "GitHub", href: "https://github.com/DitIsIK" },
      { label: "LinkedIn", href: "https://share.google/hWghw0HQni8dMEci6" },
      { label: "Email", href: "mailto:yannick.deetman@icloud.com" },
      { label: "Letterboxd", href: "https://letterboxd.com/Yannick__/" },
    ],
  },
  hero: {
    keywords: [
      "Communicatie meets front-end — verhalen die klikken én converteren",
      "Fotografie, UX copy en snelle prototypes voor echte mensen",
    ],
    primaryCta: { label: "Bekijk projecten", targetId: "projects" },
    secondaryCta: {
      label: "CV downloaden",
      href: "/assets/cv/Yannick_Deetman_CV.pdf",
    },
  },
  about: {
    stats: [
      {
        icon: "bx bxs-graduation about-icon",
        title: "HvA Communicatie",
        subtitle: "Jaar 1 student",
      },
      {
        icon: "bx bx-code-curly about-icon",
        title: "Side projects",
        subtitle: "Sympafix tools",
      },
      {
        icon: "bx bx-camera about-icon",
        title: "Fotografie",
        subtitle: "Film & hockey vibes",
      },
    ],
    now: [
      "UX copy en interface iteraties voor Sympafix tools",
      "Onderzoekstechnieken aanscherpen bij HvA Communicatie",
      "Fotografie & filmreviews cureren in Notion",
    ],
    profileImage: "/assets/profile/yannick-deetman.svg",
  },
  skills: {
    primary: [
      "HTML",
      "CSS/Tailwind",
      "JavaScript",
      "React/Next.js",
      "UX writing",
      "Communicatieonderzoek",
    ],
    primaryNote:
      "Momenteel aan het leren en verbeteren bij HvA Communicatie: schrijven, onderzoek, visuele communicatie en front-end basics.",
    secondary: [
      "shadcn/ui",
      "Figma/Canva",
      "Notion",
      "Supabase (basis)",
      "Git",
    ],
    secondaryNote:
      "Kan eenvoudige webapplicaties bouwen (HTML/CSS/JS + basis React/Next.js) en shippen op Netlify.",
    topLangs: {
      labels: [
        "HTML & CSS",
        "JavaScript",
        "React",
        "UX research",
        "Copywriting",
      ],
      data: [120, 95, 70, 60, 55],
    },
    categories: [
      {
        title: "Digitale productie",
        description:
          "Prototypes en tools bouwen die strak, snel en duidelijk communiceren.",
        skills: [
          { name: "HTML", logo: "html", proficiency: "proficient" },
          { name: "CSS/Tailwind", logo: "tailwind", proficiency: "proficient" },
          { name: "JavaScript", logo: "javascript", proficiency: "proficient" },
          { name: "React/Next.js", logo: "react", proficiency: "intermediate" },
          { name: "shadcn/ui", logo: "design", proficiency: "intermediate" },
        ],
      },
      {
        title: "Story & communicatie",
        description:
          "Van UX copy tot fotografie: verhalen scherp krijgen en delen.",
        skills: [
          { name: "UX writing", logo: "uxwriting", proficiency: "intermediate" },
          {
            name: "Communicatieonderzoek",
            logo: "communication",
            proficiency: "intermediate",
          },
          { name: "Fotografie", logo: "photography", proficiency: "intermediate" },
          { name: "Filmreviews", logo: "film", proficiency: "intermediate" },
          { name: "Social media", logo: "social", proficiency: "intermediate" },
        ],
      },
      {
        title: "Workflow & ops",
        description:
          "Samenwerken, documenteren en shippen met praktische tools.",
        skills: [
          { name: "Figma/Canva", logo: "design", proficiency: "intermediate" },
          { name: "Notion", logo: "notion", proficiency: "intermediate" },
          { name: "Supabase", logo: "sql", proficiency: "beginner" },
          { name: "Git", logo: "git", proficiency: "intermediate" },
          { name: "Netlify", logo: "netlify", proficiency: "intermediate" },
        ],
      },
    ],
    graphs: [
      {
        skillTitle: "Frontend flow",
        skillDescription:
          "Structuur, componenten en UX states vertalen naar duidelijke interfaces.",
        Labels: ["Planning", "Design", "Development", "Testing", "Copy"],
        Scores: [4.2, 4.0, 4.1, 3.8, 4.3],
      },
      {
        skillTitle: "Communicatie toolkit",
        skillDescription:
          "Onderzoek, storytelling en content distributie helder en concreet maken.",
        Labels: ["Onderzoek", "Schrijven", "Analyse", "Stakeholder", "Story"],
        Scores: [4.1, 4.2, 3.9, 3.8, 4.4],
      },
    ],
  },
  experience: {
    career: [
      {
        experienceTitle: "Sympafix — Productie & Simple Apps",
        experienceSubTitle: "Front-end & productie support",
        experienceTimeline: "2024 — heden",
        experienceTagline:
          "Twee praktische tools gebouwd voor snelle montage workflows.",
        experienceParagraphs: [
          "Sympafix Spijkerwijzer: snelle zero-dependency tool die compatibele tools/ankers toont, met duidelijke kleurstates.",
          "Sympafix Volume Calculator: React + Tailwind app die Excel-logica vertaalt naar een nette webervaring.",
          "Ondersteunt de productieafdeling met strakke assets en documentatie.",
        ],
        experienceImages: [
          "/projects/sympafix-spijkerwijzer.svg",
          "/projects/sympafix-volume-calculator.svg",
        ],
        experienceURLs: {
          demo: "https://sympafix-volumecalculator.netlify.app/",
          tooling: "https://spijkerwijzer.netlify.app/#mode=home",
        },
      },
      {
        experienceTitle: "Toekomstige rol",
        experienceSubTitle: "Op zoek naar communicatie + front-end stage",
        experienceTimeline: "2025 — …",
        experienceTagline:
          "Open voor teams die digitale verhalen, UX en content combineren.",
        experienceParagraphs: [
          "Placeholder: klaar om meer projecten en campagnes te dragen.",
        ],
        experienceImages: ["/assets/profile/yannick-deetman.svg"],
        experienceURLs: {},
      },
    ],
    involvements: [
      {
        involvementTitle: "HvA Communicatie",
        involvementSubTitle: "Bachelor jaar 1",
        involvementTimeline: "2024 — heden",
        involvementTagline:
          "Leren over doelgroeponderzoek, storytelling en multimodale communicatie.",
        involvementParagraphs: [
          "Projectgroepen geleid rondom campagnes en contentformats.",
          "Experimenten met UX writing en tone of voice voor verschillende kanalen.",
        ],
        involvementImages: ["/assets/profile/yannick-deetman.svg"],
        involvementURLs: {
          linkedin: "https://share.google/hWghw0HQni8dMEci6",
        },
      },
    ],
    honors: [
      {
        honorsExperienceTitle: "Sympafix toolset launch",
        honorsExperienceSubTitle: "Interne highlight",
        honorsExperienceTimeline: "2025",
        honorsExperienceTagline:
          "Tools uitgerold binnen productie om keuzes sneller te maken.",
        honorsExperienceParagraphs: [
          "Collega's gebruiken de tools nu op laptop én mobiel voor on-site beslissingen.",
        ],
        honorsExperienceImages: ["/projects/sympafix-volume-calculator.svg"],
        honorsExperienceURLs: {
          demo: "https://sympafix-volumecalculator.netlify.app/",
        },
      },
    ],
    yearInReview: [
      {
        yearInReviewTitle: "2024 highlights",
        yearInReviewTimeline: "2024",
        yearInReviewTagline:
          "Start HvA, eerste klantproject en fotografie-experimenten vastgelegd.",
        yearInReviewParagraphs: [
          "Communicatieonderzoek en contentstrategie cursussen afgerond.",
          "Sympafix Spijkerwijzer live gezet met positieve feedback.",
          "Portfolio workflows in Notion en Netlify opgezet.",
        ],
        yearInReviewImages: ["/projects/sympafix-spijkerwijzer.svg"],
        yearInReviewURLs: {
          notion: "https://notion.so",
        },
      },
    ],
  },
  projects: [
    {
      projectTitle: "Sympafix Volume Calculator",
      projectSubTitle: "Front-end & UX",
      projectTimeline: "2025",
      projectTagline:
        "Adhesive-volume calculator voor chemische ankers.",
      projectHighlights: [
        "React + Tailwind UI in wit-grijs, strak en snel.",
        "Dropdowns met producttypes en diameter-mappings.",
        "Exacte Excel-logica geport naar web.",
      ],
      projectTech: ["React", "Next.js", "Tailwind"],
      projectParagraphs: [
        "De calculator vertaalt de Excel-formules van Sympafix naar een intuïtieve webapp, zodat monteurs sneller de juiste hoeveelheden bepalen.",
        "UI en copy afgestemd op productiepartners: duidelijke states, toetsenbordvriendelijk en te gebruiken op tablets.",
      ],
      projectImages: ["/projects/sympafix-volume-calculator.svg"],
      projectURLs: {
        demo: "https://sympafix-volumecalculator.netlify.app/",
      },
      projectLink: "sympafix-volume-calculator",
    },
    {
      projectTitle: "Sympafix Spijkerwijzer",
      projectSubTitle: "Front-end",
      projectTimeline: "2025",
      projectTagline:
        "Snelle tool met modern UI om compatibele tools/ankers te vinden.",
      projectHighlights: [
        "Zero-dependency, snelle load.",
        "Heldere states en kleurgebruik (groen = geschikt).",
        "Netlify deploy + assets fix (logo paths).",
      ],
      projectTech: ["HTML", "CSS", "JavaScript"],
      projectParagraphs: [
        "Gebouwd als lichtgewicht tool zodat verkoop en productie direct compatibiliteit kan checken.",
        "Helder kleurgebruik en states maken inzichtelijk welke optie werkt en waarom.",
      ],
      projectImages: ["/projects/sympafix-spijkerwijzer.svg"],
      projectURLs: {
        demo: "https://spijkerwijzer.netlify.app/#mode=home",
      },
      projectLink: "sympafix-spijkerwijzer",
    },
  ],
  feed: [
    {
      feedTitle: "Nieuwe calculator live",
      feedCategory: "Project",
      feedDescription:
        "Sympafix Volume Calculator gedeployed op Netlify met duidelijke handleiding voor het team.",
      feedLink: "https://sympafix-volumecalculator.netlify.app/",
    },
    {
      feedTitle: "HvA sprint",
      feedCategory: "Studie",
      feedDescription:
        "User research interviews gedaan voor minorproject over stadscommunicatie.",
      feedLink: "https://share.google/hWghw0HQni8dMEci6",
    },
    {
      feedTitle: "Fotografie moodboard",
      feedCategory: "Creatief",
      feedDescription:
        "Nieuw Letterboxd-lijstje gestart met favoriete visuele inspiratie.",
      feedLink: "https://letterboxd.com/Yannick__/",
    },
  ],
  contact: {
    email: "yannick.deetman@icloud.com",
    phone: null,
    location: "Amsterdam en Alkmaar, NL",
    socials: {
      email: "mailto:yannick.deetman@icloud.com",
      linkedin: "https://share.google/hWghw0HQni8dMEci6",
      github: "https://github.com/DitIsIK",
      letterboxd: "https://letterboxd.com/Yannick__/",
    },
  },
};

export default siteData;
