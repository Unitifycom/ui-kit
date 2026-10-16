export function observeFrameHeight(target: Element, resize: (height: number) => void): () => void {
    const observer = new ResizeObserver((entries) => {
        if (entries.length) resize(entries[0].target.clientHeight)
    })
    observer.observe(target)
    return () => observer.disconnect()
}
