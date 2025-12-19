import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatPrice, timeAgo } from '@/lib/utils';
import Link from 'next/link';

export const ExchangeListings = ({
  coinData,
}: {
  coinData: CoinDetailsData;
}) => {
  return (
    <div className='w-full mt-8 space-y-4'>
      <h4 className='section-title'>Exchange Listings</h4>
      <div className='custom-scrollbar mt-5 exchange-container'>
        <Table>
          <TableHeader className='text-purple-100'>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='exchange-header-left'>Exchange</TableHead>
              <TableHead className='text-purple-100'>Pair</TableHead>
              <TableHead className='text-purple-100'>Price</TableHead>
              <TableHead className='exchange-header-right'>
                Last Traded
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coinData.tickers
              .slice(0, 7)
              .map((ticker: Ticker, index: number) => (
                <TableRow
                  key={index}
                  className='overflow-hidden rounded-lg hover:!bg-dark-400/30'
                >
                  <TableCell className=' text-green-500 font-bold'>
                    <Link
                      href={ticker.trade_url}
                      target='_blank'
                      className='exchange-link'
                    >
                      {ticker.market.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className='exchange-pair'>
                      <p className='truncate max-w-[100px] h-full'>
                        {ticker.base}
                      </p>
                      /
                      <p className='truncate max-w-[100px] h-full ml-2'>
                        {ticker.target}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className='font-medium'>
                    {formatPrice(ticker.converted_last.usd)}
                  </TableCell>
                  <TableCell className='exchange-timestamp'>
                    {timeAgo(ticker.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
