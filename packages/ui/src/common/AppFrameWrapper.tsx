import { useEffect, type PropsWithChildren } from 'react'
import { observeFrameHeight } from './frame-height.ts'
export function AppFrameWrapper({
    children,
    resize,
}: PropsWithChildren<{ resize: (height: number) => void }>) {
    useEffect(() => {
        if (window.self !== window.top) return observeFrameHeight(document.body, resize)
    }, [resize])
    return children
}
