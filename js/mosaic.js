import { iconFiles } from "./icons.js";

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

function inSafeZone(nx, ny, safe) {
  return nx >= safe.left && nx <= safe.right && ny >= safe.top && ny <= safe.bottom;
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

export function initIconMosaic(heroEl) {
  if (!heroEl || iconFiles.length === 0) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const layer = document.createElement("div");
  layer.className = "icon-mosaic";
  layer.setAttribute("aria-hidden", "true");

  const bg = heroEl.querySelector(".hero-bg");
  if (bg) bg.after(layer);
  else heroEl.prepend(layer);

  let generation = 0;
  let resizeTimer = null;

  const build = () => {
    generation += 1;
    const myGen = generation;
    const isStale = () => myGen !== generation;

    layer.replaceChildren();

    const rect = heroEl.getBoundingClientRect();
    if (rect.width < 40 || rect.height < 40) return;

    const iconSize = cssNumber("--mosaic-icon-size", 28);
    const gap = cssNumber("--mosaic-gap", 44);
    const step = iconSize + gap;

    const cols = Math.max(3, Math.floor(rect.width / step));
    const rows = Math.max(3, Math.floor(rect.height / step));

    const safe = {
      left: cssNumber("--mosaic-safe-left", 0.2),
      right: cssNumber("--mosaic-safe-right", 0.8),
      top: cssNumber("--mosaic-safe-top", 0.26),
      bottom: cssNumber("--mosaic-safe-bottom", 0.74),
    };
    const headerBand = cssNumber("--mosaic-header-band", 0.12);

    if (rect.width < 720) {
      safe.left = Math.min(safe.left, 0.12);
      safe.right = Math.max(safe.right, 0.88);
      safe.top = Math.min(safe.top, 0.22);
      safe.bottom = Math.max(safe.bottom, 0.78);
    }

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const nx = (c + 0.5) / cols;
        const ny = (r + 0.5) / rows;
        if (ny < headerBand) continue;
        if (inSafeZone(nx, ny, safe)) continue;

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
    resizeTimer = setTimeout(build, 200);
  };
  window.addEventListener("resize", onResize);

  return () => {
    generation += 1;
    window.removeEventListener("resize", onResize);
    clearTimeout(resizeTimer);
    layer.remove();
  };
}
