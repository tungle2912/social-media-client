/* eslint-disable react-hooks/rules-of-hooks */
import { useInfiniteQuery } from '@tanstack/react-query';
import { Flex, message, Skeleton, Tabs } from 'antd';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IconTick } from '~/common/icon';
import { SearchParams } from '~/definitions/interfaces/interface';
import { QUERY_KEY } from '~/definitions/models';
import { ConversationFilterType } from '~/definitions/models/message';
import useConfirm from '~/hooks/useConfirm';
import { useSocket } from '~/provider/socketProvider';
import { messageApi } from '~/services/api/message.api';
import useListOnline from '~/stores/listOnline.data';
import styles from './styles.module.scss';

import { useRouter, useSearchParams } from 'next/navigation';
import { useDeleteConservationMutation } from '~/hooks/data/conservation.data';
import ListMessageItem from '~/modules/message/listMessage/messageItem';
import useActivityAccountInfo from '~/stores/activityAccountInfo.store';
const INIT_PARAMS = { pageIndex: 1, pageSize: 10 };
export default function ListMessage() {
  const t = useTranslations();
  const router = useRouter();
  const socket: any = useSocket();
  const searchParams = useSearchParams();
  const { mutate, isPending: isLoadingDeleteConservation } = useDeleteConservationMutation();
  const listOnline = useListOnline((state) => state.listOnline);
  const [params, setParams] = useState<SearchParams>(INIT_PARAMS);
  const [openMoreMessage, setOpenMoreMessage] = useState<boolean>(false);
  const [moveEnter_id, setMoveEnter_id] = useState<string>('');
  const [activeKey, setActiveKey] = useState<string>(ConversationFilterType.ALL);
  const [activeRoom, setActiveRoom] = useState<string | undefined>(undefined);
  const [oldRoom, setOldRoom] = useState<string | undefined>(undefined);
  const setActivityAccountInfo = useActivityAccountInfo((state) => state.setUserInfo);
  const setActivityAccountType = useActivityAccountInfo((state) => state.setType);
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
  useEffect(() => {
    if (searchParams?.get('roomId') && !!socket) {
      const roomId = searchParams.get('roomId') || undefined;
      setActiveRoom(roomId);
      if (oldRoom) {
        socket.emit('leave-room', {
          room: oldRoom,
        });
      }
      socket.emit('join-room', {
        room: roomId,
      });
      setOldRoom(roomId);
    }
  }, [searchParams?.get('roomId')]);
  const flatListMessages = useMemo(() => {
    const oldData = listMessages?.pages.flatMap((page: any) => page.data) || [];
    return oldData?.map((item) => {
      console.log('itemitem', item);
      item.isOnline = Array.from(listOnline).includes(item?.partner?._id) || false;
      return item;
    });
  }, [listMessages?.pages, listOnline]);
  const settingConfirm = {
    width: 560,
    textCancel: t('modalConfirm.no'),
    textOk: t('modalConfirm.yes'),
    title: t('modalConfirm.message'),
    description: (
      <div>
        <p className="text-[#636363]">{t('conversation.deleteConfirmation.title')}</p>
        <p className="text-[#636363]">{t('conversation.deleteConfirmation.description')}</p>
      </div>
    ),
    isLoadingOk: isLoadingDeleteConservation,
  };
  const onDeleteConservation = (event: any, conservation_id: string) => {
    event.stopPropagation();
    useConfirm({
      ...settingConfirm,
      onOk: async () =>
        mutate(conservation_id, {
          onSuccess: () => {
            message.success(t('messageLocale.deleteConversationSuccess'));
            refetchListMessage();
            router.replace('/connect/message');
          },
        }),
    });
  };
  const renderPreviewMsg = (lastMsg: any) => {
    if (lastMsg?.message === '') {
      return `<i>${t('conversation.sendMediaMsg')}</i>`;
    }
    return lastMsg?.message?.replace(/\r\n|\n/g, '<br>');
  };
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
    const onMouseMoveChatMessage = (action: string, _id: string) => {
      if (action === 'enter') {
        setMoveEnter_id(_id);
      } else {
        setMoveEnter_id('');
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
        {flatListMessages.map((item: any, index: number) => (
          <ListMessageItem
            activeRoom={activeRoom}
            flatListMessagesLength={flatListMessages?.length}
            index={index}
            isLoadingDeleteConservation={isLoadingDeleteConservation}
            item={item}
            moveEnter_id={moveEnter_id}
            onDeleteConservation={onDeleteConservation}
            onMouseMoveChatMessage={onMouseMoveChatMessage}
            openMoreMessage={openMoreMessage}
            refetchListMessage={refetchListMessage}
            renderPreviewMsg={renderPreviewMsg}
            setActivityAccountInfo={setActivityAccountInfo}
            setActivityAccountType={setActivityAccountType}
            setOpenMoreMessage={setOpenMoreMessage}
            key={item._id}
            disableDeleteConversation={false}
          />
        ))}
      </InfiniteScroll>
    );
  };
  const tabs = [
    {
      key: ConversationFilterType.ALL,
      label: t('conversation.all'),
      element: renderListMessage(),
    },
    {
      key: ConversationFilterType.CONNECTED,
      label: t('conversation.connected'),
      element: renderListMessage(),
    },
    {
      key: ConversationFilterType.NON_CONNECTED,
      label: t('conversation.non-connected'),
      element: renderListMessage(),
    },
    {
      key: ConversationFilterType.GROUP,
      label: t('conversation.group'),
      element: renderListMessage(),
    },
  ];
  const onChangeTab = (tab: string) => {
    setActiveKey(tab);
    setParams({ ...params, conversationType: tab });
  };
  return (
    <>
      <div className="py-[24px] max-md:py-[16px">
        <Flex justify="space-between" align="center" className="px-[16px]">
          <Flex align="center" className="max-lg:gap-[16px]">
            {/* <MobileMenu /> */}
            <span className="text-base-black font-bold text-[20px] max-md:text-[16px]">
              {t('conversation.message')}
            </span>
          </Flex>
          <div
            className="flex gap-[8px] items-center cursor-pointer"
            // onClick={() => markAllAsReadMessage.mutate(undefined)}
          >
            <IconTick />
            <span className="text-black-200 text-[12px] whitespace-nowrap">{t('conversation.markAllRead')}</span>
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
