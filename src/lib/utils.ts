import { message } from "antd";


export const handleError = (error: any) => {
  if (error?.response?.data?.message) {
    return message.error(error.response.data.message);
  } else if (error?.message) {
    return message.error(error.message);
  } else {
    return message.error("Something went wrong");
  }
};
