import generatePicker from 'antd/es/date-picker/generatePicker'
import dayjsConfig from 'rc-picker/es/generate/dayjs'
import type { Dayjs } from 'dayjs'
export const DatePicker: ReturnType<typeof generatePicker<Dayjs>> =
    generatePicker<Dayjs>(dayjsConfig)
