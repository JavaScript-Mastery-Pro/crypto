import { TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';

import { DataTable } from '@/components/DataTable';
import { fetcher } from '@/lib/coingecko.actions';
import { cn, formatPercentage, formatCurrency } from '@/lib/utils';

export const Categories = async () => {
  const categories = await fetcher<Category[]>('/coins/categories');

  const columns: DataTableColumn<Category>[] = [
    {
      header: 'Category',
      cellClassName: 'category-cell',
      cell: (category) => category.name,
    },
    {
      header: 'Top Gainers',
      cellClassName: 'top-gainers-cell',
      cell: (category) =>
        category.top_3_coins.map((coin: string) => (
          <Image
            key={coin}
            src={coin}
            alt='Coin image'
            width={28}
            height={28}
          />
        )),
    },
    {
      header: '24h Change',
      cellClassName: 'change-header-cell',
      cell: (category) => {
        const isTrendingUp = category.market_cap_change_24h > 0;

        return (
          <div
            className={cn('change-cell', {
              'text-green-500': category.market_cap_change_24h > 0,
              'text-red-500': category.market_cap_change_24h < 0,
            })}
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
      cellClassName: 'market-cap-cell',
      cell: (category) => formatCurrency(category.market_cap),
    },
    {
      header: '24h Volume',
      cellClassName: 'volume-cell',
      cell: (category) => formatCurrency(category.volume_24h),
    },
  ];

  return (
    <div id='categories' className='custom-scrollbar'>
      <h4>Top Categories</h4>
      <DataTable
        tableClassName='mt-3'
        columns={columns}
        data={categories?.slice(0, 10) ?? []}
        rowKey={(_, index) => index}
      />
    </div>
  );
};
