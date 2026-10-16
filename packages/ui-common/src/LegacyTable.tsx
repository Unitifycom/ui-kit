import { Pagination, Table as AntdTable, type TableProps } from 'antd'
import './legacy.css'

export function LegacyTable<Record extends object>(props: TableProps<Record>) {
    const { pagination, className, ...tableProps } = props
    const config = typeof pagination === 'object' ? pagination : undefined
    const pageSize = config?.pageSize ?? 30
    const total = config?.total ?? props.dataSource?.length ?? 0
    return (
        <div className={className}>
            <div className="condo-legacy-table-frame">
                <AntdTable {...tableProps} tableLayout="fixed" pagination={false} />
            </div>
            {pagination !== false && total > pageSize ? (
                <Pagination
                    {...config}
                    total={total}
                    pageSize={pageSize}
                    showSizeChanger={false}
                    className="condo-legacy-pagination"
                />
            ) : null}
        </div>
    )
}
