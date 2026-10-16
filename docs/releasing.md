# Releases

All three packages use one version. Start with `0.1.0`. Changing a public prop, CSS contract or export requires an appropriate SemVer change and changelog entry. Keep peer ranges between the packages aligned.

## GitHub release archives

1. Run `bun install --frozen-lockfile`, `bunx playwright install chromium`, then `bun run check`.
2. Review `dist/packages/manifest.json`, licenses and `git diff`. The consumer test must install the archives outside this workspace, typecheck and render without Less configuration.
3. Push the reviewed changes, wait for CI, then create a `v<version>` tag and a GitHub release.
4. The release workflow checks out that tag, reruns checks, and attaches the three archives and checksum manifest. Never replace files under an already used release version; release a new version instead.

Archives contain `dist`, README and LICENSE only. `bun run pack` does not publish or require registry credentials. The root repository is private as a workspace (`private: true` in package.json); the three library package manifests are publishable.

## npm (separate step)

The names `@unitifycom/icons`, `@unitifycom/ui` and `@unitifycom/ui-common` must be owned by the npm organization. GitHub organization ownership alone does not grant npm access. The initial packages need an authorized first publication, then configure a trusted publisher for this public repository and a protected release workflow. Do not store an npm token in source or `.npmrc`.

After the npm setup and explicit release authorization, publish the exact reviewed archives in dependency order: icons, ui, ui-common. Use public access and provenance. Consumers will then be able to install by package version instead of archive URL. No npm publication is performed by the initial GitHub release workflow.

References: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), [provenance](https://docs.npmjs.com/generating-provenance-statements/).
