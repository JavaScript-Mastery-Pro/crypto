import { Skeleton } from '../ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export const CategoriesFallback = () => (
  <div className='custom-scrollbar categories-container'>
    <h4 className='section-title pl-5'>Top Categories</h4>
    <Table>
      <TableHeader className='text-purple-100'>
        <TableRow className='hover:bg-transparent'>
          <TableHead className='exchange-header-left'>Category</TableHead>
          <TableHead className='text-purple-100'>Top Gainers</TableHead>
          <TableHead className='text-purple-100 pl-7'>24h Change</TableHead>
          <TableHead className='text-purple-100'>Market Cap</TableHead>
          <TableHead className='text-purple-100'>24h Volume</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 6 }).map((_, index) => (
          <TableRow
            key={index}
            className='md:text-base rounded-lg hover:bg-dark-400/30!'
          >
            <TableCell className='pl-5 font-bold'>
              <Skeleton className='h-4 w-32 skeleton' />
            </TableCell>
            <TableCell className='flex gap-1 mr-5'>
              {Array.from({ length: 3 }).map((__, coinIndex) => (
                <Skeleton
                  key={coinIndex}
                  className='h-7 w-7 rounded-full skeleton'
                />
              ))}
            </TableCell>
            <TableCell className='font-medium'>
              <Skeleton className='h-4 w-16 skeleton' />
            </TableCell>
            <TableCell className='font-medium'>
              <Skeleton className='h-4 w-20 skeleton' />
            </TableCell>
            <TableCell className='font-medium'>
              <Skeleton className='h-4 w-24 skeleton' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export const CoinOverviewFallback = () => (
  <div id='coin-overview'>
    <div className='w-full h-full min-h-[420px] rounded-2xl bg-dark-500/60 p-6'>
      <div className='flex items-center gap-4 mb-6'>
        <Skeleton className='h-14 w-14 rounded-full skeleton' />
        <div className='flex flex-col gap-2 flex-1'>
          <Skeleton className='h-4 w-1/3 skeleton' />
          <Skeleton className='h-8 w-1/2 skeleton' />
        </div>
      </div>
      <Skeleton className='h-[280px] w-full rounded-xl skeleton' />
    </div>
  </div>
);

export const TrendingCoinsFallback = () => (
  <div className='top-movers-container'>
    <h4 className='section-title px-5'>Trending Coins</h4>
    <div className='table-scrollbar-container custom-scrollbar'>
      <Table>
        <TableHeader className='table-header-cell'>
          <TableRow className='hover:bg-transparent'>
            <TableHead className='table-head-left'>Name</TableHead>
            <TableHead className='table-header-cell table-cell'>
              24h Change
            </TableHead>
            <TableHead className='table-head-right'>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 6 }).map((_, index) => (
            <TableRow key={index} className='table-row-hover'>
              <TableCell className='font-bold'>
                <div className='flex items-center gap-3'>
                  <Skeleton className='h-9 w-9 rounded-full skeleton' />
                  <Skeleton className='h-4 w-24 skeleton' />
                </div>
              </TableCell>
              <TableCell className='table-cell-change'>
                <Skeleton className='h-4 w-16 skeleton' />
              </TableCell>
              <TableCell className='table-cell-price'>
                <Skeleton className='h-4 w-20 skeleton' />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);
