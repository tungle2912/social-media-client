import { useInfiniteQuery } from '@tanstack/react-query';
import { Avatar, Dropdown, Empty, List, Menu, Skeleton } from 'antd';
import classNames from 'classnames';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ThreeDotBorderIcon } from '~/common/icon';
import { SOCKET_EVENT_KEY } from '~/definitions/constants/index.constant';
import { useSocket } from '~/provider/socketProvider';
import { notificationApi } from '~/services/api/notification.api';
import styles from './styles.module.scss';
import { useRouter } from 'next/navigation';

const NotificationPopover = () => {
  const [filter, setFilter] = useState('all');
  const t = useTranslations();
  const socket = useSocket();
  const router = useRouter();
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: ['notifications', filter],
    queryFn: ({ pageParam = 1 }) =>
      notificationApi.getNotifications({
        page: pageParam,
        limit: 10,
        ...(filter === 'unread' && { status: 0 }),
      }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.result.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const notifications = useMemo(() => {
    return data?.pages.flatMap((page) => page.result.notifications) || [];
  }, [data]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationApi.readNotification(id);
      refetch();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };
  useEffect(() => {
    if (socket) {
      socket.on(SOCKET_EVENT_KEY.NOTIFICATION, async () => {
        await refetch();
      });
    }
  }, [socket]);

  const menu = (id: string) => (
    <Menu>
      <Menu.Item key="mark-as-read" onClick={() => handleMarkAsRead(id)}>
        {t('notification.markAsRead')}
      </Menu.Item>
    </Menu>
  );
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const getNotificationContent = (notification: any) => {
    const { token, params } = notification;
    return t(`notification.${token}`, params);
  };
  const handleClickNoti = (noti: any) => {
    handleMarkAsRead(noti._id);
    router.push(noti.link);
  };
  return (
    <div className={styles.popoverContent}>
      {isLoading ? (
        <div className="flex justify-center mt-[20px]">
          <Skeleton />
        </div>
      ) : (
        <>
          <h1 className={styles.title}>Notification</h1>
          <div className={styles.filter}>
            <div
              onClick={() => setFilter('all')}
              className={classNames(styles.buttonFiler, filter === 'all' && styles.active)}
            >
              All
            </div>
            <div
              onClick={() => setFilter('unread')}
              className={classNames(styles.buttonFiler, filter === 'unread' && styles.active)}
            >
              Unread
            </div>
          </div>
          <InfiniteScroll
            dataLength={notifications.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={
              isFetchingNextPage ? (
                <div className="flex justify-center mt-[20px]">
                  <Skeleton />
                </div>
              ) : null
            }
            height={400}
          >
            <List
              className={styles.list}
              locale={{
                emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No notifications" />,
              }}
            >
              {notifications?.length === 0 ? (
                <div className="flex justify-center mt-[20px] px-[20px]">
                  <span className="text-base-black text-[16px]">{t('conversation.noMessage')}</span>
                </div>
              ) : (
                notifications.map((notification) => (
                  <List.Item
                    className={clsx(styles.listItem, notification.isRead ? '' : styles.unread)}
                    key={notification._id}
                    onClick={() => handleClickNoti(notification)}
                    actions={[
                      <Dropdown key={notification._id} overlay={menu(notification.id)} trigger={['click']}>
                        <div className=" bg-transparent rounded-[5px]">
                          <ThreeDotBorderIcon />
                        </div>
                      </Dropdown>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar size={45} src={notification.params.senderAvatar} />}
                      title={
                        <p className="font-medium">{t(`notification.${notification.token}`, notification.params)}</p>
                      }
                      description={formatDate(notification.createdAt)}
                    />
                    {/* {notification.params?.contentPreview && (
                      <div className={styles.contentPreview}>{notification.params?.contentPreview}</div>
                    )} */}
                  </List.Item>
                ))
              )}
            </List>
          </InfiniteScroll>
        </>
      )}
    </div>
  );
};

export default NotificationPopover;
