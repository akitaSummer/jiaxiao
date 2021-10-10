import Taro from "@tarojs/taro";
import {
  UPDATER_ECOMMENDS_LIST,
  RECOMMENDS_ERROR,
  RECOMMENDS_CLEARTYPE,
  UPDATE_CURRENT_RECOMMEND
} from "../constants";

export type RecommendType = {
  depFullName: string;
  description: string;
  jobId: string;
  name: string;
  num: number;
  origin: string;
  reqEducationName: string;
  reqWorkYearsName: string;
  requirement: string;
  type: "social" | "school";
  workPlace: string;
};

export type RecommendsStateType = {
  currentRecommend?: RecommendType;
  recommendsList: RecommendType[];
  actionType: string;
  errMsg: string;
};

export const RECOMMENDS_INITIAL_STATE: RecommendsStateType = {
  recommendsList: [],
  currentRecommend: null,
  actionType: "DEFAULT",
  errMsg: ""
};

export default (state = RECOMMENDS_INITIAL_STATE, actions) => {
  switch (actions.type) {
    case UPDATER_ECOMMENDS_LIST:
      return {
        ...state,
        actionType: actions.type,
        recommendsList: actions.data
      };
    case UPDATE_CURRENT_RECOMMEND: {
      return {
        ...state,
        actionType: actions.type,
        currentRecommend: actions.data
      };
    }
    case RECOMMENDS_ERROR:
      return {
        ...state,
        actionType: actions.type,
        errMsg: actions.data
      };
    case RECOMMENDS_CLEARTYPE:
      return {
        ...state,
        actionType: RECOMMENDS_CLEARTYPE
      };

    default:
      return {
        ...state,
        actionType: actions.type
      };
  }
};
