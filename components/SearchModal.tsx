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
import { useEffect, useState } from 'react';
import { cn, formatPercentage, formatPrice } from '@/lib/utils';

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
          {isLoading && <div className='search-empty'>Searching...</div>}

          {!isLoading &&
            searchQuery.trim().length === 0 &&
            initialTrendingCoins.length === 0 && (
              <div className='search-empty'>Type to search for coins...</div>
            )}

          {!isLoading &&
            searchQuery.trim().length === 0 &&
            initialTrendingCoins.length > 0 && (
              <CommandGroup
                heading={
                  <div className='search-heading'>
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

          {!isLoading &&
            searchQuery.trim().length > 0 &&
            searchResults.length === 0 && (
              <CommandEmpty>No coins found.</CommandEmpty>
            )}

          {!isLoading &&
            searchQuery.trim().length > 0 &&
            searchResults.length > 0 && (
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
                        {formatPercentage(
                          coin.data?.price_change_percentage_24h
                        )}
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
