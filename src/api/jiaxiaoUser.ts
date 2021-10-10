import Taro from "@tarojs/taro";

import { jiaxiaoBaseUrl } from ".";

export const userAchievement = async () =>
  await Taro.request<
    {
      category: string;
      list: {
        category: string;
        finishTime: string;
        finishUrl: string;
        hasFinish: boolean;
        name: string;
        notFinishUrl: string;
        prize: {
          key: string;
          value: string;
        }[];
      }[];
    }[]
  >({
    url: `${jiaxiaoBaseUrl}/jxwx/user/achievement`,
    method: "GET"
  });

export const jiaxiaoUserInfo = async () =>
  await Taro.request<{
    headUrl: string;
    point: number;
    userId: string;
    userName: string;
  }>({
    url: `${jiaxiaoBaseUrl}/jxwx/user/info`,
    method: "GET"
  });

export const jiaxiaoLogin = async (code: string) =>
  await Taro.request<{
    accessToken: string;
  }>({
    url: `${jiaxiaoBaseUrl}/jxwx/user/login`,
    data: {
      code
    },
    method: "POST"
  });

export const jiaxiaoDetail = async () =>
  await Taro.request<{
    birthday: string;
    email: string;
    professional: string;
    realName: string;
    school: string;
    sex: string;
  }>({
    url: `${jiaxiaoBaseUrl}/jxwx/user/real/detail`,
    method: "GET"
  });

export const jiaxiaoUserUpdate = async ({
  birthday,
  email,
  professional,
  realName,
  school,
  sex
}: {
  birthday: string;
  email: string;
  professional: string;
  realName: string;
  school: string;
  sex: string;
}) =>
  await Taro.request<{
    birthday: string;
    email: string;
    professional: string;
    realName: string;
    school: string;
    sex: string;
  }>({
    url: `${jiaxiaoBaseUrl}/jxwx/user/real/update`,
    data: {
      birthday,
      email,
      professional,
      realName,
      school,
      sex
    },
    method: "POST"
  });
