import React from 'react';

export interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, emptyMessage = 'No records found' }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div 
        className="glass-panel" 
        style={{ 
          textAlign: 'center', 
          padding: '48px', 
          color: 'var(--text-secondary)',
          fontSize: '16px',
          fontWeight: 500
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="table-container" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <table>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{col.accessor(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default DataTable;
