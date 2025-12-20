'use client';

import { useRouter } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

export default function CoinsPagination({
  currentPage,
  totalPages,
  hasMorePages,
}: {
  currentPage: number;
  totalPages: number;
  hasMorePages: boolean;
}) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/coins?page=${page}`);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Number of page buttons to show

    if (totalPages <= showPages) {
      // Show all pages if total is less than or equal to showPages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      // Calculate start and end of middle pages
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const isLastPage = !hasMorePages || currentPage === totalPages;

  return (
    <Pagination>
      <PaginationContent className='flex w-full'>
        <PaginationItem className='bg-dark-400 rounded-sm pr-2 py-1'>
          <PaginationPrevious
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className={
              currentPage === 1
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>

        <div className='flex flex-1 justify-center gap-2'>
          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <span className='px-3 py-2 text-base'>...</span>
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(page as number)}
                  className={cn(
                    `hover:bg-dark-400! rounded-sm text-base cursor-pointer`,
                    {
                      'bg-green-500! text-dark-900 font-semibold':
                        currentPage === page,
                    }
                  )}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>

        <PaginationItem className='bg-dark-400 rounded-sm pl-2 py-1'>
          <PaginationNext
            onClick={() => !isLastPage && handlePageChange(currentPage + 1)}
            className={
              isLastPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
