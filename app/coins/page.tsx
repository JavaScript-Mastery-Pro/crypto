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

  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: 'Rank',
      cellClassName: 'rank-cell',
      cell: (coin) => (
        <>
          #{coin.market_cap_rank}
          <Link href={`/coins/${coin.id}`} aria-label='View coin' />
        </>
      ),
    },
    {
      header: 'Token',
      cellClassName: 'token-cell',
      cell: (coin) => (
        <div className='token-info'>
          <Image src={coin.image} alt={coin.name} width={36} height={36} />
          <p>
            {coin.name} ({coin.symbol.toUpperCase()})
          </p>
        </div>
      ),
    },
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: (coin) => formatPrice(coin.current_price),
    },
    {
      header: '24h Change',
      cellClassName: 'change-cell',
      cell: (coin) => {
        const isTrendingUp = coin.price_change_percentage_24h > 0;

        return (
          <span
            className={cn('change-value', {
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
      cellClassName: 'market-cap-cell',
      cell: (coin) => formatPrice(coin.market_cap),
    },
  ];

  return (
    <main id='coins-page'>
      <div className='content'>
        <h4>All Coins</h4>

        <DataTable
          tableClassName='coins-table'
          columns={columns}
          data={coinsData}
          rowKey={(coin) => coin.id}
        />

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
