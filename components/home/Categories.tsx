import { DataTable } from '@/components/DataTable';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategories } from '@/lib/coingecko.actions';
import { cn, formatPercentage, formatPrice } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export const Categories = async () => {
  const categories = (await getCategories()) as Category[];
  const columns = [
    {
      header: 'Category',
      cellClassName: 'pl-5 font-bold',
      cell: (category: Category) => category.name,
    },
    {
      header: 'Top Gainers',
      cellClassName: 'flex gap-1 mr-5',
      cell: (category: Category) =>
        category.top_3_coins.map((coin: string) => (
          <Image
            key={coin}
            src={coin}
            alt='Coin image'
            width={28}
            height={28}
            className='rounded-full py-2'
          />
        )),
    },
    {
      header: '24h Change',
      cellClassName: 'font-medium',
      cell: (category: Category) => {
        const isTrendingUp = category.market_cap_change_24h > 0;

        return (
          <div
            className={cn(
              'flex flex-1 gap-1 items-end pl-5 text-base font-medium',
              {
                'text-green-500': category.market_cap_change_24h > 0,
                'text-red-500': category.market_cap_change_24h < 0,
              }
            )}
          >
            <p>{formatPercentage(category.market_cap_change_24h)}</p>
            {isTrendingUp ? (
              <TrendingUp width={16} height={16} />
            ) : (
              <TrendingDown width={16} height={16} />
            )}
          </div>
        );
      },
    },
    {
      header: 'Market Cap',
      cellClassName: 'font-medium',
      cell: (category: Category) => formatPrice(category.market_cap),
    },
    {
      header: '24h Volume',
      cellClassName: 'font-medium',
      cell: (category: Category) => formatPrice(category.volume_24h),
    },
  ];

  return (
    <div className='custom-scrollbar pt-8 mt-5 w-full bg-dark-500 rounded-xl overflow-hidden'>
      <h4 className='section-title pl-5'>Top Categories</h4>
      <DataTable
        columns={columns}
        data={categories}
        rowKey={(_, index) => index}
        headerClassName='text-purple-100'
        headerRowClassName='hover:bg-transparent'
        bodyRowClassName='md:text-base rounded-lg hover:bg-dark-400/30!'
      />
    </div>
  );
};

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
