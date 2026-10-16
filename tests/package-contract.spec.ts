import { expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
const root = resolve(import.meta.dirname, '..')
it.each(['icons', 'ui', 'ui-common'])(
    'publishes %s as compiled ESM with declarations and public metadata',
    (directory) => {
        const manifest = JSON.parse(
            readFileSync(resolve(root, 'packages', directory, 'package.json'), 'utf8'),
        )
        expect(manifest.name).toBe(`@unitifycom/${directory}`)
        expect(manifest.private).not.toBe(true)
        expect(manifest.exports['.']).toEqual({
            types: './dist/index.d.ts',
            import: './dist/index.js',
        })
        expect(manifest.files).toEqual(['dist', 'LICENSE', 'README.md'])
        expect(manifest.repository.url).toBe('git+https://github.com/Unitifycom/ui-kit.git')
        expect(manifest.publishConfig.access).toBe('public')
        expect(manifest.peerDependencies.react).toBe('^18.3.1')
    },
)
it('exports compiled CSS without requiring a consumer Less pipeline', () => {
    const manifest = JSON.parse(readFileSync(resolve(root, 'packages/ui/package.json'), 'utf8'))
    expect(manifest.exports['./styles.css']).toEqual({
        types: './dist/styles.d.ts',
        default: './dist/styles.css',
    })
    expect(manifest.sideEffects).toEqual(['**/*.css', '**/*.less'])
})
