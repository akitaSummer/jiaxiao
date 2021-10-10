import Taro from "@tarojs/taro";

import { jiaxiaoBaseUrl } from ".";

export const lastStation = async () =>
  await Taro.request<{
    id: string;
    name: string;
  }>({
    url: `${jiaxiaoBaseUrl}/jxwx/station/last/select`,
    method: "GET"
  });

export const updateStation = async (stationId: string) =>
  await Taro.request<boolean>({
    url: `${jiaxiaoBaseUrl}/jxwx/station/last/select/update`,
    method: "POST",
    data: {
      stationId
    }
  });

export const stationList = async (searchVal: string) =>
  await Taro.request<
    {
      id: string;
      name: string;
    }[]
  >({
    url: `${jiaxiaoBaseUrl}/jxwx/station/list`,
    method: "POST",
    data: {
      searchVal
    }
  });
