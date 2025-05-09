import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { QUERY_KEY } from '~/definitions/models';
import { useDimension } from '~/hooks';
import { useUnFollowMutation } from '~/hooks/data/user.data';
import useDebounce from '~/hooks/useDebounce';
import { contactApi } from '~/services/api/contact.api';
interface Props {
  userId: string;
}

export default function FriendTab({ userId }: Props) {
  const t = useTranslations();
  const { isSM: isMobile } = useDimension();
  const [params, setParams] = useState({
    pageIndex: 1,
    pageSize: 10,
    keyword: '',
  });
  const unfollowMutation = useUnFollowMutation();
  const [searchKeyword, setSearchKeyword] = useState('');
  const router = useRouter();
  const {
    data: dataResponse,
    isLoading: isLoadingList,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: userId ? [QUERY_KEY.LIST_FRIEND, userId, params] : [QUERY_KEY.MY_CONTACT, params],
    queryFn: ({ pageParam = 1 }) =>
      contactApi.getFriendById(userId, {
        search: params.keyword,
        page: pageParam,
        limit: params.pageSize,
      }),
    staleTime: 0,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.result.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
  const onSearch = useDebounce((event) => {
    setParams({ ...params, keyword: event?.target.value });
  }, 500);
  const dataContact = useMemo(() => {
    return dataResponse?.pages?.flatMap((page) => page.result.users) || [];
  }, [dataResponse]);
  return(
    <>
    
    </>
  )
}
