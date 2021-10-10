import { UPDATECURRENTORDER, DATAS_ERROR } from "../constants";

export const updateCurrentOrder = (data?: {
  content: string;
  headUrl: string;
  orderId: string;
  point: number;
  receiveTime: string;
  taskId: string;
  userId: string;
  userName: string;
}) => {
  return data
    ? {
        type: UPDATECURRENTORDER,
        data
      }
    : {
        type: UPDATECURRENTORDER,
        data: DATAS_ERROR
      };
};
