// ----------------- LENIS + GSAP SYNC -----------------
// const lenis = new Lenis({
//   duration: 1.2,
//   easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//   smoothWheel: true,
//   smoothTouch: false
// });

// // Sync Lenis with GSAP's ScrollTrigger (if GSAP exists)
// if (typeof ScrollTrigger !== 'undefined') {
//   lenis.on('scroll', ScrollTrigger.update);
//   gsap.ticker.add((time) => {
//     lenis.raf(time * 1000); // time in ms
//   });
//   gsap.ticker.lagSmoothing(0);
// } else {
//   // Fallback if GSAP not loaded
//   function raf(time) {
//     lenis.raf(time);
//     requestAnimationFrame(raf);
//   }
//   requestAnimationFrame(raf);
// }
// ------------------------------------------------------


// =================================
// PREMIUM SMOOTH SCROLLING
// =================================

const lenis = typeof Lenis !== "undefined"
  ? new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
      infinite: false
    })
  : null;

if (lenis) {
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}
// =================================
// SMART NAVBAR
// =================================

const navbar = document.querySelector("#nav");

let lastScroll = 0;

function updateNavbar(currentScroll) {
  if (!navbar) return;

  if (currentScroll < 80) {
    navbar.classList.remove("nav-hidden");
    navbar.classList.remove("nav-scrolled");
  } else if (currentScroll > lastScroll + 3) {
    navbar.classList.add("nav-hidden");
  } else if (currentScroll < lastScroll - 3) {
    navbar.classList.remove("nav-hidden");
    navbar.classList.add("nav-scrolled");
  }

  lastScroll = currentScroll;
}

if (lenis) {
  lenis.on("scroll", ({ scroll }) => updateNavbar(scroll));
} else {
  console.warn("Lenis was not loaded; using native scrolling.");

  const handleNativeScroll = () => {
    const scroll = Math.max(
      window.scrollY || 0,
      document.documentElement.scrollTop || 0,
      document.body.scrollTop || 0
    );
    updateNavbar(scroll);
  };

  window.addEventListener("scroll", handleNativeScroll, { passive: true });
  document.body.addEventListener("scroll", handleNativeScroll, { passive: true });
}
// ----------------- SHERY.JS -----------------
if (typeof Shery !== "undefined") {
  if (window.innerWidth > 1024 && !("ontouchstart" in window)) {
    Shery.mouseFollower();
  }

  Shery.makeMagnet(".magnet");
} else {
  console.warn("Shery.js was not loaded; magnetic hover effects are disabled.");
}

// ----------------- VIDEO HOVER -----------------
document.querySelectorAll(".video-hover-container").forEach((container) => {
  const img = container.querySelector(".video-thumbnail");
  const vid = container.querySelector(".video-preview");

  container.addEventListener("mouseenter", () => {
    img.style.display = "none";
    vid.style.display = "block";
    vid.play();
  });

  container.addEventListener("mouseleave", () => {
    vid.pause();
    vid.currentTime = 0;
    vid.style.display = "none";
    img.style.display = "block";
  });
});

// ----------------- HOME SERVICE CARDS -----------------
const serviceSection = document.querySelector("#ourServices");
const serviceCards = serviceSection
  ? Array.from(serviceSection.querySelectorAll("[data-service-card]"))
  : [];

