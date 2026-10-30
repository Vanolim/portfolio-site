#!/usr/bin/env python3
"""Build English recommendation PDFs from the Russian originals (Arial, keep stamps/signatures)."""

from pathlib import Path

import fitz

ARIAL = "/System/Library/Fonts/Supplemental/Arial.ttf"
ARIAL_B = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
DOC = Path("/Users/legavana/Development/Doc")
SITE = Path("/Users/legavana/Development/portfolio-site/assets/recommendations")

FONT = fitz.Font(fontfile=ARIAL)
FONTB = fitz.Font(fontfile=ARIAL_B)


def copy_images(src_page, dst_page):
    doc = src_page.parent
    for img in src_page.get_images(full=True):
        xref, smask = img[0], img[1]
        try:
            rects = src_page.get_image_rects(xref)
        except Exception:
            rects = []
        if not rects:
            continue
        pix = fitz.Pixmap(doc, xref)
        if smask:
            mask = fitz.Pixmap(doc, smask)
            pix = fitz.Pixmap(pix, mask)
        if pix.n - pix.alpha >= 4:
            pix = fitz.Pixmap(fitz.csRGB, pix)
        for r in rects:
            dst_page.insert_image(r, pixmap=pix)


def put(page, x, y, text, bold=False, size=11):
    page.insert_text(
        (x, y),
        text,
        fontname="arialb" if bold else "arial",
        fontsize=size,
    )


def wrap(text, max_w, bold=False, size=11):
    f = FONTB if bold else FONT
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if f.text_length(trial, fontsize=size) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def put_wrapped(page, x, y, text, max_w, bold=False, size=11, leading=14.5):
    for line in wrap(text, max_w, bold=bold, size=size):
        put(page, x, y, line, bold=bold, size=size)
        y += leading
    return y


def put_bullet(page, y, title, desc, left=90, right=524, leading=14.5):
    title_part = f"•  {title}"
    put(page, left, y, title_part, bold=True)
    dash = " – "
    tw = FONTB.text_length(title_part, fontsize=11)
    put(page, left + tw, y, dash)
    x = left + tw + FONT.text_length(dash, fontsize=11)
    words = desc.split()
    cur = ""
    first = True
    for w in words:
        trial = (cur + " " + w).strip()
        limit = right - x if first else right - 108
        if FONT.text_length(trial, fontsize=11) <= limit:
            cur = trial
        else:
            put(page, x if first else 108, y, cur)
            y += leading
            first = False
            x = 108
            cur = w
    if cur:
        put(page, x if first else 108, y, cur)
        y += leading
    return y + 10


def make_mc():
    src = fitz.open(str(DOC / "Сопроводительное Ивана - MC.pdf"))
    src_page = src[0]
    out = fitz.open()
    page = out.new_page(width=src_page.rect.width, height=src_page.rect.height)
    page.insert_font(fontname="arial", fontfile=ARIAL)
    page.insert_font(fontname="arialb", fontfile=ARIAL_B)
    copy_images(src_page, page)

    put(page, 72, 95, 'LLC "MADAME CYCLONE"')
    put(page, 72, 109.5, "66 Myasnikyan St., Dilijan, Tavush Region, Armenia")
    put(page, 72, 136, "July 1, 2025")
    put(page, 72, 165, "Letter of Recommendation for Ivan Selyutin", bold=True, size=13)

    y = 192
    y = put_wrapped(
        page,
        72,
        y,
        'This letter confirms that Ivan Selyutin worked at LLC "MADAME CYCLONE" '
        "as a Gameplay/Tools Programmer from January 10, 2024 to May 1, 2025.",
        452,
    )
    y += 10
    y = put_wrapped(
        page,
        72,
        y,
        "During his work on our 2D Narrative Boss Battle Action project, "
        "Ivan made a significant contribution to the team's success:",
        452,
    )
    y += 12
    bullets = [
        (
            "Gameplay and content",
            "implemented 10 character upgrades and eight unique boss fights with modular AI.",
        ),
        (
            "Tools for designers",
            "built additional tooling for game design and narrative design.",
        ),
        (
            "Wwise technical integration",
            "helped resolve engine integration issues and extended related Unity functionality.",
        ),
        (
            "Code standards",
            "followed the architecture established by the senior programmer.",
        ),
        (
            "Team collaboration",
            "responded quickly to designers and artists, always prioritizing project goals and deadlines.",
        ),
    ]
    for title, desc in bullets:
        y = put_bullet(page, y, title, desc)

    y += 6
    y = put_wrapped(
        page,
        72,
        y,
        "Ivan has proven himself to be a responsible, proactive, and technically strong specialist. "
        "He can quickly propose solutions, communicate his ideas clearly, and deliver work end-to-end "
        "without sacrificing quality. We are confident that his experience and professionalism will be "
        "a valuable asset to any game studio.",
        452,
    )
    y += 14
    y = put_wrapped(
        page,
        72,
        y,
        "We are happy to provide additional information upon request.",
        452,
    )
    y += 14
    put(page, 72, y, "Sincerely,")
    put(page, 72, 630, "__________ / CEO", bold=True)
    put(page, 72, 644.5, 'LLC "MADAME CYCLONE"')
    put(page, 72, 659, "e-mail: titov.serg.93@gmail.com")
    put(page, 72, 673.5, "twitter: https://x.com/MadameCyclone")

    paths = [
        DOC / "Letter of Recommendation — Ivan Selyutin — Madame Cyclone (EN).pdf",
        SITE / "madame-cyclone-en.pdf",
    ]
    for path in paths:
        out.save(str(path))
        print("Wrote", path)
    out.close()
    src.close()


