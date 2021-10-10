import { UPDATECURRENTMANAGE, DATAS_ERROR } from "../constants";

export const updateCurrentManage = (data?: {
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
        type: UPDATECURRENTMANAGE,
        data
      }
    : {
        type: UPDATECURRENTMANAGE,
        data: DATAS_ERROR
      };
};
