/* eslint-disable react-hooks/rules-of-hooks */
import { useInfiniteQuery } from '@tanstack/react-query';
import { Avatar, Flex, Image, Popover, Spin, Tooltip } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDimension } from '~/hooks';
import { useSocket } from '~/provider/socketProvider';
import useListOnline from '~/stores/listOnline.data';
import styles from './styles.module.scss';
import { QUERY_KEY } from '~/definitions/models';
import { messageApi } from '~/services/api/message.api';
import {
  ConversationMessageStatus,
  ConversationType,
  MESSAGE_TYPE,
  TYPE_DELETE_MESSAGE,
} from '~/definitions/models/message';
import { handleError } from '~/lib/utils';
import { contactApi } from '~/services/api/contact.api';
import { CancelledIcon, DeleteTagIcon, DocumentDownloadIcon, DropDownIcon2, IconRead, IconSent } from '~/common/icon';
import SmartTooltip from '~/common/smartTooltip';
import useConfirm from '~/hooks/useConfirm';
import { convertLinksToAnchors } from '~/lib/helper';
import { getUsername } from '~/services/helpers';
import MediaMessage from '~/modules/message/MediaMessage';
import image from '@/static/image';
import InputMessage from '~/modules/dashboard/MessageDrawer/ChatMessage/InputMessage';

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
  const [hasNextPage, setHasNexPage] = useState<boolean>(true);
  const lastMsgRef = useRef<HTMLParagraphElement | null>(null);
  const [openDrawerEditMember, setOpenDrawerEditMember] = useState<boolean>(false);
  const [isNewMsg, setIsNewMsg] = useState<boolean>(true);
  const { data: sessionData } = useSession();
  const profile = sessionData?.user;
  useEffect(() => {
    setListDetailMessage([]);
    setHasNexPage(true);
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
  const getMediaMessage = async (newMsg) => {
    try {
      const res: any = await connect.getMediaMessage(newMsg?.uuid);
      if (res?.code === CODE.OK) {
        setListDetailMessage((prev) => [{ ...newMsg, conversationMessageMedias: res?.data }, ...prev]);
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (socket) {
      socket.on('NEW_MESSAGE', async (message: any) => {
        setDataMessageResponse((prev: any) => [message, ...prev]);
      });
    }
  }, [roomId, socket]);
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

      const fetchData = async () => {
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
      };

      fetchData();
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
    setParamsDetailMsg((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
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
    formData.append('type', (files?.length || documents?.length) > 0 ? MESSAGE_TYPE.MEDIA : MESSAGE_TYPE.TEXT);
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
      const res: any = await messageApi.createConversationMessage(formData);
      // if (!!res) {
      //   setListDetailMessage((prev: any) => [
      //     {
      //       ...res.result,
      //       isScroll: true,
      //       owner: true,
      //       createdAt: dayjs(),
      //       isNextDate:
      //         listDetailMessage?.length > 0 &&
      //         dayjs(listDetailMessage[0]?.createdAt).format('YYYY-MM-DD') !== dayjs().format('YYYY-MM-DD'),
      //     },
      //     ...prev,
      //   ]);
      // }
    } catch (error) {}
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

    const handleDeleteMsg = async (type, messageUuid) => {
      // try {
      //   const res: any = await connect.deleteMessage(roomId, messageUuid, {
      //     deleteType: type,
      //   });
      //   if (res?.code === CODE.OK) {
      //     const newList = listDetailMessage.map((msg) => {
      //       if (msg?.uuid === messageUuid)
      //         return { ...msg, isDeleted: true, message: t('messageLocale.deletedByUser') };
      //       return msg;
      //     });
      //     setListDetailMessage(newList);
      //   }
      // } catch (error) {}
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

    return listDetailMessage.map((message, index) => {
      const listMedia = message?.medias;
      const listDocs = message?.attachments;

      const handleDownload = () => {
        const listDownload = [...listMedia, ...listDocs];
        listDownload?.forEach((item) => {
          saveAs(item?.url);
        });
      };

      const MsgComponent = () => (
        <div
          id={`message_${message?._id}`}
          className={classNames(
            `mt-4 flex ${message?.owner ? 'justify-end' : 'justify-start'} items-center overflow-x-clip`,
            styles.msg
          )}
        >
          {message?.owner && !message?.deletedAt && !message?.isDeleted && (
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
                          onOk: () => handleDeleteMsg(TYPE_DELETE_MESSAGE.ONLY_ME, message?.uuid),
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
                            onOk: () => handleDeleteMsg(TYPE_DELETE_MESSAGE.ALL, message?.uuid),
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
          {message?.owner ? (
            <div className="w-fit max-w-[70%] px-[16px] py-[12px] rounded-[10px] bg-[#f7f0ff]">
              <div
                className="text-sm break-words text-[#333333] max-w-[390px]"
                dangerouslySetInnerHTML={{
                  __html:
                    message?.deletedAt || message?.isDeleted
                      ? `<i>${message?.message}</i>`
                      : convertLinksToAnchors(message?.message),
                }}
              ></div>
              {message?.createdAt && !message?.deletedAt && !message?.isDeleted && (
                <>
                  {message?.additionalData && message?.type === MESSAGE_TYPE.PROFILE && (
                    <Flex className="flex flex-col bg-[white] px-3 py-2">
                      <Flex className="gap gap-2 py-2 flex justify-center items-center border-b-[1px]">
                        {message.additionalData?.basicPersonalInfo?.profilePhoto ? (
                          <Avatar
                            src={message.additionalData?.basicPersonalInfo?.profilePhoto || ''}
                            alt="avatar"
                            className={styles.avatarUser}
                          />
                        ) : (
                          <div className={styles.avatarUser}>{message?.partner?.user_name}</div>
                        )}
                        <div>
                          <SmartTooltip
                            className="text-base-black-200 font-bold text-[16px] max-w-[35rem]"
                            text={`${message.additionalData?.basicPersonalInfo?.firstName} ${message.additionalData?.basicPersonalInfo?.lastName}`}
                          />
                          <p className="mt-[4px] text-base-black-300 text-[12px]">
                            {dataConversation?.partner?.experiences?.companyName}
                          </p>
                          <p className="mt-[4px] text-base-black-300 text-[12px]">
                            {message.additionalData?.basicPersonalInfo?.cityOfResidence}
                          </p>
                        </div>
                      </Flex>
                      <Flex className="mt-2">
                        <u className="py-2 leading-6 cursor-pointer text-[#333333]">{t('messageLocale.viewProfile')}</u>
                      </Flex>
                    </Flex>
                  )}
                  {message?.additionalData && message?.type === MESSAGE_TYPE.POST && (
                    <Flex className="flex flex-col bg-base-black-600 rounded-[10px] mt-[4px] px-3 py-2">
                      <Flex className="gap gap-2 py-2 flex  border-b-[1px]">
                        {message.additionalData?.owner?.profilePhoto ? (
                          <Avatar
                            src={message.additionalData?.owner?.profilePhoto || ''}
                            alt="avatar"
                            className={styles.avatarUserSmall}
                          />
                        ) : (
                          <div className={styles.avatarUserSmall}>
                            {getUsername(message?.additionalData?.owner, true)}
                          </div>
                        )}
                        <div>
                          <SmartTooltip
                            className="text-base-black-200 font-bold text-[16px] max-w-[35rem]"
                            text={`${message.additionalData?.owner?.firstName} ${message.additionalData?.owner?.lastName}`}
                          />
                          <a
                            href={`${process.env.NEXT_PUBLIC_DOMAIN}/community/${message?.additionalData.uuid}`}
                            target="_blank"
                            className="text-sm not-italic font-normal leading-[24px] mt-[4px] text-base-blue-500 "
                            rel="noreferrer"
                          >
                            {' '}
                            {`${process.env.NEXT_PUBLIC_DOMAIN}/community/${message?.additionalData.uuid}`}{' '}
                          </a>
                        </div>
                      </Flex>
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
                  <SendTime
                    createdAt={message?.createdAt}
                    isRead={message?.deliveredByUsers?.length === 0}
                    isOwn={true}
                    deliveredByUsers={message?.deliveredByUsers}
                    readByUsers={message?.readByUsers}
                  />
                </>
              )}
            </div>
          ) : (
            <Flex className="w-full">
              <div className="mr-2 relative cursor-pointer" onClick={() => {}}>
                {message?.user?.avatar ? (
                  <Avatar src={message?.user?.avatar || ''} alt={t('avatar')} className={styles.avatar} />
                ) : (
                  <div className={styles.avatar}>message?.user?.user_name</div>
                )}
                {message?.isOnline && (
                  <div className={classNames(styles.status, styles.online, 'absolute right-[2px] top-[30px]')}></div>
                )}
              </div>
              <div className="max-w-[80%] w-fit flex justify-center items-center">
                <div>
                  {dataConversation?.type === ConversationType.GROUP_CHAT && (
                    <strong onClick={() => {}} className="text-xs cursor-pointer hover:underline">
                      {getUsername(message?.user?.basicPersonalInfo)}
                    </strong>
                  )}
                  <div
                    className={classNames(
                      'px-[16px] w-full  py-[12px] rounded-[10px] bg-[#F7F7F7]',
                      dataConversation?.type === ConversationType.GROUP_CHAT ? 'mt-1' : ''
                    )}
                  >
                    <div
                      className="text-sm break-words text-[#333333] break-all"
                      dangerouslySetInnerHTML={{
                        __html:
                          message?.deletedAt || message?.isDeleted
                            ? `<i>${message?.message}</i>`
                            : convertLinksToAnchors(message?.message),
                      }}
                    ></div>
                    {message?.createdAt && !message?.deletedAt && !message?.isDeleted && (
                      <>
                        {message?.additionalData && message?.type === MESSAGE_TYPE.PROFILE && (
                          <Flex className="flex flex-col bg-[white] px-3 py-2">
                            <Flex
                              className={`w-[${isSM ? 40 : 15}vw] gap gap-2 py-2 flex justify-start items-center border-b-[1px]`}
                            >
                              {message.additionalData?.basicPersonalInfo?.profilePhoto ? (
                                <Avatar
                                  src={message.additionalData?.basicPersonalInfo?.profilePhoto || ''}
                                  alt={t('avatar')}
                                  className={styles.avatarUser}
                                />
                              ) : (
                                <div className={styles.avatarUser}>
                                  {getUsername(message?.user?.basicPersonalInfo, true)}
                                </div>
                              )}
                              <div>
                                <SmartTooltip
                                  className="text-base-black-200 font-bold text-[16px] max-w-[35rem]"
                                  text={`${message.additionalData?.basicPersonalInfo?.firstName} ${message.additionalData?.basicPersonalInfo?.lastName}`}
                                />
                              </div>
                            </Flex>
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
                        {message?.additionalData && message?.type === MESSAGE_TYPE.POST && (
                          <Flex className="flex flex-col bg-base-black-600 rounded-[10px] mt-[4px] px-3 py-2">
                            <Flex className="gap gap-3 py-2 flex  border-b-[1px]">
                              {message.additionalData?.owner?.profilePhoto ? (
                                <Avatar
                                  src={message.additionalData?.owner?.profilePhoto || ''}
                                  alt={t('avatar')}
                                  className={styles.avatarUserSmall}
                                />
                              ) : (
                                <div className={styles.avatarUserSmall}>
                                  {getUsername(message?.additionalData?.owner, true)}
                                </div>
                              )}
                              <div>
                                <SmartTooltip
                                  className="text-base-black-200 font-bold text-[16px] max-w-[35rem]"
                                  text={`${message.additionalData?.owner?.firstName} ${message.additionalData?.owner?.lastName}`}
                                />
                                <a
                                  href={`${process.env.NEXT_PUBLIC_DOMAIN}/community/${message?.additionalData._id}`}
                                  target="_blank"
                                  className="text-sm not-italic font-normal leading-[24px] mt-[4px] text-base-blue-500 line-clamp-2"
                                  rel="noreferrer"
                                >
                                  {' '}
                                  {`${process.env.NEXT_PUBLIC_DOMAIN}/community/${message?.additionalData._id}`}{' '}
                                </a>
                              </div>
                            </Flex>
                          </Flex>
                        )}
                        {listMedia?.length > 0 && (
                          <MediaMessage listMedia={listMedia} handleDownload={handleDownload} />
                        )}
                        {listMedia?.length < 1 && listDocs?.length > 0 && (
                          <div className="flex justify-end">
                            <div className={styles.btnAction} onClick={handleDownload}>
                              <DocumentDownloadIcon />
                            </div>
                          </div>
                        )}
                        {listDocs?.length > 0 &&
                          listDocs.map((doc: any, i: any) => (
                            <div className={styles.documentFile} key={i}>
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
                        {message?.createdAt && !message?.deletedAt && !message?.isDeleted && (
                          <SendTime
                            createdAt={message?.createdAt}
                            isRead={message?.status === ConversationMessageStatus.READ || message?.isRead}
                            isOwn={false}
                            dataConversation={dataConversation}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
                {!message?.owner && !message?.deletedAt && !message?.isDeleted && (
                  <div className={classNames('relative cursor-pointer z-10 ml-2', styles.msgOption)}>
                    <Popover
                      showArrow={false}
                      overlayClassName={styles.msgOptionPopover}
                      content={() => (
                        <div
                          className="p-4 hover:bg-[#F7F7F7]"
                          onClick={() =>
                            useConfirm({
                              ...settingConfirm,
                              onOk: () => handleDeleteMsg(TYPE_DELETE_MESSAGE.ONLY_ME, message?._id),
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
          )}
        </div>
      );
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
                  hasMore={!!hasNextPage}
                  loader={
                    <div className="flex justify-center mt-[20px]">
                      <Spin />
                    </div>
                  }
                  inverse={true}
                  height={window.innerHeight - 300}
                  className={classNames(
                    isSM ? '' : 'h-[350px]',
                    'scroll-bar  py-4 px-[16px] mr-[5px] flex flex-col-reverse'
                  )}
                >
                  <div ref={lastMsgRef} />
                  {renderListMsg()}
                </InfiniteScroll>
              ) : null}
            </div>
            <div className=" h-auto w-full absolute bottom-0 border-t-[1px] border-color-[#fffaaa] z-10 rounded-b-[15px] rounded-tl-none rounded-tr-none">
              <InputMessage defaultValue={''} handleSendMsg={sendMessage} />
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
