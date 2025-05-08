/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/rules-of-hooks */
import { useInfiniteQuery } from '@tanstack/react-query';
import { Avatar, Flex, Image, Popover, Skeleton, Spin, Tooltip } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import image from '@/static/image';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DeleteTagIcon, DocumentDownloadIcon, DropDownIcon2, IconRead, IconSent } from '~/common/icon';
import SmartTooltip from '~/common/smartTooltip';
import { SOCKET_EVENT_KEY } from '~/definitions/constants/index.constant';
import { messageType } from '~/definitions/enums/index.enum';
import { QUERY_KEY } from '~/definitions/models';
import {
  ConversationMessageStatus,
  ConversationType,
  MESSAGE_TYPE,
  messageDeleteType,
} from '~/definitions/models/message';
import { useDimension } from '~/hooks';
import { useDeleteMessageMutation } from '~/hooks/data/conservation.data';
import useConfirm from '~/hooks/useConfirm';
import { convertLinksToAnchors } from '~/lib/helper';
import InputMessage from '~/modules/dashboard/MessageDrawer/ChatMessage/InputMessage';
import MediaMessage from '~/modules/message/MediaMessage';
import { useSocket } from '~/provider/socketProvider';
import { messageApi } from '~/services/api/message.api';
import { getUsername } from '~/services/helpers';
import useListOnline from '~/stores/listOnline.data';
import styles from './styles.module.scss';
import { useGetPostByIdQuery } from '~/hooks/data/post.data';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import PostItem from '~/modules/profile/postItems';
import { ProfileItem } from '~/modules/message/chatMessage/MessageItem/profileItem.tsx';
const SYSTEM_MESSAGE_MAP: Record<string, string> = {
  [messageType.CreateGroup]: 'message.groupCreatedBy',
  [messageType.AddMember]: 'message.memberAdded',
  [messageType.RemoveMember]: 'message.memberRemoved',
  [messageType.JoinGroup]: 'message.memberJoined',
  [messageType.LeaveGroup]: 'message.memberLeft',
};
const MemoizedPostItem = memo(PostItem);
// TODO: Need refactoring
const ChatMessage = (message: any) => {
  const socket: any = useSocket();
  const t = useTranslations();
  const { isSM } = useDimension();
  const roomId = message?._id;
  const listOnline = useListOnline((state) => state.listOnline);
  const [loading, setLoading] = useState<boolean>(true);
  const [listDetailMessage, setListDetailMessage] = useState<any>([]);
  const [dataConversation, setDataConversation] = useState<any>();
  const [dataPagination, setDataPagination] = useState<any>();
  const [dataMessageResponse, setDataMessageResponse] = useState<any>();
  const [msgMetaData, setMsgMetaData] = useState<any>();
  const [paramsDetailMsg, setParamsDetailMsg] = useState({
    pageSize: 20,
    pageIndex: 1,
  });
  const [postId, setPostId] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const deleteMessageMutation = useDeleteMessageMutation();
  const lastMsgRef = useRef<HTMLParagraphElement | null>(null);
  const [openDrawerEditMember, setOpenDrawerEditMember] = useState<boolean>(false);
  const [isNewMsg, setIsNewMsg] = useState<boolean>(true);
  const { data: sessionData } = useSession();
  const [roomActive, setRoomActive] = useState<any>(null);
  const profile = sessionData?.user;
  const { data: postDetail, refetch: refetchPost, error: postError, status: postStatus } = useGetPostByIdQuery(postId);
  useEffect(() => {
    if (postError) {
      // @ts-ignore
      if (postError.status === 403) {
        // @ts-ignore
        setErrorMessage(postError.data?.message || 'Not authorized to view');
      } else {
        setErrorMessage('An error occurred while fetching post');
      }
      setSelectedPost(null);
    } else if (postDetail) {
      setSelectedPost(postDetail.result);
      setErrorMessage('');
    }
  }, [postDetail, postError]);
  const renderPostContent = useCallback(() => {
    if (errorMessage) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
          <ExclamationCircleOutlined className="text-red-500 text-4xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('accessDenied')}</h3>
          <p className="text-gray-600 text-center">{errorMessage}</p>
        </div>
      );
    }

    if (selectedPost) {
      return (
        <div className="max-h-[90vh] overflow-y-auto p-4">
          <MemoizedPostItem openComment={true} post={selectedPost} isPreview refetch={refetchPost} />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center min-h-[300px] p-4">
        <Skeleton active paragraph={{ rows: 4 }} title={false} className="w-full max-w-[400px]" />
      </div>
    );
  }, [selectedPost, errorMessage]);
  useEffect(() => {
    setListDetailMessage([]);
    setParamsDetailMsg((prev) => ({ ...prev, pageIndex: 1 }));
  }, [roomId]);
  useEffect(() => {
    if (message?.message === '' || message?.isNotConnected) {
      setLoading(false);
      setIsNewMsg(true);
    } else {
      setIsNewMsg(false);
    }
  }, [message]);
  const changeRoomActive = () => {
    setRoomActive(roomId);
  };
  useEffect(() => {
    if (socket && roomActive === roomId) {
      const handleNewMessage = (message: any) => {
        setDataMessageResponse((prev: any) => [message, ...prev]);
      };
      const handleNewDeleteMessage = (updatedMessage: any) => {
        setDataMessageResponse((prev: any) =>
          prev.map((msg: any) => (msg._id === updatedMessage._id ? updatedMessage : msg))
        );
      };

      socket.on(SOCKET_EVENT_KEY.NEW_MESSAGE, handleNewMessage);
      socket.on(SOCKET_EVENT_KEY.DELETE_MESSAGE, handleNewDeleteMessage);

      // Cleanup: Xóa listener khi component unmount hoặc khi roomId/socket thay đổi
      return () => {
        socket.off(SOCKET_EVENT_KEY.NEW_MESSAGE, handleNewMessage);
        socket.off(SOCKET_EVENT_KEY.DELETE_MESSAGE, handleNewDeleteMessage);
      };
    }
  }, [roomId, socket]);
  const {
    data: dataResponse,
    isLoading: isLoadingList,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.LIST_DETAIL_MESSAGE, roomId],
    queryFn: ({ pageParam = 1 }) =>
      messageApi.getConversationsDetailMessage(roomId, {
        pageSize: 20,
        pageIndex: pageParam,
      }),
    enabled: !!roomId && !isNewMsg,
    staleTime: 0,
    getNextPageParam: (lastPage) => {
      const { pageIndex, totalPages } = lastPage.result.pagination;
      return pageIndex < totalPages ? pageIndex + 1 : undefined;
    },
    initialPageParam: 1,
  });
  useEffect(() => {
    if (dataResponse) {
      setDataPagination(dataResponse?.pages[0]?.result.pagination);
      const conversation: any = dataResponse?.pages[0]?.result?.conversation;
      const messageType = conversation.type;
      if (messageType === ConversationType.DIRECT_MESSAGE) {
        conversation.isOnline = Array.from(listOnline).includes(conversation?.partner?._id);
      }
      setDataConversation(conversation);
      //set dataConversion
      //  setMsgMetaData(dataResponse?.pages[0]?.metadata);
      const data =
        dataResponse?.pages[0]?.result?.pagination.page === 1
          ? dataResponse?.pages[dataResponse?.pages?.length - 1]?.result?.data
          : [...listDetailMessage, ...dataResponse?.pages[dataResponse?.pages?.length - 1]?.result?.data];
      setDataMessageResponse(data);
    }
  }, [dataResponse]);
  useEffect(() => {
    if (dataMessageResponse) {
      const currentUserId = (sessionData?.user as any)?._id;
      const filteredMessages = dataMessageResponse.filter((message: any) => {
        if (message.deletedFor && message.deletedFor.includes(currentUserId)) return false;
        return true;
      });
      const data = filteredMessages;
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
    const onlineUsers = new Set(listOnline.map((user: any) => user._id));
    if (dataConversation?.type === ConversationType.GROUP_CHAT) {
      setListDetailMessage((oldData: any) => {
        return oldData?.map((item: any) => {
          item.isOnline = onlineUsers.has(item?.user?._id) || false;
          return item;
        });
      });
    }
  }, [listOnline]);

  const onNextPage = () => {
    if (!hasNextPage || isLoadingList) return;
    fetchNextPage();
  };
  useEffect(() => {
    if (listDetailMessage && listDetailMessage?.length > 0 && !!listDetailMessage[0].isScroll) {
      if (lastMsgRef.current) {
        lastMsgRef?.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [listDetailMessage]);

  const sendMessage = async (text: string, files: any, documents: any) => {
    const formData = new FormData();
    formData.append('message', text);
    formData.append('conversationId', roomId + '');
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
    await messageApi.createConversationMessage(formData);
  };

  const renderListMsg = () => {
    const SendTime = ({ createdAt, isRead, isOwn, deliveredByUsers, readByUsers }: any) => {
      return (
        <Flex className="mt-2 text-right" justify="end" align="center">
          <span className="text-xs mr-2 text-[#636363]">
            <Tooltip
              rootClassName={styles.tooltipTime}
              placement="bottom"
              title={<span className="text-[10px]">{dayjs(createdAt).format('HH:mm MMMM DD, YYYY')}</span>}
            >
              {dayjs(createdAt).format('HH:mm')}
            </Tooltip>
          </span>
          {isOwn && (
            <span>
              {isRead ? (
                dataConversation?.type === ConversationType.GROUP_CHAT ? (
                  <Popover
                    content={
                      <div className="w-[395px] max-h-[400px] overflow-auto">
                        <div className="flex items-center gap-[10px] mb-[16px]">
                          <IconRead />
                          <p>{t('message.readBy')}</p>
                        </div>
                        <div className="mb-[18px]">
                          {readByUsers?.map((item: any, index: any) => {
                            return (
                              <div key={index} className="flex items-center gap-[8px]">
                                <div>
                                  {item?.basicPersonalInfo?.profilePhoto ? (
                                    <Avatar
                                      src={item?.basicPersonalInfo?.profilePhoto || ''}
                                      alt="avatar"
                                      className={styles.avatar}
                                    />
                                  ) : (
                                    <div className={styles.avatar}>{item?.user_name}</div>
                                  )}
                                </div>
                                <SmartTooltip
                                  className="text-sm not-italic font-normal leading-[24px] max-w-[300px] text-[#636363]"
                                  text={item?.user_name}
                                />
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-[10px] mb-[16px]">
                          <IconSent />
                          <p>{t('message.deliveredBy')}</p>
                        </div>
                        <div>
                          {deliveredByUsers?.map((item: any, index: any) => {
                            return (
                              <div key={index} className="flex items-center gap-[8px]">
                                <div>
                                  {item?.basicPersonalInfo?.profilePhoto ? (
                                    <Avatar
                                      src={item?.basicPersonalInfo?.profilePhoto || ''}
                                      alt="avatar"
                                      className={styles.avatarSeenUser}
                                    />
                                  ) : (
                                    <div className={styles.avatarSeenUser}>{item?.user_name}</div>
                                  )}
                                </div>
                                <SmartTooltip
                                  className="text-sm not-italic font-normal leading-[24px] max-w-[300px] text-[#636363]"
                                  text={item?.user_name}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    }
                    placement="bottomRight"
                    arrow={false}
                  >
                    <div>
                      <IconRead />
                    </div>
                  </Popover>
                ) : (
                  <IconRead />
                )
              ) : (
                <IconSent />
              )}
            </span>
          )}
        </Flex>
      );
    };

    const handleDeleteMsg = async (type: messageDeleteType, message_id: any) => {
      await deleteMessageMutation.mutateAsync(
        {
          id: message_id,
          data: {
            delete_type: type,
          },
        },
        {
          onSuccess: () => {
            message.success(t('message.deleteMessageSuccess'));
          },
        }
      );
    };

    const settingConfirm = {
      width: 560,
      textCancel: t('modalConfirm.no'),
      textOk: t('modalConfirm.yes'),
      title: t('modalConfirm.message'),
      description: (
        <div>
          <p className="text-[#636363]">{t('message.deleteConfirmation.title')}</p>
          <p className="text-[#636363]">{t('message.deleteConfirmation.description')}</p>
        </div>
      ),
    };

    return listDetailMessage.map((message: any, index: any) => {
      const listMedia = message?.medias;
      const listDocs = message?.attachments;

      const handleDownload = () => {
        const listDownload = [...listMedia, ...listDocs];
        listDownload?.forEach((item) => {
          saveAs(item?.url);
        });
      };

      const MsgComponent = () => {
        const isMessageSystem =
          message?.type &&
          [
            messageType.CreateGroup,
            messageType.AddMember,
            messageType.RemoveMember,
            messageType.JoinGroup,
            messageType.LeaveGroup,
          ].includes(message.type);

        const messageText = SYSTEM_MESSAGE_MAP[message.type]
          ? t(SYSTEM_MESSAGE_MAP[message.type])
          : t('message.unknownAction');
        const renderSystemMessage = () => (
          <div className="px-[16px] text-sm max-w-[100%] py-[6px] rounded-[10px] bg-[#F7F7F7] text-[#333333] flex gap-2 items-center">
            {message.user?.avatar ? (
              <Avatar src={message.user?.avatar || ''} alt={t('avatar')} className={styles.avatarUserIcon} />
            ) : (
              <div className={styles.avatarUserIcon}>{message.user.user_name}</div>
            )}
            <span className="text-xs font-medium">{message.user?.user_name}</span>
            <span className="text-xs text-lg">{messageText}</span>
          </div>
        );
        const renderMessageContent = () => {
          if (message.deletedForAll) {
            return (
              <div className="text-sm break-words text-[#333333]">
                <i>{t('message.messageHasBeenRecalled')}</i>
              </div>
            );
          }
          return (
            <>
              <div
                className="text-sm break-words text-[#333333]"
                dangerouslySetInnerHTML={{ __html: convertLinksToAnchors(message?.message) }}
              ></div>
              {message?.additionalData && message?.type === messageType.Profile && (
                <Flex className="flex flex-col bg-[white] px-3 py-2">
                  <ProfileItem data={message?.additionalData} />
                  <Flex className="mt-2">
                    <a
                      target="_blank"
                      href={`${process.env.NEXT_PUBLIC_DOMAIN}/public-page/personal/${message?.additionalData?._id}`}
                      className="py-2 leading-6 cursor-pointer underline"
                      rel="noreferrer"
                    >
                      {t('message.viewProfile')}
                    </a>
                  </Flex>
                </Flex>
              )}
              {message?.additionalData && message?.type === messageType.Post && (
                <Flex className="flex flex-col bg-base-black-600 rounded-[10px] mt-[4px] px-3 py-2">
                  <Flex className="gap gap-3 py-2 flex border-b-[1px]">{renderPostContent()}</Flex>
                </Flex>
              )}
              {listMedia?.length > 0 && <MediaMessage listMedia={listMedia} handleDownload={handleDownload} />}
              {listMedia?.length < 1 && listDocs?.length > 0 && (
                <div className="flex justify-end">
                  <div className={styles.btnAction} onClick={handleDownload}>
                    <DocumentDownloadIcon />
                  </div>
                </div>
              )}
              {listDocs?.length > 0 &&
                listDocs.map((doc: any, index: any) => (
                  <div className={styles.documentFile} key={index}>
                    <div className="flex gap-[9px] items-center">
                      <div className="h-[26.67px]">
                        <Image src={image.attachment} width={26.67} height={26.67} alt={t('attachmentAlt')} />
                      </div>
                      <div className={classNames(styles.name)}>
                        <SmartTooltip className="max-w-[100%]" text={doc?.name} />
                      </div>
                    </div>
                  </div>
                ))}
            </>
          );
        };
        const renderOwnerMessage = () => (
          <div className="w-fit max-w-[70%] px-[16px] py-[12px] rounded-[10px] bg-[#f7f0ff]">
            {renderMessageContent()}
            {message?.createdAt && !message?.deletedAt && !message?.isDeleted && (
              <SendTime
                createdAt={message?.createdAt}
                isRead={message?.deliveredByUsers?.length === 0 || message?.isRead}
                isOwn={true}
                deliveredByUsers={message?.deliveredByUsers}
                readByUsers={message?.readByUsers}
                lastMsg={index === 0}
                dataConversation={dataConversation}
                key={message?._id}
              />
            )}
          </div>
        );
        const renderNonOwnerMessage = () => (
          <Flex className="w-full">
            <div className="mr-2 relative cursor-pointer" onClick={() => {}}>
              {message?.user?.avatar ? (
                <Avatar src={message?.user?.avatar || ''} alt={t('avatar')} className={styles.avatar} />
              ) : (
                <div className={styles.avatar}>{message?.user?.user_name}</div>
              )}
              {message?.isOnline && (
                <div className={classNames(styles.status, styles.online, 'absolute right-[2px] top-[30px]')}></div>
              )}
            </div>
            <div className="max-w-[80%] w-fit flex justify-center items-center">
              <div>
                {dataConversation?.type === ConversationType.GROUP_CHAT && (
                  <strong onClick={() => {}} className="text-xs cursor-pointer hover:underline">
                    {message?.user?.user_name}
                  </strong>
                )}
                <div
                  className={classNames(
                    'px-[16px] w-full py-[12px] rounded-[10px] bg-[#F7F7F7]',
                    dataConversation?.type === ConversationType.GROUP_CHAT ? 'mt-1' : ''
                  )}
                >
                  {renderMessageContent()}
                  {message?.createdAt && !message?.deletedAt && !message?.isDeleted && (
                    <SendTime
                      createdAt={message?.createdAt}
                      isRead={message?.status === ConversationMessageStatus.READ || message?.isRead}
                      isOwn={false}
                      dataConversation={dataConversation}
                    />
                  )}
                </div>
              </div>
              {!message?.owner && !message?.deletedForAll && (
                <div className={classNames('relative cursor-pointer z-10 ml-2', styles.msgOption)}>
                  <Popover
                    showArrow={false}
                    overlayClassName={styles.msgOptionPopover}
                    content={() => (
                      <div
                        className="p-4 hover:bg-[#F7F7F7]"
                        onClick={() =>
                          useConfirm({
                            width: 560,
                            textCancel: t('modalConfirm.no'),
                            textOk: t('modalConfirm.yes'),
                            title: t('modalConfirm.message'),
                            description: (
                              <div>
                                <p className="text-[#636363]">{t('message.deleteConfirmation.title')}</p>
                                <p className="text-[#636363]">{t('message.deleteConfirmation.description')}</p>
                              </div>
                            ),
                            onOk: () => handleDeleteMsg(messageDeleteType.onlyMe, message?._id),
                          })
                        }
                      >
                        <div className="cursor-pointer flex justify-start items-center">
                          <DeleteTagIcon />
                          <span className="ml-2 text-sm">{t('message.deleteForMe')}</span>
                        </div>
                      </div>
                    )}
                  >
                    <div
                      className={classNames(
                        'flex justify-center items-center w-[32px] h-[32px] mr-2 border-[1px] border-[#E8E9EE] rounded-[100px]',
                        styles.iconDropdown
                      )}
                    >
                      <DropDownIcon2 />
                    </div>
                  </Popover>
                </div>
              )}
            </div>
          </Flex>
        );
        return (
          <div
            id={`message_${message?._id}`}
            className={classNames(
              `mt-4 flex ${isMessageSystem ? 'justify-center' : message?.owner ? 'justify-end' : 'justify-start'} items-center overflow-x-clip`,
              styles.msg
            )}
          >
            {message?.owner && !message?.deletedForAll && (
              <div className={classNames('relative cursor-pointer z-10', styles.msgOption)}>
                <Popover
                  showArrow={false}
                  overlayClassName={styles.msgOptionPopover}
                  content={() => (
                    <>
                      <div
                        className="p-4 hover:bg-[#F7F7F7]"
                        onClick={() =>
                          useConfirm({
                            ...settingConfirm,
                            onOk: () => handleDeleteMsg(messageDeleteType.onlyMe, message?._id),
                          })
                        }
                      >
                        <div className="cursor-pointer flex justify-start items-center">
                          <DeleteTagIcon />
                          <span className="ml-2 text-sm">{t('message.deleteForMe')}</span>
                        </div>
                      </div>
                      {dayjs().diff(message?.createdAt, 'minute') < 60 && (
                        <div
                          className="p-4 hover:bg-[#F7F7F7]"
                          onClick={() =>
                            useConfirm({
                              ...settingConfirm,
                              description: (
                                <div>
                                  <p className="text-[#636363]">{t('message.confirmDelete')}</p>
                                  <p className="text-[#636363]">{t('message.confirmDeleteDes')}</p>
                                </div>
                              ),
                              onOk: () => handleDeleteMsg(messageDeleteType.all, message?._id),
                            })
                          }
                        >
                          <div className="cursor-pointer flex justify-start items-center">
                            <DeleteTagIcon />
                            <span className="ml-2 text-sm">{t('message.deleteForEveryone')}</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                >
                  <div
                    className={classNames(
                      'flex justify-center items-center w-[32px] h-[32px] mr-2 border-[1px] border-[#E8E9EE] rounded-[100px]',
                      styles.iconDropdown
                    )}
                  >
                    <DropDownIcon2 />
                  </div>
                </Popover>
              </div>
            )}
            {isMessageSystem ? renderSystemMessage : message?.owner ? renderOwnerMessage() : renderNonOwnerMessage()}
          </div>
        );
      };
      if (!!message?.isNextDate) {
        return (
          <>
            {<MsgComponent key={message?.id || index} />}
            <div className="my-8 h-[1px] w-full border-[1px] border-[#E8E9EE] flex justify-center items-center">
              <div className="w-fit px-4 bg-[#FFF] text-[#636363] text-xs text-center">
                {dayjs(message.createdAt).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
                  ? 'Today'
                  : dayjs(message.createdAt).format('MMMM DD, YYYY')}
              </div>
            </div>
          </>
        );
      }
      return <MsgComponent key={message?.id || index} />;
    });
  };

  return (
    <div className="relative h-full">
      <div className={styles.contentMessage}>
        {loading ? (
          <div className="w-full h-[60vh] flex justify-center items-center">
            <Spin />
          </div>
        ) : (
          <>
            <div className={classNames('flex-1 overflow-y-auto', styles.customScrollBar)}>
              {listDetailMessage?.length > 0 ? (
                <InfiniteScroll
                  dataLength={listDetailMessage?.length || 0}
                  next={onNextPage}
                  hasMore={hasNextPage}
                  loader={
                    <div className="flex justify-center mt-[20px]">
                      <Spin />
                    </div>
                  }
                  inverse={true}
                  height={window.innerHeight - 300}
                  className={classNames(
                    isSM ? '' : 'h-[320px]',
                    'scroll-bar  py-4 px-[16px] mr-[5px] flex flex-col-reverse'
                  )}
                >
                  <div ref={lastMsgRef} />
                  {renderListMsg()}
                </InfiniteScroll>
              ) : null}
            </div>
            <div className=" h-auto w-full absolute bottom-0 border-t-[1px] border-color-[#fffaaa] z-10 rounded-b-[15px] rounded-tl-none rounded-tr-none">
              <InputMessage defaultValue={''} handleSendMsg={sendMessage} setRoomActive={changeRoomActive} />
            </div>
          </>
        )}
      </div>
      {/* <DrawerEditMember
        open={openDrawerEditMember}
        onClose={() => {
          setOpenDrawerEditMember(false);
        }}
      /> */}
    </div>
  );
};

export default ChatMessage;
