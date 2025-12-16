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
import { Input } from './ui/input';
import { formatPrice } from '@/lib/utils';

export const Converter = ({ symbol, icon, priceList }: ConverterProps) => {
  const [currency, setCurrency] = useState('usd');
  const [amount, setAmount] = useState('1');

  // Calculate converted price
  const convertedPrice = (parseFloat(amount) || 0) * (priceList[currency] || 0);

  return (
    <div className='space-y-2 bg-dark-500 px-5 py-7 rounded-lg '>
      <div className='bg-dark-400 h-12 w-full rounded-md flex items-center justify-between py-4 pr-4'>
        <Input
          type='number'
          placeholder='Amount'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className='flex-1 !text-lg border-none font-medium !bg-dark-400 focus-visible:ring-0 shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
        />
        <div className='flex items-center gap-1'>
          <Image src={icon} alt={symbol} width={20} height={20} />
          <p className='font-semibold text-base text-purple-100'>
            {symbol.toUpperCase()}
          </p>
        </div>
      </div>

      <div>
        <div className='relative flex justify-center items-center my-4'>
          <div className='h-[1px] z-10 w-full bg-dark-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ' />
          <Image
            src='/assets/converter.svg'
            alt='converter'
            width={32}
            height={32}
            className='size-8 z-20 bg-dark-400 rounded-full p-2 text-green-500'
          />
        </div>
      </div>

      <div className='bg-dark-400 h-12 w-full rounded-md flex items-center justify-between py-4 pl-4'>
        <p className='text-base font-medium'>
          {formatPrice(convertedPrice, 2, currency, false)}
        </p>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger
            className='w-fit border-none cursor-pointer !h-12 !bg-dark-400 hover:!bg-dark-400 focus-visible:!ring-0'
            value={currency}
          >
            <SelectValue placeholder='Select' className='flex gap-2'>
              <span className='font-semibold text-sm text-purple-100'>
                {currency.toUpperCase()}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className='bg-dark-400'>
            {Object.keys(priceList).map((currencyCode) => (
              <SelectItem
                key={currencyCode}
                value={currencyCode}
                className='cursor-pointer hover:!bg-dark-500'
              >
                {currencyCode.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
