import Taro from "@tarojs/taro";

import { jiaxiaoBaseUrl } from ".";

export const manageList = async (
  access_token: string,
  pageNum: number,
  pageSize: number,
  positionId: string
) =>
  await Taro.request<{
    hasMore: boolean;
    list: {
      content: string;
      headUrl: string;
      orderId: string;
      point: number;
      receiveTime: string;
      taskId: string;
      userId: string;
      userName: string;
    }[];
    pageNum: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }>({
    url: `${jiaxiaoBaseUrl}/jxwx/task/manage/list`,
    method: "POST",
    data: {
      pageNum,
      pageSize,
      positionId
    },
    header: {
      AccessToken: access_token
    }
  });

export const manageDetail = async (access_token: string, taskId: string) =>
  await Taro.request<{
    title: string;
    content: string;
    gps: string;
    headUrl: string;
    orderFlows: string[];
    orderId: string;
    phone: string;
    point: 0;
    receiveTime: string;
    status: string;
    taskId: string;
    userId: string;
    userName: string;
  }>({
    url: `${jiaxiaoBaseUrl}/jxwx/task/manage/detail`,
    method: "POST",
    data: {
        taskId
    },
    header: {
      AccessToken: access_token
    }
  });
