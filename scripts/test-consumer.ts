import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { createServer } from 'node:http'
import { build } from 'vite'
import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
const root = resolve(import.meta.dirname, '..'),
    consumer = await mkdtemp(resolve(tmpdir(), 'unitify-ui-consumer-'))
function command(args: string[]) {
    const result = Bun.spawnSync(args, {
        cwd: consumer,
        stdout: 'pipe',
        stderr: 'pipe',
        timeout: 180000,
    })
    if (result.exitCode) throw new Error(result.stdout.toString() + result.stderr.toString())
}
try {
    const dependencies: Record<string, string> = {
        react: '18.3.1',
        'react-dom': '18.3.1',
        'react-intl': '7.1.14',
        '@types/react': '^18.3.0',
        '@types/react-dom': '^18.3.0',
    }
    const artifacts: Array<{ name: string; filename: string }> = JSON.parse(
        await readFile(resolve(root, 'dist/packages/manifest.json'), 'utf8'),
    )
    for (const artifact of artifacts)
        dependencies[artifact.name] = 'file:' + resolve(root, 'dist/packages', artifact.filename)
    await writeFile(
        resolve(consumer, 'package.json'),
        JSON.stringify({
            private: true,
            type: 'module',
            dependencies,
            overrides: Object.fromEntries(
                Object.entries(dependencies).filter(
                    ([name]) => name.startsWith('@unitifycom/') || name.startsWith('@types/react'),
                ),
            ),
        }),
    )
    command(['bun', 'install', '--ignore-scripts'])
    await writeFile(
        resolve(consumer, 'index.html'),
        '<div id="root"></div><script type="module" src="/entry.tsx"></script>',
    )
    await writeFile(
        resolve(consumer, 'labels.json'),
        JSON.stringify({ button: 'Continue', heading: 'Unitify UI Kit', locale: 'en' }),
    )
    await writeFile(
        resolve(consumer, 'entry.tsx'),
        `
        import React from 'react'
        import { createRoot } from 'react-dom/client'
        import { IntlProvider } from 'react-intl'
        import { Button } from '@unitifycom/ui/components/Button'
        import { Checkbox, Radio, Tag, Tooltip, UIProvider, Input } from '@unitifycom/ui'
        import { Check } from '@unitifycom/icons/Check'
        import { DesignSystemProvider, LegacyTable, DateRangePicker } from '@unitifycom/ui-common'
        import '@unitifycom/ui/styles.css'
        import '@unitifycom/ui-common/staff.css'
        import '@unitifycom/ui-common/styles.css'
        import labels from './labels.json'
        const icon: React.ReactElement = <Check />
        // @ts-expect-error Invalid size must be rejected by the published declarations.
        const invalid = <Check size="invalid-icon-size" />
        const components = [LegacyTable, DateRangePicker, Checkbox, Radio, Tag, Tooltip, Input]
        if (components.some(value => !value)) throw new Error('Missing public exports')
        createRoot(document.getElementById('root')!).render(<IntlProvider locale={labels.locale}><DesignSystemProvider><UIProvider locale={labels.locale}><Button type="primary" icon={icon}>{labels.button}</Button></UIProvider></DesignSystemProvider></IntlProvider>)
    `,
    )
    await writeFile(
        resolve(consumer, 'tsconfig.json'),
        JSON.stringify({
            compilerOptions: {
                strict: true,
                noEmit: true,
                module: 'ESNext',
                moduleResolution: 'Bundler',
                jsx: 'react-jsx',
                target: 'ES2022',
                skipLibCheck: true,
                resolveJsonModule: true,
                esModuleInterop: true,
            },
            include: ['entry.tsx'],
        }),
    )
    command([
        'bun',
        resolve(root, 'node_modules/typescript/bin/tsc'),
        '--project',
        'tsconfig.json',
        '--incremental',
        'false',
    ])
    await build({ root: consumer, configFile: false, logLevel: 'warn', build: { minify: false } })
    const jsFiles = new Bun.Glob('assets/*.js'),
        cssFiles = new Bun.Glob('assets/*.css')
    let javascript = '',
        css = ''
    for await (const file of jsFiles.scan(resolve(consumer, 'dist')))
        if (file.split('/').pop()?.startsWith('index-'))
            javascript += await readFile(resolve(consumer, 'dist', file), 'utf8')
    for await (const file of cssFiles.scan(resolve(consumer, 'dist')))
        css += await readFile(resolve(consumer, 'dist', file), 'utf8')
    assert.ok(
        !javascript.includes('@tiptap'),
        'Unused editor must not enter the consumer entry bundle',
    )
    assert.ok(css.includes('.condo-btn') && css.includes('.ant-btn'))
    assert.ok(!/fonts\.googleapis|fonts\.gstatic/.test(css))
    const server = createServer(async (req, res) => {
        const pathname = new URL(req.url ?? '/', 'http://localhost').pathname
        const file = resolve(consumer, 'dist', '.' + (pathname === '/' ? '/index.html' : pathname))
        if (!file.startsWith(resolve(consumer, 'dist') + '/')) {
            res.writeHead(403).end()
            return
        }
        try {
            res.setHeader(
                'content-type',
                file.endsWith('.js')
                    ? 'application/javascript'
                    : file.endsWith('.css')
                      ? 'text/css'
                      : file.endsWith('.html')
                        ? 'text/html'
                        : 'application/octet-stream',
            )
            res.end(await readFile(file))
        } catch {
            res.writeHead(404).end()
        }
    })
    await new Promise<void>((done) => server.listen(0, '127.0.0.1', done))
    const browser = await chromium.launch({ headless: true })
    try {
        const page = await browser.newPage(),
            errors: string[] = [],
            failures: string[] = []
        page.on('pageerror', (error) => errors.push(error.message))
        page.on('response', (response) => {
            if (response.status() >= 400) failures.push(response.url())
        })
        await page.goto(`http://127.0.0.1:${(server.address() as { port: number }).port}`)
        const button = page.getByRole('button', { name: 'Continue', exact: true })
        await button.waitFor()
        await page.evaluate(() => document.fonts.ready)
        assert.ok(
            await button.evaluate((element) => getComputedStyle(element).borderRadius !== '0px'),
        )
        assert.deepEqual(errors, [])
        assert.deepEqual(failures, [])
    } finally {
        await browser.close()
        await new Promise<void>((done) => server.close(() => done()))
    }
    console.info(
        'Independent consumer passed: archive installation, strict types, Vite without Less, browser rendering and local fonts.',
    )
} finally {
    await rm(consumer, { recursive: true, force: true })
}