if (serviceCards.length) {
  const activateServiceCard = (activeCard) => {
    serviceCards.forEach((card) => {
      const isActive = card === activeCard;
      const toggle = card.querySelector(".service-card__toggle");
      const details = card.querySelector(".service-card__details");

      card.classList.toggle("is-active", isActive);
      toggle.setAttribute("aria-expanded", String(isActive));
      details.setAttribute("aria-hidden", String(!isActive));

      if (isActive) {
        details.removeAttribute("inert");
      } else {
        details.setAttribute("inert", "");
      }
    });
  };

  serviceCards.forEach((card) => {
    card.addEventListener("pointerenter", () => activateServiceCard(card));
    card.addEventListener("focusin", () => activateServiceCard(card));
    card
      .querySelector(".service-card__toggle")
      .addEventListener("click", () => activateServiceCard(card));
  });

  let serviceScrollFrame = 0;
  const activateServiceAtViewportCenter = () => {
    if (serviceScrollFrame) return;

    serviceScrollFrame = requestAnimationFrame(() => {
      serviceScrollFrame = 0;

      const sectionRect = serviceSection.getBoundingClientRect();
      if (sectionRect.bottom <= 0 || sectionRect.top >= window.innerHeight) return;

      const viewportCenter = window.innerHeight / 2;
      let nearestCard = null;
      let nearestDistance = Infinity;

      serviceCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

        const cardCenter = (rect.top + rect.bottom) / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < nearestDistance) {
          nearestCard = card;
          nearestDistance = distance;
        }
      });

      if (nearestCard) activateServiceCard(nearestCard);
    });
  };

  if (lenis) {
    lenis.on("scroll", activateServiceAtViewportCenter);
  } else {
    window.addEventListener("scroll", activateServiceAtViewportCenter, { passive: true });
  }

  window.addEventListener("resize", activateServiceAtViewportCenter);
  activateServiceAtViewportCenter();
}

// ----------------- TAB BUTTONS -----------------
const projectShowcase = document.querySelector("#projectShowcaseMain");
const projectItems = projectShowcase
  ? Array.from(projectShowcase.querySelectorAll("[data-category]"))
  : [];
const projectColumns = projectShowcase
  ? Array.from(projectShowcase.children)
  : [];

projectItems.forEach((item) => item.classList.add("project-filter-item"));

const insightContainer = document.querySelector("#blogContentBoxAreaMain");
const insightColumns = insightContainer
  ? Array.from(insightContainer.children)
  : [];
const insightItems = insightContainer
  ? Array.from(insightContainer.querySelectorAll(".blogContentBox1"))
      .map((card) => card.closest("a"))
      .filter(Boolean)
  : [];

insightItems.forEach((item) => {
  const category = item.querySelector(".blogContentBoxText button");
  item.dataset.category = category
    ? category.textContent.trim().toLowerCase().replace(/\s+/g, "-")
    : "";
  item.classList.add("insight-filter-item");
});

function filterProjects(filter) {
  projectItems.forEach((item) => {
    const categories = item.dataset.category.split(/\s+/);
    item.hidden = filter !== "all" && !categories.includes(filter);
  });

  const visibleColumns = projectColumns.filter((column) => {
    const hasVisibleItem = Array.from(column.querySelectorAll("[data-category]"))
      .some((item) => !item.hidden);
    column.hidden = !hasVisibleItem;
    return hasVisibleItem;
  });

  projectShowcase.classList.toggle(
    "has-single-project-column",
    visibleColumns.length === 1
  );
}

function filterInsights(filter) {
  insightItems.forEach((item) => {
    item.hidden = filter !== "all" && item.dataset.category !== filter;
  });

  const visibleColumns = insightColumns.filter((column) => {
    const hasVisibleItem = Array.from(column.querySelectorAll(".insight-filter-item"))
      .some((item) => !item.hidden);
    column.hidden = !hasVisibleItem;
    return hasVisibleItem;
  });

  insightContainer.classList.toggle(
    "has-single-blog-column",
    visibleColumns.length === 1
  );
}

const filterButtons = document.querySelectorAll(".tab-button[data-filter]");
filterButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  button.addEventListener("click", () => {
    const group = button.closest(".ourHeadingButtons");
    if (!group) return;

    group.querySelectorAll(".tab-button[data-filter]").forEach((tab) => {
      const isActive = tab === button;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-pressed", String(isActive));
    });

    if (projectShowcase) {
      filterProjects(button.dataset.filter);
    } else if (insightContainer) {
      filterInsights(button.dataset.filter);
    }
  });
});

if (projectShowcase) filterProjects("all");
if (insightContainer) filterInsights("all");

// ----------------- SERVICE BUTTONS -----------------
document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".service-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      this.classList.toggle("active");
    });
  });
});

const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menuOverlay");
const closeBtn = document.querySelector(".closeBtn");

hamburger.addEventListener("click", () => {
  menu.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  menu.classList.remove("show");
});
