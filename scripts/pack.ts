import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createHash } from 'node:crypto'
const root = resolve(import.meta.dirname, '..'),
    output = resolve(root, 'dist/packages')
await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })
const artifacts = []
const directory = resolve(root, 'packages/ui')
const manifest = JSON.parse(await readFile(resolve(directory, 'package.json'), 'utf8'))
const packed = Bun.spawnSync(['bun', 'pm', 'pack', '--destination', output, '--quiet'], {
    cwd: directory,
    stdout: 'pipe',
    stderr: 'pipe',
})
if (packed.exitCode) throw new Error(packed.stderr.toString())
const filename = `${manifest.name.replace('@', '').replace('/', '-')}-${manifest.version}.tgz`
const data = await readFile(resolve(output, filename))
artifacts.push({
    name: manifest.name,
    version: manifest.version,
    filename,
    bytes: data.length,
    sha256: createHash('sha256').update(data).digest('hex'),
})
console.info(`Packed ${manifest.name}: ${filename}`)
await writeFile(resolve(output, 'manifest.json'), JSON.stringify(artifacts, null, 2) + '\n')
