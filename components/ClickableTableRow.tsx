'use client';

import { useRouter } from 'next/navigation';
import { TableRow } from '@/components/ui/table';

export function ClickableTableRow({
  href,
  children,
  className,
}: ClickableTableRowProps) {
  const router = useRouter();

  return (
    <TableRow className={className} onClick={() => router.push(href)}>
      {children}
    </TableRow>
  );
}
