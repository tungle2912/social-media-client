import { UserType } from "~/definitions/types/types";

export type TSample = {
  attr: string;
};
export interface Response<TData> {
  message: string;
  result: TData;
}

export interface ErrorResponse<TData> {
  message: string;
  data?: TData;
}

export type RefreshTokenResponse = Response<{
  access_token: string;
}>;

export type AuthResponse = Response<{
  refresh_token: string;
  access_token: string;
  user: UserType;
}>;
export type SendOtpResponse = Response<{
  otp_id: string;
}>;
export type GetProfileResponse = Response<UserType>;
