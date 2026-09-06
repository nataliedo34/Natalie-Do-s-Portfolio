(function () {
  const views = {
    home: ["about", "contact"],
    projects: ["selected-work"],
    resume: ["education", "experience", "activities", "skills", "credentials"],
  };
  const viewBannerTitle = {
    home: "Home",
    projects: "Projects",
    resume: "Resume",
  };
  const sectionIds = Object.values(views).flat();
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function toView(hashOrId) {
    const key = (hashOrId || "").replace(/^#/, "");
    if (key === "projects") return "projects";
    if (key === "resume") return "resume";
    if (key === "home") return "home";
    if (views.projects.includes(key)) return "projects";
    if (views.resume.includes(key)) return "resume";
    return "home";
  }

  function setActiveView(view, updateHash) {
    const activeView = toView(view);
    const activeSections = new Set(views[activeView]);
    const banner = document.querySelector(".tab-banner");
    const bannerTitle = document.getElementById("tab-banner-title");
    const bannerTitleText = viewBannerTitle[activeView] || viewBannerTitle.home;

    sectionIds.forEach(function (id) {
      const section = document.getElementById(id);
      if (!section) return;
      const willBeActive = activeSections.has(id);
      section.hidden = !willBeActive;
      section.classList.remove("tab-enter");
      if (willBeActive && !reduceMotionQuery.matches) {
        section.classList.add("tab-enter");
      }
    });

    if (banner) banner.hidden = activeView === "home";
    if (bannerTitle) bannerTitle.textContent = bannerTitleText;

    document.querySelectorAll(".pill-nav a").forEach(function (link) {
      const href = link.getAttribute("href");
      const isActive = href === "#" + activeView;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    if (updateHash) {
      window.history.replaceState(null, "", "#" + activeView);
    }
  }

  document.querySelectorAll(".main section").forEach(function (section) {
    section.addEventListener("animationend", function () {
      section.classList.remove("tab-enter");
    });
  });

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

  document
    .querySelectorAll(
      '.pill-nav a[href="#home"], .pill-nav a[href="#projects"], .pill-nav a[href="#resume"], .logo-mark[href="#home"], .home-shortcut-card[href="#projects"], .home-shortcut-card[href="#resume"]'
    )
    .forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href");
      const nextView = toView(href);
      if (!nextView) return;
      e.preventDefault();
      setActiveView(nextView, true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  window.addEventListener("hashchange", function () {
    setActiveView(window.location.hash, false);
  });

  setActiveView(window.location.hash, false);

  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("contact-name");
      const email = document.getElementById("contact-email");
      const message = document.getElementById("contact-message");
      if (!name || !email || !message) return;

      const mailLink = document.querySelector(".contact-email-link");
      let addr = "nataliedo@tamu.edu";
      if (mailLink && mailLink.getAttribute("href")) {
        const raw = mailLink.getAttribute("href").replace(/^mailto:/i, "").split("?")[0];
        if (raw) addr = raw;
      }
      const subject = encodeURIComponent("Portfolio message from " + (name.value || "visitor"));
      const body = encodeURIComponent(
        "From: " + (name.value || "") + "\nEmail: " + (email.value || "") + "\n\n" + (message.value || "")
      );
      window.location.href = "mailto:" + addr + "?subject=" + subject + "&body=" + body;
    });
  }
})();
