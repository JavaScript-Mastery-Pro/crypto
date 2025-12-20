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
import { buildPageNumbers, cn, ELLIPSIS } from '@/lib/utils';

export default function CoinsPagination({
  currentPage,
  totalPages,
  hasMorePages,
}: Pagination) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/coins?page=${page}`);
  };

  const pageNumbers = buildPageNumbers(currentPage, totalPages);
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
              {page === ELLIPSIS ? (
                <span className='px-3 py-2 text-base'>...</span>
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    'hover:bg-dark-400! rounded-sm text-base cursor-pointer',
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
