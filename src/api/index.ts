import Taro from "@tarojs/taro";

export * from "./user";
export * from "./wx";
export * from "./datas";
export * from "./search";
export * from "./resume";
export * from "./history";
export * from "./order";
export * from "./station";
export * from "./task";
export * from "./manage";
export const userUrl =
  Taro.getEnv() === "WEB" ? "/bg" : "https://doudou0.online/bg";
export const baseUrl = Taro.getEnv() === "WEB" ? "/" : "https://doudou0.online";
export const recommendsUrl =
  Taro.getEnv() === "WEB" ? "/rec" : "https://doudou0.online/rec";

export const jiaxiaoBaseUrl = "http://121.41.104.45:8080";
