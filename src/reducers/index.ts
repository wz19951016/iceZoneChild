/*
 * @Author: wangzhong
 * @Date: 2020-07-10 16:17:30
 * @LastEditors: wangzhong
 * @LastEditTime: 2020-12-03 17:21:01
 * @FilePath: /iceZoneChild/src/reducers/index.ts
 */
import { combineReducers } from "redux";

const initialState = {
  data: ""
};

const {{name}}Reducer = (state = initialState, action) => {
  switch (action.type) {
    case "{{name}}INITACTION":
      return { ...state, data: action.data };
    default:
      return state;
  }
};

export default combineReducers({ {{name}}Reducer });
