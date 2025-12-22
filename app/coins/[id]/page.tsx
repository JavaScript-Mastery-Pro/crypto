import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { getCoinDetails, getCoinOHLC, fetchPools, fetchTopPool } from '@/lib/coingecko.actions';
import { Converter } from '@/components/coin-details/Converter';
import { TopGainersLosers } from '@/components/coin-details/TopGainersLosers';
import LiveDataWrapper from '@/components/LiveDataWrapper';
import { DataTable } from '@/components/DataTable';
import { formatPrice, timeAgo } from '@/lib/utils';

export default async function CoinDetailsPage({ params }: CoinDetailsPageProps) {
  const { id } = await params;

  const [coinData, coinOHLCData] = await Promise.all([getCoinDetails(id), getCoinOHLC(id, 1, 'usd', 'hourly', 'full')]);

  const platformId = coinData.asset_platform_id;
  const platform = platformId ? coinData.detail_platforms?.[platformId] : null;
  const network = platform?.geckoterminal_url?.split('/')[3] ?? null;
  const contractAddress = platform?.contract_address ?? null;

  const pool = network && contractAddress ? await fetchTopPool(network, contractAddress) : await fetchPools(id);

  const marketStats = [
    { label: 'Market Cap', value: formatPrice(coinData.market_data.market_cap.usd) },
    { label: 'Rank', value: `#${coinData.market_cap_rank}` },
    { label: 'Volume', value: formatPrice(coinData.market_data.total_volume.usd) },
    { label: 'Website', link: coinData.links.homepage[0], linkText: 'Official Site' },
    { label: 'Explorer', link: coinData.links.blockchain_site[0], linkText: 'Blockchain' },
    { label: 'Community', link: coinData.links.subreddit_url, linkText: 'Reddit' },
  ];

  const exchangeColumns: DataTableColumn<Ticker>[] = [
    {
      header: 'Exchange',
      cellClassName: 'exchange-name',
      cell: (ticker) => (
        <>
          {ticker.market.name}
          <Link href={ticker.trade_url} target='_blank' />
        </>
      ),
    },
    {
      header: 'Pair',
      cell: (ticker) => (
        <div
          className='pair font-medium text-purple-100 truncate max-w-[120px]'
          title={`${ticker.base}/${ticker.target}`}
        >
          {ticker.base}/{ticker.target}
        </div>
      ),
    },
    {
      header: 'Price',
      cellClassName: 'price-cell font-bold',
      cell: (ticker) => formatPrice(ticker.converted_last.usd),
    },
    {
      header: 'Last Traded',
      cellClassName: 'time-cell text-end text-purple-100 text-sm',
      cell: (ticker) => timeAgo(ticker.timestamp),
    },
  ];

  return (
    <main id='coin-details-page'>
      <section className='primary'>
        <LiveDataWrapper coinId={id} poolId={pool?.id || ''} coin={coinData} coinOHLCData={coinOHLCData}>
          <div className='exchange-section'>
            <h4>Exchange Listings</h4>
            <DataTable
              tableClassName='exchange-table'
              columns={exchangeColumns}
              data={coinData.tickers.slice(0, 7)}
              rowKey={(ticker: Ticker, index: number) => `${ticker.market.name}-${ticker.target}-${index}`}
              bodyCellClassName='py-3!'
            />
          </div>
        </LiveDataWrapper>
      </section>

      <section className='secondary'>
        <Converter
          symbol={coinData.symbol}
          icon={coinData.image.small}
          priceList={coinData.market_data.current_price}
        />

        <div className='details'>
          <h4>Asset Information</h4>
          <ul className='details-grid'>
            {marketStats.map((stat, index) => (
              <li key={index}>
                <p className='label'>{stat.label}</p>
                {stat.link ? (
                  <div className='link'>
                    <Link href={stat.link} target='_blank'>
                      {stat.linkText}
                    </Link>
                    <ArrowUpRight size={14} className='opacity-70' />
                  </div>
                ) : (
                  <p className='value font-bold'>{stat.value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
        <TopGainersLosers />
      </section>
    </main>
  );
}
