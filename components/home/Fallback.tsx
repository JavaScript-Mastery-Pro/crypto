import { DataTable } from '@/components/DataTable';
import { Skeleton } from '../ui/skeleton';

const createPlaceholderData = (length: number) => Array.from({ length }, (_, i) => ({ id: i }));

export const CategoriesFallback = () => (
  <div id='categories-fallback' className='custom-scrollbar'>
    <h4>Top Categories</h4>
    <DataTable
      tableClassName='mt-3'
      data={createPlaceholderData(6)}
      rowKey={(item) => item.id}
      columns={[
        {
          header: 'Category',
          cellClassName: 'category-cell',
          cell: () => <Skeleton className='skeleton h-5 w-32' />,
        },
        {
          header: 'Top Gainers',
          cellClassName: 'top-gainers-cell',
          cell: () => (
            <div className='flex gap-2'>
              {createPlaceholderData(3).map((coin) => (
                <Skeleton key={coin.id} className='skeleton size-7 rounded-full' />
              ))}
            </div>
          ),
        },
        {
          header: '24h Change',
          cellClassName: 'change-header-cell',
          cell: () => (
            <div className='change-cell flex items-center gap-2'>
              <Skeleton className='skeleton h-4 w-12' />
              <Skeleton className='skeleton size-4 rounded-full' />
            </div>
          ),
        },
        {
          header: 'Market Cap',
          cellClassName: 'market-cap-cell',
          cell: () => <Skeleton className='skeleton h-4 w-24' />,
        },
        {
          header: '24h Volume',
          cellClassName: 'volume-cell',
          cell: () => <Skeleton className='skeleton h-4 w-28' />,
        },
      ]}
    />
  </div>
);

export const CoinOverviewFallback = () => (
  <div id='coin-overview-fallback'>
    <div id='candlestick-chart' className='is-fallback border-none'>
      <div className='chart-header'>
        <div className='flex-1'>
          <div className='header flex items-center gap-4'>
            <Skeleton className='skeleton size-14 rounded-full' />
            <div className='info space-y-2'>
              <Skeleton className='skeleton h-3 w-28' />
              <Skeleton className='skeleton h-7 w-44' />
            </div>
          </div>
        </div>
        <div className='button-group flex gap-1'>
          {createPlaceholderData(7).map((btn) => (
            <Skeleton key={btn.id} className='skeleton h-8 w-10 rounded-sm' />
          ))}
        </div>
      </div>
      <div className='chart mt-5'>
        <Skeleton className='skeleton h-[360px] w-full rounded-xl' />
      </div>
    </div>
  </div>
);

export const TrendingCoinsFallback = () => (
  <div id='trending-coins-fallback'>
    <h4>Trending Coins</h4>
    <DataTable
      tableClassName='trending-coins-table mt-3'
      headerCellClassName='py-3!'
      bodyCellClassName='py-2!'
      data={createPlaceholderData(6)}
      rowKey={(item) => item.id}
      columns={[
        {
          header: 'Name',
          cellClassName: 'name-cell',
          cell: () => (
            <div className='name-link flex items-center gap-3'>
              <Skeleton className='skeleton size-9 rounded-full' />
              <Skeleton className='skeleton h-4 w-24' />
            </div>
          ),
        },
        {
          header: '24h Change',
          cellClassName: 'change-cell',
          cell: () => (
            <div className='price-change flex items-center gap-2'>
              <Skeleton className='skeleton h-4 w-16' />
              <Skeleton className='skeleton size-3.5 rounded-full' />
            </div>
          ),
        },
        {
          header: 'Price',
          cellClassName: 'price-cell',
          cell: () => <Skeleton className='skeleton h-4 w-20' />,
        },
      ]}
    />
  </div>
);
