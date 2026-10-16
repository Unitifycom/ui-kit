import { afterEach, expect, it, vi } from 'vitest'
import {
    sendAnalyticsClickEvent,
    setAnalyticsHandler,
} from '../packages/ui/src/components/_utils/analytics.ts'
afterEach(() => {
    setAnalyticsHandler(undefined)
    vi.unstubAllGlobals()
})
it('does not send values or page URLs to an embedding parent by default', () => {
    const postMessage = vi.fn()
    vi.stubGlobal('window', { location: { href: 'https://consumer.test/private' } })
    vi.stubGlobal('parent', { postMessage })
    sendAnalyticsClickEvent('Button', { value: 'value', type: 'primary' })
    expect(postMessage).not.toHaveBeenCalled()
})
it('delivers events only to an explicitly configured handler and can disable it', () => {
    vi.stubGlobal('window', { location: { href: 'https://consumer.test/page' } })
    const handler = vi.fn()
    setAnalyticsHandler(handler)
    sendAnalyticsClickEvent('Button', { value: 'value', type: 'primary' })
    expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
            params: expect.objectContaining({
                event: 'click',
                component: 'Button',
                value: 'value',
            }),
        }),
    )
    setAnalyticsHandler(undefined)
    sendAnalyticsClickEvent('Button', { value: 'value', type: 'primary' })
    expect(handler).toHaveBeenCalledTimes(1)
})
