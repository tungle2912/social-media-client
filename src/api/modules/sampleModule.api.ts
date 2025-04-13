import { sendGet } from '~/api/request';

export const getDataSample = (param1: string) => sendGet('url', { param1 });
