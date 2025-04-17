import { RoleType } from "~/definitions/enums/index.enum";

export interface APIResponse<T = Record<string, any>> {
  response: {
    data: {
      errors: {
        email: {
          msg: string;
        };
        otp: {
          msg: string;
        };
      };
      message: string;
      result: T;
    };
  };
}
  
export interface LoginResponse {
    access_token: string
    refresh_token: string
    role: RoleType
  }
  
  export interface LoginValues {
    email: string
    password: string
    role: number
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
  