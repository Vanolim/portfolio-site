Фон hero (верхний блок)

1. Положите картинку сюда, например: hero.jpg / hero.webp / hero.png
2. В css/theme.css раскомментируйте и поправьте путь:

   --hero-bg-image: url("../assets/bg/hero.jpg");

3. Высоту настройте там же:

   --hero-height: 70vh;          /* десктоп */
   --hero-height-mobile: 80svh;  /* телефон */

Ширина фона всегда 100% экрана.
Если текст плохо читается — поднимите --hero-bg-overlay (например 0.5).
