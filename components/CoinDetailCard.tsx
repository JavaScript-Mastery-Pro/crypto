import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface CoinDetailCardProps {
  label: string;
  value: string | number;
  link?: string;
  linkText?: string;
}

export default function CoinDetailCard({
  label,
  value,
  link,
  linkText,
}: CoinDetailCardProps) {
  return (
    <div className='detail-card'>
      <p className='text-purple-100'>{label}</p>
      {link ? (
        <div className='detail-link'>
          <Link href={link} target='_blank'>
            {linkText || label}
          </Link>
          <ArrowUpRight size={16} />
        </div>
      ) : (
        <p className='text-base font-medium'>{value}</p>
      )}
    </div>
  );
}
