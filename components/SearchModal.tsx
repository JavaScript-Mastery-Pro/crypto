'use client';

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
import { searchCoins } from '@/lib/coingecko.actions';
import { Search as SearchIcon, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { cn, formatPercentage, formatPrice } from '@/lib/utils';
import useSWR from 'swr';
import { useDebounce, useKey } from 'react-use';

export const SearchModal = ({
  initialTrendingCoins = [],
}: {
  initialTrendingCoins: TrendingCoin[];
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useDebounce(
    () => {
      setDebouncedQuery(searchQuery.trim());
    },
    300,
    [searchQuery]
  );

  const {
    data: searchResults = [],
    isValidating: isSearching,
  } = useSWR<SearchCoin[]>(
    debouncedQuery ? ['coin-search', debouncedQuery] : null,
    ([, query]) => searchCoins(query as string),
    {
      revalidateOnFocus: false,
    }
  );

  useKey(
    (event) => event.key?.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey),
    (event) => {
      event.preventDefault();
      setOpen((prev) => !prev);
    },
    {},
    [setOpen]
  );

  const handleSelect = (coinId: string) => {
    setOpen(false);
    setSearchQuery('');
    setDebouncedQuery('');
    router.push(`/coins/${coinId}`);
  };

  const hasQuery = debouncedQuery.length > 0;
  const trendingCoins = initialTrendingCoins;
  const showTrending = !hasQuery && trendingCoins.length > 0;

  return (
    <>
      <Button
        variant='ghost'
        onClick={() => setOpen(true)}
        className='search-button'
      >
        <SearchIcon size={18} />
        Search
        <kbd className='search-kbd'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </Button>

      {/* Dialog */}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className='search-dialog'
      >
        <div className='bg-dark-500'>
          <CommandInput
            className='placeholder:text-purple-100'
            placeholder='Search for a token by name or symbol...'
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </div>

        <CommandList className='custom-scrollbar search-list'>
          {isSearching && <div className='search-empty'>Searching...</div>}

          {!isSearching && !hasQuery && !showTrending && (
            <div className='search-empty'>Type to search for coins...</div>
          )}

          {!isSearching && showTrending && (
            <CommandGroup
              heading={
                <div className='search-heading'>
                  <TrendingUp size={16} />
                  Trending Coins
                </div>
              }
              className='bg-dark-500'
            >
              {trendingCoins.slice(0, 8).map((trendingCoin) => {
                const coin = trendingCoin.item;

                return (
                  <CommandItem
                    key={coin.id}
                    value={coin.id}
                    onSelect={() => handleSelect(coin.id)}
                    className='search-item'
                  >
                    <div className='search-coin-info'>
                      <Image
                        src={coin.thumb}
                        alt={coin.name}
                        width={32}
                        height={32}
                        className='search-coin-image'
                      />
                      <div className='flex flex-col'>
                        <p className='font-bold'>{coin.name}</p>
                        <p className='search-coin-symbol'>{coin.symbol}</p>
                      </div>
                    </div>

                    <span className='search-coin-price'>
                      {formatPrice(coin.data.price)}
                    </span>

                    <p
                      className={cn('search-coin-change', {
                        'text-green-500':
                          coin.data.price_change_percentage_24h.usd > 0,
                        'text-red-500':
                          coin.data.price_change_percentage_24h.usd < 0,
                      })}
                    >
                      {formatPercentage(
                        coin.data.price_change_percentage_24h.usd
                      )}
                    </p>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {!isSearching && hasQuery && searchResults.length === 0 && (
            <CommandEmpty>No coins found.</CommandEmpty>
          )}

          {!isSearching && hasQuery && searchResults.length > 0 && (
            <CommandGroup
              heading={<p className='search-heading'>Search Results</p>}
              className='search-group'
            >
              {searchResults.slice(0, 10).map((coin) => {
                return (
                  <CommandItem
                    key={coin.id}
                    value={coin.id}
                    onSelect={() => handleSelect(coin.id)}
                    className='search-item'
                  >
                    <div className='search-coin-info'>
                      <Image
                        src={coin.thumb}
                        alt={coin.name}
                        width={32}
                        height={32}
                        className='search-coin-image'
                      />
                      <div className='flex flex-col'>
                        <p className='font-bold text-white'>{coin.name}</p>
                        <p className='search-coin-symbol'>{coin.symbol}</p>
                      </div>
                    </div>

                    {coin.data?.price && (
                      <span className='search-coin-price'>
                        {formatPrice(coin.data.price)}
                      </span>
                    )}

                    <p
                      className={cn('search-coin-change', {
                        'text-green-500':
                          coin.data?.price_change_percentage_24h > 0,
                        'text-red-500':
                          coin.data?.price_change_percentage_24h < 0,
                      })}
                    >
                      {formatPercentage(coin.data?.price_change_percentage_24h)}
                    </p>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
