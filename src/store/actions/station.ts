import {
  UPDATE_CURRENT_STATION,
  STATION_ERROR,
  CURRENT_STATION,
  UPDATER_STATION_LIST
} from "../constants";

export const updateCurrentStation = (data?: { id: string; name: string }) => {
  return data
    ? {
        type: UPDATE_CURRENT_STATION,
        data
      }
    : {
        type: UPDATE_CURRENT_STATION,
        data: STATION_ERROR
      };
};

export const updateStationList = (
  data?: {
    id: string;
    name: string;
  }[]
) => {
  return data
    ? {
        type: UPDATER_STATION_LIST,
        data
      }
    : {
        type: UPDATE_CURRENT_STATION,
        data: STATION_ERROR
      };
};
