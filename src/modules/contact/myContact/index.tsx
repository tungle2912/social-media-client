import { Avatar, Checkbox, Dropdown, Empty, Spin } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

import { useMemo, useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CloseIcon, FollowIcon, ForwardIcon, ThreeDotBorderIcon } from '~/common/icon';
import SmartTooltip from '~/common/smartTooltip';
import Button from '~/components/form/Button';
import { QUERY_KEY } from '~/definitions/models';
import { useDimension } from '~/hooks';
import { handleError } from '~/lib/utils';
import { contactApi } from '~/services/api/contact.api';
import styles from './styles.module.scss';
import { useRouter } from 'next/navigation';
import InputSearch from '~/common/inputSearch';
import useDebounce from '~/hooks/useDebounce';

interface IPropsMyContact {}

const MyContact = ({}: IPropsMyContact) => {
  const t = useTranslations();
  const { isSM: isMobile } = useDimension();
  const [noticeModal, setNoticeModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });
  const [openDisconnect, setOpenDisconnect] = useState<{ isOpen: boolean; multiple?: boolean }>({
    isOpen: false,
    multiple: false,
  });
  const [params, setParams] = useState({
    pageIndex: 1,
    pageSize: 10,
    keyword: '',
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [openShareInvite, setOpenShareInvite] = useState<boolean>(false);
  const [uuidSelected, setUuiSelected] = useState<string>('');
  const [uuidsSelected, setUuidsSelected] = useState<string[]>([]);
  const [checkedList, setCheckedList] = useState<any>([]);
  const [openModalFollow, setOpenModalFollow] = useState<boolean>(false);
  const [openModalForward, setOpenModalForward] = useState<boolean>(false);
  const [dataFollow, setDataFollow] = useState();
  const [valueForward, setValueForward] = useState<any>([]);
  const [userSelected, setUserSelected] = useState<any>();
  const router = useRouter();

  //   const { mutate: connectionsBulkDeleteMutate, isLoading: isLoadingConnectionBulkDelete } = useMutation({
  //     mutationKey: ['connections-bulk-delete'],
  //     mutationFn: (payload: { userUuids: string[] }) => connect.connectionsBulkDelete(payload),
  //   });

  const {
    data: dataResponse,
    isLoading: isLoadingList,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.MY_CONTACT, params],
    queryFn: ({ pageParam = 1 }) =>
      contactApi.getFriends({
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

  const allValueId = useMemo(() => {
    return dataContact?.map((it) => it?.id);
  }, [dataContact]);

  const handleFollowing = async (item: any) => {};

  const onChangeCheckBox = (checkedValue: any) => {
    setCheckedList(checkedValue);
  };

  const onChangeAll = (e: any) => {
    setCheckedList(e?.target?.checked ? allValueId : []);
  };

  const onConfirmDisconnectMulti = () => {
    const userUuids: string[] = [];
    dataContact?.forEach((contact) => {
      if (checkedList.includes(contact.id)) {
        userUuids.push(contact.user.uuid);
      }
    });
    setUuidsSelected(userUuids);
    setOpenDisconnect({ isOpen: true, multiple: true });
  };

  const onDisconnectMultiple = () => {};

  const renderListContact = () => {
    return dataContact?.map((item) => {
      const checkShowNew = dayjs().diff(dayjs(item?.createdAt), 'hour') <= 72;
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
            <Checkbox value={item?.id} />
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
                  {checkShowNew && (
                    <p className="rounded-[5px] bg-[#FFF8E5] flex px-[8px] py-[4px] items-center gap-[4px] w-[43px] text-xs not-italic font-bold text-[#E57A00] mr-[8px]">
                      {t('contact.new')}
                    </p>
                  )}
                  <SmartTooltip
                    text={`${item?.user_name}`}
                    onClick={() => {}}
                    className="text-base not-italic font-bold text-[#3E3E3E] mr-[24px] max-w-[250px] max-sm:max-w-[150px] cursor-pointer hover:underline"
                  />
                </div>
              </div>

              <Button
                rounded="large"
                className="w-[120px] max-sm:hidden"
                onClick={() => router.push(`/message?roomId=${item?.conversationId}`)}
              >
                {t('contact.message')}
              </Button>
            </div>

            <DropDownOption
              isMobile={isMobile}
              onOpenDisconnect={() => {
                setUuiSelected(item?.user?.uuid);
                setOpenDisconnect({ isOpen: true });
              }}
              setUserSelected={(param: any) => setUserSelected(param)}
              contactId={item?.id}
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
            />
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
                <div className="max-sm:bg-[#F7F7F7] max-sm:h-[40px] flex items-center gap-[40px] max-xs:gap-[4px] max-xs:pr-4">
                  <Checkbox
                    className={classNames(styles.checkboxAll, 'w-fit')}
                    indeterminate={checkedList?.length > 0 && checkedList?.length < allValueId.length}
                    checked={allValueId.length === checkedList?.length}
                    onChange={onChangeAll}
                  >
                    {t('contact.selectAll')}
                  </Checkbox>
                  {checkedList?.length > 0 && (
                    <>
                      <div
                        className={styles.btnActionAll}
                        onClick={() => {
                          setOpenModalForward(true);
                          const userUuids = dataContact
                            ?.filter((i) => checkedList?.includes(i?.id))
                            ?.map((_i) => _i?.user?.uuid);
                          setValueForward(userUuids);
                        }}
                      >
                        <ForwardIcon />
                        <p className="text-sm not-italic font-normal leading-[24px] text-[#3E3E3E]">
                          {' '}
                          {t('contact.forward')}
                        </p>
                      </div>

                      <div className={styles.btnActionAll} onClick={() => onConfirmDisconnectMulti()}>
                        <CloseIcon />
                        <p className="text-sm not-italic font-normal leading-[24px] text-[#3E3E3E]">
                          {' '}
                          {t('contact.disconnect')}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-col pt-[8px]">
                  <Checkbox.Group value={checkedList} onChange={onChangeCheckBox}>
                    <InfiniteScroll
                      dataLength={dataContact?.length || 0}
                      next={fetchNextPage}
                      hasMore={hasNextPage}
                      loader={
                        <div className="flex justify-center mt-[20px]">
                          <Spin />
                        </div>
                      }
                      className="scroll-bar py-10 px-[16px] mr-[5px] flex flex-col-reverse"
                    >
                      {renderListContact()}
                    </InfiniteScroll>
                  </Checkbox.Group>
                </div>
              </>
            ) : (
              !isLoadingList && (
                <Empty
                  className="mt-[145px]"
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

export default MyContact;
