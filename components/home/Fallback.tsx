import { Skeleton } from '../ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export const CategoriesFallback = () => (
  <div id='categories-fallback' className='custom-scrollbar'>
    <h4>Top Categories</h4>
    <Table>
      <TableHeader className='header'>
        <TableRow className='header-row'>
          <TableHead className='head head-left'>Category</TableHead>
          <TableHead className='head'>Top Gainers</TableHead>
          <TableHead className='head head-change'>24h Change</TableHead>
          <TableHead className='head'>Market Cap</TableHead>
          <TableHead className='head'>24h Volume</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 6 }).map((_, index) => (
          <TableRow key={index} className='row'>
            <TableCell className='category-cell'>
              <Skeleton className='skeleton category-skeleton' />
            </TableCell>
            <TableCell className='gainers-cell'>
              {Array.from({ length: 3 }).map((__, coinIndex) => (
                <Skeleton
                  key={coinIndex}
                  className='skeleton coin-skeleton'
                />
              ))}
            </TableCell>
            <TableCell className='value-cell'>
              <Skeleton className='skeleton value-skeleton-sm' />
            </TableCell>
            <TableCell className='value-cell'>
              <Skeleton className='skeleton value-skeleton-md' />
            </TableCell>
            <TableCell className='value-cell'>
              <Skeleton className='skeleton value-skeleton-lg' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export const CoinOverviewFallback = () => (
  <div id='coin-overview-fallback'>
    <div className='panel'>
      <div className='header'>
        <Skeleton className='skeleton header-image' />
        <div className='header-lines'>
          <Skeleton className='skeleton header-line-sm' />
          <Skeleton className='skeleton header-line-lg' />
        </div>
      </div>
      <Skeleton className='skeleton chart-skeleton' />
    </div>
  </div>
);

export const TrendingCoinsFallback = () => (
  <div id='trending-coins-fallback'>
    <h4>Trending Coins</h4>
    <div className='table-wrapper custom-scrollbar'>
      <Table>
        <TableHeader className='header'>
          <TableRow className='header-row'>
            <TableHead className='head head-left'>Name</TableHead>
            <TableHead className='head'>24h Change</TableHead>
            <TableHead className='head head-right'>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 6 }).map((_, index) => (
            <TableRow key={index} className='row'>
              <TableCell className='name-cell'>
                <div className='name'>
                  <Skeleton className='skeleton name-image' />
                  <Skeleton className='skeleton name-line' />
                </div>
              </TableCell>
              <TableCell className='change-cell'>
                <Skeleton className='skeleton change-line' />
              </TableCell>
              <TableCell className='price-cell'>
                <Skeleton className='skeleton price-line' />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);
