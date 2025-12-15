import { getCoinList } from '@/lib/actions/ coingecko';
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
import { cn, formatPercentage, formatPrice } from '@/lib/utils';
import CoinsPagination from '@/components/CoinsPagination';

const Coins = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const perPage = 8;

  const coinsData = await getCoinList(currentPage, perPage);

  // CoinGecko API doesn't return total count, so we determine pagination dynamically:
  // - If we receive fewer items than perPage, we're on the last page
  const hasMorePages = coinsData.length === perPage;

  // Smart pagination that expands as users navigate further
  // Starts at 100 pages, adds 100 more when user reaches page 100, 200, etc.
  const estimatedTotalPages =
    currentPage >= 100 ? Math.ceil(currentPage / 100) * 100 + 100 : 100;

  return (
    <main className='py-12 container size-full items-center gap-10 justify-center'>
      <div className='flex flex-col w-full space-y-4'>
        <h4 className='text-2xl'>All Coins</h4>
        <Table className='bg-dark-500 rounded-lg overflow-hidden'>
          <TableHeader className='bg-dark-400 text-purple-100'>
            <TableRow className='hover:bg-transparent !border-purple-600 '>
              <TableHead className='pl-5 py-4 text-purple-100'>Rank</TableHead>
              <TableHead className='text-purple-100'>Token</TableHead>
              <TableHead className='text-purple-100'>Price</TableHead>
              <TableHead className='pr-8 text-purple-100'>24h Change</TableHead>
              <TableHead className='pr-8 text-purple-100'>Market Cap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coinsData.map((coin: CoinMarketData) => {
              const isTrendingUp = coin.price_change_percentage_24h > 0;
              return (
                <TableRow
                  key={coin.id}
                  className='text-lg hover:!bg-dark-400/30 !border-purple-600 cursor-pointer'
                >
                  <TableCell className='pl-5 !max-w-[80px] py-5 font-medium text-purple-100'>
                    #{coin.market_cap_rank}
                  </TableCell>
                  <TableCell className='py-3 font-semibold'>
                    <Link
                      href={`/coins/${coin.id}`}
                      className='flex items-center gap-3 hover:text-green-500 transition-colors'
                    >
                      <Image
                        src={coin.image}
                        alt={coin.name}
                        width={36}
                        height={36}
                      />
                      <p>
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </p>
                    </Link>
                  </TableCell>
                  <TableCell className='py-4 font-medium'>
                    {formatPrice(coin.current_price)}
                  </TableCell>
                  <TableCell className='font-medium'>
                    <span
                      className={cn('flex gap-1 items-center font-medium', {
                        'text-green-600': isTrendingUp,
                        'text-red-500': !isTrendingUp,
                      })}
                    >
                      {isTrendingUp && '+'}
                      {formatPercentage(coin.price_change_percentage_24h)}
                    </span>
                  </TableCell>
                  <TableCell className='pr-5 font-medium'>
                    {formatPrice(coin.market_cap)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

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
