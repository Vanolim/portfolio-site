export const site = {
  formEndpoint: "https://formsubmit.co/YOUR_EMAIL@example.com",
  defaultLang: "ru",
  resume: {
    ru: "assets/resumes/SelyutinCV.pdf",
    en: "assets/resumes/SelyutinCV.pdf",
  },
  socials: [
    { id: "mail", href: "mailto:legavana@gmail.com", label: "Email" },
    { id: "telegram", href: "https://t.me/Vanolim", label: "Telegram" },
    { id: "linkedin", href: "https://www.linkedin.com/in/vanolim/", label: "LinkedIn" },
    { id: "github", href: "https://github.com/Vanolim", label: "GitHub" },
  ],
};

export const copy = {
  ru: {
    brand: "Иван Селютин",
    nav: {
      home: "Главная",
      about: "Обо мне",
      projects: "Проекты",
      experience: "Опыт",
      recommendations: "Рекомендации",
      resume: "Скачать резюме",
    },
    hero: {
      kicker: "Unity Developer",
      firstName: "Иван",
      lastName: "Селютин",
      tagline:
        "Более 5 лет в разработке. Создаю игры на Unity с нуля, развиваю legacy-проекты и довожу продукт от прототипа до релиза.",
      cta: "Мои проекты",
    },
    about: {
      title: "Обо мне",
      paragraphs: [
        "Unity-разработчик с 5+ годами коммерческого опыта в создании casual-, midcore- и hardcore-игр для мобильных платформ, PC и консолей.",
        "Разрабатываю игровые, мета- и мультиплеерные системы от прототипа и архитектуры до релиза и LiveOps. Основной фокус — масштабируемый C#-код, оптимизация производительности и стабильность продукта.",
        "Работал в кросс-функциональных командах разного масштаба (от 3 до 70+ человек) и руководил небольшими подкомандами в роли фичевнера.",
      ],
    },
    projects: { title: "Проекты" },
    experience: { title: "Опыт работы" },
    recommendations: {
      title: "Рекомендации",
      open: "Открыть рекомендацию",
    },
    projectPlaceholder: "Добавьте картинки в assets/projects/…",
  },
  en: {
    brand: "Ivan Selyutin",
    nav: {
      home: "Home",
      about: "About",
      projects: "Projects",
      experience: "Experience",
      recommendations: "Recommendations",
      resume: "Download CV",
    },
    hero: {
      kicker: "Unity Developer",
      firstName: "Ivan",
      lastName: "Selyutin",
      tagline:
        "5+ years in development. I build Unity games from scratch, improve legacy projects, and take products from prototype to release.",
      cta: "My projects",
    },
    about: {
      title: "About",
      paragraphs: [
        "Unity developer with 5+ years of commercial experience building casual, midcore, and hardcore games for mobile, PC, and consoles.",
        "I design and ship gameplay, meta, and multiplayer systems — from prototyping and architecture to release and LiveOps. My focus is scalable C#, performance optimization, and product stability.",
        "I have worked in cross-functional teams of 3 to 70+ people and led small sub-teams as a feature owner.",
      ],
    },
    projects: { title: "Projects" },
    experience: { title: "Experience" },
    recommendations: {
      title: "Recommendations",
      open: "Open recommendation",
    },
    projectPlaceholder: "Add images under assets/projects/…",
  },
};

