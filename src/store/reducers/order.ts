import { UPDATECURRENTORDER, UPDATEORDERDETAIL } from "../constants";

export type OrderType = {
  content: string;
  headUrl: string;
  orderId: string;
  point: number;
  receiveTime: string;
  taskId: string;
  userId: string;
  userName: string;
};

export type OriderStateType = {
  currentOrder?: OrderType;
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
};

export const ORDER_INITIAL_STATE: OriderStateType = {
  currentOrder: null,
  actionType: "DEFAULT"
};

export default (state = ORDER_INITIAL_STATE, actions) => {
  switch (actions.type) {
    case UPDATECURRENTORDER:
      return {
        ...state,
        actionType: actions.type,
        currentOrder: actions.data
      };
    case UPDATEORDERDETAIL:
      return {
        ...state,
        actionType: actions.type,
        orderDetail: actions.data
      };
    default:
      return {
        ...state,
        actionType: actions.type
      };
  }
};
