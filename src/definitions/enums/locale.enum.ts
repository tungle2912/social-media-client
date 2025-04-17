/* eslint-disable no-shadow */
export enum ELocale {
  EN = 'en',
  VN = 'vn',
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
