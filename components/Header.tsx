'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SearchModal } from './SearchModal';


export const Header = ({ trendingCoins = [] }: HeaderProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header>
      <div className='inner main-container'>
        <Link href='/'>
          <Image src='/assets/logo.svg' alt='CoinPulse Logo' width={132} height={40} priority />
        </Link>

        <nav>
          <Link
            href='/'
            className={cn('nav-link is-home', {
              'is-active': isActive('/'),
            })}
          >
            Home
          </Link>

          {/* Search Trigger - Integrated into Nav Flow */}
          <SearchModal initialTrendingCoins={trendingCoins} />

          <Link
            href='/coins'
            className={cn('nav-link', {
              'is-active': isActive('/coins'),
            })}
          >
            All Coins
          </Link>
        </nav>
      </div>
    </header>
  );
};
