'use client';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDimension } from '~/hooks';
import styles from './styles.module.scss';
import ListMessage from '~/modules/message/listMessage';
import ChatMessage from '~/modules/message/chatMessage';

export default function MessageContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  const { isSM } = useDimension();
  const queryClient = useQueryClient();
//   useEffect(() => {
//     queryClient.resetQueries(['LIST_MESSAGE']);
//   }, []);

  return (
    <div className="flex h-full rounded-[10px] overflow-hidden">
      {(!isSM || !roomId) && (
        <div className={styles.messageList}>
          <ListMessage />
        </div>
      )}
      {(!isSM || roomId) && (
        <div className={styles.messageDetail}>
          <ChatMessage  />
        </div>
      )}
    </div>
  );
}
