# Changelog

## 0.2.0

- Merge core UI, 127 icons and shared application components into one `@unitifycom/ui` archive.
- Expose icons through `/icons`, shared components from the root and `/common`, themes through `/themes` and CSS under the same package.
- Remove internal package peers and the archive overrides previously required by consumers.
- Keep theme prefixes distinct, local fonts, typed direct imports and lazy editor loading.
- Add installation and migration instructions following the devportal UI documentation format.
- Validate installation of exactly one archive in an isolated React application and Chromium.

## 0.1.0

- Extract the UI, icons and shared component packages from Pass into an independent MIT library.
- Ship ESM modules, public declarations, direct imports, precompiled CSS, tokens and local fonts.
- Preserve React 18.3 / Ant Design 4.24 component behavior and lazy rich-text loading.
- Remove root-barrel cycles and make analytics opt-in.
- Validate release archives in a separate React application with strict typechecking and Chromium.
