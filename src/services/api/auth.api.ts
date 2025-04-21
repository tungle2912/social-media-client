import { publicPost, publicPut, sendDelete } from "~/api/request";

export const authApi = {
  register: (values: { email: string; password: string; confirm_password: string }) => {
    return publicPost("/api/auth/register", values)
  },
  logout: () => {
    return sendDelete("/api/auth/logout")
  },
  emailVerify: (values: { email_verify_token: string }) => {
    return publicPost("/api/auth/verify-email", values)
  },
  sendOtpForgotPassword: (values: { email: string }) => {
    return publicPost("/api/auth/send-otp-forgot-password", values)
  },
  verifyOtpForgotPassword: (values: { otp_id: string; otp: string }) => {
    return publicPost("/api/auth/verify-otp-forgot-password", values)
  },
  resetPassword: (values: { email: string; password: string; otp_id: string }) => {
    return publicPut("/api/auth/reset-password", values)
  }
}
