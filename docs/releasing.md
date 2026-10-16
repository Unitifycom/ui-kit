# Releases

The single publishable package is `@unitifycom/ui`. Current version: **0.2.0**. Keep the root development manifest and package manifest versions aligned. Changing public props, CSS or export paths requires an appropriate SemVer change and changelog entry.

## GitHub release archive

1. Run `bun install --frozen-lockfile`, `bunx playwright install chromium`, then `bun run check`.
2. Review `dist/packages/manifest.json`, licenses and `git diff`. The consumer test must install exactly one archive outside the workspace, typecheck and render without source aliases or Less configuration.
3. Push reviewed changes, wait for CI, then create a `v<version>` tag and GitHub release.
4. The release workflow checks out the tag, reruns checks and attaches **one** `unitifycom-ui-<version>.tgz` and its checksum manifest. Never replace artifacts of an existing version; release a new version.
5. Verify the release download against the manifest and update installation examples to the released URL.

Archives contain `dist`, README and LICENSE only. `bun run pack` removes stale package artifacts before packing; it does not publish or require registry credentials. The root is a private development workspace, while `packages/ui/package.json` is publishable. Version 0.1.0 remains available as the historical three-package release.

## npm (separate step)

The npm organization must own `@unitifycom/ui`; GitHub organization ownership does not grant npm access. An initial npm publication requires explicit release authorization and registry setup. Then configure a trusted publisher and a protected release workflow. Never store npm tokens in source or `.npmrc`.

Publish the exact reviewed archive with public access and provenance. Only after that should installation examples use `@unitifycom/ui@<version>` instead of the GitHub archive URL. The GitHub release workflow does not publish to npm.

References: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), [provenance](https://docs.npmjs.com/generating-provenance-statements/).
