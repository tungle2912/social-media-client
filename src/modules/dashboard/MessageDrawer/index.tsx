import { Avatar, Drawer } from 'antd';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import React from 'react';
import styles from './styles.module.scss';

import SmartTooltip from '~/common/smartTooltip';
import { ConversationType } from '~/definitions/models/message';
import { ArrowExpandIcon, CloseIcon } from '~/common/icon';
import ChatMessage from '~/modules/dashboard/MessageDrawer/ChatMessage';
import { useRouter } from 'next/navigation';

interface Props {
  open: boolean;
  onClose: () => void;
  message: any;
  firstMessageRender?: React.ReactNode;
}

const MessagePopup: React.FC<Props> = ({ open, onClose, message, firstMessageRender }) => {
  const t = useTranslations();
  const router = useRouter();
  const hasConveration = !!message?._id;
  return (
    <Drawer
      height="90%"
      closable={false}
      placement="bottom"
      open={open}
      onClose={() => onClose()}
      className={styles.drawerMessage}
      title={
        <div className="flex justify-between items-center border-b-[1px] border-[#E8E9EE] pb-[8px] h-[53px]">
          <div className="flex items-center gap-[8px] h-[32px]">
            <div className="flex items-center gap-[8px] h-[48px]">
              <div className="flex items-center gap-[8px]">
                <div className="relative">
                  {message?.avatar ? (
                    <Avatar className="bg-[#fff0f6] w-[40px] h-[40px]" src={message?.avatar || ''} />
                  ) : (
                    <Avatar className="bg-[#fff0f6] w-[40px] h-[40px]">
                      <span className="text-[#eb2f96] text-base font-bold">{message?.title?.charAt(0)}</span>
                    </Avatar>
                  )}
                  {message?.isOnline && (
                    <div className={classNames(styles.status, styles.online, 'absolute right-[2px] bottom-0')} />
                  )}
                  {!message?.isOnline && message?.type === ConversationType.DIRECT_MESSAGE && (
                    <div className={classNames(styles.status, styles.offline, 'absolute right-[2px] bottom-0')} />
                  )}
                </div>
                <div>
                  <SmartTooltip className="text-[#3E3E3E] font-bold max-w-[150px]" text={message?.title} />
                  {message?.isOnline && <div className="text-[#636363]">{t('activityStatus.active')}</div>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-[16px]">
            {hasConveration && (
              <div
                className="cursor-pointer"
                onClick={() => router.push(`/message?roomId=${message._id}`)}
              >
                <ArrowExpandIcon />
              </div>
            )}
            <div onClick={onClose}>
              <CloseIcon />
            </div>
          </div>
        </div>
      }
    >
      <div className="bg-[#ffffff]">
        <div className="bg-[#ffffff] border-t-[1px] border-[#E8E9EE] mx-[20px]" />
      </div>
      <div className={classNames('bg-[#FFFFFF] transition-[max-height] duration-500 ease-in-out overflow-hidden')}>
        {firstMessageRender ? firstMessageRender : <ChatMessage message={message} />}
        <div className="border-t-[1px] border-[#E8E9EE]" />
      </div>
    </Drawer>
  );
};

export default MessagePopup;
