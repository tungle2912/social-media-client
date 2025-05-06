/* eslint-disable react-hooks/rules-of-hooks */
import { Avatar, Flex, Spin } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BackIcon, IconPenEdit } from '~/common/icon';
import IconNoMessage from '~/common/IconNoMessage';
import SmartTooltip from '~/common/smartTooltip';
import { QUERY_KEY } from '~/definitions/models';
import { ConversationType, MESSAGE_TYPE } from '~/definitions/models/message';
import { handleError } from '~/lib/utils';
import InputMessage from '~/modules/message/chatMessage/InputMessage';
import MessageItem from '~/modules/message/chatMessage/MessageItem';
import { useSocket } from '~/provider/socketProvider';
import useActivityAccountInfo from '~/stores/activityAccountInfo.store';
import useListOnline from '~/stores/listOnline.data';
import styles from './styles.module.scss';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { contactApi } from '~/services/api/contact.api';
import { messageApi } from '~/services/api/message.api';
import { messageType } from '~/definitions/enums/index.enum';

export default function ChatMessage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const socket: any = useSocket();
  const roomId = searchParams?.get('roomId');
  const queryClient = useQueryClient();
  const { data: sessionData } = useSession();
  const [isNewMsg, setIsNewMsg] = useState<boolean>(false);
  const listOnline = useListOnline((state) => state.listOnline);
  const activityAccountInfo = useActivityAccountInfo((state) => state.userInfo);
  const activityAccountType = useActivityAccountInfo((state) => state.type);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataConversation, setDataConversation] = useState<any>();
  const [dataPagination, setDataPagination] = useState<any>();
  const [dataMessageResponse, setDataMessageResponse] = useState<any>();
  const [listDetailMessage, setListDetailMessage] = useState<any>([]);
  const [openDrawerEditMember, setOpenDrawerEditMember] = useState<boolean>(false);
  const [openDrawerEditGroup, setOpenDrawerEditGroup] = useState<boolean>(false);
  const [openDrawerMember, setOpenDrawerMember] = useState<boolean>(false);
  const [msgMetaData, setMsgMetaData] = useState<any>();
  const [newMsgRead, setNewMsgRead] = useState<any>();
  const [newMsg, setNewMsg] = useState<any>();
  const [paramsDetailMsg, setParamsDetailMsg] = useState({
    pageSize: 20,
    pageIndex: 1,
  });
  const {
    data: dataResopnse,
    isLoading: isLoadingList,
    refetch,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.LIST_DETAIL_MESSAGE, roomId, paramsDetailMsg],
    queryFn: () => messageApi.getConversationsDetailMessage(roomId, paramsDetailMsg),
    enabled: !!roomId && !isNewMsg,
    staleTime: 0,
    getNextPageParam: (lastPage: any) => {
      const nextPage = lastPage?.pageIndex < lastPage?.totalPages ? lastPage?.pageIndex + 1 : undefined;
      return nextPage;
    },
    initialPageParam: 1,
  });
  useEffect(() => {
    if (dataResopnse) {
      setDataPagination(dataResopnse?.pages[0]?.result.pagination);
      const conversation: any = dataResopnse?.pages[0]?.result?.conversation;
      const messageType = conversation.type;
      if (messageType === ConversationType.DIRECT_MESSAGE) {
        conversation.isOnline = Array.from(listOnline).includes(conversation?.partner?._id);
      }
      setDataConversation(conversation);
      //set dataConversion
      //  setMsgMetaData(dataResopnse?.pages[0]?.metadata);
      const data =
        dataResopnse?.pages[0]?.result?.pagination.page === 1
          ? dataResopnse?.pages[dataResopnse?.pages?.length - 1]?.result?.data
          : [...listDetailMessage, ...dataResopnse?.pages[dataResopnse?.pages?.length - 1]?.result?.data];
      setDataMessageResponse(data);
    }
  }, [dataResopnse]);
  useEffect(() => {
    if (dataMessageResponse) {
      const data = dataMessageResponse;
      const onlineUsers = new Set(listOnline?.users?.map((user: any) => user._id));
      const messageType = dataConversation.type;
      //filter data for add key isNextDate
      let listNewMsgConvert: any = [];
      if (data?.length > 1) {
        for (let i = 0; i < data.length; i++) {
          const message = {
            ...data[i],
            isOnline: messageType === ConversationType.GROUP_CHAT ? onlineUsers.has(data[i]?.user?._id) : false,
            owner: data[i].user?._id === (sessionData?.user as any)?._id,
          };
          if (i < data.length) {
            if (
              dayjs(data[i + 1]?.createdAt).format('YYYY-MM-DD') !== dayjs(message?.createdAt).format('YYYY-MM-DD') ||
              (!hasNextPage && i === data.length - 1)
            ) {
              listNewMsgConvert = [...listNewMsgConvert, { ...message, isNextDate: true }];
            } else {
              listNewMsgConvert = [...listNewMsgConvert, { ...message, isNextDate: false }];
            }
          } else {
            listNewMsgConvert = [...listNewMsgConvert, { ...message, isNextDate: false }];
          }
        }
      } else if (data?.length === 1) {
        listNewMsgConvert = [
          ...listNewMsgConvert,
          {
            ...data[0],
            isNextDate: true,
            isOnline: messageType === ConversationType.GROUP_CHAT ? onlineUsers.has(data[0]?.user?._id) : false,
          },
        ];
      }
      setListDetailMessage(listNewMsgConvert);
      setLoading(false);
    } else
      setTimeout(() => {
        setLoading(false);
      }, 1000);
  }, [dataMessageResponse]);
  useEffect(() => {
    if (!!roomId) {
      setLoading(true);
      setListDetailMessage([]);
      setHasNexPage(true);
      setParamsDetailMsg((prev) => ({ ...prev, pageIndex: 1 }));
      setIsNewMsg(false);
    }
    if (!roomId) {
      setLoading(false);
      setListDetailMessage([]);
      setIsNewMsg(true);
    }
  }, [roomId, activityAccountInfo?._id]);
  const lastMsgRef = useRef<HTMLParagraphElement | null>(null);
  const [hasNextPage, setHasNexPage] = useState<boolean>(true);
  const t = useTranslations();
  const renderGeneralRoomInfo = useCallback(() => {
    if (activityAccountType === ConversationType.NOT_CHATTED) {
      const isOnline = listOnline?.users?.some((user: any) => user._id === activityAccountInfo?._id);
      return (
        <>
          <div className="relative">
            {activityAccountInfo?.avatar ? (
              <Avatar src={activityAccountInfo?.avatar || ''} alt={t('avatar')} className={styles.avatarUser} />
            ) : (
              <div className={styles.avatarUser}>{activityAccountInfo?.user_name}</div>
            )}
            {isOnline && (
              <div className={classNames(styles.status, styles.online, 'absolute right-[2px] bottom-0')}></div>
            )}
            {!isOnline && (
              <div className={classNames(styles.status, styles.offline, 'absolute right-[2px] bottom-0')}></div>
            )}
          </div>
          <div className="w-full">
            <SmartTooltip
              className="text-base-black-200 font-bold text-[16px] max-w-[35rem]"
              text={activityAccountInfo?.user_name ?? ''}
            />
          </div>
        </>
      );
    } else if (dataConversation?.type === ConversationType.DIRECT_MESSAGE) {
      return (
        <>
          <div className="relative cursor-pointer" onClick={() => {}}>
            {dataConversation?.avatar ? (
              <Avatar src={dataConversation?.avatar || ''} alt={t('avatar')} className={styles.avatarUser} />
            ) : (
              <div className={styles.avatarUser}>{dataConversation?.title}</div>
            )}
            {dataConversation?.isOnline && (
              <div className={classNames(styles.status, styles.online, 'absolute right-[2px] bottom-0')}></div>
            )}
            {!dataConversation?.isOnline && (
              <div className={classNames(styles.status, styles.offline, 'absolute right-[2px] bottom-0')}></div>
            )}
          </div>
          <div className="w-full">
            <SmartTooltip
              className="text-base-black-200 font-bold text-[16px] max-w-[35rem] cursor-pointer hover:underline"
              onClick={() => {}}
              text={dataConversation?.title}
            />
          </div>
        </>
      );
    } else if (dataConversation?.type === ConversationType.GROUP_CHAT) {
      return (
        <>
          <div>
            {dataConversation?.avatar ? (
              <Avatar src={dataConversation?.avatar || ''} alt={t('avatar')} className={styles.avatarUser} />
            ) : (
              <div className={styles.avatarUser}>{dataConversation?.title ? dataConversation.title.charAt(0) : ''}</div>
            )}
          </div>
          <div>
            <Flex gap={24} align="center" className="hover:cursor-pointer group">
              <SmartTooltip
                className="text-base-black-200 font-bold text-[16px] max-w-[35rem] group-hover:max-w-[25em]"
                text={dataConversation?.title}
              />
              <div
                className={classNames(styles.btnEdit, 'invisible group-hover:visible')}
                onClick={() => setOpenDrawerEditGroup(true)}
              >
                <IconPenEdit />
              </div>
            </Flex>
            <p
              className="mt-[4px] text-base-black-300 text-[12px] cursor-pointer hover:text-[#2268FA]"
              onClick={() => setOpenDrawerMember(true)}
            >{`${dataConversation?.totalUser} ${t('message.member')}`}</p>
          </div>
        </>
      );
    }

    return null;
  }, [dataConversation, activityAccountInfo?._id, roomId, listOnline, activityAccountType]);
  const onNextPage = () => {
    if (!hasNextPage || isLoadingList) return;
    setParamsDetailMsg((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
  };
  useEffect(() => {
    console.log('listDetailMessage', listDetailMessage);
  }, [listDetailMessage]);
  const renderListMsg = () => {
    return listDetailMessage.map((message: any, index: any) => {
      const listMedia = message?.medias;
      const listDocs = message?.attachments;
      if (!!message?.isNextDate) {
        return (
          <>
            {
              <MessageItem
                key={message?._id}
                dataConversation={dataConversation}
                handleDeleteMsg={(type, message_id) => Promise.resolve()}
                index={index}
                listDocs={listDocs}
                listMedia={listMedia}
                message={message}
              />
            }
            <div className="mt-8 mb-4 h-[1px] w-full border-[1px] border-[#E8E9EE] flex justify-center items-center">
              <div className="w-fit px-4 bg-[#FFF] text-[#636363] text-xs text-center">
                {dayjs(message.createdAt).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
                  ? t('message.today')
                  : dayjs(message.createdAt).format('MMMM DD, YYYY')}
              </div>
            </div>
          </>
        );
      }
      return (
        <MessageItem
          key={message?._id}
          dataConversation={dataConversation}
          handleDeleteMsg={(type, message_id) => Promise.resolve()}
          index={index}
          listDocs={listDocs}
          listMedia={listMedia}
          message={message}
        />
      );
    });
  };
  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message: any) => {
        setDataMessageResponse((prev: any) => [message, ...prev]);
      };

      socket.on('NEW_MESSAGE', handleNewMessage);

      // Cleanup: Xóa listener khi component unmount hoặc khi roomId/socket thay đổi
      return () => {
        socket.off('NEW_MESSAGE', handleNewMessage);
      };
    }
  }, [roomId, socket]);
  const sendMessage = async (text: string, files: any, documents: any) => {
    const formData = new FormData();
    formData.append('message', text);
    if (activityAccountType === ConversationType.NOT_CHATTED) {
      formData.append('userId', activityAccountInfo?._id + '');
    } else {
      formData.append('conversationId', roomId + '');
    }
    // formData.append('conversationUuid', roomId + '');
    formData.append('type', String((files?.length || documents?.length) > 0 ? messageType.Media : messageType.Text));
    if (files?.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('medias', files[i]?.file);
      }
    }
    if (documents?.length > 0) {
      for (let i = 0; i < documents.length; i++) {
        formData.append('attachments', documents[i]?.file);
      }
    }
    try {
      await messageApi.createConversationMessage(formData);
    } catch (error) {}
  };
  return (
    <>
      <div className="relative h-full">
        {!roomId && !activityAccountType ? (
          <div className="w-full h-full flex justify-center items-center">
            <IconNoMessage />
          </div>
        ) : (
          <div className={styles.contentMessage}>
            {loading ? (
              <div className="w-full h-[60vh] flex justify-center items-center">
                <Spin />
              </div>
            ) : (
              <>
                <div className="absolute w-full top-0 bg-white z-1 flex items-center justify-center border-b-[1px] border-color-[#E8E9EE]">
                  <div className="flex justify-between items-center gap-[12px] px-[32px] max-xs:px-[16px] py-[24px] w-full">
                    <div
                      className={styles.backButton}
                      onClick={() => {
                        router.push('/message');
                      }}
                    >
                      <BackIcon />
                    </div>
                    <div className="flex items-center gap-[12px] w-full">{renderGeneralRoomInfo()}</div>
                    {/* <div className="flex items-center gap-[16px]">{renderActionRoom()}</div> */}
                  </div>
                </div>
                <div className={classNames('w-full absolute top-[115px] pb-[12px] bg-white', styles.customScrollBar)}>
                  <InfiniteScroll
                    dataLength={listDetailMessage?.length || 0}
                    next={onNextPage}
                    hasMore={!!hasNextPage}
                    loader={
                      <div className="flex justify-center mt-[20px]">
                        <Spin />
                      </div>
                    }
                    inverse={true}
                    height={`calc(100dvh - 300px)`}
                    className="scroll-bar py-10 px-[16px] mr-[5px] flex flex-col-reverse"
                  >
                    <div ref={lastMsgRef} />
                    {renderListMsg()}
                  </InfiniteScroll>
                </div>
                <div className="absolute bottom-0 h-auto w-full border-t-[1px] border-color-[#fffaaa] z-10">
                  <InputMessage defaultValue={''} handleSendMsg={sendMessage} />
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {/* <DrawerEditMember
        open={openDrawerEditMember}
        onClose={() => {
          setOpenDrawerEditMember(false);
        }}
        dataConversation={dataConversation}
      />
      <DrawerMember
        open={openDrawerMember}
        onClose={() => {
          setOpenDrawerMember(false);
        }}
        dataConversation={dataConversation}
      />
      <DrawerEditGroup
        open={openDrawerEditGroup}
        onClose={() => {
          setOpenDrawerEditGroup(false);
        }}
        _id={dataConversation?._id}
        groupName={dataConversation?.title}
        key={dataConversation?.title}
        refetch={refetch}
      />
      <ModalExitGroup
        open={openExitGroup}
        onClose={() => {
          setOpenExitGroup(false);
        }}
        conversation_id={dataConversation?._id}
      />
      <GroupChat drawerCtrl={groupChatCtrl} /> */}
    </>
  );
}
