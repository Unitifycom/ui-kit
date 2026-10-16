# Установка @unitifycom/ui в проект

## Требования и версия

Версия **0.2.0** объединяет компоненты, иконки и общие обёртки в одном пакете. Поддерживается React/ReactDOM 18.3.1; стили основаны на Ant Design 4.24.16. React и ReactDOM — внешние peer dependencies. Для `DesignSystemProvider` нужен существующий `IntlProvider` из `react-intl` 7.

## 1. Установить один пакет

Пока пакет не опубликован в npm, используйте фиксированный URL архива GitHub Release:

```sh
bun add https://github.com/Unitifycom/ui-kit/releases/download/v0.2.0/unitifycom-ui-0.2.0.tgz
```

Для npm, Yarn и pnpm замените `bun add` на `npm install`, `yarn add` или `pnpm add`. Можно скачать архив из [релиза v0.2.0](https://github.com/Unitifycom/ui-kit/releases/tag/v0.2.0) и установить локально:

```sh
bun add ./unitifycom-ui-0.2.0.tgz
```

Сверить SHA-256 архива можно с `manifest.json` из того же релиза. Команда `bun add @unitifycom/ui` станет доступна после отдельной публикации в npm; сейчас она не является способом установки этой версии.

Для проекта без React:

```sh
bun add react@18.3.1 react-dom@18.3.1 react-intl@7.1.14
bun add -d typescript @types/react@18 @types/react-dom@18
```

Сохраните lockfile приложения. Для Bun/npm добавьте в `package.json` фиксацию типов React 18, поскольку транзитивные зависимости могут запросить типы React 19:

```json
{
    "overrides": {
        "@types/react": "^18.3.0",
        "@types/react-dom": "^18.3.0"
    }
}
```

В Yarn для этого используются `resolutions`, в pnpm — `pnpm.overrides`. Overrides на `@unitifycom/icons` / `@unitifycom/ui-common` больше не нужны: таких зависимостей у пакета нет.

## 2. Подключить CSS один раз

В точке входа, например `src/main.tsx` в Vite:

```tsx
import '@unitifycom/ui/styles.css'
```

Шрифты Inter, Wix Madefor Display и Noto Sans Mono поставляются локально. Загрузки с Google Fonts нет.

Для общих компонентов Ant Design добавьте одну тему перед стилями:

```tsx
import '@unitifycom/ui/staff.css'
import '@unitifycom/ui/styles.css'
```

Для приложения жителя используйте `resident.css` вместо `staff.css`. Не подключайте исходный `antd/dist/antd.css` поверх темы. Стандартная конфигурация Vite подходит без aliases, плагинов библиотеки и настройки Less.

## 3. Подключить локализацию

В корне приложения поместите `DesignSystemProvider` внутри своего `IntlProvider`. Передавайте язык и сообщения из текущей локали пользователя:

```tsx
import type { PropsWithChildren } from 'react'
import { IntlProvider } from 'react-intl'
import { DesignSystemProvider } from '@unitifycom/ui'

export function Providers({
    children,
    locale,
    messages,
}: PropsWithChildren<{
    locale: string
    messages: Record<string, string>
}>) {
    return (
        <IntlProvider locale={locale} messages={messages}>
            <DesignSystemProvider>{children}</DesignSystemProvider>
        </IntlProvider>
    )
}
```

Если проект уже настраивает корневой Ant Design `ConfigProvider`, оставьте его и используйте `UIProvider` с `locale` для собственного каталога UI Kit. Встроенные тексты UI Kit — EN/RU с EN fallback; пользовательские подписи передаются через переводы приложения.

## 4. Использовать компоненты

```tsx
import { useIntl } from 'react-intl'
import { Button } from '@unitifycom/ui/components/Button'
import { Check } from '@unitifycom/ui/icons/Check'

export function SaveButton() {
    const intl = useIntl()
    const SaveLabel = intl.formatMessage({ id: 'actions.save' })
    return (
        <Button type="primary" icon={<Check size="small" />}>
            {SaveLabel}
        </Button>
    )
}
```

Добавьте `actions.save` в каталоги своего приложения. Тот же `Button` и его `ButtonProps` доступны из `@unitifycom/ui`; полный набор иконок — из `/icons`; общие обёртки — из корня или `/common`.

## Next.js

В App Router добавьте `'use client'` в файл провайдеров. Глобальные CSS-импорты разместите в корневом layout. Компоненты используют браузерные API и Ant Design 4; поддержка произвольного Node SSR не заявлена. Для полностью клиентского экрана можно использовать `dynamic(() => import('./Screen'), { ssr: false })` внутри клиентского компонента.

В Pages Router CSS подключается в `pages/_app.tsx`. Не добавляйте source aliases или транспиляцию TypeScript библиотеки: поставляется готовый JS. Конкретную Next.js-сборку проверьте в своём приложении; автоматический consumer smoke test в библиотеке использует Vite.

## Публичные пути импорта

| Путь                                        | Содержимое                                             |
| ------------------------------------------- | ------------------------------------------------------ |
| `@unitifycom/ui`                            | Компоненты, их типы, общие обёртки и провайдеры        |
| `@unitifycom/ui/components/Button`          | Прямой импорт одного основного компонента              |
| `@unitifycom/ui/icons`                      | Все иконки и `IconProps`                               |
| `@unitifycom/ui/icons/Check`                | Прямой импорт одной иконки                             |
| `@unitifycom/ui/common`                     | Общие обёртки приложений                               |
| `@unitifycom/ui/common/DateRangePicker`     | Прямой импорт общей обёртки                            |
| `@unitifycom/ui/colors`                     | Цветовая палитра                                       |
| `@unitifycom/ui/hooks`                      | Адаптивность и размеры контейнеров                     |
| `@unitifycom/ui/events`                     | Опциональная телеметрия                                |
| `@unitifycom/ui/themes`                     | Объекты `staffTheme` / `residentTheme`                 |
| `@unitifycom/ui/styles.css`                 | Основные стили, локальные шрифты и стили общих обёрток |
| `@unitifycom/ui/staff.css` / `resident.css` | Готовая тема Ant Design, выбрать одну                  |
| `@unitifycom/ui/style-vars/css`             | CSS-токены                                             |
| `@unitifycom/ui/style-vars/less`            | Less-токены                                            |
| `@unitifycom/ui/antd.less` / `vite`         | Необязательная собственная сборка темы                 |

Прямые пути помогают ограничить граф импортов. Редактор `Input.RichTextArea` остаётся ленивым.

## Переход с прежней версии

См. [миграцию](migration.md): удалить отдельные icons/ui-common и их overrides, заменить импорты и повторные CSS-импорты, установить один архив. Проверить реальные экраны перед выкладкой.
