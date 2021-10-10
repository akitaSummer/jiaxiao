import { UPDATECURRENTMANAGE, UPDATEORDERDETAIL } from "../constants";

export type ManageType = {
  content: string;
  headUrl: string;
  orderId: string;
  point: number;
  receiveTime: string;
  taskId: string;
  userId: string;
  userName: string;
};

export type ManageStateType = {
  currentManage?: ManageType;
  actionType: string;
  orderManage?: {
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

export const MANAGE_INITIAL_STATE: ManageStateType = {
  currentManage: null,
  actionType: "DEFAULT"
};

export default (state = MANAGE_INITIAL_STATE, actions) => {
  switch (actions.type) {
    case UPDATECURRENTMANAGE:
      return {
        ...state,
        actionType: actions.type,
        currentManage: actions.data
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
