# Структура приложения Angels Born

## Папки

- **core/** — сервисы-синглтоны, guard'ы, константы (данные контактов, конфиг меню).
- **shared/** — переиспользуемые компоненты и пайпы (nav-menu, contact-box, news-item).
- **layout/** — компоненты разметки: header, footer, page-layout (обёртка контента страницы).
- **features/** — страницы и фичи по разделам сайта:
  - **home** — главная
  - **history** — история
  - **dogs/** — наши собаки: dogs-list, dog-profile, dog-card
  - **breeding/** — наше разведение: breeding, pomet-detail, breeding-sidebar
  - **puppies** — щенки
  - **news** — новости
  - **contacts** — контакты

## Роутинг

- `''` — главная
- `istoriya` — история
- `nashi-sobaki` — список собак
- `nashi-sobaki/:slug` — профиль собаки
- `nashe-razvedenie` — наше разведение
- `nashe-razvedenie/pomet/:letter` — страница помёта (литера A–Z)
- `schenki` — щенки
- `novosti` — новости
- `kontaktyi` — контакты

## Следующие шаги миграции

1. Скопировать ресурсы (images, favicon) в `src/assets/`.
2. Перенести глобальные стили из `css/reset.css`, `css/templates.css` в `src/styles.scss`.
3. Реализовать контент и стили в каждом feature-компоненте по существующим HTML/CSS.
