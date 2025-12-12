'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { useState } from 'react';

export const Converter = () => {
  const [selected, setSelected] = useState('btc');

  return (
    <div className='space-y-2 bg-dark-500 p-5 rounded-lg '>
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger
          className='w-full border-none cursor-pointer !h-12 !bg-dark-400 hover:!bg-dark-400 focus-visible:!ring-0'
          value={selected}
        >
          <SelectValue placeholder='Select' className='flex gap-2'>
            <span className='text-purple-100 font-semibold'>
              {selected.toUpperCase()}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='btc'>BTC</SelectItem>
          <SelectItem value='usdt'>USDT</SelectItem>
          <SelectItem value='eth'>ETH</SelectItem>
        </SelectContent>
      </Select>
      <div>
        <div className='relative flex justify-center items-center my-4'>
          <div className='h-[1px] z-10 w-full bg-dark-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ' />
          <Image
            src='/assets/icons/converter.svg'
            alt='converter'
            width={32}
            height={32}
            className='size-8 z-20 bg-dark-400 rounded-full p-2 text-green-500'
          />
        </div>
      </div>
      <div className='bg-dark-400 h-12 rounded-md flex items-center justify-center p-4'>
        <span className='font-semibold'>10.42</span>
      </div>
    </div>
  );
};
