import Taro from "@tarojs/taro";

import { userUrl } from "./";

export const getHistoryList = async (access_token: string) =>
  await Taro.request({
    url: `${userUrl}/schedules`,
    method: "GET",
    header: {
      AccessToken: access_token
    }
  });
