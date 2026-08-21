import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMemo, useRef, useState } from 'react';
import type { DataRow } from '../model/types';
import styles from './DataTable.module.css';

const ROW_HEIGHT = 44;
const OVERSCAN = 8;

const columnHelper = createColumnHelper<DataRow>();

interface DataTableProps {
    data: DataRow[];
}

export function DataTable({ data }: DataTableProps) {
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
    const parentRef = useRef<HTMLDivElement>(null);

    const columns = useMemo(
        () => [
            columnHelper.accessor('rowNumber', {
                id: 'index',
                header: '#',
                size: 80,
                minSize: 60,

                cell: ({ row }) => row.original.rowNumber,
            }),

            columnHelper.accessor('id', {
                header: 'ID',
                size: 120,
                minSize: 80,
            }),

            columnHelper.accessor('text', {
                header: 'Text',
                size: 300,
                minSize: 150,
            }),
        ],
        [],
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => String(row.id),
    });

    const rows = table.getRowModel().rows;

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: OVERSCAN,
        getItemKey: (index) => rows[index]?.id ?? index,
        useFlushSync: false,
    });

    const virtualRows = rowVirtualizer.getVirtualItems();
    const totalSize = rowVirtualizer.getTotalSize();

    const handleRowClick = (id: number) => {
        setSelectedRowId((prev) => (prev === id ? null : id));
    };

    if (data.length === 0) {
        return (
            <div className={styles.empty}>
                Нет данных для отображения
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                {table.getHeaderGroups().map((headerGroup) => (
                    <div
                        key={headerGroup.id}
                        className={styles.headerRow}
                    >
                        {headerGroup.headers.map((header) => (
                            <div
                                key={header.id}
                                className={styles.headerCell}
                                style={{
                                    width:
                                        header.column.id === 'text'
                                            ? undefined
                                            : header.getSize(),

                                    flex:
                                        header.column.id === 'text'
                                            ? '1 1 0'
                                            : '0 0 auto',

                                    minWidth:
                                        header.column.columnDef.minSize ?? 0,
                                }}
                            >
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div
                ref={parentRef}
                className={styles.scrollContainer}
            >
                <div
                    className={styles.body}
                    style={{
                        height: totalSize,
                    }}
                >
                    {virtualRows.map((virtualRow) => {
                        const row = rows[virtualRow.index];

                        if (!row) {
                            return null;
                        }

                        const isSelected = selectedRowId === row.original.id;

                        return (
                            <div
                                key={row.id}
                                role="row"
                                aria-rowindex={virtualRow.index + 1}
                                aria-selected={isSelected}
                                tabIndex={0}
                                className={`${styles.row} ${isSelected
                                    ? styles.selected
                                    : ''
                                    }`}
                                style={{
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                                onClick={() => handleRowClick(row.original.id)}
                            >
                                {row
                                    .getVisibleCells()
                                    .map((cell) => (
                                        <div
                                            key={cell.id}
                                            className={styles.cell}
                                            style={{
                                                width:
                                                    cell.column.id ===
                                                        'text'
                                                        ? undefined
                                                        : cell.column.getSize(),

                                                flex:
                                                    cell.column.id ===
                                                        'text'
                                                        ? '1 1 0'
                                                        : '0 0 auto',

                                                minWidth:
                                                    cell.column.columnDef
                                                        .minSize ?? 0,
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </div>
                                    ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}