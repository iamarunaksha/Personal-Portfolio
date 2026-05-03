export const portfolioData = {
  // General Info
  name: "Arunaksha S.",
  email: "sarkararunaksha22@gmail.com",
  role: "Software Development Engineer",
  
  // Custom URLs (Used in Safari / Web Apps)
  leetcodeUrl: "https://leetcode.com/u/iamarunaksha/",
  githubUrl: "https://github.com/iamarunaksha",
  linkedinUrl: "https://linkedin.com/in/arunakshas",
  
  // Google Drive URL
  resumeUrl: "https://drive.google.com/file/d/1N3f2wPSJEsZwYvcqeJo2MdHZ6Zz9peuU/view?usp=sharing",
  
  // Spotify / Music
  spotifyEmbedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator",

  // Terminal / About Me Text
  aboutMe: `Hi, I'm Arunaksha, a passionate Software Engineer. 
I specialize in building scalable web apps, writing clean code, 
and tackling complex algorithms. When I'm not grinding LeetCode, 
I'm usually exploring new frontend frameworks or reading about system design.`,

  skills: [
    "C++", "JavaScript", "Java", "Angular", "React", "TypeScript",  "Node.js", "Express", "SQL",
    "MongoDB", "TailwindCSS"
  ],

  // Mail App Emails
  emails: [
    {
      id: 1,
      sender: "Arunaksha S.",
      subject: "Welcome to my portfolio!",
      date: "Oct 22 at 9:00 AM",
      preview: "Feel free to look around and explore...",
      body: `Hello!

Thanks for taking the time to check out my portfolio. This portfolio website is built using React & TailwindCSS.

Feel free to open the widgets, drag windows around, check the terminal, or browse my projects in the Finder/VSCode app.

You can reach me at my actual email if you want to connect: sarkararunaksha22@gmail.com

Enjoy your stay!
- Arunaksha`
    }
  ],

  // Projects (Used in VS Code / Finder)
  projects: [
    {
      id: "collaborative-code-editor",
      title: "Collaborative Code Editor",
      description: `A real-time collaborative code editor supporting concurrent users using CRDTs (Yjs), WebSockets, and Monaco Editor, with persistent document state and low-latency synchronization. 
      Currently available for JS only.
      Would love if you click on the Live Demo link and have a look at it yourself.`,
      githubUrl: "https://github.com/iamarunaksha/CodeTogether/tree/main",
      liveUrl: "https://code-together-arunaksha.web.app/",
      image: "/projects/code-editor.png",
      tech: ["React", "Node.js", "Express", "Monaco Editor", "WebSockets", "Socket.io", "CRDT", "YJs", "Y-Monaco", "Y-Websocket"]
    },
    {
      id: "backend-rate-limiter",
      title: "Rate Limiter",

      description: `A highly resilient NodeJS distributed rate limiting service utilizing Redis to elegantly protect backend microservices from DDoS attacks. 
      Application demonstrates three rate-limiting algorithms which are widely used, namely : 
      1. Fixed-Window Counter 
      2. Sliding Window 
      3. Token Bucket`,

      githubUrl: "https://github.com/iamarunaksha/RateLimiter",
      liveUrl: "https://iamarunaksha-rate-limiter.hf.space/",
      image: "/projects/rate-limiter.png",
      tech: ["Node.js", "Express", "Redis", "TypeScript"]
    }
  ],

  // Finder > Experience
  experience: [
    {
      id: "TCS.exp",
      title: "Software Developer",
      date: "April, 2025 - Present",
      markdown: "Working on building scalable web applications for a Fortune 500 client."
    },
    {
      id: "PwC.exp",
      title: "Cyber Security Analyst Intern",
      date: "Jan, 2024 - Oct 2024",
      markdown: "Performed VAPT assessments & delivered vulnerability report listing all 'Critical', 'High', 'Medium', 'Low' vulnerabilities present in their dev. environment for one of the largest public sector banks in India."
    }
  ],

  // Finder > Education
  education: [
    {
      id: "B.Tech",
      title: "B.Tech in Computer Science & Engineering",
      // date: "2020 - 2024",
      markdown: "University: MAKAUT, West Bengal, India\nCGPA: 9.36/10"
    }
  ],

  // Launchpad > Tech Stack Icons (Using DevIcon CDN references)
  techStackIcons: [
    { name: "C++", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
    { name: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "TypeScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "Java", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { name: "Angular", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
    { name: "React", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Bootstrap", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
    { name: "TailwindCSS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "Node.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Express", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
    { name: "SQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    { name: "MongoDB", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "Redis", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" }
  ],

  // Trash > Easter Eggs
  trashItems: [
    { name: "Internet_Explorer.exe", type: "system", icon: "exe", message: "Error: Internet Explorer has stopped working. (It stopped working in 2003, actually.)"},
    { name: "bug_that_took_3_days_to_fix.js", type: "file", icon: "js", message: "Error: File corrupted. The bug was a missing semicolon on line 247. Those were dark times." },
    { name: "rejection_letter_2021.pdf", type: "file", icon: "pdf", message: "Error: Cannot open. Their loss, not mine!!!" },
    { name: "coffee_cups.zip", type: "folder", icon: "zip", message: "Error: Archive corrupted. Contents: 847 coffee cups, all responsible for this portfolio." }
  ]
};
