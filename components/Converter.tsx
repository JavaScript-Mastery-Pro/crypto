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
  const [amount, setAmount] = useState('10');

  // Calculate converted price
  const convertedPrice = (parseFloat(amount) || 0) * (priceList[currency] || 0);

  return (
    <div className='converter-container'>
      <div className='converter-input-wrapper'>
        <Input
          type='number'
          placeholder='Amount'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className='converter-input'
        />
        <div className='converter-coin-info'>
          <Image src={icon} alt={symbol} width={20} height={20} />
          <p className='converter-coin-symbol'>
            {symbol.toUpperCase()}
          </p>
        </div>
      </div>

      <div>
        <div className='converter-divider-wrapper'>
          <div className='converter-divider-line' />
          <Image
            src='/assets/converter.svg'
            alt='converter'
            width={32}
            height={32}
            className='converter-icon'
          />
        </div>
      </div>

      <div className='converter-output-wrapper'>
        <p className='text-base font-medium'>
          {formatPrice(convertedPrice, 2, currency, false)}
        </p>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger
            className='converter-select-trigger'
            value={currency}
          >
            <SelectValue placeholder='Select' className='flex gap-2'>
              <span className='converter-currency'>
                {currency.toUpperCase()}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className='converter-select-content'>
            {Object.keys(priceList).map((currencyCode) => (
              <SelectItem
                key={currencyCode}
                value={currencyCode}
                className='converter-select-item'
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
