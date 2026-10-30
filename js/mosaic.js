import { iconFiles } from "./icons.js";

const ICON_BASE = "assets/icons/";

const CONTENT_SELECTORS = [
  ".hero-inner",
  "#about",
  "#experience",
  "#projects",
  "#recommendations",
  "#social-rail",
  "#site-header .nav",
];

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

function docRect(el) {
  const r = el.getBoundingClientRect();
  return {
    left: r.left + window.scrollX,
    top: r.top + window.scrollY,
    right: r.right + window.scrollX,
    bottom: r.bottom + window.scrollY,
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

function collectZones(root, padX, padY) {
  const rootRect = docRect(root);
  const zones = [];

  for (const selector of CONTENT_SELECTORS) {
    const el = document.querySelector(selector);
    if (!el) continue;
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;
    const rect = docRect(el);
    if (rect.right - rect.left < 8 || rect.bottom - rect.top < 8) continue;
    // Extra clearance around the hero title block.
    const extraX = selector === ".hero-inner" ? padX * 0.5 : 0;
    const extraY = selector === ".hero-inner" ? padY * 0.75 : 0;
    zones.push(expandRect(rect, padX + extraX, padY + extraY));
  }

  // Keep icons out of the fixed header band at the top of the page.
  const header = document.getElementById("site-header");
  if (header) {
    const h = header.getBoundingClientRect().height || 72;
    zones.push({
      left: rootRect.left,
      top: rootRect.top,
      right: rootRect.right,
      bottom: rootRect.top + h + padY,
    });
  }

  return { rootRect, zones };
}

function overlapsZone(x, y, half, zones) {
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

export function initIconMosaic(rootEl = document.querySelector("main")) {
  if (!rootEl || iconFiles.length === 0) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const layer = document.createElement("div");
  layer.className = "icon-mosaic";
  layer.setAttribute("aria-hidden", "true");
  rootEl.prepend(layer);

  let generation = 0;
  let resizeTimer = null;

  const build = () => {
    generation += 1;
    const myGen = generation;
    const isStale = () => myGen !== generation;

    layer.replaceChildren();

    const width = rootEl.offsetWidth;
    const height = rootEl.scrollHeight;
    if (width < 40 || height < 40) return;

    layer.style.height = `${height}px`;

    const iconSize = cssNumber("--mosaic-icon-size", 28);
    const gap = cssNumber("--mosaic-gap", 56);
    const step = iconSize + gap;
    const density = Math.min(1, Math.max(0.2, cssNumber("--mosaic-density", 0.7)));
    const padX = cssNumber("--mosaic-content-pad-x", 36);
    const padY = cssNumber("--mosaic-content-pad-y", 28);
    const half = iconSize / 2;

    const cols = Math.max(3, Math.floor(width / step));
    const rows = Math.max(3, Math.floor(height / step));
    const { rootRect, zones } = collectZones(rootEl, padX, padY);

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const nx = (c + 0.5) / cols;
        const ny = (r + 0.5) / rows;
        const x = rootRect.left + nx * width;
        const y = rootRect.top + ny * height;

        if (overlapsZone(x, y, half, zones)) continue;
        if (Math.random() > density) continue;

        const cell = document.createElement("div");
        cell.className = "icon-mosaic__cell";
        cell.style.left = `${nx * 100}%`;
        cell.style.top = `${ny * 100}%`;

        const img = document.createElement("img");
        img.alt = "";
        img.decoding = "async";
        img.draggable = false;
        cell.appendChild(img);
        layer.appendChild(cell);

        runSlot(img, isStale);
      }
    }
  };

  build();

  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 220);
  };
  window.addEventListener("resize", onResize);

  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
  ro?.observe(rootEl);

  return () => {
    generation += 1;
    window.removeEventListener("resize", onResize);
    ro?.disconnect();
    clearTimeout(resizeTimer);
    layer.remove();
  };
}
