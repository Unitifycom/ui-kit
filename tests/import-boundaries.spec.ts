import { expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
function files(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory()
            ? files(resolve(directory, entry.name))
            : [resolve(directory, entry.name)],
    )
}
it('keeps component modules independent from the root barrel to avoid ESM cycles and eager editor loading', () => {
    const componentFiles = files(
        resolve(import.meta.dirname, '../packages/ui/src/components'),
    ).filter((file) => /\.tsx?$/.test(file))
    const cycles = componentFiles.filter((file) =>
        /from ['"](?:\.\.\/)+index\.ts['"]/.test(readFileSync(file, 'utf8')),
    )
    expect(cycles).toEqual([])
})
it('exports direct icon paths that match the actual component modules', () => {
    const manifest = JSON.parse(
        readFileSync(resolve(import.meta.dirname, '../packages/icons/package.json'), 'utf8'),
    )
    expect(manifest.exports['./*']).toEqual({
        types: './dist/components/*.d.ts',
        import: './dist/components/*.js',
    })
})
