'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from './ui/button';
import { searchCoins } from '@/lib/ coingecko.actions';
import { Search as SearchIcon, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';

export const SearchModal = ({
  initialTrendingCoins = [],
}: {
  initialTrendingCoins: TrendingCoin[];
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchCoin[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search 300ms
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsLoading(true);
        try {
          const results = await searchCoins(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }

      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (coinId: string) => {
    setOpen(false);
    setSearchQuery('');
    router.push(`/coins/${coinId}`);
  };

  return (
    <>
      <Button
        variant='ghost'
        onClick={() => setOpen(true)}
        className='px-6 hover:!bg-transparent font-medium transition-all h-full cursor-pointer text-base text-purple-100 flex items-center gap-2'
      >
        <SearchIcon size={18} />
        Search
        <kbd className='pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100'>
          <span className='text-xs'>⌘</span>K
        </kbd>
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
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </div>
        <CommandList className='bg-dark-500 max-h-[400px] custom-scrollbar'>
          {isLoading ? (
            <div className='py-6 text-center text-sm text-gray-400'>
              Searching...
            </div>
          ) : searchQuery.trim().length === 0 ? (
            // Show trending coins when no search query
            initialTrendingCoins.length > 0 ? (
              <CommandGroup
                heading={
                  <div className='flex items-center gap-2 text-purple-100'>
                    <TrendingUp size={16} />
                    Trending Coins
                  </div>
                }
                className='bg-dark-500'
              >
                {initialTrendingCoins.slice(0, 8).map((trendingCoin) => {
                  const coin = trendingCoin.item;

                  return (
                    <CommandItem
                      key={coin.id}
                      value={coin.id}
                      onSelect={() => handleSelect(coin.id)}
                      className='grid grid-cols-[auto_1fr_auto] gap-4 items-center data-[selected=true]:bg-dark-400 transition-all cursor-pointer hover:!bg-dark-400/50 py-3'
                    >
                      <Image
                        src={coin.thumb}
                        alt={coin.name}
                        width={32}
                        height={32}
                        className='rounded-full'
                      />
                      <div className='flex flex-col'>
                        <p className='font-bold'>{coin.name}</p>
                        <p className='text-sm text-purple-100 uppercase'>
                          {coin.symbol}
                        </p>
                      </div>
                      {coin.data?.price && (
                        <span className='font-semibold text-green-500'>
                          {formatPrice(coin.data.price)}
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : (
              <div className='py-6 text-center text-sm text-gray-400'>
                Type to search for coins...
              </div>
            )
          ) : searchResults.length === 0 ? (
            <CommandEmpty>No coins found.</CommandEmpty>
          ) : (
            <CommandGroup heading='Search Results' className='bg-dark-500'>
              {searchResults.slice(0, 10).map((coin) => (
                <CommandItem
                  key={coin.id}
                  value={coin.id}
                  onSelect={() => handleSelect(coin.id)}
                  className='grid grid-cols-[auto_1fr_auto] gap-4 items-center data-[selected=true]:bg-dark-400 transition-all cursor-pointer hover:!bg-dark-400/50 py-3'
                >
                  <Image
                    src={coin.thumb}
                    alt={coin.name}
                    width={32}
                    height={32}
                    className='rounded-full'
                  />
                  <div className='flex flex-col'>
                    <p className='font-semibold'>{coin.name}</p>
                    <p className='text-sm text-purple-100 uppercase'>
                      {coin.symbol}
                    </p>
                  </div>
                  {coin.data?.price && (
                    <span className='font-semibold text-green-500'>
                      {formatPrice(coin.data.price)}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
