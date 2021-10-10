import Taro from "@tarojs/taro";

import { jiaxiaoBaseUrl } from ".";

export const addTask = async ({
  content,
  invalidTime,
  point,
  positionId,
  title
}: {
  content: string;
  invalidTime: string;
  point: number;
  positionId: string;
  title: string;
}) =>
  await Taro.request<{
    content: string;
    headUrl: string;
    point: number;
    publishTime: string;
    taskId: string;
    title: string;
    userId: string;
    userName: string;
  }>({
    url: `${jiaxiaoBaseUrl}/jxwx/task/add`,
    method: "POST",
    data: {
      content,
      invalidTime,
      point,
      positionId,
      title
    }
  });

export const OverTask = async (taskId: string) =>
  await Taro.request<boolean>({
    url: `${jiaxiaoBaseUrl}/jxwx/task/manage/over`,
    method: "POST",
    data: {
      taskId
    }
  });

export const undoTask = async (taskId: string) =>
  await Taro.request<boolean>({
    url: `${jiaxiaoBaseUrl}/jxwx/task/manage/undo`,
    method: "POST",
    data: {
      taskId
    }
  });

export const receiveTask = async (taskId: string) =>
  await Taro.request<boolean>({
    url: `${jiaxiaoBaseUrl}/jxwx/task/receive`,
    method: "POST",
    data: {
      taskId
    }
  });

export const updateTask = async ({
  content,
  invalidTime,
  point,
  positionId,
  title,
  taskId
}: {
  content: string;
  invalidTime: string;
  point: number;
  positionId: string;
  title: string;
  taskId: string;
}) =>
  await Taro.request<{
    content: string;
    headUrl: string;
    point: number;
    publishTime: string;
    taskId: string;
    title: string;
    userId: string;
    userName: string;
  }>({
    url: `${jiaxiaoBaseUrl}/jxwx/task/manage/update`,
    method: "POST",
    data: {
      content,
      invalidTime,
      point,
      positionId,
      title,
      taskId
    }
  });

export const taskList = async (
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
    url: `${jiaxiaoBaseUrl}/jxwx/task/list`,
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

export const taskDetail = async (access_token: string, taskId: string) =>
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
    url: `${jiaxiaoBaseUrl}/jxwx/task/detail`,
    method: "POST",
    data: {
      taskId
    },
    header: {
      AccessToken: access_token
    }
  });
