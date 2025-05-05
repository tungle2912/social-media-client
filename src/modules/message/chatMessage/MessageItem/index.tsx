/* eslint-disable react-hooks/rules-of-hooks */
import { Avatar, Flex, Popover } from 'antd';
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
import { convertLinksToAnchors } from '~/lib/helper';
import Image from 'next/image';

interface MessageItemProps {
  message: any;
  handleDeleteMsg: (type: string, message_id: string) => Promise<void>;
  listMedia: any;
  listDocs: any;
  index: number;
  dataConversation: any;
}

const MessageItem = ({ message, handleDeleteMsg, listDocs, listMedia, index, dataConversation }: MessageItemProps) => {
  const t = useTranslations();
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
  const handleDownload = () => {
    const listDownload = [...listMedia, ...listDocs];
    listDownload?.forEach((item) => {
      saveAs(item?.url);
    });
  };
  const router = useRouter();
  const { isSM } = useDimension();

  return (
    <div
      id={`message_${message?._id}`}
      className={classNames(`mt-4 flex ${message?.owner ? 'justify-end' : 'justify-start'} items-center`, styles.msg)}
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
      {message?.owner ? (
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
                      <div className={styles.avatarUserSmall}>{getUsername(message?.additionalData?.owner, true)}</div>
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
