'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, TrendingUp, ArrowUpRight, ArrowDownRight, X } from 'lucide-react';
import useSWR from 'swr';
import { useDebounce, useKey } from 'react-use';

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
import { cn, formatPercentage, formatPrice } from '@/lib/utils';
import { SearchItemProps, TrendingCoin, SearchCoin } from '@/types';

const SearchItem = ({ coin, onSelect, isActiveName }: SearchItemProps) => {
  const price = coin.data?.price;

  // Cleanly extract percentage change based on data source
  const change =
    (coin as SearchCoin).data?.price_change_percentage_24h ??
    (coin as TrendingCoin['item']).data?.price_change_percentage_24h?.usd ??
    0;

  const isPositive = change >= 0;

  return (
    <CommandItem value={coin.id} onSelect={() => onSelect(coin.id)} className='search-item'>
      <div className='coin-info'>
        <Image src={coin.thumb} alt={coin.name} width={40} height={40} />

        <div>
          <p className={cn('font-bold', isActiveName && 'text-white')}>{coin.name}</p>
          <p className='coin-symbol'>{coin.symbol}</p>
        </div>
      </div>

      <div className='flex items-center gap-6 ml-auto'>
        {price !== undefined && <span className='coin-price text-base font-semibold'>{formatPrice(price)}</span>}

        <div
          className={cn('coin-change', {
            'text-green-500': isPositive,
            'text-red-500': !isPositive,
          })}
        >
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{formatPercentage(Math.abs(change))}</span>
        </div>
      </div>
    </CommandItem>
  );
};

export const SearchModal = ({ initialTrendingCoins = [] }: { initialTrendingCoins: TrendingCoin[] }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useDebounce(() => setDebouncedQuery(searchQuery.trim()), 300, [searchQuery]);

  const { data: searchResults = [], isValidating: isSearching } = useSWR<SearchCoin[]>(
    debouncedQuery ? ['coin-search', debouncedQuery] : null,
    ([, query]) => searchCoins(query as string),
    { revalidateOnFocus: false },
  );

  useKey(
    (e) => (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k',
    (e) => {
      e.preventDefault();
      setOpen((prev) => !prev);
    },
  );

  const handleSelect = (coinId: string) => {
    setOpen(false);
    setSearchQuery('');
    router.push(`/coins/${coinId}`);
  };

  const isQueryEmpty = !searchQuery.trim();
  const trendingCoins = initialTrendingCoins.slice(0, 5);

  return (
    <div id='search-modal'>
      <Button variant='ghost' onClick={() => setOpen(true)} className='trigger'>
        <SearchIcon size={18} />
        Search
        <kbd className='kbd'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} className='dialog'>
        <div className='cmd-input'>
          <CommandInput
            placeholder='Search for a token by name or symbol'
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </div>

        <CommandList className='list custom-scrollbar'>
          {isSearching && <div className='py-10 text-center text-purple-100 animate-pulse'>Scanning markets...</div>}

          {!searchResults.length && !isSearching && (
            <CommandEmpty className='py-10 text-center text-purple-100'>
              No assets found for &quot;{searchQuery}&quot;
            </CommandEmpty>
          )}

          {isQueryEmpty &&
            trendingCoins.length > 0 &&
            trendingCoins.map(({ item }) => (
              <SearchItem key={item.id} coin={item} onSelect={handleSelect} isActiveName={false} />
            ))}

          {!isQueryEmpty && !isSearching && (
            <CommandGroup heading='Search Results' className='group'>
              {searchResults.map((coin) => (
                <SearchItem key={coin.id} coin={coin} onSelect={handleSelect} isActiveName={true} />
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
};
