import Image from 'next/image';
import Link from 'next/link';

import { DataTable } from '@/components/DataTable';
import CoinsPagination from '@/components/CoinsPagination';
import { getCoinList } from '@/lib/coingecko.actions';
import { cn, formatPercentage, formatPrice } from '@/lib/utils';
import { CoinsPageProps, DataTableColumn, CoinMarketData } from '@/types';

const CoinsPage = async ({ searchParams }: CoinsPageProps) => {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const ITEMS_PER_PAGE = 20;

  const coinsData = await getCoinList(currentPage, ITEMS_PER_PAGE);

  const hasMorePages = coinsData.length === ITEMS_PER_PAGE;
  const totalPagesEstimate = hasMorePages ? currentPage + 1 : currentPage;

  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: 'Rank',
      cellClassName: 'rank-cell font-medium text-purple-100',
      cell: (coin) => (
        <>
          <span>#{coin.market_cap_rank}</span>
          <Link href={`/coins/${coin.id}`} />
        </>
      ),
    },
    {
      header: 'Token',
      cellClassName: 'token-cell',
      cell: (coin: CoinMarketData) => (
        <div className='token-info'>
          <Image src={coin.image} alt={coin.name} width={32} height={32} />
          <div className='flex flex-col'>
            <span className='font-bold leading-tight'>{coin.name}</span>
            <span className='text-xs text-purple-100 uppercase font-medium'>{coin.symbol}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Price',
      cellClassName: 'price-cell font-semibold',
      cell: (coin) => formatPrice(coin.current_price),
    },
    {
      header: '24h Change',
      cellClassName: 'change-cell font-medium',
      cell: (coin) => {
        const isPositive = coin.price_change_percentage_24h > 0;
        return (
          <span className={cn(isPositive ? 'text-green-500' : 'text-red-500')}>
            {isPositive ? '+' : ''}
            {formatPercentage(coin.price_change_percentage_24h)}
          </span>
        );
      },
    },
    {
      header: 'Market Cap',
      cellClassName: 'market-cap-cell text-purple-100',
      cell: (coin) => formatPrice(coin.market_cap),
    },
  ];

  return (
    <main id='coins-page'>
      <div className='content container mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>Market Explorer</h1>

        <DataTable tableClassName='coins-table' columns={columns} data={coinsData} rowKey={(coin) => coin.id} />

        <div className='mt-8 flex justify-center'>
          <CoinsPagination currentPage={currentPage} totalPages={totalPagesEstimate} hasMorePages={hasMorePages} />
        </div>
      </div>
    </main>
  );
};

export default CoinsPage;
