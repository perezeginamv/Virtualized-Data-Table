import { useCallback, useMemo, useState } from 'react';
import styles from './DataTablePage.module.css';
import type { DataRow } from '../../widgets/DataTable/model/types';
import { DataTable } from '../../widgets/DataTable/ui/DataTable';

const ROW_COUNT = 100_000;

function createInitialData(): DataRow[] {
    return Array.from({ length: ROW_COUNT }, (_, index) => {
        const rowNumber = index + 1;

        return {
            id: rowNumber,
            rowNumber,
            text: `Row ${rowNumber}`,
        };
    });
}

function shuffle<T>(source: T[]): T[] {
    const result = [...source];

    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));

        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

export function DataTablePage() {
    const [data, setData] = useState<DataRow[]>(createInitialData);

    const handleShuffle = useCallback(() => {
        setData((currentData) => shuffle(currentData));
    }, []);

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>
                    Virtualized data table
                </h1>

                <div className={styles.toolbar}>
                    <p className={styles.description}>
                        {data.length.toLocaleString('ru-RU')} строк
                    </p>

                    <button
                        type="button"
                        className={styles.shuffleButton}
                        onClick={handleShuffle}
                    >
                        Перемешать
                    </button>
                </div>


                <div className={styles.tableWrapper}>
                    <DataTable data={data} />
                </div>
            </div>
        </main>
    );
}