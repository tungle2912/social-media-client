import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '~/services/api/notification.api';

export const useGetNotificationAllQuery = function ({
  page,
  limit,
  status,
}: {
  page: number;
  limit: number;
  status: number;
}) {
  return useQuery({
    queryKey: ['NOTIFICATIONS', page, status, limit],
    queryFn: function () {
      return notificationApi.getNotifications({ limit: limit, page: page, status: status });
    },
  });
};
export const useGetCountNotificationCountQuery = function () {
  return useQuery({
    queryKey: ['NOTIFICATIONS_COUNT'],
    queryFn: notificationApi.getNotificationCount,
  });
};
export const useReadNotificationMutation = function () {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.readNotification,
    onSuccess: function () {
      queryClient.invalidateQueries({
        queryKey: ['NOTIFICATIONS'],
      });
    },
  });
};
export const useMarkAllAsReadMutation = function () {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: function () {
      queryClient.invalidateQueries({
        queryKey: ['NOTIFICATIONS'],
      });
    },
  });
};
