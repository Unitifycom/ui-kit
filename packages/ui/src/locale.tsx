import React, { createContext, useContext, type PropsWithChildren } from 'react'
import en from './locales/en.json'
import ru from './locales/ru.json'
const UIStrings = createContext(en)
export function UIProvider({ children, locale }: PropsWithChildren<{ locale: string }>) {
    return (
        <UIStrings.Provider value={locale.split('-')[0] === 'ru' ? ru : en}>
            {children}
        </UIStrings.Provider>
    )
}
export function useUIStrings(): typeof en {
    return useContext(UIStrings)
}
