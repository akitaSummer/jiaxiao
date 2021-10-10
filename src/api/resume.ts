import Taro from "@tarojs/taro";
import { baseUrl } from "./";

export const resumePost = async (
  access_token: string,
  type: string,
  target: string,
  target_name: string,
  resume: string,
  production: string | null
) =>
  await Taro.request({
    url: `${baseUrl}/bg/post`,
    header: {
      AccessToken: access_token
    },
    data: {
      type,
      target,
      target_name,
      resume,
      production
    },
    method: "POST"
  });
