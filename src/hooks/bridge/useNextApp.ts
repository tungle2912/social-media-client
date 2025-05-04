import { useRouter } from 'next/router';
import {
  usePathname as usePathnameNext,
  useSearchParams as useSearchParamsNext,
  useParams as useParamsNext,
} from 'next/navigation';

const usePathname = () => {
  const pathname = usePathnameNext();

  return pathname || '';
};

const useSearchParams = () => {
  const searchParams = useSearchParamsNext();

  return searchParams;
};

const useParams = () => {
  const params = useParamsNext();

  return (params || {}) as any;
};

export { usePathname, useSearchParams, useParams, useRouter };
