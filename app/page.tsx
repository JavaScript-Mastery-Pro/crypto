import { Suspense } from 'react';

import {
  Categories,
  CategoriesFallback,
} from '@/components/home/Categories';
import {
  CoinOverview,
  CoinOverviewFallback,
} from '@/components/home/CoinOverview';
import {
  TrendingCoins,
  TrendingCoinsFallback,
} from '@/components/home/TrendingCoins';

const Home = () => {
  return (
    <main className='main-container'>
      <section className='home-grid'>
        <Suspense fallback={<CoinOverviewFallback />}>
          <CoinOverview />
        </Suspense>

        <Suspense fallback={<TrendingCoinsFallback />}>
          <TrendingCoins />
        </Suspense>
      </section>

      <section className='w-full mt-7 space-y-4'>
        <Suspense fallback={<CategoriesFallback />}>
          <Categories />
        </Suspense>
      </section>
    </main>
  );
};

export default Home;
