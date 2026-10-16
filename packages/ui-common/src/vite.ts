import { readFileSync } from 'node:fs'
export function designSystemLess(theme: Record<string, string | number>, legacyTypography = false) {
    return {
        javascriptEnabled: true,
        additionalData(source: string, filename: string) {
            const variables =
                filename.includes('/packages/ui/') || filename.includes('/@unitifycom/ui/')
                    ? {
                          '@ant-prefix': 'condo',
                          '@text-color': '#222',
                          '@heading-color': '#222',
                          ...(legacyTypography
                              ? Object.fromEntries(
                                    [
                                        'default',
                                        'h1',
                                        'h2',
                                        'h3',
                                        'h4',
                                        'h5',
                                        'h6',
                                        'text-l',
                                        'text-m',
                                        'text-s',
                                    ].map((key) => [
                                        key === 'default'
                                            ? '@condo-global-font-family-default'
                                            : `@condo-global-typography-${key}-font-family`,
                                        '"Wix Madefor Display", var(--condo-font-fallback)',
                                    ]),
                                )
                              : {}),
                      }
                    : theme
            return `${source}\n${Object.entries(variables)
                .map(([key, value]) => `${key}: ${value};`)
                .join('\n')}`
        },
    }
}
export function localDesignSystem() {
    return {
        name: 'unitify-local-design-system-fonts',
        enforce: 'pre' as const,
        generateBundle(this: {
            emitFile: (file: { type: 'asset'; fileName: string; source: string }) => string
        }) {
            for (const fileName of ['wix-OFL.txt', 'noto-mono-OFL.txt', 'inter-OFL.txt']) {
                this.emitFile({
                    type: 'asset',
                    fileName: `licenses/${fileName}`,
                    source: readFileSync(new URL(`fonts/${fileName}`, import.meta.url), 'utf8'),
                })
            }
        },
        transform(css: string, id: string) {
            if (id.endsWith('/ui/src/components/style/core/global.less'))
                return css.replace(/^@import[^\n]*https:\/\/fonts\.googleapis\.com\/[^\n]*$/gm, '')
            if (id.endsWith('/@unitifycom/ui/dist/styles.min.css'))
                return css.replace(/@font-face\s*\{[^}]+\}/g, '')
        },
    }
}
