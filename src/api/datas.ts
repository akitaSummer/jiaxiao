import Taro from "@tarojs/taro";

import { userUrl, recommendsUrl } from "./";

export const getSchoolList = async (name: string) =>
  await Taro.request({
    url: `${userUrl}/school?name=${name}`,
    method: "GET"
  });

export const getCitysList = async () =>
  await Taro.request({
    url: `${recommendsUrl}/citys`,
    method: "GET"
  });

export const getTags = async () =>
  await Taro.request({
    url: `${recommendsUrl}/tags`,
    method: "GET"
  });

export const submitComment = async (
  access_token: string,
  id: number,
  comment: string
) =>
  await Taro.request({
    url: `${userUrl}/comment`,
    method: "POST",
    data: {
      comment,
      id
    },
    header: {
      AccessToken: access_token
    }
  });
