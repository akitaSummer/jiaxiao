import { combineReducers } from "redux";
import user from "./user";
import datas from "./datas";
import recommends from "./recommends";
import history from "./history";
import order from "./order";
import station from './station'
import task from './task'
import manage from './manage'

export default combineReducers({ user, datas, recommends, history, order, station, task, manage });

export * from "./order";
export * from "./user";
export * from "./datas";
export * from "./recommends";
export * from "./history";
export * from './station'
export * from './task'
export * from './manage'