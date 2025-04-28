import { Avatar, Dropdown, Popover, Tooltip } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import SmartTooltip from '~/common/smartTooltip';
import Button from '~/components/form/Button';
import styles from '../styles.module.scss';
import { ConversationMessageStatus, ConversationType, IPartnerTag } from '~/definitions/models/message';
import { getUsername } from '~/services/helpers';
import { convertTimeStampToStringDate } from '~/lib/utils';
import { DeleteTagIcon, ThreeDotIcon } from '~/common/icon';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface itemProps {
  item: any;
  onMouseMoveChatMessage: (type: string, item_id: string) => void;
  flatListMessagesLength: number;
  index: any;
  activeRoom: string | undefined;
  refetchListMessage: () => void;
  setActivityAccountInfo: (info: any) => void;
  setActivityAccountType: (type: any) => void;
  moveEnter_id: string;
  renderPreviewMsg: (lastMsg: any) => TrustedHTML;
  openMoreMessage: boolean;
  setOpenMoreMessage: (open: boolean) => void;
  isLoadingDeleteConservation: boolean;
  onDeleteConservation: (event: any, conservation_id: string) => void;
  disableDeleteConversation: boolean;
}
export default function MessageItem({
  item,
  onMouseMoveChatMessage,
  flatListMessagesLength,
  index,
  activeRoom,
  refetchListMessage,
  renderPreviewMsg,
  disableDeleteConversation,
  moveEnter_id,
  isLoadingDeleteConservation,
  onDeleteConservation,
  openMoreMessage,
  setActivityAccountInfo,
  setActivityAccountType,
  setOpenMoreMessage,
}: itemProps) {
  const partnerTagItems = item?.partnerTag?.map((partnerTag: IPartnerTag, partnerTagIndex: number) => ({
    key: partnerTagIndex,
    value: partnerTag.tag.id,
    label: <SmartTooltip text={partnerTag.tag.name} className="text-[#636363]" />,
  }));
  const t = useTranslations();
  const router = useRouter();
  const { data } = useSession();
  return (
    <div
      key={item?._id}
      onMouseEnter={() => onMouseMoveChatMessage('enter', item?._id)}
      onMouseLeave={() => onMouseMoveChatMessage('leave', '')}
      className={classNames('pr-0 hover:bg-[#F8F8FF] cursor-pointer hover:rounded-[10px] pb-[16px] pt-[12px]', {
        ['border-b-[1px] border-color-[#E8E9EE]']: flatListMessagesLength - 1 !== index,
        ['mt-[12px]']: index,
        ['bg-[#F8F8FF] rounded-[10px]']: activeRoom === item?._id,
      })}
      onClick={() => {
        refetchListMessage();
        if (item?.type === ConversationType.NOT_CHATTED) {
          router.push(`/message`);
        } else {
          router.push(`/message?roomId=${item?._id}`);
        }
        setActivityAccountInfo(data?.user);
        setActivityAccountType(item?.type);
      }}
    >
      <div className="px-[12px]">
        <div className="flex gap-[8px] items-center">
          <div className="relative">
            <Avatar
              className="bg-[#fff0f6] w-[56px] h-[56px]"
              src={item?.type === ConversationType.GROUP_CHAT ? item?.avatar : item.partner?.avatar || ''}
            >
              {(item?.type !== ConversationType.GROUP_CHAT && !item.partner?.avatar) ||
              (item?.type === ConversationType.GROUP_CHAT && !item?.avatar) ? (
                <span className="text-[#eb2f96] text-base font-bold">
                  {item?.type === ConversationType.GROUP_CHAT ? item?.title?.charAt(0) : item.partner?.title?.charAt(0)}
                </span>
              ) : null}
            </Avatar>

            {item?.isOnline && (
              <div className={classNames(styles.status, styles.online, 'absolute right-[2px] bottom-0')}></div>
            )}
            {!item?.isOnline && item?.type !== ConversationType.GROUP_CHAT && (
              <div className={classNames(styles.status, styles.offline, 'absolute right-[2px] bottom-0')} />
            )}
          </div>
          <div className="flex justify-between items-center gap-[8px] w-full">
            <div className="w-full">
              <div className="flex justify-between items-center gap-[20px]">
                <SmartTooltip
                  className="text-[#3E3E3E] font-bold max-w-[60%] sm:max-w-[50%]"
                  text={item?.type === ConversationType.DIRECT_MESSAGE ? item?.partner?.user_name : item?.title}
                />
                {moveEnter_id !== item._id && (
                  <Tooltip
                    className="text-[#1C1C28] text-[12px]"
                    title={
                      item?.lastMessage?.createdAt
                        ? dayjs(item?.lastMessage?.createdAt).format('MMM D, YYYY [at] h:mm A')
                        : ''
                    }
                  >
                    {item?.lastMessage?.createdAt ? convertTimeStampToStringDate(item.lastMessage.createdAt) || '' : ''}
                  </Tooltip>
                )}
              </div>
              <div
                style={
                  item?.lastMessage?.status === ConversationMessageStatus.UNREAD && item?._id !== activeRoom
                    ? { fontWeight: 'bold' }
                    : {}
                }
                className="line-clamp-1 text-[#1C1C28]"
                dangerouslySetInnerHTML={{
                  __html: item?.lastMessage?.systemMessage
                    ? `<i>${item?.lastMessage?.message}</i>`
                    : renderPreviewMsg(item?.lastMessage),
                }}
              ></div>
            </div>
            {moveEnter_id === item._id ? (
              <Popover
                trigger={['click']}
                arrow={false}
                open={openMoreMessage}
                onOpenChange={(e) => setOpenMoreMessage(e)}
                className={styles.dropdownReaction}
                placement="bottomLeft"
                content={() => {
                  return (
                    <Button
                      loading={isLoadingDeleteConservation}
                      type="link"
                      className="py-[12px] h-[48px] w-[198px]"
                      onClick={(event) => onDeleteConservation(event, item?._id)}
                    >
                      <div className={classNames('flex gap-[14px] items-center w-full')}>
                        <DeleteTagIcon />
                        <span className="text-[#3E3E3E]">{t('delete')}</span>
                      </div>
                    </Button>
                  );
                }}
                getPopupContainer={(trigger: HTMLElement) => trigger}
              >
                {!disableDeleteConversation && (
                  <div
                    className=""
                    onClick={(event) => {
                      event.stopPropagation();
                      setOpenMoreMessage(true);
                    }}
                  >
                    <ThreeDotIcon />
                  </div>
                )}
              </Popover>
            ) : item?.lastMessage?.status === ConversationMessageStatus.UNREAD && item?._id !== activeRoom ? (
              <div>
                <Avatar className="bg-primary w-[14px] h-[14px]"></Avatar>
              </div>
            ) : null}
          </div>
        </div>
        {item?.partnerTag?.length ? (
          <div className={classNames(styles.tags, 'w-full')}>
            {item?.partnerTag?.slice(0, 3)?.map((item: IPartnerTag) => (
              <div key={item.id} className={classNames(styles.tag, 'w-[100px]')}>
                <SmartTooltip text={item.tag.name} className="text-[#636363]" />
              </div>
            ))}
            {item?.partnerTag.slice(3)?.length > 0 ? (
              <Dropdown
                menu={{ items: partnerTagItems }}
                placement="bottomRight"
                rootClassName={styles.dropdownTag}
                trigger={['hover']}
                getPopupContainer={(trigger: HTMLElement) => trigger}
                dropdownRender={() => {
                  return (
                    <div className={styles.dropdownRender}>
                      {item?.partnerTag.slice(3).map((partnerTag: IPartnerTag) => (
                        <div key={partnerTag.id} className={styles.item}>
                          <div className="text-white line-clamp-1">
                            <SmartTooltip text={partnerTag?.tag.name} />
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }}
              >
                <div
                  className="flex shrink-0 px-[8px] py-[4px] justify-center items-center gap-[10px] rounded-[5px] border-[1px] border-solid border-[#E8E9EE] bg-[#F7F7F7] cursor-pointer text-[#2268FA] text-[14px] font-bold"
                  onClick={(event) => event?.stopPropagation()}
                >
                  {`+${item?.partnerTag.slice(3).length}`}
                </div>
              </Dropdown>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
