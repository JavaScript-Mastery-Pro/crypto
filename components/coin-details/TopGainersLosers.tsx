import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoinCard from '../CoinCard';
import { getTopGainersLosers } from '@/lib/coingecko.actions';

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
    volume24={coin.usd_24h_vol}
    rank={coin.market_cap_rank}
  />
);

export const TopGainersLosers = async () => {
  const topGainersLosers = await getTopGainersLosers();

  return (
    <Tabs defaultValue='top-gainers' className='mt-8 w-full'>
      <TabsList className='size-full p-1 bg-transparent border-b border-dark-500 rounded-none '>
        {TAB_CONFIG.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className='data-[state=active]:border-none! data-[state=active]:bg-transparent! flex justify-start mb-0! py-2 text-lg font-semibold md:text-2xl'
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {TAB_CONFIG.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className='top-list'>
          {topGainersLosers[tab.key].map(renderCoinCard)}
        </TabsContent>
      ))}
    </Tabs>
  );
};
