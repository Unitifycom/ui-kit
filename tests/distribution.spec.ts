import { expect, it } from 'vitest'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
const root = resolve(import.meta.dirname, '..')
it.each(['ui'])('builds runnable %s entry points and declarations', (name) => {
    const directory = resolve(root, 'packages', name, 'dist')
    expect(existsSync(resolve(directory, 'index.js'))).toBe(true)
    expect(existsSync(resolve(directory, 'index.d.ts'))).toBe(true)
    const source = readFileSync(resolve(directory, 'index.js'), 'utf8')
    expect(source).not.toMatch(/\.tsx?['"]|@open-condo|WebstormProjects/)
})
it('ships local fonts, font licenses and the original UI prefix in compiled CSS', () => {
    const css = readFileSync(resolve(root, 'packages/ui/dist/styles.css'), 'utf8')
    expect(css).toContain('.condo-btn')
    expect(css).toContain('.condo-radio')
    expect(css).toContain('Inter')
    expect(css).not.toMatch(/fonts\.googleapis|fonts\.gstatic|data:font/)
    expect(
        readdirSync(resolve(root, 'packages/ui/dist/assets')).some((name) =>
            /\.(woff2|ttf)$/.test(name),
        ),
    ).toBe(true)
    expect(existsSync(resolve(root, 'packages/ui/dist/licenses/inter-OFL.txt'))).toBe(true)
})
it('ships both antd themes without making consumers compile Less', () => {
    for (const name of ['staff', 'resident']) {
        const css = readFileSync(resolve(root, `packages/ui/dist/${name}.css`), 'utf8')
        expect(css).toContain('.ant-btn')
        expect(css).not.toContain('fonts.googleapis')
    }
})
it('keeps font URLs relative to the package and leaves dynamic imports reusable by host bundlers', () => {
    const css = readFileSync(resolve(root, 'packages/ui/dist/styles.css'), 'utf8')
    expect(css).not.toMatch(/url\(["']?\/assets\//)
    const editor = readFileSync(
        resolve(root, 'packages/ui/dist/components/Input/richTextAreaLazy.js'),
        'utf8',
    )
    expect(editor).toContain('import(')
    expect(editor).not.toContain('__vitePreload')
})
