import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useDimension } from '~/hooks';
import styles from './styles.module.scss';

export default function MessageContainer() {
  const router = useRouter();
  const { roomId } = router.query;
  const { isSM } = useDimension();
  const queryClient = useQueryClient();
//   useEffect(() => {
//     queryClient.resetQueries(['LIST_MESSAGE']);
//   }, []);

  return (
    <div className="flex h-full">
      {(!isSM || !roomId) && (
        <div className={styles.messageList}>
          {/* <ListMessage /> */}
        </div>
      )}
      {(!isSM || roomId) && (
        <div className={styles.messageDetail}>
          {/* <ChatMessage listMessage={undefined} /> */}
        </div>
      )}
    </div>
  );
}
