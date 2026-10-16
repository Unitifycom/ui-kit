import type { ReactNode } from 'react'
import { ConfigProvider } from 'antd'
import { UIProvider } from '@unitifycom/ui'
import en from 'antd/es/locale/en_US'
import ru from 'antd/es/locale/ru_RU'
import ar from 'antd/es/locale/ar_EG'
import az from 'antd/es/locale/az_AZ'
import be from 'antd/es/locale/by_BY'
import de from 'antd/es/locale/de_DE'
import es from 'antd/es/locale/es_ES'
import fr from 'antd/es/locale/fr_FR'
import hy from 'antd/es/locale/hy_AM'
import ka from 'antd/es/locale/ka_GE'
import kk from 'antd/es/locale/kk_KZ'
import lv from 'antd/es/locale/lv_LV'
import pt from 'antd/es/locale/pt_PT'
import sl from 'antd/es/locale/sl_SI'
import uz from 'antd/es/locale/uz_UZ'
import { useIntl } from 'react-intl'
import dayjs from 'dayjs'
import 'dayjs/locale/ru.js'
import 'dayjs/locale/en.js'
import 'dayjs/locale/ar.js'
import 'dayjs/locale/az.js'
import 'dayjs/locale/be.js'
import 'dayjs/locale/de.js'
import 'dayjs/locale/es.js'
import 'dayjs/locale/fr.js'
import 'dayjs/locale/hy-am.js'
import 'dayjs/locale/ka.js'
import 'dayjs/locale/kk.js'
import 'dayjs/locale/lv.js'
import 'dayjs/locale/pt.js'
import 'dayjs/locale/sl.js'
import 'dayjs/locale/uz-latn.js'
const locales: Record<string, typeof en> = {
    en,
    ru,
    ar,
    az,
    be,
    de,
    es,
    fr,
    hy,
    ka,
    kk,
    lv,
    pt,
    sl,
    uz,
}
export function DesignSystemProvider({ children }: { children: ReactNode }) {
    const intl = useIntl()
    const locale = locales[intl.locale] ?? en
    dayjs.locale(intl.locale === 'uz' ? 'uz-latn' : intl.locale === 'hy' ? 'hy-am' : intl.locale)
    return (
        <ConfigProvider
            locale={locale}
            componentSize="large"
            direction={intl.locale === 'ar' ? 'rtl' : 'ltr'}
        >
            <UIProvider locale={intl.locale}>{children}</UIProvider>
        </ConfigProvider>
    )
}
