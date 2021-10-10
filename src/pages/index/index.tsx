import React, { useState, useEffect, useMemo } from "react";
import { View, Text } from "@tarojs/components";
import { useShareAppMessage, useShareTimeline } from "@tarojs/taro";
import { AtButton, AtTabBar } from "taro-ui";
import { useSelector, useDispatch } from "react-redux";

import Search from "../../components/search";
import History from "../../components/history";
import User from "../../components/user";
import {
  StoreType,
  UserStateType,
  asyncUpdateUserInfoFromDb,
  asyncGetFiles,
  asyncGetHistoryList,
  asyncUpdateCitysList,
  asyncUpdateTagsList
} from "../../store";

const ComponentMaps = {
  0: Search,
  // 1: History,
  1: User
};

const Index = () => {
  const [current, setCurrent] = useState(0);
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const dispatch = useDispatch();

  const Component = useMemo(() => ComponentMaps[current], [current]);

  const getUserMessage = () => {
    try {
      dispatch(asyncUpdateCitysList());
      dispatch(asyncUpdateTagsList());
      if (!userInfo.accessToken) return;
      dispatch(asyncUpdateUserInfoFromDb(userInfo.accessToken));
      dispatch(asyncGetFiles(userInfo.accessToken));
      dispatch(asyncGetHistoryList(userInfo.accessToken));
    } catch (e) {
      console.log(e);
    }
  };

  useShareAppMessage(res => {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    return {
      title: "UFreedom",
      path: "/pages/index/index"
    };
  });

  useShareTimeline(() => {
    return {
      title: "UFreedom",
      path: "/pages/index/index"
    };
  });

  useEffect(() => {
    getUserMessage();
  }, []);

  return (
    <View className="index">
      <Component />
      <AtTabBar
        fixed
        tabList={[
          // { title: "进度查询", iconType: "bullet-list", text: "new" },
          // { title: "内推岗位", iconType: "search" },
          // { title: "我的", iconType: "user", text: "100", max: 99 }
          { title: "任务", iconType: "bullet-list" },
          // {
          //   title: "校园",
          //   iconPrefixClass: "iconfont icon",
          //   iconType: "shequ"
          // },
          { title: "我的", iconType: "user" }
        ]}
        onClick={number => {
          setCurrent(number);
        }}
        current={current}
      />
    </View>
  );
};

export default Index;
