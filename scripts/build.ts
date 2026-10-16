import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { resolve, relative } from 'node:path'
import { build } from 'vite'
import less from 'less'
import { createHash } from 'node:crypto'
import { designSystemLess } from '../packages/ui-common/src/vite.ts'
import { staffTheme, residentTheme } from '../packages/ui-common/src/themes.ts'

const root = resolve(import.meta.dirname, '..')
async function sourceFiles(directory: string): Promise<string[]> {
    const entries = await readdir(directory, { withFileTypes: true })
    const nested = await Promise.all(
        entries.map((entry) =>
            entry.isDirectory()
                ? sourceFiles(resolve(directory, entry.name))
                : [resolve(directory, entry.name)],
        ),
    )
    return nested.flat()
}
for (const name of ['icons', 'ui', 'ui-common']) {
    const directory = resolve(root, 'packages', name)
    const source = resolve(directory, 'src'),
        output = resolve(directory, 'dist')
    await rm(output, { recursive: true, force: true })
    const manifest = JSON.parse(await readFile(resolve(directory, 'package.json'), 'utf8'))
    const dependencies = Object.keys({ ...manifest.dependencies, ...manifest.peerDependencies })
    const external = (id: string) =>
        id.startsWith('node:') ||
        dependencies.some((name) => id === name || id.startsWith(name + '/'))
    const input = Object.fromEntries(
        (await sourceFiles(source))
            .filter(
                (file) =>
                    /\.(ts|tsx)$/.test(file) &&
                    !file.endsWith('.d.ts') &&
                    !(name === 'ui-common' && file.endsWith('/vite.ts')),
            )
            .map((file) => [relative(source, file).replace(/\.(ts|tsx)$/, ''), file]),
    )
    await build({
        configFile: false,
        base: './',
        root: directory,
        logLevel: 'warn',
        css: { preprocessorOptions: { less: designSystemLess(staffTheme) } },
        build: {
            outDir: output,
            emptyOutDir: false,
            modulePreload: false,
            minify: false,
            target: 'es2022',
            cssCodeSplit: false,
            assetsInlineLimit: 0,
            lib: { entry: input, formats: ['es'], cssFileName: 'styles' },
            rollupOptions: {
                input,
                external,
                preserveEntrySignatures: 'strict',
                output: {
                    format: 'es',
                    preserveModules: true,
                    preserveModulesRoot: source,
                    entryFileNames: '[name].js',
                    chunkFileNames: '[name]-[hash].js',
                    assetFileNames: (asset) =>
                        asset.names.some((name) => name.endsWith('.css'))
                            ? 'styles.css'
                            : 'assets/[name]-[hash][extname]',
                },
            },
        },
    })
    if (name === 'ui-common') {
        const tool = await Bun.build({
            entrypoints: [resolve(source, 'vite.ts')],
            outdir: output,
            target: 'node',
            format: 'esm',
            packages: 'external',
        })
        if (!tool.success) throw new Error('Vite helper build failed')
    }
    const cssPath = resolve(output, 'styles.css')
    if (name === 'ui') {
        let css = await readFile(cssPath, 'utf8')
        for (const match of css.matchAll(
            /data:(font\/[a-z0-9+-]+|application\/(?:x-font-ttf|font-woff));base64,([A-Za-z0-9+/=]+)/g,
        )) {
            const data = Buffer.from(match[2], 'base64')
            const extension = match[1].includes('woff2')
                ? 'woff2'
                : match[1].includes('woff')
                  ? 'woff'
                  : 'ttf'
            const filename =
                'font-' +
                createHash('sha256').update(data).digest('hex').slice(0, 12) +
                '.' +
                extension
            await mkdir(resolve(output, 'assets'), { recursive: true })
            await writeFile(resolve(output, 'assets', filename), data)
            css = css.replaceAll(match[0], './assets/' + filename)
        }
        await writeFile(cssPath, css)
    }
    const declarations = Bun.spawn(
        ['bunx', '--no-install', 'tsc', '-p', 'tsconfig.build.json', '--incremental', 'false'],
        {
            cwd: directory,
            stdout: 'inherit',
            stderr: 'inherit',
        },
    )
    if (await declarations.exited) throw new Error(`Declaration build failed: ${name}`)
    for (const file of await sourceFiles(output)) {
        if (file.endsWith('.d.ts')) {
            const declaration = await readFile(file, 'utf8')
            await writeFile(
                file,
                declaration.replace(/^import ['"][^'"]+\.(?:less|css)['"];?\n/gm, ''),
            )
        }
    }
    for (const file of (await sourceFiles(source)).filter((file) => file.endsWith('.json'))) {
        const target = resolve(output, relative(source, file))
        await mkdir(resolve(target, '..'), { recursive: true })
        await cp(file, target)
    }
    if (name === 'ui') {
        await cp(resolve(source, 'tokens'), resolve(output, 'tokens'), { recursive: true })
        await mkdir(resolve(output, 'licenses'), { recursive: true })
        for (const file of (await readdir(resolve(source, 'fonts'))).filter((file) =>
            file.endsWith('.txt'),
        )) {
            await cp(resolve(source, 'fonts', file), resolve(output, 'licenses', file))
        }
    }
    if (name === 'ui-common') {
        await cp(resolve(source, 'fonts'), resolve(output, 'fonts'), { recursive: true })
        await cp(resolve(source, 'fonts.css'), resolve(output, 'fonts.css'))
        await cp(resolve(source, 'antd.less'), resolve(output, 'antd.less'))
        for (const [themeName, tokens] of Object.entries({
            staff: staffTheme,
            resident: residentTheme,
        })) {
            const compiled = await less.render(
                await readFile(resolve(source, 'antd.less'), 'utf8'),
                {
                    filename: resolve(source, 'antd.less'),
                    paths: [resolve(root, 'node_modules')],
                    javascriptEnabled: true,
                    modifyVars: Object.fromEntries(
                        Object.entries(tokens).map(([key, value]) => [key, String(value)]),
                    ),
                },
            )
            await writeFile(resolve(output, `${themeName}.css`), compiled.css)
        }
    }
    await writeFile(resolve(output, 'styles.d.ts'), 'export {}\n')
    console.info(`Built ${manifest.name}: ESM, declarations${name !== 'icons' ? ', CSS' : ''}`)
}
