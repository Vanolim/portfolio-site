# Portfolio site

Статический сайт-портфолио в духе [draas-games.ru](https://draas-games.ru/): без вкладки навыков, с каруселью картинок в проектах, RU/EN и правками без сборки.

## Быстрый старт

Сайт использует ES-модули. Запускайте сервер **без кэша**:

```bash
cd /Users/legavana/Development/portfolio-site
python3 serve.py
```

Откройте http://127.0.0.1:8080/

После правок в `js/data.js` обязательно **сохраните файл (Cmd+S)**, затем обновите страницу.

> Имя на экране берётся из двух мест: `copy.ru.brand` (шапка) и `copy.ru.hero.firstName` / `lastName` (крупный заголовок).

## Что править

| Задача | Файл |
|--------|------|
| Имя, тексты, проекты, опыт, рекомендации, соцсети, email формы | `js/data.js` |
| Цвета, светлая/тёмная тема, фоновые картинки | `css/theme.css` |
| Картинки проектов | `assets/projects/<id>/…` |
| Резюме PDF | `assets/resumes/resume_ru.pdf`, `resume_en.pdf` |
| Фон hero / страницы | `assets/bg/` + пути в `css/theme.css` |

### Проекты с несколькими картинками

В `js/data.js`:

```js
images: [
  "assets/projects/sample-project/1.jpg",
  "assets/projects/sample-project/2.jpg",
],
```

Если картинок больше одной — появятся стрелки и точки для листания.

### Цвета и фон

В `css/theme.css` меняйте переменные `--color-accent`, `--color-bg` и т.д.

Фон hero:

```css
--hero-bg-image: url("../assets/bg/hero.jpg");
```

Светлая тема — раскомментируйте готовый блок внизу `theme.css`.

### Форма контакта

В `js/data.js` укажите:

```js
formEndpoint: "https://formsubmit.co/you@email.com",
```

При первой отправке FormSubmit попросит подтвердить email.

## Публикация

Подойдёт любой статический хостинг: GitHub Pages, Netlify, Vercel, reg.ru — просто загрузите папку сайта.
