import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import {
  getCoinDetails,
  getCoinOHLC,
  fetchPools,
  fetchTopPool,
} from '@/lib/coingecko.actions';
import { Converter } from '@/components/coin-details/Converter';
import LiveDataWrapper from '@/components/LiveDataWrapper';
import { TopGainersLosers } from '@/components/coin-details/TopGainersLosers';
import { DataTable } from '@/components/DataTable';
import { formatPrice, timeAgo } from '@/lib/utils';

const CoinDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const coinData = await getCoinDetails(id);
  const coinOHLCData = await getCoinOHLC(id, 1, 'usd', 'hourly', 'full');

  const platform = coinData.asset_platform_id
    ? coinData.detail_platforms[coinData.asset_platform_id]
    : null;

  const network = platform?.geckoterminal_url.split('/')[3] || null;
  const contractAddress = platform?.contract_address || null;

  const pool =
    network && contractAddress
      ? await fetchTopPool(network, contractAddress)
      : await fetchPools(id);

  const coinDetails = [
    {
      label: 'Market Cap',
      value: formatPrice(coinData.market_data.market_cap.usd),
    },
    {
      label: 'Market Cap Rank',
      value: `# ${coinData.market_cap_rank}`,
    },
    {
      label: 'Total Volume',
      value: formatPrice(coinData.market_data.total_volume.usd),
    },
    {
      label: 'Website',
      value: '-',
      link: coinData.links.homepage[0],
      linkText: 'Website',
    },
    {
      label: 'Explorer',
      value: '-',
      link: coinData.links.blockchain_site[0],
      linkText: 'Explorer',
    },
    {
      label: 'Community Link',
      value: '-',
      link: coinData.links.subreddit_url,
      linkText: 'Community',
    },
  ];

  const exchangeColumns: DataTableColumn<Ticker>[] = [
    {
      header: 'Exchange',
      cellClassName: 'exchange-name',
      cell: (ticker) => (
        <>
          {ticker.market.name}

          <Link
            href={ticker.trade_url}
            target='_blank'
            aria-label='View coin'
          />
        </>
      ),
    },
    {
      header: 'Pair',
      cell: (ticker) => (
        <div className='pair'>
          <p>{ticker.base}</p>
          <span>/</span>
          <p>{ticker.target}</p>
        </div>
      ),
    },
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: (ticker) => formatPrice(ticker.converted_last.usd),
    },
    {
      header: 'Last Traded',
      headClassName: 'text-end',
      cellClassName: 'time-cell',
      cell: (ticker) => timeAgo(ticker.timestamp),
    },
  ];

  return (
    <main id='coin-details-page'>
      <section className='primary'>
        <LiveDataWrapper
          coinId={id}
          poolId={pool.id}
          coin={coinData}
          coinOHLCData={coinOHLCData}
        >
          <div className='exchange-section'>
            <h4>Exchange Listings</h4>

            <DataTable
              tableClassName='exchange-table'
              columns={exchangeColumns}
              data={coinData.tickers.slice(0, 7)}
              rowKey={(_, index) => index}
              bodyCellClassName='py-2!'
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
          <h4>Coin Details</h4>

          <ul className='details-grid'>
            {coinDetails.map(({ label, value, link, linkText }, index) => (
              <li key={index}>
                <p className='label'>{label}</p>

                {link ? (
                  <div className='link'>
                    <Link href={link} target='_blank'>
                      {linkText || label}
                    </Link>
                    <ArrowUpRight size={16} />
                  </div>
                ) : (
                  <p className='text-base font-medium'>{value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <TopGainersLosers />
      </section>
    </main>
  );
};

export default CoinDetails;
