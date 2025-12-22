import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoinCard from '../CoinCard';
import { fetcher } from '@/lib/coingecko.actions';

const TAB_CONFIG = [
  { value: 'top-gainers', label: 'Top Gainers', key: 'top_gainers' },
  { value: 'top-losers', label: 'Top Losers', key: 'top_losers' },
] as const;

const renderCoinCard = (coin: TopGainersLosersResponse) => (
  <CoinCard
    key={coin.id}
    id={coin.id}
    name={coin.name}
    symbol={coin.symbol}
    image={coin.image}
    price={coin.usd}
    priceChangePercentage24h={coin.usd_24h_change}
  />
);

export const TopGainersLosers = async () => {
  const data = await fetcher<{
    top_gainers: TopGainersLosersResponse[];
    top_losers: TopGainersLosersResponse[];
  }>('/coins/top_gainers_losers', { vs_currency: 'usd' });

  const topGainersLosers = {
    top_gainers: data.top_gainers?.slice(0, 4) ?? [],
    top_losers: data.top_losers?.slice(0, 4) ?? [],
  };

  return (
    <Tabs defaultValue='top-gainers' id='top-gainers-losers'>
      <TabsList className='tabs-list'>
        {TAB_CONFIG.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className='tabs-trigger'
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {TAB_CONFIG.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className='tabs-content'>
          {topGainersLosers[tab.key].map(renderCoinCard)}
        </TabsContent>
      ))}
    </Tabs>
  );
};
