import { Avatar } from 'antd';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import SmartTooltip from '~/common/smartTooltip';
import { ConversationType } from '~/definitions/models/message';
import ChatMessage from '~/modules/dashboard/MessageDrawer/ChatMessage';
import styles from './styles.module.scss';
import { CloseIcon, MinimizeIcon } from '~/common/icon';
import { useSocket } from '~/provider/socketProvider';
export default function ChatBox({ conversation, onClose }: any) {
  const [isMinimized, setIsMinimized] = useState(false);
  const socket: any = useSocket();
  useEffect(() => {
    if (conversation?._id && !!socket) {
      socket.emit('join-room', {
        room: conversation?._id,
      });
    }
  }, [conversation]);
  const renderGeneralRoomInfo = useCallback(() => {
    if (conversation?.type === ConversationType.DIRECT_MESSAGE) {
      return (
        <>
          <div className="relative cursor-pointer mr-3" onClick={() => {}}>
            {conversation?.partner.avatar ? (
              <Avatar src={conversation?.partner.avatar || ''} alt={'avatar'} className={styles.avatarUser} />
            ) : (
              <div className={styles.avatarUser}>{conversation?.title}</div>
            )}
            {conversation?.isOnline && (
              <div className={classNames(styles.status, styles.online, 'absolute right-[2px] bottom-0')}></div>
            )}
            {!conversation?.isOnline && (
              <div className={classNames(styles.status, styles.offline, 'absolute right-[2px] bottom-0')}></div>
            )}
          </div>
          <div className="w-full">
            <SmartTooltip
              className="text-base-black-200 font-bold text-[16px] max-w-[35rem] cursor-pointer hover:underline"
              onClick={() => {}}
              text={conversation?.partner.user_name || conversation?.title}
            />
          </div>
        </>
      );
    } else if (conversation?.type === ConversationType.GROUP_CHAT) {
      return (
        <>
          <div className="relative cursor-pointer mr-3">
            {conversation?.avatar ? (
              <Avatar src={conversation?.avatar || ''} alt={'avatar'} className={styles.avatarUser} />
            ) : (
              <div className={styles.avatarUser}>{conversation?.title ? conversation.title.charAt(0) : ''}</div>
            )}
          </div>
          <div className="w-full">
            <SmartTooltip
              className="text-base-black-200 font-bold text-[16px] max-w-[35rem] cursor-pointer hover:underline"
              onClick={() => {}}
              text={ conversation?.title}
            />
          </div>
        </>
      );
    }

    return null;
  }, [conversation]);
  return (
    <div
      style={{
        width: '350px',
        background: '#fff',
        border: '1px solid #ccc',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px',
          borderBottom: '1px solid #eee',
          background: '#f6f6f6',
          borderTopLeftRadius: '15px',
          borderTopRightRadius: '15px',
          overflow: 'hidden',
        }}
      >
        {renderGeneralRoomInfo()}
        <div className="flex gap-[5px]">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{ marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <MinimizeIcon />
          </button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <CloseIcon />
          </button>
        </div>
      </div>
      {!isMinimized && (
        <div style={{ height: '433px' }}>
          <ChatMessage _id={conversation._id} />
        </div>
      )}
    </div>
  );
}
