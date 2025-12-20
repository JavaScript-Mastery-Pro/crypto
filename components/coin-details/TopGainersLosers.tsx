import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoinCard from '../CoinCard';
import { getTopGainersLosers } from '@/lib/coingecko.actions';

export const TopGainersLosers = async () => {
  const topGainersLosers = await getTopGainersLosers();

  return (
    <Tabs defaultValue='top-gainers' className='mt-8  w-full'>
      <TabsList className='size-full p-1 bg-transparent border-b border-dark-500 rounded-none '>
        <TabsTrigger
          value='top-gainers'
          className='data-[state=active]:border-none! data-[state=active]:bg-transparent! flex justify-start mb-0! py-2 text-lg font-semibold md:text-2xl'
        >
          Top Gainers
        </TabsTrigger>
        <TabsTrigger
          value='top-losers'
          className='data-[state=active]:border-none! data-[state=active]:bg-transparent! flex justify-start mb-0! py-2 text-lg font-semibold md:text-2xl'
        >
          Top Losers
        </TabsTrigger>
      </TabsList>
      <TabsContent value='top-gainers' className='top-list'>
        {topGainersLosers.top_gainers.map((coin: TopGainersLosersResponse) => (
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
        ))}
      </TabsContent>
      <TabsContent value='top-losers' className='top-list'>
        {topGainersLosers.top_losers.map((coin: TopGainersLosersResponse) => (
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
        ))}
      </TabsContent>
    </Tabs>
  );
};
