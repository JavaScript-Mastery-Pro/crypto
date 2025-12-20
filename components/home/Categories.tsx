import { DataTable } from '@/components/DataTable';
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
      />
    </div>
  );
};
