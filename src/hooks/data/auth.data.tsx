'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleError } from '~/lib/utils';

import { authApi } from '~/services/api/auth.api';

// Hàm đăng ký người dùng
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['REGISTER'], // Làm mới dữ liệu liên quan đến "REGISTER"
      });
    },
  });
};

// Hàm đăng xuất
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['USER'], // Làm mới dữ liệu liên quan đến người dùng
      });
    },
  });
};

// Xác minh email
export const useEmailVerifyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.emailVerify,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['EMAIL_VERIFICATION'], // Làm mới liên quan đến xác minh email
      });
    },
  });
};

// Gửi OTP cho quên mật khẩu
export const useSendOtpForgotPasswordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.sendOtpForgotPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['FORGOT_PASSWORD_OTP'], // Làm mới OTP cho quên mật khẩu
      });
    },
  });
};

// Xác minh OTP cho quên mật khẩu
export const useVerifyOtpForgotPasswordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.verifyOtpForgotPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['VERIFY_FORGOT_PASSWORD_OTP'], // Làm mới sau khi xác minh OTP
      });
    },
  });
};

// Đặt lại mật khẩu
export const useResetPasswordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['RESET_PASSWORD'], // Làm mới sau khi đặt lại mật khẩu
      });
    },
    onError: handleError,
  });
};
