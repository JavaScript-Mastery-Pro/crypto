import { DataTable } from '@/components/DataTable';
import { Skeleton } from '../ui/skeleton';

export const CategoriesFallback = () => (
  <div id='categories-fallback' className='custom-scrollbar'>
    <h4>Top Categories</h4>
    <DataTable
      tableClassName='mt-3'
      columns={[
        {
          header: 'Category',
          cellClassName: 'category-cell',
          cell: () => <Skeleton className='skeleton category-skeleton' />,
        },
        {
          header: 'Top Gainers',
          cellClassName: 'top-gainers-cell',
          cell: () =>
            Array.from({ length: 3 }).map((_, coinIndex) => (
              <Skeleton key={coinIndex} className='skeleton coin-skeleton' />
            )),
        },
        {
          header: '24h Change',
          cellClassName: 'change-header-cell',
          cell: () => (
            <div className='change-cell'>
              <Skeleton className='skeleton value-skeleton-sm' />
              <Skeleton className='skeleton change-icon' />
            </div>
          ),
        },
        {
          header: 'Market Cap',
          cellClassName: 'market-cap-cell',
          cell: () => <Skeleton className='skeleton value-skeleton-md' />,
        },
        {
          header: '24h Volume',
          cellClassName: 'volume-cell',
          cell: () => <Skeleton className='skeleton value-skeleton-lg' />,
        },
      ]}
      data={Array.from({ length: 6 })}
      rowKey={(_, index) => index}
    />
  </div>
);

export const CoinOverviewFallback = () => (
  <div id='coin-overview-fallback'>
    <div id='candlestick-chart' className='is-fallback'>
      <div className='chart-header'>
        <div className='flex-1'>
          <div className='header'>
            <Skeleton className='skeleton header-image' />
            <div className='info'>
              <Skeleton className='skeleton header-line-sm' />
              <Skeleton className='skeleton header-line-lg' />
            </div>
          </div>
        </div>
        <div className='button-group'>
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton
              key={index}
              className='skeleton period-button-skeleton'
            />
          ))}
        </div>
      </div>
      <div className='chart'>
        <Skeleton className='skeleton chart-skeleton' />
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
      columns={[
        {
          header: 'Name',
          cellClassName: 'name-cell',
          cell: () => (
            <div className='name-link'>
              <Skeleton className='skeleton name-image' />
              <Skeleton className='skeleton name-line' />
            </div>
          ),
        },
        {
          header: '24h Change',
          cellClassName: 'change-cell',
          cell: () => (
            <div className='price-change'>
              <Skeleton className='skeleton change-line' />
              <Skeleton className='skeleton change-icon' />
            </div>
          ),
        },
        {
          header: 'Price',
          cellClassName: 'price-cell',
          cell: () => <Skeleton className='skeleton price-line' />,
        },
      ]}
      data={Array.from({ length: 6 })}
      rowKey={(_, index) => index}
    />
  </div>
);
