import { Avatar, Dropdown, Empty, message, Spin, Tag } from 'antd';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { useMemo, useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CloseIcon, FollowIcon, ForwardIcon, ThreeDotBorderIcon } from '~/common/icon';
import InputSearch from '~/common/inputSearch';
import SmartTooltip from '~/common/smartTooltip';
import Button from '~/components/form/Button';
import { QUERY_KEY } from '~/definitions/models';
import { useDimension } from '~/hooks';
import { useCloseFollowMutation, useFollowMutation, useUnFollowMutation } from '~/hooks/data/user.data';
import useDebounce from '~/hooks/useDebounce';
import { contactApi } from '~/services/api/contact.api';
import styles from './styles.module.scss';

const MyInvitation = () => {
  const t = useTranslations();
  const { isSM: isMobile } = useDimension();
  const [params, setParams] = useState({
    pageIndex: 1,
    pageSize: 10,
    keyword: '',
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [checkedList, setCheckedList] = useState<any>([]);
  const router = useRouter();

  const followMutation = useFollowMutation();

  const {
    data: dataResponse,
    isLoading: isLoadingList,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.MY_INVITATION, params],
    queryFn: ({ pageParam = 1 }) =>
      contactApi.getFollowings({
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
  const closeFollowMutation = useCloseFollowMutation();
  const onSearch = useDebounce((event) => {
    setParams({ ...params, keyword: event?.target.value });
  }, 500);
  const dataContact = useMemo(() => {
    return dataResponse?.pages?.flatMap((page) => page.result.users) || [];
  }, [dataResponse]);

  const renderListContact = () => {
    const handleCloseFollow = (id: string) => {
      closeFollowMutation.mutateAsync(id, {
        onSuccess: async () => {
          await refetch();
          message.success(t('contact.closeFollowSuccess'));
        },
        onError: () => {
          message.error(t('contact.closeFollowError'));
        },
      });
    };
    return dataContact?.map((item) => {
      return (
        <div
          className={classNames(styles.wrapItem, { [styles.active]: checkedList?.includes(item?.id) })}
          key={item?.id}
        >
          <div
            className={classNames(styles.wrapContent, {
              [styles.active]: checkedList?.includes(item?.id),
            })}
          >
            <div className={styles.wrapInfo}>
              <div className={styles.avatar} onClick={() => {}}>
                {item?.avatar ? (
                  <Avatar shape="circle" size={72} src={item?.avatar} />
                ) : (
                  <Avatar shape="circle" size={72}>
                    {item?.user_name?.slice(0, 1)}
                  </Avatar>
                )}
              </div>

              <div className={styles.info}>
                <div className="flex items-center">
                  <SmartTooltip
                    text={`${item?.user_name}`}
                    onClick={() => {}}
                    className="text-base not-italic font-bold text-[#3E3E3E] mr-[24px] max-w-[250px] max-sm:max-w-[150px] cursor-pointer hover:underline"
                  />{' '}
                </div>
              </div>

              <Tag className={classNames(styles.tag, styles.pending)}>
                <span className={styles.dot}></span>
                <p>Waiting</p>
              </Tag>
            </div>

            <DropDownOption contactId={item?._id} handleCloseFollow={handleCloseFollow} checkedList={checkedList} />
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div className={styles.wrap}>
        <InputSearch
          className={styles.customInputSearch}
          value={searchKeyword}
          placeholder={t('search')}
          onChange={(event) => {
            setSearchKeyword(event.target.value);
            onSearch(event);
          }}
        />
        <div className={styles.wrapList}>
          <Spin spinning={isLoadingList}>
            {dataContact?.length > 0 ? (
              <>
                <div className="flex flex-col">
                  <InfiniteScroll
                    dataLength={dataContact?.length || 0}
                    next={fetchNextPage}
                    hasMore={hasNextPage}
                    loader={
                      <div className="flex justify-center mt-[20px]">
                        <Spin />
                      </div>
                    }
                    className="scroll-bar pt-0 pb-10 px-[16px] mr-[5px] flex flex-col-reverse"
                  >
                    {renderListContact()}
                  </InfiniteScroll>
                </div>
              </>
            ) : (
              !isLoadingList && (
                <Empty
                  className="mt-[45px]"
                  description={
                    <div>
                      <p className="text-sm not-italic font-normal leading-[24px] text-[#3E3E3E]">
                        {t('contact.noListAvailable')}
                      </p>
                      <p className="text-sm not-italic font-normal leading-[24px] text-[#3E3E3E]">
                        {t('contact.connectFriends')}
                      </p>
                    </div>
                  }
                />
              )
            )}
          </Spin>
        </div>
      </div>
    </>
  );
};

const DropDownOption = ({
  contactId,
  handleCloseFollow,
  checkedList,
}: {
  contactId: string;
  handleCloseFollow: any;
  checkedList: any;
}) => {
  const t = useTranslations();

  const items = [
    {
      key: '1',
      label: <p className="text-sm not-italic font-normal leading-[24px] text-[#3E3E3E]">{t('contact.closeFollow')}</p>,
      icon: <CloseIcon />,
      onClick: () => handleCloseFollow(contactId),
    },
  ];

  return (
    <div>
      <Dropdown
        menu={{
          items,
        }}
        placement="bottomRight"
        trigger={['click']}
        getPopupContainer={(element) => element}
        rootClassName={styles.dropdownOptions}
        disabled={checkedList?.length >= 2}
        className={checkedList?.length >= 2 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      >
        <div className="bg-transparent rounded-[5px]">
          <ThreeDotBorderIcon />
        </div>
      </Dropdown>
    </div>
  );
};

export default MyInvitation;
