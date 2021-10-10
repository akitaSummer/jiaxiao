import {
  DATAS_CLEARTYPE,
  DATAS_ERROR,
  UPDATESCHOOLLIST,
  UPDATE_CITYS_LIST,
  UPDATE_TAGS_LIST
} from "../constants";
import { TagType } from "../reducers";
import { getSchoolList, getCitysList, getTags } from "../../api";

export const updateSchoolList = (data?: string[]) => {
  return data
    ? {
        type: UPDATESCHOOLLIST,
        data
      }
    : {
        type: DATAS_ERROR,
        data: UPDATESCHOOLLIST
      };
};

export const updateCitysList = (data?: string[]) => {
  return data
    ? {
        type: UPDATE_CITYS_LIST,
        data
      }
    : {
        type: DATAS_ERROR,
        data: UPDATE_CITYS_LIST
      };
};

export const updateTagsList = (data?: TagType[]) => {
  return data
    ? {
        type: UPDATE_TAGS_LIST,
        data
      }
    : {
        type: DATAS_ERROR,
        data: UPDATE_TAGS_LIST
      };
};

export const datasClearType = () => {
  return {
    type: DATAS_CLEARTYPE
  };
};

export const asyncUpdateSchoolList = (name: string) => async dispatch => {
  try {
    const { data, statusCode, errMsg } = await getSchoolList(name);
    if (statusCode < 200 || statusCode >= 300) {
      throw new Error(errMsg);
    }
    dispatch(updateSchoolList(data.map(item => item.name)));
  } catch (e) {
    dispatch(updateSchoolList());
    console.log(e);
    throw e;
  }
};

export const asyncUpdateCitysList = () => async dispatch => {
  try {
    const { data, statusCode, errMsg } = await getCitysList();
    if (statusCode < 200 || statusCode >= 300) {
      throw new Error(errMsg);
    }
    dispatch(updateCitysList(data));
  } catch (e) {
    dispatch(updateCitysList());
    console.log(e);
    throw e;
  }
};

export const asyncUpdateTagsList = () => async dispatch => {
  try {
    const { data, statusCode, errMsg } = await getTags();
    if (statusCode < 200 || statusCode >= 300) {
      throw new Error(errMsg);
    }
    dispatch(updateTagsList(data));
  } catch (e) {
    dispatch(updateTagsList());
    console.log(e);
    throw e;
  }
};