def make_sociaro():
    src = fitz.open(str(DOC / "Рекомендательное письмо Селютина Ивана .pdf"))
    src_page = src[0]
    out = fitz.open()
    page = out.new_page(width=src_page.rect.width, height=src_page.rect.height)
    page.insert_font(fontname="arial", fontfile=ARIAL)
    page.insert_font(fontname="arialb", fontfile=ARIAL_B)
    copy_images(src_page, page)

    put(page, 72, 95, "Sociaro Limited", bold=True)
    put(page, 72, 114, "4 louki Akrita Avenue, Office 406,")
    put(page, 72, 133, "Agios Andreas, 1100, Nicosia, Cyprus.")
    put(page, 72, 152, "www.sociaro.com")
    put(page, 72, 171, "May 30, 2025")

    put(
        page,
        72,
        228,
        "Letter of Recommendation for Ivan Leonidovich Selyutin (07.07.2000)",
        bold=True,
    )
    put(
        page,
        72,
        253,
        "who worked with us as a Unity Developer from December 22, 2024 to May 28, 2025.",
    )

    y = 292
    y = put_wrapped(
        page,
        72,
        y,
        'Ivan worked on the multiplayer prototype "Devil\'s Bar". His responsibilities included '
        "full prototype development, timeline estimation, testing, maintaining code quality, "
        "and shaping the project architecture. He took part in building internal company processes "
        "and closely collaborated with other departments.",
        470,
    )
    y += 14
    y = put_wrapped(
        page,
        72,
        y,
        "During his time with us, Ivan demonstrated excellent programming skills. "
        "He proved to be a strong team player, showed a creative approach to routine tasks, "
        "reliability, and excellent communication skills.",
        470,
    )
    y += 14
    y = put_wrapped(
        page,
        72,
        y,
        "I can say with confidence that Ivan is a talented and hardworking specialist "
        "who will be a valuable addition to any company.",
        470,
    )

    put(page, 72, 580, "Sergey Maev / Head of HR")
    put(page, 72, 660, "Kirill Shidenko / CEO")

    paths = [
        DOC / "Letter of Recommendation — Ivan Selyutin — Sociaro (EN).pdf",
        SITE / "sociaro-en.pdf",
    ]
    for path in paths:
        out.save(str(path))
        print("Wrote", path)
    out.close()
    src.close()


def previews():
    for src, name in [
        (SITE / "madame-cyclone-en.pdf", "preview-mc-en.png"),
        (SITE / "sociaro-en.pdf", "preview-sociaro-en.png"),
    ]:
        doc = fitz.open(str(src))
        pix = doc[0].get_pixmap(matrix=fitz.Matrix(1.5, 1.5))
        pix.save(str(SITE / name))
        print("preview", name)
        doc.close()


if __name__ == "__main__":
    SITE.mkdir(parents=True, exist_ok=True)
    make_mc()
    make_sociaro()
    previews()
