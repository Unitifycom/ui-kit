# Unitify UI Kit

- Bun, TypeScript, ESM. Generated JavaScript belongs only in ignored dist directories.
- Reproduce packaging and behavior bugs with a failing test first.
- Keep React/ReactDOM external peers. Preserve component APIs, CSS prefixes and lazy editor loading.
- No application credentials, API clients, tenant data or backend dependencies belong here.
- Preserve upstream MIT and font OFL notices. Source capture hashes are historical evidence.
- Do not claim React 19 or Ant Design 5/6 compatibility without tests.
- New user-facing labels belong in locale catalogs or typed label props.
- Run bun run check before publishing. Do not publish to npm without an explicit release request.
