import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoinCard from '../CoinCard';
import { getTopGainersLosers } from '@/lib/coingecko.actions';

const TAB_CONFIG = [
  { value: 'top-gainers', label: 'Top Gainers', key: 'top_gainers' as const },
  { value: 'top-losers', label: 'Top Losers', key: 'top_losers' as const },
];

export const TopGainersLosers = async () => {
  const data = await getTopGainersLosers();

  return (
    <div id='top-gainers-losers'>
      <Tabs defaultValue='top-gainers' className='w-full'>
        <TabsList className='tabs-list'>
          {TAB_CONFIG.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className='tabs-trigger'>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_CONFIG.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className='tabs-content space-y-3'>
            {data[tab.key].map((coin) => (
              <CoinCard key={coin.id} coin={coin} />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
