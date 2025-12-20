import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export const DataTable = <T,>({
  columns,
  data,
  rowKey,
  tableClassName,
  headerClassName,
  headerRowClassName,
  headerCellClassName = 'text-purple-100',
  bodyRowClassName,
}: DataTableProps<T>) => {
  return (
    <Table className={tableClassName}>
      <TableHeader className={headerClassName}>
        <TableRow className={headerRowClassName}>
          {columns.map((column, columnIndex) => (
            <TableHead
              key={columnIndex}
              className={cn(
                headerCellClassName,
                column.headClassName,
                columnIndex === 0 && 'pl-5'
              )}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowKey(row, rowIndex)} className={bodyRowClassName}>
            {columns.map((column, columnIndex) => (
              <TableCell
                key={columnIndex}
                className={cn(
                  column.cellClassName,
                  columnIndex === 0 && 'pl-5'
                )}
              >
                {column.cell(row, rowIndex)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
