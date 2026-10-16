import React, { lazy, Suspense } from 'react'
import type { RichTextAreaProps } from './richTextArea'
const Editor = lazy(() =>
    import('./richTextArea').then((module) => ({ default: module.RichTextArea })),
)
export const RichTextArea: React.FC<RichTextAreaProps> = (props) => (
    <Suspense fallback={null}>
        <Editor {...props} />
    </Suspense>
)
