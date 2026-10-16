import { expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
const root = resolve(import.meta.dirname, '..')
const manifest = JSON.parse(readFileSync(resolve(root, 'packages/ui/package.json'), 'utf8'))
it('ships one independently installable package with no internal peers', () => {
    expect(readdirSync(resolve(root, 'packages'))).toEqual(['ui'])
    expect(manifest.name).toBe('@unitifycom/ui')
    expect(
        Object.keys({ ...manifest.dependencies, ...manifest.peerDependencies }).filter((name) =>
            name.startsWith('@unitifycom/'),
        ),
    ).toEqual([])
    expect(manifest.private).not.toBe(true)
    expect(manifest.exports['.']).toEqual({ types: './dist/index.d.ts', import: './dist/index.js' })
    expect(manifest.files).toEqual(['dist', 'LICENSE', 'README.md'])
    expect(manifest.repository.url).toBe('git+https://github.com/Unitifycom/ui-kit.git')
    expect(manifest.publishConfig.access).toBe('public')
    expect(manifest.peerDependencies.react).toBe('^18.3.1')
})
it('exports icons and shared components from the same package', () => {
    expect(manifest.exports['./icons']).toEqual({
        types: './dist/icons/index.d.ts',
        import: './dist/icons/index.js',
    })
    expect(manifest.exports['./icons/*']).toEqual({
        types: './dist/icons/components/*.d.ts',
        import: './dist/icons/components/*.js',
    })
    expect(manifest.exports['./common']).toEqual({
        types: './dist/common/index.d.ts',
        import: './dist/common/index.js',
    })
})
it('exports compiled CSS without requiring a consumer Less pipeline', () => {
    for (const name of ['styles', 'staff', 'resident', 'fonts']) {
        expect(manifest.exports[`./${name}.css`]).toEqual({
            types: './dist/styles.d.ts',
            default: `./dist/${name}.css`,
        })
    }
    expect(manifest.sideEffects).toEqual(['**/*.css', '**/*.less'])
})
