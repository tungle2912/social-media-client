import { useInfiniteQuery } from '@tanstack/react-query';
import { Flex, Skeleton, Tabs } from 'antd';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IconTick } from '~/common/icon';
import { SearchParams } from '~/definitions/interfaces/interface';
import { QUERY_KEY } from '~/definitions/models';
import { ConversationFilterType } from '~/definitions/models/message';
import { messageApi } from '~/services/api/message.api';
import useListOnline from '~/stores/listOnline.data';
import styles from './styles.module.scss';
import { useSocket } from '~/provider/socketProvider';
const INIT_PARAMS = { pageIndex: 1, pageSize: 10 };
export default function ListMessage() {
  const t = useTranslations();
  const socket: any = useSocket();
  const listOnline = useListOnline((state) => state.listOnline);
  const [params, setParams] = useState<SearchParams>(INIT_PARAMS);
  const [openMoreMessage, setOpenMoreMessage] = useState<boolean>(false);
  const [moveEnterUuid, setMoveEnterUuid] = useState<string>('');
  const [activeKey, setActiveKey] = useState<string>(ConversationFilterType.ALL);
  const {
    data: listMessages,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingListMessages,
    isFetchingNextPage,
    refetch: refetchListMessage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.LIST_RECENT_MESSAGE, params],
    queryFn: ({ pageParam }) => {
      const cloneParams = { ...params, pageIndex: pageParam };
      //   if (cloneParams?.messageTime === MessageTime.ALL) {
      //     delete cloneParams.messageTime;
      //   }
      if (cloneParams?.conversationType === ConversationFilterType.ALL) {
        delete cloneParams.conversationType;
      }
      return messageApi.getConversationRecentMessage(cloneParams);
    },
    getNextPageParam: (lastPage: any) => {
      const nextPage = lastPage.pageIndex < lastPage?.totalPages ? lastPage.pageIndex + 1 : undefined;
      return nextPage;
    },
    // cacheTime: 5 * 60 * 1000,
    staleTime: 60 * 1000,
    initialPageParam: INIT_PARAMS.pageIndex, 
  });
  const flatListMessages = useMemo(() => {
    const onlineUsers = new Set(listOnline?.users?.map((user: any) => user._id));
    const oldData = listMessages?.pages.flatMap((page: any) => page.data) || [];
    return oldData?.map((item) => {
      item.isOnline = onlineUsers.has(item?.userInfo?.uuid) || false;
      return item;
    });
  }, [listMessages?.pages, listOnline]);
  const renderListMessage = () => {
    if (isLoadingListMessages) {
      return (
        <div className="flex justify-center mt-[20px] px-[20px]">
          <Skeleton />
        </div>
      );
    }
    const onNextPage = () => {
      if (!hasNextPage || isLoadingListMessages) {
        return;
      }
      fetchNextPage();
    };
    const onMouseMoveChatMessage = (action: string, uuid: string) => {
        if (action === 'enter') {
          setMoveEnterUuid(uuid);
        } else {
          setMoveEnterUuid('');
          setOpenMoreMessage(false);
        }
      };
    return (
      <InfiniteScroll
        dataLength={flatListMessages.length}
        next={onNextPage}
        hasMore={!!hasNextPage}
        loader={
          isFetchingNextPage ? (
            <div className="flex justify-center mt-[20px]">
              <Skeleton />
            </div>
          ) : null
        }
        height={`calc(100dvh - 314px)`}
        className="scroll-bar pl-[10px] pr-[6px] mr-[5px] pb-[5px]"
      >
        <div></div>
        {/* {flatListMessages.map((item: any, index: number) => (
          <MessageItem
            activeRoom={activeRoom}
            disableDeleteConversation={disableDeleteConversation}
            flatListMessagesLength={flatListMessages?.length}
            index={index}
            isLoadingDeleteConservation={isLoadingDeleteConservation}
            item={item}
            moveEnterUuid={moveEnterUuid}
            onDeleteConservation={onDeleteConservation}
            onMouseMoveChatMessage={onMouseMoveChatMessage}
            openMoreMessage={openMoreMessage}
            refetchListMessage={refetchListMessage}
            renderPreviewMsg={renderPreviewMsg}
            setActivityAccountInfo={setActivityAccountInfo}
            setActivityAccountType={setActivityAccountType}
            setOpenMoreMessage={setOpenMoreMessage}
            key={item.uuid}
          />
        ))} */}
      </InfiniteScroll>
    );
  };
  const tabs = [
    {
      key: ConversationFilterType.ALL,
      label: t('messageLocale.all'),
      element: renderListMessage(),
    },
    {
      key: ConversationFilterType.CONNECTED,
      label: t('messageLocale.connected'),
      element: renderListMessage(),
    },
    {
      key: ConversationFilterType.NON_CONNECTED,
      label: t('messageLocale.non-connected'),
      element: renderListMessage(),
    },
    {
      key: ConversationFilterType.GROUP,
      label: t('messageLocale.group'),
      element: renderListMessage(),
    },
  ];
  const onChangeTab = (tab: string) => {
    setActiveKey(tab);
    setParams({ ...params, conversationType: tab });
  };
  return (
    <>
      <div className="py-[24px] max-md:py-[16px]">
        <Flex justify="space-between" align="center" className="px-[16px]">
          <Flex align="center" className="max-lg:gap-[16px]">
            {/* <MobileMenu /> */}
            <span className="text-base-black font-bold text-[20px] max-md:text-[16px]">
              {t('messageLocale.message')}
            </span>
          </Flex>
          <div
            className="flex gap-[8px] items-center cursor-pointer"
            // onClick={() => markAllAsReadMessage.mutate(undefined)}
          >
            <IconTick />
            <span className="text-black-200 text-[12px] whitespace-nowrap">{t('messageLocale.markAllRead')}</span>
          </div>
        </Flex>
        <div className="mt-[8px]">
          <Tabs activeKey={activeKey} onChange={onChangeTab} className={classNames(styles.customTabs, 'message-tab')}>
            {tabs.map((tab) => {
              return (
                <Tabs.TabPane tab={tab.label} key={tab.key}>
                  {tab.element}
                </Tabs.TabPane>
              );
            })}
          </Tabs>
        </div>
      </div>
      {/* <GroupChat drawerCtrl={groupChatCtrl} refetchListMessage={refetchListMessage} /> */}
    </>
  );
}
