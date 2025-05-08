import { Avatar, Dropdown, Empty, message, Spin } from 'antd';
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
import { useFollowMutation, useRejectFollowMutation } from '~/hooks/data/user.data';
import useDebounce from '~/hooks/useDebounce';
import { contactApi } from '~/services/api/contact.api';
import styles from './styles.module.scss';

const BeingInvited = () => {
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
  const rejectFollowMutation = useRejectFollowMutation();
  const followMutation = useFollowMutation();
  const {
    data: dataResponse,
    isLoading: isLoadingList,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.BEING_INVITED, params],
    queryFn: ({ pageParam = 1 }) =>
      contactApi.getFollowers({
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

  const renderListContact = () => {
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
                  <Avatar shape="circle" size={92} src={item?.avatar} />
                ) : (
                  <Avatar shape="circle" size={92}>
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
                  <p
                    onClick={async () => {
                      await followMutation.mutateAsync(item?._id, {
                        onSuccess: async () => {
                          await refetch();
                          message.success('Follow successfully', 3);
                        },
                      });
                    }}
                    className="rounded-[5px] bg-[#FFF8E5] flex px-[8px] py-[4px] items-center gap-[4px] w-[43px] text-xs not-italic font-bold text-[#E57A00] mr-[8px]"
                  >
                    {t('contact.follow')}
                  </p>
                </div>
              </div>

              <Button
                rounded="large"
                btnType="primary"
                className="w-[120px] max-sm:hidden"
                onClick={() => {
                  if (item?._id) {
                    followMutation.mutateAsync(item._id as string, {
                      onSuccess: async () => {
                        await refetch();
                        message.success(t('contact.acceptFollowSuccess'));
                      },
                    });
                  }
                }}
              >
                {t('contact.Accept')}
              </Button>
              <Button
                rounded="large"
                className="w-[120px] max-sm:hidden"
                onClick={() => {
                  if (item?._id) {
                    rejectFollowMutation.mutateAsync(item._id as string, {
                      onSuccess: async () => {
                        await refetch();
                        message.success(t('contact.rejectFollowSuccess'));
                      },
                    });
                  }
                }}
              >
                {t('contact.Remove')}
              </Button>
            </div>

            {/* <DropDownOption
              isMobile={isMobile}
              onOpenDisconnect={() => {
                setUuidsSelected([item._id]);
                setOpenDisconnect({ isOpen: true, multiple: false });
              }}
              setUserSelected={(param: any) => setUserSelected(param)}
              contactId={item?._id}
              onOpenUnFollow={() => {
                setOpenModalFollow(true);
                setDataFollow(item);
              }}
              dataItem={item}
              handleFollowing={handleFollowing}
              onOpenForward={() => {
                setOpenModalForward(true);
                setValueForward([item?._id]);
              }}
              checkedList={checkedList}
            /> */}
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
  onOpenDisconnect,
  contactId,
  isMobile,
  onOpenUnFollow,
  dataItem,
  handleFollowing,
  onOpenForward,
  checkedList,
  setUserSelected,
}: {
  onOpenDisconnect: () => void;
  contactId: any;
  isMobile: boolean;
  onOpenUnFollow: () => void;
  dataItem: any;
  handleFollowing: (item: any) => void;
  onOpenForward: () => void;
  checkedList: any[];
  setUserSelected: (param: any) => void;
}) => {
  const t = useTranslations();

  const defaultItem = [
    {
      key: '2',
      label: <p className="text-sm not-italic font-normal leading-[24px] text-[#3E3E3E]">{t('contact.disconnect')}</p>,
      icon: <CloseIcon />,
      onClick: () => {
        onOpenDisconnect();
      },
    },
    {
      key: '3',
      label: <p className="text-sm not-italic font-normal leading-[24px] text-[#3E3E3E]">{t('contact.forward')}</p>,
      icon: <ForwardIcon />,
      onClick: () => {
        onOpenForward();
        setUserSelected(dataItem?._id);
      },
    },
  ];

  const items = isMobile
    ? [
        {
          key: '5',
          label: (
            <p className="text-sm not-italic font-normal leading-[24px] text-[#3E3E3E]">
              {dataItem?.following ? t('contactLocale.following') : t('contactLocale.follow')}
            </p>
          ),
          icon: <FollowIcon />,
          onClick: () => {
            dataItem?.following ? onOpenUnFollow() : handleFollowing(dataItem);
          },
        },
        ...defaultItem,
      ]
    : [...defaultItem];

  return (
    <div>
      <Dropdown
        menu={{
          items,
        }}
        placement="bottomRight"
        trigger={['click']}
        getPopupContainer={(element: HTMLElement) => {
          return element;
        }}
        rootClassName={styles.dropdownOptions}
        disabled={checkedList?.length >= 2}
        className={checkedList?.length >= 2 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      >
        <div className=" bg-transparent rounded-[5px]">
          <ThreeDotBorderIcon />
        </div>
      </Dropdown>
    </div>
  );
};

export default BeingInvited;
