import { ChevronDown, Minus } from '@unitifycom/icons'
import type { ComponentProps } from 'react'
import { DatePicker } from './DatePicker.tsx'
export function DateRangePicker(props: ComponentProps<typeof DatePicker.RangePicker>) {
    return (
        <DatePicker.RangePicker
            suffixIcon={<ChevronDown size="small" />}
            separator={<Minus size="small" />}
            format="DD.MM.YYYY"
            {...props}
        />
    )
}
