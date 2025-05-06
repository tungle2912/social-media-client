/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/rules-of-hooks */
import { Avatar, Flex, Popover, Spin } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { useTranslations } from 'next-intl';
import useConfirm from '~/hooks/useConfirm';
import styles from './styles.module.scss';
import { useDimension } from '~/hooks';
import { DeleteTagIcon, DocumentDownloadIcon, DropDownIcon2 } from '~/common/icon';
import SmartTooltip from '~/common/smartTooltip';
import {
  ConversationMessageStatus,
  ConversationType,
  MESSAGE_TYPE,
  TYPE_DELETE_MESSAGE,
} from '~/definitions/models/message';
import { getUsername } from '~/services/helpers';
import MediaMessage from '~/modules/message/MediaMessage';
import SendTime from '~/modules/message/chatMessage/SendTime';
import image from '@/static/image';
import { useRouter } from 'next/navigation';
import { convertLinksToAnchors, parseFile, parseMedia } from '~/lib/helper';
import Image from 'next/image';
import { messageType } from '~/definitions/enums/index.enum';
import { useEffect, useRef, useState } from 'react';
import { useGetPostByIdQuery } from '~/hooks/data/post.data';
import HeaderPost from '~/modules/profile/postItems/headerPost';
import ContentPost from '~/modules/profile/postItems/contentPost';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import PostItem from '~/modules/profile/postItems';

interface MessageItemProps {
  message: any;
  handleDeleteMsg: (type: string, message_id: string) => Promise<void>;
  listMedia: any;
  listDocs: any;
  index: number;
  dataConversation: any;
}
const SYSTEM_MESSAGE_MAP: Record<string, string> = {
  [messageType.CreateGroup]: 'message.groupCreatedBy',
  [messageType.AddMember]: 'message.memberAdded',
  [messageType.RemoveMember]: 'message.memberRemoved',
  [messageType.JoinGroup]: 'message.memberJoined',
  [messageType.LeaveGroup]: 'message.memberLeft',
};

const MessageItem = ({ message, handleDeleteMsg, listDocs, listMedia, index, dataConversation }: MessageItemProps) => {
  const t = useTranslations();
  const [postId, setPostId] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const postRef = useRef<any>(null);
  const { data: postDetail, refetch, error: postError, status: postStatus } = useGetPostByIdQuery(postId);
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
  useEffect(() => {
    if (postRef.current) {
      const scale = Math.min(100 / postRef.current.offsetWidth, 200 / postRef.current.offsetWidth);
      postRef.current.style.transformOrigin = 'center';
      postRef.current.style.transform = `scale(${scale})`;
    }
  }, [selectedPost]);
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
  useEffect(() => {
    if (message?.type === messageType.Post) {
      setPostId(message?.additionalData?._id);
    }
  }, [message]);

  const handleDownload = () => {
    const listDownload = [...listMedia, ...listDocs];
    listDownload?.forEach((item) => {
      saveAs(item?.url);
    });
  };
  const router = useRouter();
  const { isSM } = useDimension();
  const isMessageSystem = message?.type && [
    messageType.CreateGroup,
    messageType.AddMember,
    messageType.RemoveMember,
    messageType.JoinGroup,
    messageType.LeaveGroup,
  ].includes(message.type);

  const messageText = SYSTEM_MESSAGE_MAP[message.type]
    ? t(SYSTEM_MESSAGE_MAP[message.type])
    : t('message.unknownAction');
  return (
    <div
      id={`message_${message?._id}`}
      className={classNames(
        `mt-4 flex ${isMessageSystem ? 'justify-center' : message?.owner ? 'justify-end' : 'justify-start'} items-center`,
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
                      onOk: () => handleDeleteMsg(TYPE_DELETE_MESSAGE.ONLY_ME, message?._id),
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
                            <p className="text-[#636363]">{t('message.deleteConfirmation.title')}</p>
                            <p className="text-[#636363]">{t('message.deleteConfirmation.description')}</p>
                          </div>
                        ),
                        onOk: () => handleDeleteMsg(TYPE_DELETE_MESSAGE.ALL, message?._id),
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
      {isMessageSystem ? (
        <div className="px-[16px] text-sm max-w-[100%] py-[6px] rounded-[10px] bg-[#F7F7F7] text-[#333333] flex gap-2 items-center">
          {message.user?.avatar ? (
            <Avatar src={message.user?.avatar || ''} alt={t('avatar')} className={styles.avatarUserIcon} />
          ) : (
            <div className={styles.avatarUserIcon}>{message.user.user_name}</div>
          )}
          <span className="text-xs font-medium">{message.user?.user_name}</span>
          <span className="text-xs text-lg">{messageText}</span>
        </div>
      ) : message?.owner ? (
        <div className="w-fit max-w-[70%] px-[16px] py-[12px] rounded-[10px] bg-[#f7f0ff]">
          <div
            className="text-sm break-words text-[#333333]"
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
                      <div className={styles.avatarUser}>{getUsername(message?.user?.basicPersonalInfo, true)}</div>
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
              {message?.additionalData && message?.type === messageType.Post && (
                <Flex className="flex flex-col bg-base-black-600 rounded-[10px] mt-[4px] px-3 py-2">
                  <Flex className="gap gap-3 py-2 flex  border-b-[1px]">
                    {errorMessage ? (
                      <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
                        <ExclamationCircleOutlined className="text-red-500 text-4xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
                        <p className="text-gray-600 text-center">{errorMessage}</p>
                      </div>
                    ) : selectedPost ? (
                      <div className="max-h-[90vh] overflow-y-auto p-4">
                        <PostItem openComment={true} post={selectedPost} isPreview refetch={refetch} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center min-h-[300px]">
                        <Spin />
                      </div>
                    )}
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
                isRead={message?.deliveredByUsers?.length === 0 || message?.isRead}
                isOwn={true}
                deliveredByUsers={message?.deliveredByUsers}
                readByUsers={message?.readByUsers}
                lastMsg={index === 0}
                dataConversation={dataConversation}
                key={message?._id}
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
                  {message?.user?.user_name}
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
                    {message?.additionalData && message?.type === messageType.Post && (
                      <Flex className="flex flex-col bg-base-black-600 rounded-[10px] mt-[4px] px-3 py-2">
                        <Flex className="gap gap-3 py-2 flex  border-b-[1px]">
                          {errorMessage ? (
                            <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
                              <ExclamationCircleOutlined className="text-red-500 text-4xl mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
                              <p className="text-gray-600 text-center">{errorMessage}</p>
                            </div>
                          ) : selectedPost ? (
                            <div className="max-h-[90vh] overflow-y-auto p-4">
                              <PostItem openComment={true} post={selectedPost} isPreview refetch={refetch} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center min-w-[200px] min-h-[300px]">
                              <Spin />
                            </div>
                          )}
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
};
export default MessageItem;
