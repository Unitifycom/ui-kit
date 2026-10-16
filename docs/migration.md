# Migrating a consumer from the Pass copies

This repository is the independent library source. The copies in Pass have not been removed or switched as part of the initial library release; running APP/EU/UZ are unchanged.

| Pass import                     | Library import                  |
| ------------------------------- | ------------------------------- |
| `@open-condo/ui`                | `@unitifycom/ui`                |
| `@open-condo/icons`             | `@unitifycom/icons`             |
| `@unitifycom/condo-ui-common`   | `@unitifycom/ui-common`         |
| `@open-condo/ui/style-vars/css` | `@unitifycom/ui/style-vars/css` |

Install all three matching versions. Keep React/ReactDOM 18.3 as shared peers. Do not put Modern Admin's React 19 into the same rendering tree.

Import core `@unitifycom/ui/styles.css` once, choose `@unitifycom/ui-common/staff.css` or `/resident.css`, then import `/styles.css` for the shared wrappers. Precompiled CSS uses the current Inter/Wix tokens, the `condo-` UI prefix and `ant-` shared wrappers. A Pass page that depends on the historical Wix override needs its own parity check or a custom theme before replacing the source copy; do not assume source-Less overrides affect precompiled CSS.

Remove source aliases and custom Less processing when consuming compiled CSS. The optional `/vite` helper and `/antd.less` remain available for a custom theme pipeline. It is unnecessary to transpile this library's TypeScript in the application.

All previous core component exports are retained. Add direct imports for performance where useful, for example `@unitifycom/ui/components/Button` and `@unitifycom/icons/Check`. Internal root-barrel cycles were removed; the rich-text implementation stays lazy.

Analytics no longer sends values or URLs to `parent.postMessage` automatically. A consumer that needs the old Condo bridge events must opt in with `setAnalyticsHandler` from `/events` and forward only approved data to a known target origin.

For each adopting miniapp, compare fonts, forms, disabled/loading controls, tooltip contrast, selected tags, tables/pagination, dates, RTL, empty states and responsive layouts before deploying. Keep a pinned previous package version for rollback.
