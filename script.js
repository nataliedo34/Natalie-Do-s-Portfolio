(function () {
  (function playOpening() {
    const root = document.documentElement;
    const typeEl = document.querySelector(".opening-type");
    const overlay = document.querySelector(".opening");
    const bar = document.querySelector(".opening-load-bar");
    if (!typeEl || !overlay) return;

    const text = "Natalie Do";
    let count = 0;
    let done = true;
    let typeTimer = 0;
    let revealTimer = 0;
    let reduce = false;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (err) {}

    function setProgress(amount) {
      if (bar) bar.style.width = Math.round(amount * 100) + "%";
    }

    function finish() {
      if (done) return;
      done = true;
      window.clearTimeout(typeTimer);
      typeEl.textContent = text;
      setProgress(1);
      root.classList.add("is-typed");
      window.clearTimeout(revealTimer);
      revealTimer = window.setTimeout(function () {
        root.classList.add("is-ready");
      }, 520);
    }

    function type() {
      if (done) return;
      count += 1;
      typeEl.textContent = text.slice(0, count);
      setProgress(count / text.length);
      if (count < text.length) {
        const delay = text.charAt(count - 1) === " " ? 170 : 84;
        typeTimer = window.setTimeout(type, delay);
      } else {
        finish();
      }
    }

    function start() {
      if (reduce) return;
      window.clearTimeout(typeTimer);
      window.clearTimeout(revealTimer);
      done = false;
      count = 0;
      typeEl.textContent = "";
      if (bar) {
        bar.style.transition = "none";
        bar.style.width = "0%";
        void bar.offsetWidth;
        bar.style.transition = "";
      }
      root.classList.add("is-opening", "is-replay");
      root.classList.remove("is-ready", "is-typed");
      void overlay.offsetWidth;
      root.classList.remove("is-replay");
      typeTimer = window.setTimeout(type, 360);
    }

    overlay.addEventListener("click", finish);
    window.addEventListener("keydown", function (event) {
      if (done) return;
      if (event.key !== "Escape" && event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      finish();
    });

    const logo = document.querySelector(".logo-mark");
    if (logo) {
      logo.addEventListener("click", function (event) {
        if (reduce) return;
        event.preventDefault();
        window.scrollTo(0, 0);
        if (window.location.hash !== "#home") {
          window.history.replaceState(null, "", "#home");
        }
        start();
      });
    }

    if (root.classList.contains("is-opening")) start();
  })();

  const spySections = [
    { id: "home", el: document.getElementById("about") },
    { id: "projects", el: document.getElementById("projects") },
    { id: "resume", el: document.getElementById("resume") },
    { id: "contact", el: document.getElementById("contact") },
  ].filter(function (item) {
    return item.el;
  });

  let activeSection = "";
  let allowHashWrite = false;
  let settleTimer = 0;

  function setActiveSection(id, writeHash) {
    if (!id) return;
    if (id !== activeSection) {
      activeSection = id;
      document.querySelectorAll(".pill-nav a").forEach(function (link) {
        const isActive = link.getAttribute("href") === "#" + id;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }
    if (!writeHash || !allowHashWrite) return;
    const nextHash = "#" + id;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }

  function currentSection() {
    const nearBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 48;
    if (nearBottom) return spySections[spySections.length - 1].id;

    const marker = Math.min(window.innerHeight * 0.32, 220);
    let current = spySections[0] ? spySections[0].id : "home";
    spySections.forEach(function (item) {
      if (item.el.getBoundingClientRect().top <= marker) current = item.id;
    });
    return current;
  }

  let spyQueued = false;
  function queueSpy(writeHash) {
    if (spyQueued) return;
    spyQueued = true;
    window.requestAnimationFrame(function () {
      spyQueued = false;
      setActiveSection(currentSection(), writeHash);
    });
  }

  function noteScroll() {
    queueSpy(false);
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(function () {
      allowHashWrite = true;
      queueSpy(true);
    }, 140);
  }

  const yearEls = document.querySelectorAll("#year, #year-mobile");
  yearEls.forEach(function (el) {
    if (el) el.textContent = String(new Date().getFullYear());
  });

  const mobileNav = document.getElementById("mobile-nav");
  const navToggle = document.querySelector(".nav-toggle");

  if (mobileNav && navToggle) {
    function setMobileNav(open) {
      mobileNav.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    navToggle.addEventListener("click", function () {
      setMobileNav(!mobileNav.classList.contains("is-open"));
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMobileNav(false);
      });
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMobileNav(false);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function () {
      allowHashWrite = false;
      window.clearTimeout(settleTimer);
    });
  });

  window.addEventListener("scroll", noteScroll, { passive: true });
  window.addEventListener("resize", function () {
    queueSpy(false);
  });
  queueSpy(false);
  window.addEventListener("load", function () {
    window.setTimeout(function () {
      allowHashWrite = true;
      queueSpy(false);
    }, 700);
  });

  /**
   * Contact form → FormSubmit → natalieedo6@gmail.com
   *
   * Uses a normal HTML POST (works best with FormSubmit on GitHub Pages).
   * Reply-To is the visitor’s email field.
   *
   * Setup:
   * 1. Open the site via Live Server or GitHub Pages (NOT by double-clicking the HTML file).
   * 2. Submit once. Check natalieedo6@gmail.com for FormSubmit “Activate Form”.
   * 3. Click Activate for YOUR real site URL (not example.com).
   * 4. Submit again — messages should arrive.
   */
  const CONTACT_INBOX = "natalieedo6@gmail.com";

  const form = document.getElementById("contact-form");
  if (form) {
    const statusEl = document.getElementById("contact-status");
    const submitBtn = document.getElementById("contact-submit");
    const nextInput = document.getElementById("contact-next");
    const subjectInput = document.getElementById("contact-subject");

    function setStatus(message, kind) {
      if (!statusEl) return;
      statusEl.hidden = !message;
      statusEl.textContent = message || "";
      statusEl.classList.remove("is-success", "is-error");
      if (kind) statusEl.classList.add(kind);
    }

    // After FormSubmit redirects back with ?sent=1
    try {
      var params = new URLSearchParams(window.location.search);
      if (params.get("sent") === "1") {
        setStatus("Message sent. Thanks for reaching out!", "is-success");
        params.delete("sent");
        var clean =
          window.location.pathname +
          (params.toString() ? "?" + params.toString() : "") +
          "#contact";
        window.history.replaceState(null, "", clean);
      }
    } catch (err) {
      /* ignore */
    }

    form.addEventListener("submit", function (e) {
      const name = document.getElementById("contact-name");
      const email = document.getElementById("contact-email");
      const message = document.getElementById("contact-message");
      if (!name || !email || !message) {
        e.preventDefault();
        return;
      }

      var nameVal = name.value.trim();
      var emailVal = email.value.trim();
      var messageVal = message.value.trim();

      if (!nameVal || !emailVal || !messageVal) {
        e.preventDefault();
        setStatus("Please fill in name, email, and message.", "is-error");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        e.preventDefault();
        setStatus("Please enter a valid email address.", "is-error");
        return;
      }

      if (window.location.protocol === "file:") {
        e.preventDefault();
        setStatus(
          "Open this site with Live Server or GitHub Pages first (not as a downloaded HTML file), then try again.",
          "is-error"
        );
        return;
      }

      if (subjectInput) {
        subjectInput.value = "Portfolio message from " + nameVal;
      }

      // Return here after FormSubmit accepts the message
      if (nextInput) {
        var returnUrl =
          window.location.origin +
          window.location.pathname +
          "?sent=1#contact";
        nextInput.value = returnUrl;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute("aria-busy", "true");
      }
      setStatus("Sending… check your Gmail for a FormSubmit Activate link if this is the first time from this site.", null);
      // Native POST continues to FormSubmit
    });
  }

  function replayAskMark(mark) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    mark.classList.remove("is-draw");
    void mark.offsetWidth;
    mark.classList.add("is-draw");
  }

  document.querySelectorAll(".ask-mark").forEach(function (mark) {
    const path = mark.querySelector(".ask-n");
    if (!path) return;
    mark.addEventListener("animationend", function (event) {
      if (event.animationName === "askLine") mark.classList.remove("is-draw");
    });
    const hoverTarget = mark.closest(".ask-launcher") || mark;
    hoverTarget.addEventListener("mouseenter", function () {
      replayAskMark(mark);
    });
    if (mark.closest(".ask-launcher")) replayAskMark(mark);
  });

  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "dark" ? "#0c1018" : "#f5f5f7");
    if (themeToggle) {
      const isDark = next === "dark";
      themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
      const label = isDark ? "Switch to light mode" : "Switch to dark mode";
      themeToggle.setAttribute("aria-label", label);
      themeToggle.setAttribute("title", label);
    }
    try {
      localStorage.setItem("theme", next);
    } catch (err) {
      /* ignore */
    }
  }

  applyTheme(document.documentElement.getAttribute("data-theme"));
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  const askLauncher = document.getElementById("ask-launcher");
  const askPanel = document.getElementById("ask-panel");
  const askBody = document.getElementById("ask-body");
  const askForm = document.getElementById("ask-form");
  const askInput = document.getElementById("ask-input");
  const askSend = document.getElementById("ask-send");
  const askClose = document.getElementById("ask-close");
  const askNew = document.getElementById("ask-new");

  if (askLauncher && askPanel && askBody && askForm && askInput) {
    function makeAskMark(extraClass) {
      const source = document.querySelector(".ask-mark");
      const mark = document.createElement("span");
      mark.className = "ask-mark" + (extraClass ? " " + extraClass : "");
      mark.setAttribute("aria-hidden", "true");
      const logo = source && source.querySelector(".ask-logo");
      if (logo) mark.appendChild(logo.cloneNode(true));
      return mark;
    }

    const suggestions = [
      "What is Natalie studying?",
      "Tell me about her Amazon internship.",
      "What projects has she worked on?",
      "How can I reach her?",
    ];

    const knowledge = [
      {
        terms: ["who is", "who are", "introduce", "background", "bio", "overview", "tell me about natalie"],
        paragraphs: [
          "Natalie Do is a junior at Texas A&M University in Mays Business School. She is earning a B.B.A. in Management Information Systems with a minor in Artificial Intelligence, and she expects to graduate in May 2027.",
          "She is most interested in how technology can simplify real business problems and help people make better decisions.",
          "Right now she is preparing to graduate from Texas A&M in May 2027 with a major in Management Information Systems and a minor in Artificial Intelligence. She is also building a healthcare platform to simplify how patients manage their medications, appointments, and recovery, and exploring how Apple Flow can support frontline workflows across industries through new interactive demos.",
        ],
      },
      {
        focus: true,
        terms: ["currently", "right now", "healthcare", "health care", "healthcare platform", "medication", "medications", "appointments", "recovery", "working on", "expanding", "beyond retail", "interactive demos", "about to graduate"],
        paragraphs: [
          "Natalie is preparing to graduate from Texas A&M in May 2027 with a major in Management Information Systems and a minor in Artificial Intelligence.",
          "She is also building a healthcare platform to simplify how patients manage their medications, appointments, and recovery, and exploring how Apple Flow can support frontline workflows across industries through new interactive demos.",
        ],
      },
      {
        terms: ["studying", "study", "major", "degree", "school", "university", "education", "mays", "graduate", "graduation", "coursework", "classes", "mis", "information systems", "tamu", "texas", "junior", "b b a"],
        paragraphs: [
          "Natalie is studying Management Information Systems at Mays Business School, Texas A&M, with a minor in Artificial Intelligence. Her expected graduation is May 2027.",
          "Coursework covers information systems, business programming, networks, systems analysis, database programming, statistics, spreadsheet modeling, business analytics, machine learning, and generative AI for business.",
        ],
      },
      {
        focus: true,
        terms: ["artificial intelligence", "ai minor", "ai", "minor", "machine learning", "generative", "predictive"],
        paragraphs: [
          "Her AI minor includes Business Transformation with Generative AI, Automating Business Storytelling Using AI, Machine Learning, Predictive Modeling, and Business Applications.",
          "Through Aggie Innovators she also explores emerging AI tools in workshops and speaker events.",
        ],
      },
      {
        focus: true,
        terms: ["amazon", "amazon internship", "area manager", "inbound", "damages", "iss", "fulfillment"],
        paragraphs: [
          "Natalie was an Area Manager Intern at Amazon in San Bernardino, California, from June 2026 to August 2026. She led a process-improvement project for Inbound Support Services (ISS) and Damages that improved productivity by 8%.",
          "The work supported 5,000+ units weekly, added standard-work checklists for three teams, included six training sessions, and set up four new workstations.",
        ],
      },
      {
        focus: true,
        terms: ["student technician", "it technology", "engineering it", "classroom", "av", "help desk"],
        paragraphs: [
          "Since July 2025, Natalie has been a Student Technician with IT Technology Services in the Texas A&M College of Engineering.",
          "She troubleshoots AV systems across 38+ classrooms, installs ceiling microphones, PTZ cameras, and NVX equipment, and resolves 10+ support issues a week for 500+ students and faculty.",
        ],
      },
      {
        focus: true,
        terms: ["audit", "seidel", "schroeder", "accounting", "gaap", "quickbooks"],
        paragraphs: [
          "From May 2024 to December 2024, Natalie was an Audit Intern at Seidel Schroeder in College Station.",
          "She prepared 30+ electronic workpapers, tested internal controls, documented discrepancies, and supported a 20-member audit team.",
        ],
      },
      {
        focus: true,
        terms: ["big dreams", "mining", "engineer intern", "graphics card"],
        paragraphs: [
          "From May 2021 to July 2022, Natalie was an Engineer Intern at Big Dreams, Inc. in Richmond, Texas.",
          "She built and troubleshot 200+ mining rigs and maintained inventory records for 500+ parts with a team of 15+ people.",
        ],
      },
      {
        focus: true,
        terms: ["resume", "full resume", "cv", "curriculum vitae"],
        paragraphs: [
          "The Resume section shows highlights in further detail from Natalie’s background.",
          "For her full resume, please email natalieedo6@gmail.com.",
        ],
        links: [{ label: "Email Natalie", href: "mailto:natalieedo6@gmail.com" }],
      },
      {
        terms: ["experience", "internship", "internships", "intern", "jobs", "work history"],
        paragraphs: [
          "Natalie’s experience includes a current Student Technician role with Texas A&M Engineering IT, an Area Manager internship at Amazon, an audit internship at Seidel Schroeder, and an engineer internship at Big Dreams, Inc.",
          "The Resume section highlights her education, experience, and activities.",
        ],
      },
      {
        focus: true,
        terms: ["intellivest", "financial literacy", "finance website"],
        paragraphs: [
          "Intellivest is a financial literacy website designed to help students at any level develop practical financial knowledge. It presents clear information and guidance in an accessible structure so students can make more informed financial decisions over time. The platform is projected to reach and educate 150+ student users.",
          "Natalie has worked on it through AITP since October 2025.",
        ],
        links: [{ label: "Intellivest @ Texas A&M", href: "https://teresaso-wq.github.io/intellivesttamu/frontend/index.html" }],
      },
      {
        focus: true,
        terms: ["apple flow", "appleflow", "shared iphone", "frontline", "shift handoff", "workforce"],
        paragraphs: [
          "Apple Flow is an iOS workforce productivity solution for frontline employees using shared iPhones.",
          "The platform brings task management, contextual guidance, automated documentation, and shift handoffs into one workflow. It is meant to simplify communication, cut down administrative work, and support collaboration for frontline teams across industries.",
          "She has worked on it through Product@TAMU since September 2026, and is exploring how Apple Flow can support frontline workflows across industries through new interactive demos.",
        ],
        links: [{ label: "Try the retail demo", href: "https://apple-flow-retaildemo.ai.studio/" }],
      },
      {
        focus: true,
        terms: ["cmis", "case competition", "transit", "mobility", "istm 320", "systems analysis", "system analysis"],
        paragraphs: [
          "Natalie was on a 4-person team that reached the finals of the CMIS Case Competition at Mays Business School. The case was for Business Systems Analysis and Design (ISTM 320).",
          "They designed an Integrated Mobility System for a regional transit cooperative with six fragmented legacy platforms. The analysis used data flow diagrams, process diagrams, use cases, and an entity-relationship diagram, and it surfaced duplicate rider profiles, manual reconciliation, and a 14-day financial close.",
          "The recommendation consolidated those platforms into a single source of truth, with automated ADA compliance, real-time dispatch, and consolidated rider accounts. The rollout was a hybrid of Waterfall and Agile across six phases and 12 to 18 months, with a plan to keep the public system running during the transition.",
        ],
        links: [{ label: "Walk through the case", href: "files/istm-320-cmis-case.pdf" }],
      },
      {
        focus: true,
        terms: ["aggie consulting", "strategic management", "smart farming", "smart farm", "iot", "livestock", "agricultural", "1850", "farm", "hartwell", "istm 410"],
        paragraphs: [
          "Natalie was a finalist in the 2026 CMIS Case Competition for Strategic Management Information Systems (ISTM 410), from October 2026 to November 2026. The event was the Aggie Consulting Case Competition, and the client was Hartwell, a 1,850-acre farm.",
          "On a 4-person team, she developed a technology modernization strategy for a 1,850-acre agricultural operation. The team used a SWOT analysis, stakeholder assessments, and operational risk reviews to find gaps in farm management, financial tracking, and livestock monitoring.",
          "The recommendation was an integrated smart farming system with IoT sensors, automated monitoring, and centralized data. It included a phased roadmap, a technology prioritization framework, and an RFP response, then a presentation to a panel of judges.",
        ],
        links: [{ label: "See the Hartwell plan", href: "files/istm-410-hartwell-smart-farm.pdf" }],
      },
      {
        terms: ["project", "projects", "portfolio", "highlights", "built", "case comp", "case competitions", "finalist", "finalists"],
        paragraphs: [
          "Highlighted work includes Apple Flow, a shared-iPhone workflow for frontline teams; Intellivest, a financial-literacy site for Texas A&M students; two CMIS Case Competition finals, one on an integrated transit system and one on smart farming for a 1,850-acre operation; and an Amazon inbound process-improvement project.",
          "Scroll to Projects to see each one.",
        ],
      },
      {
        terms: ["skill", "skills", "tools", "sql", "excel", "power bi", "python", "analytics", "technical"],
        paragraphs: [
          "Natalie works with requirements and process documentation, stakeholder communication, SQL and relational databases, Excel, Power BI, Python foundations, and Google Analytics.",
          "Those skills are backed by coursework plus certifications from AWS, Google, LinkedIn Learning, Microsoft, and Crestron.",
        ],
      },
      {
        focus: true,
        terms: ["certification", "certifications", "certificate", "credentials", "aws", "google analytics", "linkedin learning", "six sigma", "crestron"],
        paragraphs: [
          "Credentials include AWS Certified Cloud Practitioner, an Amazon Lean Six Sigma Yellow Belt, Google Analytics Skillshop certificates, LinkedIn Learning courses in Power BI, generative AI, programming, and Excel, Google Technical Support Fundamentals, Microsoft Word Associate, and several Crestron AV certificates.",
        ],
      },
      {
        focus: true,
        terms: ["product@tamu", "product tamu", "product manager"],
        paragraphs: [
          "Natalie is a Product Manager with Product@TAMU in College Station, from August 2026 to the present.",
          "She is developing Apple Flow with 5+ members, an iOS productivity solution for workflows across 6 industries. She is also running market research and competitive analysis, defining 5 core features, prioritizing the MVP, and designing Figma prototypes.",
        ],
      },
      {
        focus: true,
        terms: ["aitp", "it committee", "website developer"],
        paragraphs: [
          "Natalie is an IT Committee Website Developer and member of the Association of Information Technology Professionals (AITP) in College Station, from September 2025 to the present.",
          "With the IT Committee she designs and maintains the AITP website for 200+ members, and she builds Intellivest, a financial literacy platform projected to reach 150+ students.",
        ],
      },
      {
        focus: true,
        terms: ["philsa", "filipino", "goodphil", "cultural team"],
        paragraphs: [
          "Natalie is a judge, competitor, and member of Philsa, the Filipino Student Association, in College Station, from September 2023 to the present.",
          "She performs with the cultural team, including the National Anthem at “Isang Mahal,” and her 42-person team placed in the Top 3 for Best Execution. She also judged 20+ vocal performances over 2 consecutive years at Isang Mahal, giving feedback across 4 performance criteria.",
        ],
      },
      {
        terms: ["activity", "activities", "organization", "organizations", "club", "baca", "aggie innovators", "kpmg", "leadership", "business analytics and consulting"],
        paragraphs: [
          "On campus Natalie is involved with Product@TAMU, AITP, Aggie Innovators, Philsa (Filipino Student Association), and the Business Analytics and Consulting Association.",
          "She was also selected for the KPMG Texas Talent + Leadership Program.",
        ],
      },
      {
        terms: ["contact", "email", "reach", "linkedin", "hire", "hiring", "connect", "message", "phone", "where is", "where are", "location", "located", "college station", "based", "live", "lives", "texas"],
        paragraphs: [
          "You can email Natalie at natalieedo6@gmail.com or message her on LinkedIn. She is based in College Station, Texas.",
          "There is also a contact form on this page.",
        ],
        links: [
          { label: "Email Natalie", href: "mailto:natalieedo6@gmail.com" },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/natalie-do-95a653285" },
        ],
      },
    ];

    knowledge.forEach(function (entry) {
      entry.matchers = entry.terms.map(function (term) {
        const clean = term.trim();
        return {
          length: clean.length,
          re: new RegExp("(^|\\s)" + clean.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=\\s|$)", "i"),
        };
      });
    });

    let turnCount = 0;
    let replyTimer = null;

    function setFresh(isFresh) {
      if (askNew) askNew.disabled = isFresh;
    }

    function scrollAsk() {
      askBody.scrollTop = askBody.scrollHeight;
    }

    function resizeAskInput() {
      askInput.style.height = "auto";
      askInput.style.height = Math.min(askInput.scrollHeight, 112) + "px";
    }

    function syncSend() {
      if (askSend) askSend.disabled = askInput.value.trim().length === 0;
    }

    function addUser(text) {
      const row = document.createElement("div");
      row.className = "ask-row ask-row--user";
      const copy = document.createElement("div");
      copy.className = "ask-copy";
      copy.textContent = text;
      row.appendChild(copy);
      askBody.appendChild(row);
      scrollAsk();
    }

    function addBot(entry, withSuggestions) {
      const row = document.createElement("div");
      row.className = "ask-row ask-row--bot";
      const avatar = makeAskMark("ask-row__avatar");
      const content = document.createElement("div");
      content.className = "ask-row__content";
      const md = document.createElement("div");
      md.className = "ask-md";
      entry.paragraphs.forEach(function (text) {
        const p = document.createElement("p");
        p.textContent = text;
        md.appendChild(p);
      });
      if (entry.links) {
        const p = document.createElement("p");
        entry.links.forEach(function (link, index) {
          if (index > 0) p.appendChild(document.createTextNode(" · "));
          const a = document.createElement("a");
          a.href = link.href;
          a.textContent = link.label;
          if (link.href.indexOf("http") === 0 || /\.pdf($|\?)/.test(link.href)) {
            a.target = "_blank";
            a.rel = "noopener noreferrer";
          }
          p.appendChild(a);
        });
        md.appendChild(p);
      }
      content.appendChild(md);
      if (withSuggestions) {
        const group = document.createElement("div");
        group.className = "ask-suggestions";
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", "Suggested questions");
        suggestions.forEach(function (prompt) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "ask-suggestion";
          button.textContent = prompt;
          button.addEventListener("click", function () {
            ask(prompt);
          });
          group.appendChild(button);
        });
        content.appendChild(group);
      }
      row.appendChild(avatar);
      row.appendChild(content);
      askBody.appendChild(row);
      scrollAsk();
    }

    function showTyping() {
      const row = document.createElement("div");
      row.className = "ask-row ask-row--bot";
      row.id = "ask-typing";
      const avatar = makeAskMark("ask-row__avatar");
      avatar.classList.add("is-draw");
      const dots = document.createElement("div");
      dots.className = "ask-typing";
      dots.setAttribute("aria-label", "nd.ai is replying");
      dots.innerHTML = "<span></span>";
      row.appendChild(avatar);
      row.appendChild(dots);
      askBody.appendChild(row);
      scrollAsk();
    }

    function answerFor(raw) {
      const query = raw.toLowerCase().replace(/[^a-z0-9@.\s]/g, " ").replace(/\s+/g, " ").trim();
      if (/^(hi|hey|hello|yo|thanks|thank you|good morning|good afternoon)\b/.test(query)) {
        return {
          paragraphs: [
            "Hey! I can tell you about Natalie’s studies, experience, projects, and skills.",
            "What would you like to know?",
          ],
          suggestions: true,
        };
      }
      let best = null;
      let bestScore = 0;
      let bestLongest = 0;
      knowledge.forEach(function (entry) {
        let score = 0;
        let longest = 0;
        entry.matchers.forEach(function (matcher) {
          if (matcher.re.test(query)) {
            score += matcher.length;
            if (matcher.length > longest) longest = matcher.length;
          }
        });
        if (entry.focus && score > 0) score += 6;
        if (score > bestScore || (score === bestScore && score > 0 && longest > bestLongest)) {
          bestScore = score;
          bestLongest = longest;
          best = entry;
        }
      });
      if (!best || bestScore < 2) {
        return {
          paragraphs: [
            "I can answer from what’s on Natalie’s portfolio: her studies, experience, projects, skills, and how to reach her.",
            "Try one of the suggestions, or email her at natalieedo6@gmail.com.",
          ],
          suggestions: true,
          links: [{ label: "Email Natalie", href: "mailto:natalieedo6@gmail.com" }],
        };
      }
      return best;
    }

    function greet() {
      askBody.textContent = "";
      turnCount = 0;
      addBot(
        {
          paragraphs: [
            "Hey! I’m nd.ai.",
            "I can tell you about Natalie’s studies, experience, projects, and skills.",
            "What would you like to know?",
          ],
        },
        true
      );
      setFresh(true);
    }

    function ask(text) {
      const cleaned = text.trim();
      if (!cleaned) return;
      document.querySelectorAll(".ask-suggestions").forEach(function (group) {
        group.remove();
      });
      addUser(cleaned);
      askInput.value = "";
      resizeAskInput();
      syncSend();
      turnCount += 1;
      setFresh(false);
      showTyping();
      const entry = answerFor(cleaned);
      if (replyTimer) window.clearTimeout(replyTimer);
      let reduceMotion = false;
      try {
        reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      } catch (err) {}
      replyTimer = window.setTimeout(function () {
        const typing = document.getElementById("ask-typing");
        if (typing) typing.remove();
        addBot(entry, !!entry.suggestions);
      }, reduceMotion ? 0 : 700);
    }

    function openAsk() {
      askPanel.hidden = false;
      askLauncher.setAttribute("aria-expanded", "true");
      if (!askBody.childElementCount) greet();
      window.setTimeout(function () {
        askInput.focus();
      }, 30);
    }

    function closeAsk() {
      askPanel.hidden = true;
      askLauncher.setAttribute("aria-expanded", "false");
      askLauncher.focus();
    }

    askLauncher.addEventListener("click", openAsk);
    if (askClose) askClose.addEventListener("click", closeAsk);
    if (askNew) {
      askNew.addEventListener("click", function () {
        greet();
        askInput.focus();
      });
    }

    askInput.addEventListener("input", function () {
      resizeAskInput();
      syncSend();
    });

    askInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        ask(askInput.value);
      }
    });

    askForm.addEventListener("submit", function (e) {
      e.preventDefault();
      ask(askInput.value);
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !askPanel.hidden) closeAsk();
    });

    greet();
  }
})();
