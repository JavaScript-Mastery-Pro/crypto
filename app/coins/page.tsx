import { getCoinList } from '@/lib/actions/ coingecko';

const Coins = async () => {
  const coins = await getCoinList();
  console.log('Fetched coins:', coins);

  return (
    <main className='flex min-h-screen items-center justify-center'>
      <h1 className='max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50'>
        Coin List
      </h1>
    </main>
  );
};

export default Coins;
