import Image from 'next/image';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { DataTable } from '@/components/DataTable';
import { getCategories } from '@/lib/coingecko.actions';
import { cn, formatPercentage, formatPrice } from '@/lib/utils';
import { DataTableColumn, Category } from '@/types';

export const Categories = async () => {
  const categories = await getCategories();

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
        category.top_3_coins.map((coinUrl) => (
          <Image key={coinUrl} src={coinUrl} alt={category.name} width={28} height={28} />
        )),
    },
    {
      header: '24h Change',
      cellClassName: 'change-header-cell',
      cell: (category) => {
        const change = category.market_cap_change_24h;
        const isPositive = change >= 0;

        return (
          <div
            className={cn(
              'change-cell flex items-center gap-1 font-medium',
              isPositive ? 'text-green-500' : 'text-red-500',
            )}
          >
            <p>{formatPercentage(Math.abs(change))}</p>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          </div>
        );
      },
    },
    {
      header: 'Market Cap',
      cellClassName: 'market-cap-cell',
      cell: (category) => formatPrice(category.market_cap),
    },
    {
      header: '24h Volume',
      cellClassName: 'volume-cell',
      cell: (category) => formatPrice(category.volume_24h),
    },
  ];

  return (
    <section id='categories' className='custom-scrollbar'>
      <h4>Top Categories</h4>

      <DataTable tableClassName='mt-3' columns={columns} data={categories} rowKey={(category) => category.name} />
    </section>
  );
};
