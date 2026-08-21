import { useMemo } from 'react';
import styles from './DataTablePage.module.css';
import type { DataRow } from '../../widgets/DataTable/model/types';
import { DataTable } from '../../widgets/DataTable/ui/DataTable';

const ROW_COUNT = 100_000;

export function DataTablePage() {
    const data = useMemo<DataRow[]>(
        () =>
            Array.from({ length: ROW_COUNT }, (_, index) => ({
                id: index + 1,
                text: `Row ${index + 1}`,
            })),
        [],
    );

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>
                    Virtualized data table
                </h1>

                <p className={styles.description}>
                    {data.length.toLocaleString('ru-RU')} строк
                </p>

                <div className={styles.tableWrapper}>
                    <DataTable data={data} />
                </div>
            </div>
        </main>
    );
}