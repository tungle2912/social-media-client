export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}
export enum RoleType {
  Admin,
  User
}
export interface LoginResponse {
  access_token: string
  refresh_token: string
  role: RoleType
}

export interface LoginValues {
  email: string
  password: string
}
export interface RegisterValues {
  email: string
  password: string
  confirm_password: string
}

export interface VerifyEmailValues {
  email_verify_token: string
}
export interface sendOtpForgotPasswordValues {
  email: string
}
export interface verifyOtpForgotPasswordValues {
  otp: string
  otp_id: string
}
export interface resetPasswordValues {
  email: string
  otp_id: string
  password: string
  confirm_password: string
}

export interface APIResponse<T = Record<string, any>> {
  response: {
    data: {
      errors: {
        email: {
          msg: string
        }
        otp: {
          msg: string
        }
      }
      message: string
      result: T
    }
  }
}
