import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { DataTable } from '@/components/DataTable';
import { getTrendingCoins } from '@/lib/coingecko.actions';
import { cn, formatPercentage, formatPrice } from '@/lib/utils';

export const TrendingCoins = async () => {
  const trendingCoins = await getTrendingCoins();

  const columns: DataTableColumn<TrendingCoin>[] = [
    {
      header: 'Name',
      cellClassName: 'name-cell',
      cell: ({ item }) => (
        <Link href={`/coins/${item.id}`}>
          <Image src={item.large} alt={item.name} width={36} height={36} />
          <p>{item.name}</p>
        </Link>
      ),
    },
    {
      header: '24h Change',
      cellClassName: 'change-cell',
      cell: ({ item }) => {
        const change = item.data.price_change_percentage_24h.usd;
        const isPositive = change >= 0;

        return (
          <div className={cn('price-change', isPositive ? 'text-green-500' : 'text-red-500')}>
            <p>{formatPercentage(Math.abs(change))}</p>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          </div>
        );
      },
    },
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: ({ item }) => <span className='font-bold'>{formatPrice(item.data.price)}</span>,
    },
  ];

  return (
    <section id='trending-coins'>
      <h4>Trending Coins</h4>

      <DataTable
        tableClassName='trending-coins-table mt-3'
        bodyCellClassName='py-2'
        columns={columns}
        data={trendingCoins.slice(0, 6)}
        rowKey={(coin: TrendingCoin) => coin.item.id}
      />
    </section>
  );
};
