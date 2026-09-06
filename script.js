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
      '.pill-nav a[href="#home"], .pill-nav a[href="#projects"], .pill-nav a[href="#resume"], .logo-mark[href="#home"], .home-shortcut-card[href="#projects"], .home-shortcut-card[href="#resume"], .cta-pill[href="#resume"]'
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
        setActiveView("home", true);
        setStatus("Message sent. Thanks for reaching out!", "is-success");
        params.delete("sent");
        var clean =
          window.location.pathname +
          (params.toString() ? "?" + params.toString() : "") +
          "#home";
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
          "?sent=1#home";
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
})();
