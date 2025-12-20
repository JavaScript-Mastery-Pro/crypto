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
    <header className='border-b border-dark-400 h-20'>
      <div className='container flex justify-between items-center h-full'>
        <Link href='/'>
          <Image
            src='/assets/logo.svg'
            alt='CoinPulse Logo'
            width={132}
            height={40}
          />
        </Link>

        <nav className='flex h-full items-center'>
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
                className={cn(
                  'px-6 py-5 flex items-center transition-all hover:text-white font-medium h-full text-purple-100 cursor-pointer',
                  {
                    'text-white': isActive,
                    'max-sm:hidden': item.label === 'Home',
                  }
                )}
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
