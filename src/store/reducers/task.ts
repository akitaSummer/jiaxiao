import {
  UPDATECURRENTTASK,
  UPDATEORDERDETAIL,
  UPDATETASKDETTAIL
} from "../constants";

export type TaskType = {
  content: string;
  headUrl: string;
  orderId: string;
  point: number;
  receiveTime: string;
  taskId: string;
  userId: string;
  userName: string;
};

export type TaskStateType = {
  currentTask?: TaskType;
  actionType: string;
  orderDertail?: {
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
  };
  taskEdit?: {
    content: string;
    invalidTime: string;
    point: number;
    positionId: string;
    title: string;
  };
};

export const TASK_INITIAL_STATE: TaskStateType = {
  currentTask: null,
  actionType: "DEFAULT"
};

export default (state = TASK_INITIAL_STATE, actions) => {
  switch (actions.type) {
    case UPDATECURRENTTASK:
      return {
        ...state,
        actionType: actions.type,
        currentTask: actions.data
      };
    case UPDATEORDERDETAIL:
      return {
        ...state,
        actionType: actions.type,
        orderDetail: actions.data
      };
    case UPDATETASKDETTAIL: {
      const { content, invalidTime, point, positionId, title } = actions.data;
      return {
        ...state,
        actionType: actions.type,
        taskEdit: {
          content,
          invalidTime,
          point,
          positionId,
          title
        }
      };
    }
    default:
      return {
        ...state,
        actionType: actions.type
      };
  }
};
