const API_BASE_URL = '/api'

export const AUTH_ROUTES = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
  SEND_OTP_FORGOT_PASSWORD: `${API_BASE_URL}/auth/send-otp-forgot-password`,
  VERIFY_OTP_FORGOT_PASSWORD: `${API_BASE_URL}/auth/verify-otp-forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  LOGOUT: `${API_BASE_URL}/auth/logout`
}

export const USER_ROUTES = {
  PROFILE: `${API_BASE_URL}/users/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/user/update-profile`
}
