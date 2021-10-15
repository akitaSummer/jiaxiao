import {
  UPDATECURRENTTASK,
  DATAS_ERROR,
  UPDATETASKDETTAIL
} from "../constants";

export const updateCurrentTask = (data?: {
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
        type: UPDATECURRENTTASK,
        data
      }
    : {
        type: UPDATECURRENTTASK,
        data: DATAS_ERROR
      };
};

export const updateTaskEdit = data => {
  return {
    type: UPDATETASKDETTAIL,
    data
  };
};
