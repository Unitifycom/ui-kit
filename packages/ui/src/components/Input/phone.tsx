import { useUIStrings } from '../../locale'
import classNames from 'classnames'
import React, { forwardRef, useCallback, useEffect, useMemo } from 'react'
import ReactPhoneInput, { CountryData } from 'react-phone-input-2'

import { INPUT_CLASS_PREFIX } from './input'

import type { PhoneInputProps as DefaultPhoneInputProps } from 'react-phone-input-2'

export type PhoneInputProps = Pick<
    DefaultPhoneInputProps,
    'country' | 'placeholder' | 'onChange' | 'value' | 'onMount' | 'disabled'
> & {
    inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style' | 'value' | 'onChange'>
    id?: string
    onCountryChange?: (country: string) => void
}

const Phone = forwardRef<unknown, PhoneInputProps>((props, ref) => {
    const strings = useUIStrings()
    const {
        value,
        country,
        placeholder,
        onChange,
        disabled = false,
        id,
        inputProps,
        onCountryChange,
        ...restProps
    } = props

    const containerClasses = classNames(`${INPUT_CLASS_PREFIX}-phone`, {
        [`${INPUT_CLASS_PREFIX}-phone-disabled`]: disabled,
    })

    useEffect(() => {
        // @ts-ignore
        if (value === '+' && ref?.current?.numberInputRef) {
            // @ts-ignore
            const input = ref?.current?.numberInputRef
            setTimeout(() =>
                input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: '+' })),
            )
        }
    }, [])

    const internalOnChange = useCallback<Required<PhoneInputProps>['onChange']>(
        (rawValue: string, data: CountryData, event, formattedValue) => {
            const value = rawValue ? `+${rawValue}` : rawValue

            if (onCountryChange) {
                onCountryChange(data.countryCode)
            }
            if (onChange) {
                onChange(value, data, event, formattedValue)
            }
        },
        [onChange, onCountryChange],
    )

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement
        if (e.key === '+') {
            if (input.value === '') {
                e.preventDefault()
                const value = input.value
                input.value = '+' + value
                input.setSelectionRange(1, 1)
                input.dispatchEvent(new Event('input', { bubbles: true }))
                input.dispatchEvent(new Event('change', { bubbles: true }))
            } else if (input.value === '+') {
                e.preventDefault()
            }
        }
        if (e.key === 'Backspace' && input.value.length === 2 && input.value.startsWith('+')) {
            e.preventDefault()
            input.value = '+'
            input.dispatchEvent(new Event('input', { bubbles: true }))
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedText = e.clipboardData.getData('text')
        const input = e.target as HTMLInputElement
        if (pastedText.startsWith('+')) {
            e.preventDefault()
            const currentValue = input.value
            const selectionStart = input.selectionStart ?? 0
            const selectionEnd = input.selectionEnd ?? 0

            const newValue =
                currentValue.slice(0, selectionStart) +
                pastedText +
                currentValue.slice(selectionEnd)

            if (selectionStart === 0 && !currentValue.startsWith('+')) {
                input.value = newValue
            } else {
                input.value = newValue
            }

            input.dispatchEvent(new Event('input', { bubbles: true }))
        }
    }

    const combinedInputProps = useMemo(() => {
        const props = {
            ...inputProps,
            onKeyDown: handleKeyDown,
            onPaste: handlePaste,
        }
        if (id) {
            props.id = id
        }
        return props
    }, [id, inputProps])

    return (
        <ReactPhoneInput
            {...restProps}
            // @ts-ignore
            ref={ref}
            value={value}
            inputProps={combinedInputProps}
            onChange={internalOnChange}
            containerClass={containerClasses}
            disabled={disabled}
            inputClass={INPUT_CLASS_PREFIX}
            country={country}
            copyNumbersOnly={false}
            placeholder={placeholder || strings.phonePlaceholder}
            priority={{ kz: 0, ru: 1 }}
        />
    )
})

Phone.displayName = 'PhoneInput'

export { Phone }
