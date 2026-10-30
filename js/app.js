import { initIconMosaic } from "./mosaic.js";

const { site, copy, projects, experience, recommendations } = await import(
  new URL(`./data.js?t=${Date.now()}`, import.meta.url).href
);

const ICONS = {
  mail: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
  telegram: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>`,
  linkedin: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  github: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
  hh: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h4v16H4zM10 4h4v7h6v9h-4v-5h-2v5h-4z"/></svg>`,
  menu: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
  close: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  chevronLeft: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`,
  chevronRight: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`,
};

let lang = site.defaultLang || "ru";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function t(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang] ?? value.ru ?? value.en ?? "";
}

function setLang(next) {
  lang = next;
  localStorage.setItem("portfolio-lang", next);
  document.documentElement.lang = next;
  document.title = next === "ru" ? "Иван Селютин — Unity Developer" : "Ivan Selyutin — Unity Developer";
  renderAll();
}

function initLang() {
  const saved = localStorage.getItem("portfolio-lang");
  if (saved === "ru" || saved === "en") lang = saved;
}

function renderSocials() {
  const html = site.socials
    .map(
      (s, i) =>
        `<a href="${s.href}" target="${s.href.startsWith("mailto:") ? "_self" : "_blank"}" rel="noopener noreferrer" aria-label="${s.label}" style="--i:${i}">${ICONS[s.id] || ICONS.mail}</a>`
    )
    .join("");

  $("#social-rail").innerHTML = html;
}

