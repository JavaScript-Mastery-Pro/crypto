import { getCoinList } from '@/lib/coingecko.actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

  return (
    <main className='coins-main'>
      <div className='flex flex-col w-full space-y-5'>
        <h4 className='text-2xl'>All Coins</h4>
        <div className='custom-scrollbar coins-container'>
          <Table>
            <TableHeader className='coins-header'>
              <TableRow className='coins-header-row'>
                <TableHead className='coins-header-left'>Rank</TableHead>
                <TableHead className='text-purple-100'>Token</TableHead>
                <TableHead className='text-purple-100'>Price</TableHead>
                <TableHead className='coins-header-right'>24h Change</TableHead>
                <TableHead className='coins-header-right'>Market Cap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coinsData.map((coin: CoinMarketData) => {
                const isTrendingUp = coin.price_change_percentage_24h > 0;

                return (
                  <TableRow key={coin.id} className='coins-row relative'>
                    <TableCell className='coins-rank'>
                      #{coin.market_cap_rank}
                      <Link
                        href={`/coins/${coin.id}`}
                        className='absolute inset-0 z-10'
                        aria-label='View coin'
                      />
                    </TableCell>
                    <TableCell className='coins-token'>
                      <div className='coins-token-info'>
                        <Image
                          src={coin.image}
                          alt={coin.name}
                          width={36}
                          height={36}
                        />
                        <p className='max-w-full truncate'>
                          {coin.name} ({coin.symbol.toUpperCase()})
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className='coins-price'>
                      {formatPrice(coin.current_price)}
                    </TableCell>
                    <TableCell className='font-medium'>
                      <span
                        className={cn('coins-change', {
                          'text-green-600': isTrendingUp,
                          'text-red-500': !isTrendingUp,
                        })}
                      >
                        {isTrendingUp && '+'}
                        {formatPercentage(coin.price_change_percentage_24h)}
                      </span>
                    </TableCell>
                    <TableCell className='coins-market-cap'>
                      {formatPrice(coin.market_cap)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
