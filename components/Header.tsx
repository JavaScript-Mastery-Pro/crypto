'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navItems } from '@/lib/constants';
import { SearchModal } from './SearchModal';

export const Header = ({ trendingCoins = [] }: HeaderProps) => {
  const pathname = usePathname();

  return (
    <header>
      <div className='main-container inner'>
        <Link href='/'>
          <Image
            src='/assets/logo.svg'
            alt='CoinPulse Logo'
            width={132}
            height={40}
          />
        </Link>

        <nav>
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            if (item.label === 'Search') {
              return (
                <SearchModal
                  key={item.label}
                  initialTrendingCoins={trendingCoins}
                />
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn('nav-link', {
                  'is-active': isActive,
                  'is-home': item.label === 'Home',
                })}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
