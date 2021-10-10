import Taro from "@tarojs/taro";
import {
  UPDATESCHOOLLIST,
  UPDATE_CITYS_LIST,
  UPDATE_TAGS_LIST,
  DATAS_ERROR,
  DATAS_CLEARTYPE
} from "../constants";

export type TagType = {
  canChoose: boolean;
  children?: (TagType & { parentCode: string })[];
  code: string;
  name: string;
};

export type DatasStateType = {
  schoolList: string[];
  citysList: { title: string; value: string[] }[];
  tagsList: TagType[];
  actionType: string;
  errMsg: string;
};

export const DATAS_INITIAL_STATE: DatasStateType = {
  schoolList: [],
  citysList: [],
  tagsList: [],
  actionType: "DEFAULT",
  errMsg: ""
};

export default (state = DATAS_INITIAL_STATE, actions) => {
  switch (actions.type) {
    case UPDATESCHOOLLIST:
      return {
        ...state,
        actionType: actions.type,
        schoolList: actions.data
      };
    case UPDATE_CITYS_LIST:
      return {
        ...state,
        actionType: actions.type,
        citysList: actions.data
      };
    case UPDATE_TAGS_LIST:
      return {
        ...state,
        actionType: actions.type,
        tagsList: actions.data
      };
    case DATAS_ERROR:
      return {
        ...state,
        actionType: actions.type,
        errMsg: actions.data
      };
    case DATAS_CLEARTYPE:
      return {
        ...state,
        actionType: DATAS_CLEARTYPE
      };
    default:
      return {
        ...state,
        actionType: actions.type
      };
  }
};
