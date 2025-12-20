import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { getTrendingCoins } from '@/lib/coingecko.actions';
import { cn, formatPercentage, formatPrice } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const TrendingCoins = async () => {
  const trendingCoins = (await getTrendingCoins()) as TrendingCoin[];

  return (
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
            {trendingCoins.slice(0, 6).map((coin: TrendingCoin, index) => {
              const item = coin.item;
              const isTrendingUp =
                item.data.price_change_percentage_24h.usd > 0;

              return (
                <TableRow key={index} className='table-row-hover'>
                  <TableCell className='font-bold'>
                    <Link href={`/coins/${item.id}`} className='coin-link'>
                      <Image
                        src={item.large}
                        alt={item.name}
                        width={36}
                        height={36}
                        className='coin-image'
                      />
                      <div>
                        <p className='text-sm md:text-base'>{item.name}</p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className='table-cell-change'>
                    <div
                      className={cn(
                        'price-change-indicator',
                        isTrendingUp ? 'text-green-500' : 'text-red-500'
                      )}
                    >
                      <p>
                        {formatPercentage(
                          item.data.price_change_percentage_24h.usd
                        )}
                      </p>
                      {isTrendingUp ? (
                        <TrendingUp width={16} height={16} />
                      ) : (
                        <TrendingDown width={16} height={16} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='table-cell-price'>
                    {formatPrice(item.data.price)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

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
