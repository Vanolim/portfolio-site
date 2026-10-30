import { iconFiles } from "./icons.js?v=20261030f";

const ICON_BASE = "assets/icons/";

function cssNumber(name, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function pickIcon(exclude) {
  if (iconFiles.length === 0) return null;
  let next = iconFiles[Math.floor(Math.random() * iconFiles.length)];
  if (iconFiles.length > 1) {
    let guard = 0;
    while (next === exclude && guard < 8) {
      next = iconFiles[Math.floor(Math.random() * iconFiles.length)];
      guard += 1;
    }
  }
  return next;
}

function localRect(el, root) {
  const er = el.getBoundingClientRect();
  const rr = root.getBoundingClientRect();
  return {
    left: er.left - rr.left,
    top: er.top - rr.top,
    right: er.right - rr.left,
    bottom: er.bottom - rr.top,
  };
}

function expandRect(rect, padX, padY = padX) {
  return {
    left: rect.left - padX,
    top: rect.top - padY,
    right: rect.right + padX,
    bottom: rect.bottom + padY,
  };
}

function overlaps(x, y, half, zones) {
  for (const z of zones) {
    if (x + half > z.left && x - half < z.right && y + half > z.top && y - half < z.bottom) {
      return true;
    }
  }
  return false;
}

async function runSlot(img, isStale) {
  const cell = img.parentElement;
  let last = null;
  await wait(rand(0, cssNumber("--mosaic-stagger-ms", 4000)));

  while (!isStale() && img.isConnected) {
    const file = pickIcon(last);
    last = file;
    if (!file) break;

    cell.classList.remove("is-on");
    img.src = `${ICON_BASE}${file}`;

    await wait(
      rand(cssNumber("--mosaic-cooldown-min-ms", 900), cssNumber("--mosaic-cooldown-max-ms", 2200))
    );
    if (isStale()) break;

    cell.classList.add("is-on");
    await wait(cssNumber("--mosaic-fade-ms", 1600) + cssNumber("--mosaic-hold-ms", 900));
    if (isStale()) break;

    cell.classList.remove("is-on");
    await wait(cssNumber("--mosaic-fade-ms", 1600));
  }
}

function addZone(zones, el, root, padX, padY) {
  if (!el) return;
  const style = getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return;
  const rect = localRect(el, root);
  if (rect.right - rect.left < 4 || rect.bottom - rect.top < 4) return;
  zones.push(expandRect(rect, padX, padY));
}

function buildExclusionZones(root, width, height, padX, padY) {
  const zones = [];
  // Same pocket size as the hero title block.
  const contentPadX = padX * 1.35;
  const contentPadY = padY * 1.15;

  const header = document.getElementById("site-header");
  if (header) {
    const h = header.getBoundingClientRect().height || 72;
    zones.push({ left: 0, top: 0, right: width, bottom: h + padY * 0.6 });
  }

  addZone(zones, root.querySelector(".hero-inner"), root, contentPadX, contentPadY);

  // About: only title + text, not the full container width.
  addZone(zones, document.getElementById("about-title"), root, contentPadX, contentPadY);
  addZone(zones, root.querySelector(".about-text"), root, contentPadX, contentPadY);

  // Experience: clear the whole section column so icons stay only in side gutters
  // (no animation between zigzag timeline cards).
  addZone(zones, document.getElementById("experience"), root, contentPadX * 0.35, contentPadY * 0.35);

  // Projects: title + cards — leave gaps and space under the grid for icons.
  addZone(zones, document.getElementById("projects-title"), root, contentPadX, contentPadY);
  root.querySelectorAll(".project-card").forEach((el) => {
    addZone(zones, el, root, contentPadX * 0.4, contentPadY * 0.4);
  });

  // Recommendations: title + cards.
  addZone(zones, document.getElementById("recommendations-title"), root, contentPadX, contentPadY);
  root.querySelectorAll(".reco-card").forEach((el) => {
    addZone(zones, el, root, contentPadX * 0.55, contentPadY * 0.55);
  });

  const rail = document.getElementById("social-rail");
  if (rail && getComputedStyle(rail).display !== "none") {
    addZone(zones, rail, root, padX * 0.35, padY * 0.35);
  }

  const socialBar = document.querySelector(".social-bar");
  if (socialBar && getComputedStyle(socialBar).display !== "none") {
    const footer = document.getElementById("social-footer");
    if (footer && getComputedStyle(footer).display !== "none") {
      addZone(zones, socialBar, root, padX * 0.5, padY * 0.5);
    }
  }

  return zones.map((z) => ({
    left: Math.max(0, z.left),
    top: Math.max(0, z.top),
    right: Math.min(width, z.right),
    bottom: Math.min(height, z.bottom),
  }));
}

export function initIconMosaic(rootEl = document.querySelector("main")) {
  if (!rootEl || iconFiles.length === 0) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  document.querySelectorAll(".icon-mosaic").forEach((node) => node.remove());

  const layer = document.createElement("div");
  layer.className = "icon-mosaic";
  layer.setAttribute("aria-hidden", "true");
  rootEl.prepend(layer);

  let generation = 0;
  let resizeTimer = null;
  let building = false;

  const build = () => {
    if (building) return;
    building = true;
    generation += 1;
    const myGen = generation;
    const isStale = () => myGen !== generation;

    try {
      layer.replaceChildren();

      const width = rootEl.clientWidth;
      const height = rootEl.scrollHeight;
      if (width < 40 || height < 40) return;

      layer.style.height = `${height}px`;

      const iconSize = cssNumber("--mosaic-icon-size", 28);
      const gap = cssNumber("--mosaic-gap", 56);
      const step = iconSize + gap;
      const density = Math.min(1, Math.max(0.2, cssNumber("--mosaic-density", 0.78)));
      const padX = cssNumber("--mosaic-content-pad-x", 36);
      const padY = cssNumber("--mosaic-content-pad-y", 28);
      const half = iconSize / 2;

      const cols = Math.max(3, Math.floor(width / step));
      const rows = Math.max(4, Math.floor(height / step));
      const zones = buildExclusionZones(rootEl, width, height, padX, padY);

      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const x = ((c + 0.5) / cols) * width;
          const y = ((r + 0.5) / rows) * height;

          if (overlaps(x, y, half, zones)) continue;
          if (Math.random() > density) continue;

          const cell = document.createElement("div");
          cell.className = "icon-mosaic__cell";
          cell.style.left = `${(x / width) * 100}%`;
          cell.style.top = `${(y / height) * 100}%`;

          const img = document.createElement("img");
          img.alt = "";
          img.decoding = "async";
          img.draggable = false;
          cell.appendChild(img);
          layer.appendChild(cell);

          runSlot(img, isStale);
        }
      }
    } finally {
      building = false;
    }
  };

  const scheduleBuild = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 180);
  };

  requestAnimationFrame(() => {
    build();
    setTimeout(build, 500);
  });

  window.addEventListener("resize", scheduleBuild);
  window.addEventListener("load", scheduleBuild);

  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(scheduleBuild) : null;
  ro?.observe(rootEl);

  return () => {
    generation += 1;
    window.removeEventListener("resize", scheduleBuild);
    window.removeEventListener("load", scheduleBuild);
    ro?.disconnect();
    clearTimeout(resizeTimer);
    layer.remove();
  };
}
