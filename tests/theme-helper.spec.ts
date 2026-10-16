import { expect, it } from 'vitest'
import { designSystemLess } from '../packages/ui/src/common/vite.ts'

it('keeps the Ant Design theme prefix separate from core UI styles in the single package', () => {
    const helper = designSystemLess({ '@primary-color': '#222' })
    expect(
        helper.additionalData('', '/project/node_modules/@unitifycom/ui/dist/antd.less'),
    ).not.toContain('@ant-prefix: condo')
    expect(
        helper.additionalData('', '/project/packages/ui/src/components/Button/style/index.less'),
    ).toContain('@ant-prefix: condo')
})
