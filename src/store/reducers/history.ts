import Taro from "@tarojs/taro";
import {
  UPDATER_HISTORY_LIST,
  UPDATE_CURRENT_HISTORY,
  HISTORY_ERROR,
  HISTORY_CLEARTYPE
} from "../constants";

export type SchedulesType = {
  company: string;
  create_time: string;
  id: number;
  status: string;
  status_name: string;
  target: string | null;
  target_name: string;
  type: string;
  user_id: number;
};

export type HistoryStateType = {
  currentHistory?: SchedulesType;
  historyList: SchedulesType[];
  actionType: string;
  errMsg: string;
};

export const HISTORY_INITIAL_STATE: HistoryStateType = {
  historyList: [],
  currentHistory: null,
  actionType: "DEFAULT",
  errMsg: ""
};

export default (state = HISTORY_INITIAL_STATE, actions) => {
  switch (actions.type) {
    case UPDATER_HISTORY_LIST:
      return {
        ...state,
        actionType: actions.type,
        historyList: actions.data
      };
    case UPDATE_CURRENT_HISTORY: {
      return {
        ...state,
        actionType: actions.type,
        currentHistory: actions.data
      };
    }
    case HISTORY_ERROR:
      return {
        ...state,
        actionType: actions.type,
        errMsg: actions.data
      };
    case HISTORY_CLEARTYPE:
      return {
        ...state,
        actionType: HISTORY_CLEARTYPE
      };

    default:
      return {
        ...state,
        actionType: actions.type
      };
  }
};
