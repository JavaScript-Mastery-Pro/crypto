import { DataTable } from '@/components/DataTable';
import { getTrendingCoins } from '@/lib/coingecko.actions';
import { cn, formatPercentage, formatPrice } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const TrendingCoins = async () => {
  const trendingCoins = (await getTrendingCoins()) as TrendingCoin[];
  const columns = [
    {
      header: 'Name',
      cellClassName: 'font-bold',
      cell: (coin: TrendingCoin) => {
        const item = coin.item;

        return (
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
        );
      },
    },
    {
      header: '24h Change',
      cellClassName: 'table-cell-change',
      cell: (coin: TrendingCoin) => {
        const item = coin.item;
        const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;

        return (
          <div
            className={cn(
              'price-change-indicator',
              isTrendingUp ? 'text-green-500' : 'text-red-500'
            )}
          >
            <p>{formatPercentage(item.data.price_change_percentage_24h.usd)}</p>
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
      header: 'Price',
      cellClassName: 'table-cell-price',
      cell: (coin: TrendingCoin) => {
        return formatPrice(coin.item.data.price);
      },
    },
  ];

  return (
    <div className='top-movers-container'>
      <h4 className='section-title px-5'>Trending Coins</h4>
      <div className='table-scrollbar-container custom-scrollbar'>
        <DataTable
          columns={columns}
          data={trendingCoins.slice(0, 6)}
          rowKey={(_, index) => index}
          headerClassName='table-header-cell'
          headerRowClassName='hover:bg-transparent'
          bodyRowClassName='table-row-hover'
        />
      </div>
    </div>
  );
};
