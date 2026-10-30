import { iconFiles } from "./icons.js?v=6";

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

function buildExclusionZones(root, width, height, padX, padY) {
  const zones = [];

  // Fixed header strip.
  const header = document.getElementById("site-header");
  if (header) {
    const h = header.getBoundingClientRect().height || 72;
    zones.push({ left: 0, top: 0, right: width, bottom: h + padY });
  }

  // Hero copy — keep a clear pocket around the title block.
  const heroInner = root.querySelector(".hero-inner");
  if (heroInner) {
    zones.push(expandRect(localRect(heroInner, root), padX * 1.4, padY * 1.2));
  }

  // Content sections: clear each container box (+ pad). Icons stay in page side gutters.
  const sectionIds = ["about", "experience", "projects", "recommendations"];
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    zones.push(expandRect(localRect(el, root), padX, padY));
  }

  // About text is narrower than the container — clear it explicitly with extra pad.
  const aboutText = root.querySelector(".about-text");
  const aboutTitle = document.getElementById("about-title");
  if (aboutText) zones.push(expandRect(localRect(aboutText, root), padX * 1.6, padY * 1.4));
  if (aboutTitle) zones.push(expandRect(localRect(aboutTitle, root), padX * 1.6, padY));

  // Social rail.
  const rail = document.getElementById("social-rail");
  if (rail && getComputedStyle(rail).display !== "none") {
    zones.push(expandRect(localRect(rail, root), padX * 0.4, padY * 0.4));
  }

  // Clamp to root.
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

  // Remove any leftover hero mosaic from older builds.
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
      const density = Math.min(1, Math.max(0.2, cssNumber("--mosaic-density", 0.75)));
      const padX = cssNumber("--mosaic-content-pad-x", 40);
      const padY = cssNumber("--mosaic-content-pad-y", 32);
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

  // Layout settles after fonts/images; build twice so height reaches page end.
  requestAnimationFrame(() => {
    build();
    setTimeout(build, 400);
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
