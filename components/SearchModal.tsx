'use client';

import * as React from 'react';
import Image from 'next/image';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Button } from './ui/button';
import { coins } from '@/lib/constants';
import { cn, formatPercentage, formatPrice } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

export const SearchModal = () => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Button
        variant='ghost'
        onClick={() => setOpen(true)}
        className='px-6 hover:!bg-transparent font-medium transition-all h-full cursor-pointer text-base text-purple-100'
      >
        Search
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className='!bg-dark-400 !max-w-2xl'
      >
        <div className='bg-dark-500'>
          <CommandInput
            className='placeholder:text-purple-100'
            placeholder='Search for a token by name or symbol...'
          />
        </div>
        <CommandList className='bg-dark-500'>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading='Trending coins' className='bg-dark-500'>
            {coins.map((coin, index) => {
              const isTrendingUp =
                coin.coinData.market_data
                  .price_change_percentage_24h_in_currency.usd > 0;

              return (
                <CommandItem
                  key={index}
                  className='grid grid-cols-4 gap-2 data-[selected=true]:bg-dark-500 transition-all cursor-pointer hover:!bg-dark-400/50'
                >
                  <div className='flex col-span-2 items-center gap-3'>
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={30}
                      height={30}
                    />
                    <p>
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </p>
                  </div>
                  <p className='text-right'>
                    {formatPrice(coin.market_data.current_price.usd)}
                  </p>

                  <div
                    className={cn(
                      'flex max-w-[100px] gap-1 items-center justify-end text-sm font-medium',
                      isTrendingUp ? 'text-green-500' : 'text-red-500'
                    )}
                  >
                    <p>
                      {formatPercentage(
                        coin.coinData.market_data
                          .price_change_percentage_24h_in_currency.usd
                      )}
                    </p>
                    {isTrendingUp ? (
                      <TrendingUp
                        width={16}
                        height={16}
                        className='text-green-500'
                      />
                    ) : (
                      <TrendingDown
                        width={16}
                        height={16}
                        className='text-red-500'
                      />
                    )}
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
};