export const projects = [
  {
    id: "omut",
    title: { ru: "OMUT", en: "OMUT" },
    description: {
      ru: "Атмосферный 2D-экшен с напряжёнными битвами против боссов, требующими точности и быстрой реакции.",
      en: "An atmospheric 2D action game with intense boss fights that demand precision and quick reactions.",
    },
    tags: ["Zenject", "Particles", "Shader", "Behavior Designer", "Dialogue System", "Rendering"],
    images: [
      "assets/projects/omut/1.jpg",
      "assets/projects/omut/2.jpg",
      "assets/projects/omut/3.jpg",
      "assets/projects/omut/4.jpg",
    ],
    links: [
      { label: { ru: "Ссылка", en: "Store" }, url: "https://store.steampowered.com/app/1997330/OMUT/" },
    ],
  },
  {
    id: "zen",
    title: { ru: "Zen Tiles: Match & Relax", en: "Zen Tiles: Match & Relax" },
    description: {
      ru: "Собирайте одинаковые плитки, решайте красочные головоломки и отдыхайте за спокойным игровым процессом.",
      en: "Match identical tiles, solve colorful puzzles, and unwind with a calm, relaxing gameplay loop.",
    },
    tags: ["VContainer", "LiveOps", "Firebase", "AppLovin"],
    imageFit: "contain",
    images: [
      "assets/projects/zen/1.jpg",
      "assets/projects/zen/2.jpg",
      "assets/projects/zen/3.jpg",
    ],
    links: [
      {
        label: { ru: "Ссылка", en: "Store" },
        url: "https://play.google.com/store/apps/details?id=com.Sociarogames.TripleTiles&pcampaignid=web_share",
      },
    ],
  },
  {
    id: "war-legends",
    title: { ru: "War Legends", en: "War Legends" },
    description: {
      ru: "Фэнтезийная стратегия в реальном времени, где игроки строят базы, развивают армии и сражаются друг с другом в масштабных PvP-битвах.",
      en: "A fantasy real-time strategy game where players build bases, raise armies, and clash in large-scale PvP battles.",
    },
    tags: ["Zenject", "RTS", "Multiplayer", "Testing", "Performance"],
    imageFit: "contain",
    images: [
      "assets/projects/war-legends/1.jpg",
      "assets/projects/war-legends/2.jpg",
      "assets/projects/war-legends/3.jpg",
    ],
    links: [
      {
        label: { ru: "Ссылка", en: "Store" },
        url: "https://play.google.com/store/apps/details?id=com.geargames.warlegends.rts.strategy.game&hl=en_US",
      },
    ],
  },
  {
    id: "art-war",
    title: { ru: "Art of War 3", en: "Art of War 3" },
    description: {
      ru: "Онлайн-стратегия с двумя фракциями, десятками боевых единиц, клановыми войнами и масштабными сражениями в реальном времени.",
      en: "An online strategy game with two factions, dozens of units, clan wars, and large-scale real-time battles.",
    },
    tags: ["RTS", "Multiplayer", "Core", "Analytics", "Performance"],
    imageFit: "contain",
    images: [
      "assets/projects/art-war/1.jpg",
      "assets/projects/art-war/2.jpg",
      "assets/projects/art-war/3.jpg",
    ],
    links: [
      { label: { ru: "Ссылка", en: "Store" }, url: "https://play.google.com/store/apps/details?id=com.geargames.aow&hl=eu" },
    ],
  },
  {
    id: "animals",
    title: { ru: "Vlad and Niki - Animal Games", en: "Vlad and Niki Animal Games" },
    description: {
      ru: "Детская игра про уход за питомцами: стрижка, мини-игры, головоломки и весёлые задания.",
      en: "A kids pet-care game with grooming, mini-games, puzzles, and fun challenges.",
    },
    tags: ["Gameplay", "Monetization", "Editor Tools"],
    imageFit: "contain",
    images: [
      "assets/projects/animals/1.jpg",
      "assets/projects/animals/2.jpg",
      "assets/projects/animals/3.jpg",
    ],
    links: [
      {
        label: { ru: "Ссылка", en: "Store" },
        url: "https://apps.apple.com/ru/app/vlad-and-niki-animal-games/id6443571073",
      },
    ],
  },
  {
    id: "cars",
    title: { ru: "Vlad & Niki Car Games for Kids", en: "Vlad & Niki Car Games for Kids" },
    description: {
      ru: "Игра для детей с гонками, кастомизацией транспорта и простыми миссиями в мире Влада и Ники.",
      en: "A kids game with racing, vehicle customization, and simple missions in the world of Vlad and Niki.",
    },
    tags: ["Casual", "Monetization", "Post-release"],
    imageFit: "contain",
    images: [
      "assets/projects/cars/1.jpg",
      "assets/projects/cars/2.jpg",
      "assets/projects/cars/3.jpg",
    ],
    links: [
      {
        label: { ru: "Ссылка", en: "Store" },
        url: "https://play.google.com/store/apps/details?id=com.AzonGroup.VladNiki&hl=en_US",
      },
    ],
  },
];

