/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter, useSearchParams } from 'next/navigation';
import IconNoMessage from '~/common/IconNoMessage';
import { useSocket } from '~/provider/socketProvider';
import useActivityAccountInfo from '~/stores/activityAccountInfo.store';
import useListOnline from '~/stores/listOnline.data';
import styles from './styles.module.scss';
import { Avatar, Flex, Spin } from 'antd';
import { BackIcon, IconPenEdit } from '~/common/icon';
import classNames from 'classnames';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslations } from 'next-intl';
import { use, useCallback, useEffect, useRef, useState } from 'react';
import { ConversationType, MESSAGE_TYPE } from '~/definitions/models/message';
import { getUsername } from '~/services/helpers';
import SmartTooltip from '~/common/smartTooltip';
import { MediaType } from '~/definitions/enums/index.enum';
import dayjs from 'dayjs';
import InputMessage from '~/modules/message/chatMessage/InputMessage';
import MessageItem from '~/modules/message/chatMessage/MessageItem';
import { handleError } from '~/lib/utils';
import { QUERY_KEY } from '~/definitions/models';

import { contactApi } from '~/services/api/contact.api';
import { messageApi } from '~/services/api/message.api';
import emitter from '~/utils/emitter';
import { SOCKET_EVENT_KEY } from '~/definitions/constants/index.constant';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

