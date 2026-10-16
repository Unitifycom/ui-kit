import type { PropsWithChildren } from 'react'
export function TableFiltersContainer({ children }: PropsWithChildren) {
    return (
        <div
            className="staff-filters"
            style={{
                maxWidth: 'calc(100% + 48px)',
                borderRadius: 12,
                padding: 16,
                background: '#F2F3F7',
            }}
        >
            {children}
        </div>
    )
}
