'use client';

import { useRouter } from 'next/navigation';
import { TableRow } from '@/components/ui/table';
import { ReactNode } from 'react';

interface ClickableTableRowProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function ClickableTableRow({ href, children, className }: ClickableTableRowProps) {
  const router = useRouter();

  return (
    <TableRow
      className={className}
      onClick={() => router.push(href)}
    >
      {children}
    </TableRow>
  );
}
