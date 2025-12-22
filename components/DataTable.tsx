import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

export function DataTable<T>({
  columns,
  data,
  rowKey,
  tableClassName,
  headerRowClassName,
  headerCellClassName,
  bodyRowClassName,
  bodyCellClassName,
}: DataTableProps<T>) {
  return (
    <div className='relative w-full rounded-xl border border-white/5 overflow-hidden'>
      <Table className={cn('custom-scrollbar bg-dark-500', tableClassName)}>
        <TableHeader>
          <TableRow className={cn('hover:bg-transparent! border-none', headerRowClassName)}>
            {columns.map((column, index) => (
              <TableHead
                key={`head-${index}`}
                className={cn(
                  'bg-dark-400 text-purple-100 py-4 px-5 font-semibold',
                  headerCellClassName,
                  column.headClassName,
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowKey(row, rowIndex)}
                className={cn('relative border-b border-white/5 last:border-none transition-colors', bodyRowClassName)}
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={`cell-${colIndex}`}
                    className={cn('py-5 px-5', bodyCellClassName, column.cellClassName)}
                  >
                    {column.cell(row, rowIndex)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center text-purple-100 italic'>
                No market data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