function renderStaticCopy() {
  const c = copy[lang];

  $("#brand").textContent = c.brand;
  $("#nav-home").textContent = c.nav.home;
  $("#nav-about").textContent = c.nav.about;
  $("#nav-projects").textContent = c.nav.projects;
  $("#nav-experience").textContent = c.nav.experience;
  $("#nav-recommendations").textContent = c.nav.recommendations;
  $("#nav-resume").textContent = c.nav.resume;
  $("#nav-resume").href = site.resume[lang];

  $("#m-nav-home").textContent = c.nav.home;
  $("#m-nav-about").textContent = c.nav.about;
  $("#m-nav-projects").textContent = c.nav.projects;
  $("#m-nav-experience").textContent = c.nav.experience;
  $("#m-nav-recommendations").textContent = c.nav.recommendations;
  $("#m-nav-resume").textContent = c.nav.resume;
  $("#m-nav-resume").href = site.resume[lang];

  $("#hero-kicker").textContent = c.hero.kicker;
  $("#hero-first").textContent = c.hero.firstName;
  $("#hero-last").textContent = c.hero.lastName;
  $("#hero-tagline").textContent = c.hero.tagline;

  $("#about-title").textContent = c.about.title;
  $("#about-content").innerHTML = c.about.paragraphs.map((p) => `<p>${p}</p>`).join("");

  $("#projects-title").textContent = c.projects.title;
  $("#experience-title").textContent = c.experience.title;
  $("#recommendations-title").textContent = c.recommendations.title;

  $$(".lang-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });
}

function buildCarousel(project) {
  const images = project.images?.filter(Boolean) || [];
  const placeholder = `<div class="carousel-placeholder">${copy[lang].projectPlaceholder}</div>`;
  const containImages = project.imageFit === "contain";

  if (images.length === 0) {
    return `<div class="carousel">${placeholder}</div>`;
  }

  const slides = images
    .map(
      (src) => `
        <div class="carousel-slide${containImages ? " carousel-slide--contain" : ""}">
          ${containImages ? `<div class="carousel-slide__backdrop" style="background-image: url('${src}')"></div>` : ""}
          <img src="${src}" alt="${t(project.title)}" loading="lazy" />
        </div>`
    )
    .join("");

  const controls =
    images.length > 1
      ? `
      <div class="carousel-nav">
        <button type="button" class="carousel-btn" data-dir="-1" aria-label="Previous">${ICONS.chevronLeft}</button>
        <button type="button" class="carousel-btn" data-dir="1" aria-label="Next">${ICONS.chevronRight}</button>
      </div>
      <div class="carousel-dots">
        ${images.map((_, i) => `<button type="button" class="carousel-dot${i === 0 ? " is-active" : ""}" data-index="${i}" aria-label="Slide ${i + 1}"></button>`).join("")}
      </div>`
      : "";

  return `
    <div class="carousel" data-carousel data-index="0" data-count="${images.length}">
      <div class="carousel-track">${slides}</div>
      ${controls}
    </div>`;
}

function renderProjects() {
  const grid = $("#projects-grid");
  grid.innerHTML = projects
    .map((project) => {
      const links = (project.links || [])
        .map((link) => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${t(link.label)}</a>`)
        .join("");

      const tags = (project.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join("");

      return `
        <article class="project-card">
          ${buildCarousel(project)}
          <div class="project-body">
            <h3>${t(project.title)}</h3>
            <p>${t(project.description)}</p>
            <div class="tags">${tags}</div>
            ${links ? `<div class="project-links">${links}</div>` : ""}
          </div>
        </article>`;
    })
    .join("");

  $$("[data-carousel]", grid).forEach(bindCarousel);
}

function bindCarousel(root) {
  const count = Number(root.dataset.count || 1);
  if (count <= 1) return;

  const track = $(".carousel-track", root);
  const dots = $$(".carousel-dot", root);

  const go = (index) => {
    const next = ((index % count) + count) % count;
    root.dataset.index = String(next);
    track.style.transform = `translateX(-${next * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === next));
  };

  $$(".carousel-btn", root).forEach((btn) => {
    btn.addEventListener("click", () => {
      go(Number(root.dataset.index) + Number(btn.dataset.dir));
    });
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => go(Number(dot.dataset.index)));
  });
}

function renderExperience() {
  $("#experience-timeline").innerHTML = experience
    .map((job, i) => {
      const period = t(job.period);
      const location = t(job.location);
      const meta = [period, location].filter(Boolean);
      const role = t(job.role);
      const company = t(job.company);
      const heading = lang === "ru" ? `${role} в ${company}` : `${role} at ${company}`;
      const summary = t(job.text);
      const body = summary
        ? `<p class="timeline-text">${summary}</p>`
        : `<ul>${(job.bullets || []).map((b) => `<li>${t(b)}</li>`).join("")}</ul>`;
      const side = i % 2 === 0 ? "left" : "right";

      return `
        <article class="timeline-item timeline-item--${side}">
          <div class="timeline-content">
            ${meta.length ? `<div class="timeline-meta">${meta.map((m) => `<span>${m}</span>`).join("")}</div>` : ""}
            <h3>${heading}</h3>
            ${body}
          </div>
        </article>`;
    })
    .join("");
}

function renderRecommendations() {
  const grid = $("#recommendations-grid");
  const openLabel = copy[lang].recommendations.open;

  grid.innerHTML = recommendations
    .map((item) => {
      const link = item.url
        ? `<a class="reco-link" href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="${openLabel}">
            <svg class="reco-link-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </a>`
        : "";

      return `
        <article class="reco-card">
          <h3 class="reco-company">${t(item.company)}</h3>
          <p class="reco-text">${t(item.text)}</p>
          ${link}
        </article>`;
    })
    .join("");
}

function renderAll() {
  renderSocials();
  renderStaticCopy();
  renderProjects();
  renderExperience();
  renderRecommendations();
}

function bindUi() {
  $$(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  const mobile = $("#mobile-menu");
  $("#menu-open").addEventListener("click", () => mobile.classList.add("is-open"));
  $("#menu-close").addEventListener("click", () => mobile.classList.remove("is-open"));
  $$("#mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => mobile.classList.remove("is-open"));
  });

  const header = $("#site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

initLang();
document.documentElement.lang = lang;
document.title = lang === "ru" ? "Иван Селютин — Unity Developer" : "Ivan Selyutin — Unity Developer";
bindUi();
renderAll();
initIconMosaic(document.getElementById("hero"));
