import Taro from "@tarojs/taro";
import { UserInfoEditType } from "../store";
import { userUrl, jiaxiaoBaseUrl } from "./";

export const initDbInfo = async (access_token: string, userinfo: any) =>
  await Taro.request({
    header: {
      AccessToken: "86VKsGiSETkPNnkr2Bd5KQ=="
    },
    url: `${jiaxiaoBaseUrl}/jxwx/user/finish`,
    data: {
      ...userinfo
    },
    method: "POST"
  });

export const login = async (code: string) =>
  await Taro.request({
    url: `${jiaxiaoBaseUrl}/jxwx/user/login`,
    data: {
      code
    },
    method: "POST"
  });

export const getUserInfo = async (access_token: string) =>
  await Taro.request({
    header: {
      AccessToken: access_token
    },
    url: `${jiaxiaoBaseUrl}/jxwx/user/info`,
    method: "GET"
  });

export const updateUser = async (
  access_token: string,
  data: UserInfoEditType
) =>
  await Taro.request({
    header: {
      AccessToken: access_token
    },
    url: `${userUrl}/users`,
    data: {
      ...data
    },
    method: "PUT"
  });

export const uploadFile = async (
  access_token: string,
  name: string,
  path: string,
  type: string
) => {
  await Taro.uploadFile({
    url: `${userUrl}/files`,
    filePath: path,
    name: "file",
    header: {
      AccessToken: access_token
    },
    formData: {
      fileName: name,
      type
    }
  });
};

export const getResumesList = async (access_token: string) =>
  await Taro.request({
    url: `${userUrl}/resumes`,
    method: "GET",
    header: {
      AccessToken: access_token
    }
  });

export const delFile = async (access_token: string, id: number) =>
  await Taro.request({
    url: `${userUrl}/resumes/${id}`,
    method: "DELETE",
    header: {
      AccessToken: access_token
    }
  });

export const downloadFile = async (access_token: string, path, name) =>
  await Taro.downloadFile({
    url: `${userUrl}/files?path=${path}&filename=${name}`,
    header: {
      AccessToken: access_token
    }
  });
