import CoinDetailCard from './CoinDetailCard';
import { formatPrice } from '@/lib/utils';

export const CoinDetailsSection = ({
  coinData,
}: {
  coinData: CoinDetailsData;
}) => {
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

  return (
    <div className='w-full mt-8 space-y-4'>
      <h4 className='section-title pb-3'>Coin Details</h4>
      <div className='coin-details-grid'>
        {coinDetails.map((detail, index) => (
          <CoinDetailCard
            key={index}
            label={detail.label}
            value={detail.value}
            link={detail.link}
            linkText={detail.linkText}
          />
        ))}
      </div>
    </div>
  );
};
