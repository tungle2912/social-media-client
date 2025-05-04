import { useInfiniteQuery } from '@tanstack/react-query';
import { Avatar, Skeleton } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Button from '~/components/form/Button';
import { SearchParams } from '~/definitions/interfaces/interface';
import { QUERY_KEY } from '~/definitions/models';
import { ConversationFilterType } from '~/definitions/models/message';
import { useGetSuggestedFriendQuery } from '~/hooks/data/contact.data';
import ListContactItem from '~/modules/dashboard/listContact/listContactItem/item';
import { messageApi } from '~/services/api/message.api';
import useActivityAccountInfo from '~/stores/activityAccountInfo.store';
import useListOnline from '~/stores/listOnline.data';
import styles from './styles.module.scss';
import ChatBox from '~/modules/dashboard/chatBox';
const INIT_PARAMS = { pageIndex: 1, pageSize: 20 };
export default function ListContact() {
  const { data: suggestedFriendResponse } = useGetSuggestedFriendQuery();
  const [params, setParams] = useState<SearchParams>(INIT_PARAMS);
  const listOnline = useListOnline((state) => state.listOnline);
  const [moveEnter_id, setMoveEnter_id] = useState<string>('');
  const [messageDrawerInfo, setMessageDrawerInfo] = useState<any>(null);
  const [activeRoom, setActiveRoom] = useState<string | undefined>(undefined);
  const setActivityAccountInfo = useActivityAccountInfo((state) => state.setUserInfo);
  const setActivityAccountType = useActivityAccountInfo((state) => state.setType);
  const [openChats, setOpenChats] = useState<string[]>([]);
  const t = useTranslations();
  const [openMessageDrawer, setOpenMessageDrawer] = useState<boolean>(false);
  const handleOpenChat = (conversationId: string) => {
    if (!openChats.includes(conversationId)) {
      setOpenChats([...openChats, conversationId]);
    }
  };

  const handleCloseChat = (conversationId: string) => {
    setOpenChats(openChats.filter((id) => id !== conversationId));
  };
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
    const oldData = listMessages?.pages.flatMap((page: any) => page.data) || [];
    return oldData?.map((item) => {
      item.isOnline = Array.from(listOnline).includes(item?.partner?._id) || false;
      return item;
    });
  }, [listMessages?.pages, listOnline]);
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
        //     setOpenMoreMessage(false);
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
        className="scroll-bar pl-[10px] pr-[6px]pb-[5px]"
      >
        <div></div>
        {flatListMessages.map((item: any, index: number) => (
          <ListContactItem
            activeRoom={activeRoom}
            flatListMessagesLength={flatListMessages?.length}
            index={index}
            item={item}
            moveEnter_id={moveEnter_id}
            onMouseMoveChatMessage={onMouseMoveChatMessage}
            refetchListMessage={refetchListMessage}
            renderPreviewMsg={renderPreviewMsg}
            setActivityAccountInfo={setActivityAccountInfo}
            setActivityAccountType={setActivityAccountType}
            onOpenChat={handleOpenChat}
            key={item._id}
          />
        ))}
      </InfiniteScroll>
    );
  };
  return (
    <div className="flex flex-col gap-[12px]">
      <div className={styles.listSuggested}>
        {suggestedFriendResponse?.result?.length > 0 ? (
          suggestedFriendResponse.result.map((item: any) => (
            <div key={item.id} className={styles.suggestedItem}>
              <Avatar className="bg-[#fff0f6] w-[56px] h-[56px]" src={item?.avatar}></Avatar>
              <div className="flex flex-col ">
                <p className={styles.suggestedName}>{item?.user_name}</p>
                <div>
                  <Button btnType="primary" className="text-[#ffffff]">
                    {' '}
                    Accept
                  </Button>
                  <Button className="bg-[#d1d0d0]">Remove</Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noSuggested}>
            <p>No suggested friends available</p>
          </div>
        )}
      </div>
      <div className={styles.listMessage}>
        <p className="ml-2 text-[16px] ">Recent message</p>
        {renderListMessage()}
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: '3px',
          right: '400px',
          display: 'flex',
          gap: '10px',
          padding: '10px',
          zIndex: 1000,
        }}
      >
        {openChats.map((conversationId) => {
          const conversation = flatListMessages.find((msg) => msg._id === conversationId);
          return (
            <ChatBox key={conversationId} conversation={conversation} onClose={() => handleCloseChat(conversationId)} />
          );
        })}
      </div>
    </div>
  );
}
