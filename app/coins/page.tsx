import { getCoinList } from '@/lib/coingecko.actions';
import { DataTable } from '@/components/DataTable';
import Image from 'next/image';
import Link from 'next/link';

import CoinsPagination from '@/components/CoinsPagination';
import { cn, formatPercentage, formatPrice } from '@/lib/utils';

const Coins = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const perPage = 10;

  const coinsData = await getCoinList(currentPage, perPage);

  // CoinGecko API doesn't return total count, so we determine pagination dynamically:
  // - If we receive fewer items than perPage, we're on the last page
  const hasMorePages = coinsData.length === perPage;

  // Smart pagination that expands as users navigate further
  // Starts at 100 pages, adds 100 more when user reaches page 100, 200, etc.
  const estimatedTotalPages =
    currentPage >= 100 ? Math.ceil(currentPage / 100) * 100 + 100 : 100;

  const columns = [
    {
      header: 'Rank',
      cellClassName: 'coins-rank',
      cell: (coin: CoinMarketData) => (
        <>
          #{coin.market_cap_rank}
          <Link
            href={`/coins/${coin.id}`}
            className='absolute inset-0 z-10'
            aria-label='View coin'
          />
        </>
      ),
    },
    {
      header: 'Token',
      cellClassName: 'coins-token',
      cell: (coin: CoinMarketData) => (
        <div className='coins-token-info'>
          <Image src={coin.image} alt={coin.name} width={36} height={36} />
          <p className='max-w-full truncate'>
            {coin.name} ({coin.symbol.toUpperCase()})
          </p>
        </div>
      ),
    },
    {
      header: 'Price',
      cellClassName: 'coins-price',
      cell: (coin: CoinMarketData) => formatPrice(coin.current_price),
    },
    {
      header: '24h Change',
      cellClassName: 'font-medium',
      cell: (coin: CoinMarketData) => {
        const isTrendingUp = coin.price_change_percentage_24h > 0;

        return (
          <span
            className={cn('coins-change', {
              'text-green-600': isTrendingUp,
              'text-red-500': !isTrendingUp,
            })}
          >
            {isTrendingUp && '+'}
            {formatPercentage(coin.price_change_percentage_24h)}
          </span>
        );
      },
    },
    {
      header: 'Market Cap',
      cellClassName: 'coins-market-cap',
      cell: (coin: CoinMarketData) => formatPrice(coin.market_cap),
    },
  ];

  return (
    <main className='coins-main'>
      <div className='flex flex-col w-full space-y-5'>
        <h4 className='text-2xl'>All Coins</h4>
        <div className='custom-scrollbar coins-container'>
          <DataTable
            columns={columns}
            data={coinsData}
            rowKey={(coin) => coin.id}
            headerClassName='coins-header'
          />
        </div>

        <CoinsPagination
          currentPage={currentPage}
          totalPages={estimatedTotalPages}
          hasMorePages={hasMorePages}
        />
      </div>
    </main>
  );
};

export default Coins;
