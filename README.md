# Unitify UI Kit

React components, 127 SVG icons, design tokens and shared application components extracted from [Unitify Pass](https://github.com/Unitifycom/pass), based on the MIT-licensed Open Condo UI kit.

| Package                 | Contains                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `@unitifycom/ui`        | Buttons, inputs, selectors, tables, typography, rich text, tokens, local fonts              |
| `@unitifycom/icons`     | Individually importable React SVG icons                                                     |
| `@unitifycom/ui-common` | Date pickers, legacy table, filters, frame resize callback, providers and Ant Design themes |

The packages ship **compiled ESM, TypeScript declarations and CSS**. Applications do not need to compile TypeScript or Less from `node_modules`. React and ReactDOM stay external peers. Initial support: React **18.3**, Ant Design **4.24.16**; React 19 and Ant Design 5/6 are not supported by this release.

## Install

Download the three `.tgz` files from [Releases](https://github.com/Unitifycom/ui-kit/releases), then install them together:

Until the packages are published on npm, add local archive overrides to the consumer's `package.json` before installing. This prevents Bun from looking up the internal peer names on npm:

```json
{
    "overrides": {
        "@unitifycom/icons": "file:./unitifycom-icons-0.1.0.tgz",
        "@unitifycom/ui": "file:./unitifycom-ui-0.1.0.tgz",
        "@unitifycom/ui-common": "file:./unitifycom-ui-common-0.1.0.tgz",
        "@types/react": "^18.3.0",
        "@types/react-dom": "^18.3.0"
    }
}
```

```sh
bun add ./unitifycom-icons-0.1.0.tgz ./unitifycom-ui-0.1.0.tgz ./unitifycom-ui-common-0.1.0.tgz
bun add react@18.3.1 react-dom@18.3.1 react-intl@7
```

Keep React type packages on 18 as well; `react-intl` can otherwise install a second React 19 type tree.

The public npm names are prepared in the package manifests; an npm release requires registry ownership and trusted-publisher setup. GitHub source publication and release archives do not imply that the names have been published on npm.

## Use

```tsx
import { Button } from '@unitifycom/ui/components/Button'
import { Check } from '@unitifycom/icons/Check'
import { DesignSystemProvider } from '@unitifycom/ui-common'
import '@unitifycom/ui/styles.css'
import '@unitifycom/ui-common/staff.css'
import '@unitifycom/ui-common/styles.css'

// Supply localized labels and mount inside your existing react-intl IntlProvider.
export function SaveButton({ label }: { label: string }) {
    return (
        <DesignSystemProvider>
            <Button type="primary" icon={<Check />}>
                {label}
            </Button>
        </DesignSystemProvider>
    )
}
```

Mount `DesignSystemProvider` once near the application root, inside `IntlProvider`. It configures Ant Design locale, direction and the UI catalog. If the host already owns an Ant Design `ConfigProvider`, use `UIProvider` from `@unitifycom/ui` and keep the host provider. For resident applications, replace `staff.css` with `resident.css`; do not load both themes in the same document.

For core components without Ant Design application wrappers, `@unitifycom/ui/styles.css` is sufficient. It includes local font declarations. Theme CSS is global: core uses the existing `condo-` prefix; application wrappers use `ant-`. Isolate the kit if another Ant Design version is present.

Direct paths are typed and avoid loading the root export graph. Root named imports remain available. `Input.RichTextArea` loads its editor code on demand. Browser bundlers such as Vite are supported; Next.js App Router callers need a client boundary. No Node SSR compatibility is claimed for Ant Design 4 deep ESM dependencies.

## Tokens and customization

```ts
import { colors } from '@unitifycom/ui/colors'
import { staffTheme, residentTheme } from '@unitifycom/ui-common/themes'
```

CSS variables: `@unitifycom/ui/style-vars/css`. Less variables: `@unitifycom/ui/style-vars/less`. The optional `@unitifycom/ui-common/vite` helper supports existing source/Less workflows; the compiled CSS path needs no Vite plugin. Build custom Ant Design themes from `@unitifycom/ui-common/antd.less`. Generated token snapshots retain their source provenance; regenerate upstream instead of editing them by hand.

## Analytics

Analytics is **disabled by default**. The library does not send component values or page URLs to an embedding parent automatically. An application can explicitly register a handler:

```ts
import { setAnalyticsHandler } from '@unitifycom/ui/events'
setAnalyticsHandler((event) => {
    /* forward approved events to your own telemetry */
})
// On teardown:
setAnalyticsHandler(undefined)
```

## Development

Bun 1.4.2, TypeScript 7, Vite, Vitest, Oxlint and Prettier:

```sh
bun install --frozen-lockfile
bunx playwright install chromium
bun run check
```

`check` builds all packages, checks types/style/tests, produces archives and installs them into an independent temporary React application outside this repository. That application typechecks consumer code strictly, bundles without Less and renders in Chromium. The icon typo probe must fail compilation; `skipLibCheck` is used for the upstream Ant Design 4 / rc-tree declarations under TypeScript 7; unused rich-text dependencies must not enter the consumer bundle.

Package artifacts and checksums are written to `dist/packages/`. See [release instructions](docs/releasing.md), [migration from the Pass copies](docs/migration.md) and [source provenance](docs/source-provenance.json).

## License

MIT. Upstream notices are preserved in every package. Bundled fonts retain their SIL Open Font License notices. The repository contains UI code and assets only; no Pass API, data, credentials or tenant configuration.
