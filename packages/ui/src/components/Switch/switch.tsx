import { Switch as DefaultSwitch, SwitchProps as DefaultSwitchProps } from 'antd'
import React, { useCallback } from 'react'

import { sendAnalyticsChangeEvent } from '../_utils/analytics'

import './style.less'

const SWITCH_CLASS_PREFIX = 'condo-switch'

type CondoSwitchSize = 'small' | 'large'

export type SwitchProps = Pick<
    DefaultSwitchProps,
    'className' | 'id' | 'autoFocus' | 'checked' | 'defaultChecked' | 'disabled' | 'onChange'
> & {
    size: CondoSwitchSize
    /**
     * Accessible name for the underlying `<button role="switch">` when there is no visible
     * label next to it (e.g. one switch per table row) — antd's own `SwitchProps` does not
     * declare `aria-label`, but the underlying `rc-switch` button spreads unknown props onto
     * itself, so this passes through at runtime once `{...rest}` below carries it along.
     */
    'aria-label'?: string
}

const SWITCH_SIZE_MAP: Record<CondoSwitchSize, DefaultSwitchProps['size']> = {
    small: 'small',
    large: 'default',
}

export const Switch: React.FC<SwitchProps> = (props) => {
    const { disabled, id, onChange, size = 'large', ...rest } = props

    const handleChange = useCallback(
        (checked: boolean, event: React.MouseEvent<HTMLButtonElement>) => {
            sendAnalyticsChangeEvent('Switch', { checked, id })

            if (onChange) {
                onChange(checked, event)
            }
        },
        [id, onChange],
    )

    return (
        <DefaultSwitch
            {...rest}
            id={id}
            prefixCls={SWITCH_CLASS_PREFIX}
            disabled={disabled}
            onChange={handleChange}
            size={SWITCH_SIZE_MAP[size]}
        />
    )
}
