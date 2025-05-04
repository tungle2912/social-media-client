import { Avatar, Dropdown, Popover, Tooltip } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { DeleteTagIcon, ThreeDotIcon } from '~/common/icon';
import SmartTooltip from '~/common/smartTooltip';
import Button from '~/components/form/Button';
import { ConversationMessageStatus, ConversationType } from '~/definitions/models/message';
import { convertTimeStampToStringDate } from '~/lib/utils';
import styles from './styles.module.scss';
import { useDimension } from '~/hooks';

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
  onOpenChat: (conversationId: string) => void;
}
export default function ListMessageItem({
  item,
  onMouseMoveChatMessage,
  flatListMessagesLength,
  index,
  activeRoom,
  refetchListMessage,
  renderPreviewMsg,
  moveEnter_id,
  setActivityAccountInfo,
  setActivityAccountType,
  onOpenChat
}: itemProps) {
  const t = useTranslations();
  const router = useRouter();
  const { data } = useSession();
  const { isSM } = useDimension();
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
      onClick={() => onOpenChat(item._id)}
    >
      <div className="">
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
            {item?.lastMessage?.status === ConversationMessageStatus.UNREAD && item?._id !== activeRoom ? (
              <div>
                <Avatar className="bg-primary w-[14px] h-[14px]"></Avatar>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
