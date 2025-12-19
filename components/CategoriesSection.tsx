import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getCategories } from '@/lib/coingecko.actions';
import { cn, formatPercentage, formatPrice } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export const CategoriesSection = async () => {
  const categories = (await getCategories()) as Category[];

  return (
    <div className='custom-scrollbar pt-8 mt-5 w-full bg-dark-500 rounded-xl overflow-hidden'>
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
          {categories.map((category: Category, index: number) => {
            const isTrendingUp = category.market_cap_change_24h > 0;
            return (
              <TableRow
                key={index}
                className='md:text-base rounded-lg hover:!bg-dark-400/30'
              >
                <TableCell className='pl-5 font-bold'>
                  {category.name}
                </TableCell>
                <TableCell className='flex gap-1 mr-5'>
                  {category.top_3_coins.map((coin: string) => (
                    <Image
                      key={coin}
                      src={coin}
                      alt='Coin image'
                      width={28}
                      height={28}
                      className='rounded-full py-2'
                    />
                  ))}
                </TableCell>
                <TableCell className='font-medium'>
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
                </TableCell>
                <TableCell className='font-medium'>
                  {formatPrice(category.market_cap)}
                </TableCell>
                <TableCell className='font-medium'>
                  {formatPrice(category.volume_24h)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