export default function ChatMessage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const socket: any = useSocket();
  const roomId = searchParams?.get('roomId');
  const queryClient = useQueryClient();
  const [isNewMsg, setIsNewMsg] = useState<boolean>(false);
  const listOnline = useListOnline((state) => state.listOnline);
  const activityAccountInfo = useActivityAccountInfo((state) => state.userInfo);
  const activityAccountType = useActivityAccountInfo((state) => state.type);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataConversation, setDataConversation] = useState<any>();
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
    data,
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
    onSuccess: async (res: any) => {
      // queryClient.invalidateQueries(QUERY_KEY.LIST_DETAIL_MESSAGE);
      if (!!res) {
        const isLastPage = res?.pages[0]?.pageIndex === res?.pages[0]?.totalPages;
        //check is last page
        if (isLastPage) {
          setHasNexPage(false);
        }
        const onlineUsers = new Set(listOnline?.users?.map((user: any) => user._id));
        //set dataConversion
        const conversation: any = res?.pages[0]?.metadata?.conversation;
        setMsgMetaData(res?.pages[0]?.metadata);
        const messageType = conversation.type;
        if (res?.pages[0]?.pageIndex === 1) {
          if (messageType === ConversationType.DIRECT_MESSAGE) {
            conversation.isOnline = Array.from(onlineUsers).includes(conversation?.partner?._id);
          }
          setDataConversation(conversation);
        }
        //spreading only if the page is not 1 => not scrolling but new message
        const data =
          res?.pages[0]?.pageIndex === 1
            ? res?.pages[res?.pages?.length - 1]?.data
            : [...listDetailMessage, ...res?.pages[res?.pages?.length - 1]?.data];
        //filter data for add key isNextDate
        let listNewMsgConvert: any = [];
        if (data?.length > 1) {
          for (let i = 0; i < data.length; i++) {
            const message = {
              ...data[i],
              isOnline: messageType === ConversationType.GROUP_CHAT ? onlineUsers.has(data[i]?.user?._id) : false,
            };
            if (i < data.length) {
              if (
                dayjs(data[i + 1]?.createdAt).format('YYYY-MM-DD') !== dayjs(message?.createdAt).format('YYYY-MM-DD') ||
                (isLastPage && i === data.length - 1)
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

        const listNewMsgConvertTemp = [...listNewMsgConvert];

        const { listForwardContact, listForwardPost } = listNewMsgConvertTemp?.reduce(
          (acc, i) => {
            if (!!i?.additionalData) {
              if (
                i.type === MESSAGE_TYPE.PROFILE ||
                i.type === MESSAGE_TYPE.REMOVE_MEMBER ||
                i.type === MESSAGE_TYPE.ADD_MEMBER ||
                i.type === MESSAGE_TYPE.LEAVE_GROUP ||
                i.type === MESSAGE_TYPE.CREATE_GROUP
              ) {
                typeof i?.additionalData === 'string' && acc.listForwardContact.push(i?.additionalData?.split(',')[0]);
              } else if (i.type === MESSAGE_TYPE.POST) {
                typeof i?.additionalData === 'string' && acc.listForwardPost.push(i?.additionalData?.split(',')[0]);
              }
            }
            return acc;
          },
          { listForwardContact: [], listForwardPost: [] }
        );

        try {
          const resProfile: any =
            listForwardContact?.length > 0 &&
            (await contactApi.getContactProfile({
              additionData: listForwardContact,
            }));
          const resPost: any =
            listForwardPost?.length > 0 &&
            (await contactApi.getForwardPost({
              post_ids: listForwardPost,
            }));
          const _resProfile = resProfile?.data || [];
          const _resPost = resPost?.data || [];
          const res = [..._resProfile, ..._resPost];

          if (res?.length) {
            const lookup = res?.reduce((acc, obj) => {
              acc[obj._id] = obj;
              return acc;
            }, {});

            const result = listNewMsgConvertTemp.map((item) => {
              const newItem = { ...item };
              newItem.additionalData =
                typeof item?.additionalData === 'string'
                  ? lookup[item?.additionalData?.split(',')[0]]
                  : item?.additionalData;
              return newItem;
            });

            setListDetailMessage(result);
          } else {
            setListDetailMessage(listNewMsgConvert);
          }
        } catch (err) {
          handleError(err);
        }
        setLoading(false);
      } else
        setTimeout(() => {
          setLoading(false);
        }, 1000);
    },
    onError() {
      router.push('/404');
    },
  });
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
            {activityAccountInfo?.profilePhoto ? (
              <Avatar src={activityAccountInfo?.profilePhoto || ''} alt={t('avatar')} className={styles.avatarUser} />
            ) : (
              <div className={styles.avatarUser}>{getUsername(activityAccountInfo as any, true)}</div>
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
              text={`${activityAccountInfo?.firstName} ${activityAccountInfo?.lastName}`}
            />
          </div>
        </>
      );
    } else if (dataConversation?.type === ConversationType.DIRECT_MESSAGE) {
      return (
        <>
          <div className="relative cursor-pointer" onClick={() => {}}>
            {dataConversation?.partner?.basicPersonalInfo?.profilePhoto ? (
              <Avatar
                src={dataConversation?.partner?.basicPersonalInfo?.profilePhoto || ''}
                alt={t('avatar')}
                className={styles.avatarUser}
              />
            ) : (
              <div className={styles.avatarUser}>{getUsername(dataConversation?.partner?.basicPersonalInfo, true)}</div>
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
              text={`${dataConversation?.partnerUserInfo?.firstName} ${dataConversation?.partnerUserInfo?.lastName}`}
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
            >{`${dataConversation?.totalUser} ${t('messageLocale.member')}`}</p>
          </div>
        </>
      );
    }

    return null;
  }, [dataConversation, activityAccountInfo?.id, roomId, listOnline, activityAccountType]);
  const onNextPage = () => {
    if (!hasNextPage || isLoadingList) return;
    setParamsDetailMsg((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
  };
  const renderListMsg = () => {
    return listDetailMessage.map((message: any, index: any) => {
      const listMedia = message?.conversationMessageMedias?.filter(
        (i: any) => i?.type === MediaType.IMAGE || i?.type === MediaType.VIDEO
      );
      const listDocs = message?.conversationMessageMedias?.filter((i: { type: string }) => i?.type === 'DOCUMENT');
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
                  ? t('activityRound.dateType.today')
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
      socket.on(SOCKET_EVENT_KEY.FIRE_MESSAGE, (message: { conversationMessage: { isOnline: boolean } }) => {
        message.conversationMessage.isOnline = true;
        emitter.emit('NEW_MESSAGE');
        setNewMsg(message);
      });
      socket.on(SOCKET_EVENT_KEY.DELETE_MESSAGE, (message: { conversationUuid: string | null; messageUuid: any }) => {
        emitter.emit('NEW_MESSAGE');
        if (message?.conversationUuid === roomId) {
          setListDetailMessage((prev: any[]) =>
            prev.map((msg: { uuid: any }) => {
              if (msg?.uuid === message?.messageUuid)
                return { ...msg, isDeleted: true, message: t('messageLocale.messageStatus') };
              return msg;
            })
          );
        }
      });
      socket.on(SOCKET_EVENT_KEY.MESSAGE_READ, (message: { conversationUuid: string | null; messageUuid: any }) => {
        setNewMsgRead(message);
        if (message?.conversationUuid === roomId) {
          setListDetailMessage((prev: any[]) =>
            prev.map((msg: { uuid: any }) => {
              if (msg?.uuid === message?.messageUuid) return { ...msg, isRead: true };
              return msg;
            })
          );
        }
        socket.on(SOCKET_EVENT_KEY.ADD_MEMBER, () => {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEY.LIST_DETAIL_MESSAGE] });
          emitter.emit('NEW_MESSAGE');
        });

        socket.on(SOCKET_EVENT_KEY.REMOVE_MEMBER, () => {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEY.LIST_DETAIL_MESSAGE] });
          emitter.emit('NEW_MESSAGE');
        });
        socket.on(SOCKET_EVENT_KEY.MEMBER_EXIT, () => {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEY.LIST_DETAIL_MESSAGE] });
          emitter.emit('NEW_MESSAGE');
        });
      });
    }
  }, [roomId]);
  const sendMessage = async (text: string, files: any, documents: any) => {
    const formData = new FormData();
    formData.append('content', text);
    if (activityAccountType === ConversationType.NOT_CHATTED) {
      formData.append('userUuid', activityAccountInfo?.uuid + '');
    } else {
      formData.append('conversationUuid', roomId + '');
    }
    // formData.append('conversationUuid', roomId + '');
    formData.append('type', files?.length > 0 ? MESSAGE_TYPE.MEDIA : MESSAGE_TYPE.TEXT);
    if (files?.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]?.file);
      }
    }
    if (documents?.length > 0) {
      for (let i = 0; i < documents.length; i++) {
        formData.append('files', documents[i]?.file);
      }
    }
    try {
      const res: any = await messageApi.createConversationMessage(formData);
      if (!!res) {
        emitter.emit('NEW_MESSAGE');
        setListDetailMessage((prev: any) => [
          {
            ...res,
            isScroll: true,
            createdAt: dayjs(),
            isNextDate:
              listDetailMessage?.length > 0 &&
              dayjs(listDetailMessage[0]?.createdAt).format('YYYY-MM-DD') !== dayjs().format('YYYY-MM-DD'),
          },
          ...prev,
        ]);
      }
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
                <div className="absolute w-full top-0 bg-white z-1 flex items-center justify-center h-[108px] border-b-[1px] border-color-[#E8E9EE]">
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
                <div
                  className={classNames('w-full absolute top-[108px] bottom-[121px] pb-[12px]', styles.customScrollBar)}
                >
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
