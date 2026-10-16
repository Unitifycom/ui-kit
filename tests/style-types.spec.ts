import { expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
it.each(['ui'])('provides type entry points for every %s CSS export', (name) => {
    const manifest = JSON.parse(
        readFileSync(new URL(`../packages/${name}/package.json`, import.meta.url), 'utf8'),
    )
    for (const [path, entry] of Object.entries(manifest.exports)) {
        if (!path.endsWith('.css')) continue
        expect(entry).toEqual({ types: './dist/styles.d.ts', default: `./dist/${path.slice(2)}` })
    }
})
