import Taro from "@tarojs/taro";

import { jiaxiaoBaseUrl } from ".";

export const cancelOrder = async (access_token: string, orderId: string) =>
  await Taro.request<boolean>({
    url: `${jiaxiaoBaseUrl}/jxwx/order/cancel`,
    method: "POST",
    data: {
      orderId
    },
    header: {
      AccessToken: access_token
    }
  });

export const orderDetail = async (access_token: string, orderId: string) =>
  await Taro.request<{
    title: string
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
    url: `${jiaxiaoBaseUrl}/jxwx/order/detail`,
    method: "POST",
    data: {
      orderId
    },
    header: {
      AccessToken: access_token
    }
  });

export const finshOrder = async (access_token: string, orderId: string) =>
  await Taro.request<boolean>({
    url: `${jiaxiaoBaseUrl}/jxwx/order/finish`,
    method: "POST",
    data: {
      orderId
    },
    header: {
      AccessToken: access_token
    }
  });

export const orderList = async (
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
    url: `${jiaxiaoBaseUrl}/jxwx/order/list`,
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