export const experience = [
  {
    company: { ru: "Madame Cyclone", en: "Madame Cyclone" },
    role: { ru: "Senior Unity Developer", en: "Senior Unity Developer" },
    period: { ru: "март 2025 — апрель 2026", en: "Mar 2025 — Apr 2026" },
    text: {
      ru: "Разрабатывал OMUT — PC action с босс-файтами. Спроектировал AI боссов, боевые системы и интерактивное окружение. Делал внутренние тулы для дизайнеров, шейдеры и визуальный фидбек в боях. Искал и закрывал узкие места по CPU и GPU.",
      en: "Developed OMUT, a PC action game with boss fights. Designed boss AI, combat systems, and interactive environments. Built designer tools, shaders, and combat feedback, and fixed CPU/GPU bottlenecks.",
    },
  },
  {
    company: { ru: "Senior Sociaro Games", en: "Senior Sociaro Games" },
    role: { ru: "Unity Developer", en: "Unity Developer" },
    period: { ru: "декабрь 2024 — июнь 2025", en: "Dec 2024 — Jun 2025" },
    text: {
      ru: "Разрабатывал Zen Tiles: Match & Relax и Wordlords — мобильные LiveOps-игры. Спроектировал мета-системы: прогрессию, ивенты и монетизацию. Вёл core-геймплей и LiveOps, подключал аналитику Firebase и Unity Analytics, оптимизировал память и стабильность на слабых устройствах.",
      en: "Developed Zen Tiles: Match & Relax and Wordlords — mobile LiveOps games. Designed meta systems for progression, events, and monetization. Owned core gameplay and LiveOps, integrated Firebase and Unity Analytics, and optimized memory and stability on low-end devices.",
    },
  },
  {
    company: { ru: "Junior-Middle Gear Games", en: "Junior-Middle Gear Games" },
    role: { ru: "Unity Developer", en: "Unity Developer" },
    period: { ru: "февраль 2022 — октябрь 2024", en: "Feb 2022 — Oct 2024" },
    text: {
      ru: "Разрабатывал War Legends и Art of War 3 — мобильные RTS с мультиплеером. Делал core-геймплей: поведение юнитов, способности и боевую логику. Участвовал в синхронизации и стабильности сессий, писал автотесты и оптимизировал крупные битвы.",
      en: "Developed War Legends and Art of War 3 — mobile multiplayer RTS games. Built core gameplay for unit behavior, abilities, and combat. Worked on session sync and stability, wrote automated tests, and optimized large-scale battles.",
    },
  },
  {
    company: { ru: "Azon Group", en: "Azon Group" },
    role: { ru: "Junior Unity Developer", en: "Junior Unity Developer" },
    period: { ru: "март 2020 — февраль 2022", en: "Mar 2020 — Feb 2022" },
    text: {
      ru: "Делал геймплей в нескольких детских мобильных играх — Vlad and Niki Cars, Animal Games и PlayDough Cars. Внедрял монетизацию (реклама, rewarded video) и аналитику. Писал editor-тулы и сопровождал проекты после релиза.",
      en: "Shipped gameplay across several kids mobile games — Vlad and Niki Cars, Animal Games, and PlayDough Cars. Implemented ads and rewarded video, integrated analytics, built Unity Editor tools, and supported the titles after release.",
    },
  },
];

export const recommendations = [
  {
    company: { ru: "Madame Cyclone", en: "Madame Cyclone" },
    text: {
      ru: "Иван зарекомендовал себя как ответственный, инициативный и технически сильный специалист. Он умеет оперативно предлагать решения, ясно коммуницировать свои идеи и выполнять задачи «под ключ» без потери качества. Уверены, что его опыт и профессионализм станут ценным активом для любой игровой студии.",
      en: "Ivan has proven himself to be a responsible, proactive, and technically strong specialist. He proposes solutions quickly, communicates ideas clearly, and delivers end-to-end work without sacrificing quality. We are confident his experience and professionalism would be a valuable asset to any game studio.",
    },
    url: "assets/recommendations/madame-cyclone.pdf",
  },
  {
    company: { ru: "Sociaro Games", en: "Sociaro Games" },
    text: {
      ru: "Иван работал Unity-разработчиком над мультиплеерным прототипом Devil's Bar — от оценки сроков и архитектуры до тестирования и качества кода. Он показал отличные навыки программирования, командную работу и коммуникацию. Талантливый и исполнительный специалист, который будет ценным дополнением для любой команды.",
      en: "Ivan worked as a Unity developer on the Devil's Bar multiplayer prototype — from estimation and architecture to testing and code quality. He demonstrated strong programming skills, teamwork, and communication. A talented, diligent specialist who would be a valuable addition to any team.",
    },
    url: "assets/recommendations/sociaro.pdf",
  },
];