# Unitify UI Kit

`@unitifycom/ui` — единая библиотека адаптивных React-компонентов для мини-приложений Unitify. В одном пакете находятся компоненты, 127 SVG-иконок, общие обёртки приложений, палитра, токены и локальные шрифты. Основана на Open Condo UI под лицензией MIT; включает изменения из выделенного Pass.

Текущая версия библиотеки — **0.2.0**. Это собственная версия `@unitifycom/ui`, независимая от версий `@open-condo/ui`, Pass и мобильных сборок. Начиная с неё отдельные пакеты `@unitifycom/icons` и `@unitifycom/ui-common` устанавливать не нужно.

## Установка

Пакет распространяется через [GitHub Releases](https://github.com/Unitifycom/ui-kit/releases/tag/v0.2.0). В npm он пока не опубликован. Выполните команду своего менеджера пакетов:

```sh
# Bun
bun add https://github.com/Unitifycom/ui-kit/releases/download/v0.2.0/unitifycom-ui-0.2.0.tgz

# npm
npm install https://github.com/Unitifycom/ui-kit/releases/download/v0.2.0/unitifycom-ui-0.2.0.tgz

# Yarn
yarn add https://github.com/Unitifycom/ui-kit/releases/download/v0.2.0/unitifycom-ui-0.2.0.tgz

# pnpm
pnpm add https://github.com/Unitifycom/ui-kit/releases/download/v0.2.0/unitifycom-ui-0.2.0.tgz
```

Нужны React и ReactDOM **18.3.1**, а для `DesignSystemProvider` — `react-intl` **7**. Если их ещё нет, установите своим менеджером пакетов, например:

```sh
bun add react@18.3.1 react-dom@18.3.1 react-intl@7.1.14
bun add -d @types/react@18 @types/react-dom@18
```

В TypeScript-проекте зафиксируйте типы React 18 во всём дереве зависимостей. Полный пример конфигурации, подключение к Vite и Next.js и варианты тем — в [инструкции установки](docs/installation.md).

## Подключение стилей и провайдера

Для собственных компонентов достаточно одного импорта CSS:

```ts
import '@unitifycom/ui/styles.css'
```

Если используются общие обёртки Ant Design — `LegacyTable`, `DatePicker`, `DateRangePicker` — подключите одну тему **перед** основными стилями:

```ts
import '@unitifycom/ui/staff.css' // Для интерфейсов сотрудников
import '@unitifycom/ui/styles.css'
```

Для приложения жителя замените `staff.css` на `resident.css`. Не подключайте обе темы одновременно. Компилировать Less или TypeScript из `node_modules` не требуется: пакет содержит ESM, декларации типов, готовый CSS и шрифты.

Один `DesignSystemProvider` разместите в корне приложения внутри вашего `IntlProvider`:

```tsx
import { IntlProvider } from 'react-intl'
import { DesignSystemProvider } from '@unitifycom/ui'
import '@unitifycom/ui/staff.css'
import '@unitifycom/ui/styles.css'

export function AppProviders({
    children,
    locale,
    messages,
}: React.PropsWithChildren<{
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

Он настраивает локаль Ant Design, RTL и каталог текстов UI Kit. Если `ConfigProvider` уже принадлежит приложению, используйте `UIProvider` внутри существующего провайдера. Встроенный каталог UI Kit содержит EN/RU; для остальных локалей используется EN. Локали Ant Design подключены для 15 языков Unitify.

## Использование компонентов

```tsx
import { Button } from '@unitifycom/ui'
import type { ButtonProps } from '@unitifycom/ui'
```

Доступны и прямые импорты для небольшого графа зависимостей:

```tsx
import { Button } from '@unitifycom/ui/components/Button'
import { Check } from '@unitifycom/ui/icons/Check'

export function SaveButton({ label }: { label: string }) {
    return (
        <Button type="primary" icon={<Check size="small" />}>
            {label}
        </Button>
    )
}
```

Тексты передавайте из переводов приложения. `Input.RichTextArea` загружает редактор по требованию.

Общие компоненты доступны из того же пакета:

```tsx
import {
    DatePicker,
    DateRangePicker,
    LegacyTable,
    TableFiltersContainer,
    AppFrameWrapper,
    DesignSystemProvider,
} from '@unitifycom/ui'
```

Их также можно импортировать через `@unitifycom/ui/common` или напрямую, например `@unitifycom/ui/common/DateRangePicker`. `AppFrameWrapper` принимает callback `resize(height)`: библиотека не зависит от Condo bridge, API или конфигурации стенда.

## Цветовая палитра и токены

```ts
import { colors } from '@unitifycom/ui/colors'
import '@unitifycom/ui/style-vars/css'
```

Less-токены: `@unitifycom/ui/style-vars/less`. Объекты тем: `staffTheme` и `residentTheme` из `@unitifycom/ui/themes`. Для собственной сборки темы доступны `@unitifycom/ui/antd.less` и необязательный помощник `@unitifycom/ui/vite`; обычному проекту с готовым CSS они не нужны.

## Иконки

```tsx
import { Wallet, Star, Mail } from '@unitifycom/ui/icons'

<Wallet />
<Star size="small" />
<Mail color="#39ce66" />
```

Размеры: `large` — 24 px (по умолчанию), `medium` — 20 px, `small` — 16 px, `auto` — 1em. Цвет наследуется через `currentColor`; его можно переопределить пропом `color`. Для прямого импорта используйте `@unitifycom/ui/icons/Wallet`.

## Адаптивность

```ts
import { BREAKPOINTS, useBreakpoints, useContainerSize } from '@unitifycom/ui/hooks'
```

| Категория     | Минимальная ширина, px |
| ------------- | ---------------------- |
| MOBILE_SMALL  | 0                      |
| MOBILE_LARGE  | 360                    |
| TABLET_SMALL  | 480                    |
| TABLET_LARGE  | 768                    |
| DESKTOP_SMALL | 992                    |
| DESKTOP_LARGE | 1200                   |

`useBreakpoints()` возвращает активные брейкпоинты; `useContainerSize()` — `[size, refCallback]` для наблюдаемого контейнера. В мини-приложении ширина окна соответствует iframe.

## Совместимость

Проверено: React 18.3.1, Ant Design 4.24.16, TypeScript 7, Vite и Chromium. React 19 и Ant Design 5/6 в этой версии не поддерживаются. В Next.js App Router нужен клиентский компонент; Node SSR для глубоких ESM-зависимостей Ant Design 4 не заявлен. CSS глобальный: префикс основных компонентов — `condo-`, общих обёрток — `ant-`. Сравните оформление перед переходом с исходников Pass: его прежние Less-переопределения не меняют готовый CSS пакета.

Телеметрия выключена по умолчанию. Подключить собственный обработчик можно через `setAnalyticsHandler` из `@unitifycom/ui/events`; библиотека сама не отправляет данные родительскому окну.

## Разработка

Bun 1.4.2, TypeScript 7, Vite, Vitest, Oxlint и Prettier:

```sh
bun install --frozen-lockfile
bunx playwright install chromium
bun run check
```

Проверка собирает пакет, проверяет типы, форматирование и тесты, создаёт один архив и устанавливает его в отдельное React-приложение вне workspace. Приложение проверяет публичные типы, собирается без Less и запускается в Chromium. `skipLibCheck` используется для деклараций Ant Design 4 / rc-tree под TypeScript 7; отрицательная проверка пропов иконки подтверждает, что типы UI Kit остаются строгими.

Архив и SHA-256: `dist/packages/`. Документация: [установка](docs/installation.md), [миграция](docs/migration.md), [релизы](docs/releasing.md), [происхождение исходников](docs/source-provenance.json).

Структура руководства следует [документации UI Kit в devportal](https://devportal.app.unitify.com/ru/docs/ui/about). Там пока описан прежний `@open-condo/ui`; команды и пути новой библиотеки приведены здесь. Песочница старой библиотеки не подтверждает поведение этой версии.

## Лицензия

MIT. Уведомления Open Condo и лицензии SIL OFL на шрифты сохранены. Пакет не содержит API Pass, учётных данных и конфигурации арендаторов.
