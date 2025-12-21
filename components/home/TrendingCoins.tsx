import Image from 'next/image';
import Link from 'next/link';
import { TrendingDown, TrendingUp } from 'lucide-react';

import { DataTable } from '@/components/DataTable';
import { getTrendingCoins } from '@/lib/coingecko.actions';
import { cn, formatPercentage, formatPrice } from '@/lib/utils';

export const TrendingCoins = async () => {
  const trendingCoins = (await getTrendingCoins()) as TrendingCoin[];

  const columns = [
    {
      header: 'Name',
      cellClassName: 'name-cell',
      cell: (coin: TrendingCoin) => {
        const item = coin.item;

        return (
          <Link href={`/coins/${item.id}`}>
            <Image src={item.large} alt={item.name} width={36} height={36} />
            <p>{item.name}</p>
          </Link>
        );
      },
    },
    {
      header: '24h Change',
      cellClassName: 'change-cell',
      cell: (coin: TrendingCoin) => {
        const item = coin.item;
        const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;

        return (
          <div
            className={cn(
              'price-change',
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
      cellClassName: 'price-cell',
      cell: (coin: TrendingCoin) => {
        return formatPrice(coin.item.data.price);
      },
    },
  ];

  return (
    <div id='trending-coins'>
      <h4>Trending Coins</h4>

      <DataTable
        tableClassName='trending-coins-table mt-3'
        columns={columns}
        data={trendingCoins.slice(0, 6)}
        rowKey={(_, index) => index}
        headerCellClassName='py-3! bg-dark-400 text-purple-100'
        bodyCellClassName='py-2!'
      />
    </div>
  );
};
