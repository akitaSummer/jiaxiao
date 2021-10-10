import {
  UPDATE_CURRENT_STATION,
  STATION_ERROR,
  CURRENT_STATION,
  UPDATER_STATION_LIST
} from "../constants";

export type StationType = {
  id: string;
  name: string;
};

export type StationStateType = {
  stationList: StationType[];
  currentStation?: StationType;
  actionType: string;
};

export const STATION_INITIAL_STATE: StationStateType = {
  stationList: [],
  currentStation: null,
  actionType: "DEFAULT"
};

export default (state = STATION_INITIAL_STATE, actions) => {
  switch (actions.type) {
    case UPDATE_CURRENT_STATION:
      return {
        ...state,
        actionType: actions.type,
        currentStation: actions.data
      };
    case CURRENT_STATION:
      return {
        ...state,
        actionType: actions.type,
        currentStation: actions.data
      };
    case UPDATER_STATION_LIST:
      return {
        ...state,
        actionType: actions.type,
        stationList: actions.data
      };
    case STATION_ERROR:
      return {
        ...state,
        actionType: actions.type
      };
    default:
      return {
        ...state,
        actionType: actions.type
      };
  }
};
