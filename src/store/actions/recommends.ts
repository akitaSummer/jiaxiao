import {
  UPDATER_ECOMMENDS_LIST,
  RECOMMENDS_ERROR,
  RECOMMENDS_CLEARTYPE,
  UPDATE_CURRENT_RECOMMEND
} from "../constants";

import { RecommendType } from "../reducers";

export const updateCurrentRecommend = (data?: RecommendType) => {
  return data
    ? {
        type: UPDATE_CURRENT_RECOMMEND,
        data
      }
    : {
        type: UPDATE_CURRENT_RECOMMEND
      };
};

export const updateRecommendsList = (data?: RecommendType[]) => {
  return data
    ? {
        type: UPDATER_ECOMMENDS_LIST,
        data
      }
    : {
        type: RECOMMENDS_ERROR,
        data: UPDATER_ECOMMENDS_LIST
      };
};

export const recommendsClearType = () => {
  return {
    type: RECOMMENDS_CLEARTYPE
  };
};
