import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtButton, AtMessage } from "taro-ui";
import { useSelector, useDispatch } from "react-redux";

import {
  StoreType,
  UserStateType,
  updateUserInfoEditTips,
  DatasStateType
} from "../../store";

import classNames from "classnames";

import { localFlat } from "../../utils";

const TipsChoose = () => {
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const datas = useSelector<StoreType, DatasStateType>(state => state.datas);
  const dispatch = useDispatch();
  const [saveClick, setSaveClick] = useState(false);
  const [activeTrade, setActiveTrade] = useState(datas.tagsList[0]?.name || "");
  const hasTips = useMemo(() => {
    if (Array.isArray(datas.tagsList)) {
      const { platform } = Taro.getSystemInfoSync();
      if (platform === "windows" || platform === "mac") {
        return localFlat(
          datas.tagsList.map(item =>
            item.children.map(title => title.children.map(tips => tips.name))
          )
        );
      } else {
        return datas.tagsList
          .map(item =>
            item.children.map(title => title.children.map(tips => tips.name))
          )
          .flat(5);
      }
    }
    return [];
  }, [datas]);

  const [tips, setTips] = useState(
    userInfo.userInfoEdit.tips
      ? [
          ...userInfo.userInfoEdit.tips
            .split(",")
            .filter(item => hasTips.includes(item))
        ]
      : []
  );

  const handleTradeChange = (item: string) => {
    setActiveTrade(item);
  };

  const handleTipsClick = (item: string) => {
    if (tips.includes(item)) {
      return setTips([
        ...tips.filter(tip => item !== tip).filter(item => item !== "")
      ]);
    }
    if (tips.length >= 3) {
      return Taro.atMessage({
        message: "意向不能超过3个",
        type: "error"
      });
    }
    setTips([...tips, item]);
  };

  const saveTips = () => {
    setSaveClick(true);
  };

  useEffect(() => {
    if (saveClick) {
      Taro.navigateBack({
        complete: () => {
          dispatch(
            updateUserInfoEditTips(tips.filter(item => item !== "").join(","))
          );
        }
      });
    }
    return () => {
      if (!saveClick) {
        dispatch(updateUserInfoEditTips(userInfo.userInfoEdit.tips));
      }
    };
  }, [saveClick]);
  console.log();

  return (
    <View
      className={classNames("tips-choose-container", {
        ios: Taro.getSystemInfoSync().system.includes("iOS")
      })}
    >
      <AtMessage />
      <View className="tips-choose" catchMove={true}>
        <ScrollView scrollY className={classNames("trade")}>
          {Array.isArray(datas.tagsList) &&
            datas.tagsList.map((item, i) => (
              <View
                className={classNames("trade-item", {
                  "trade-item-active": item.name === activeTrade
                })}
                onClick={() => {
                  handleTradeChange(item.name);
                }}
              >
                <Text className="content">{item.name}</Text>
              </View>
            ))}
        </ScrollView>
        <ScrollView scrollY className={classNames("tips")}>
          <View className={classNames("box")}>
            <View className="labels">
              {Array.isArray(datas.tagsList) &&
                datas.tagsList
                  .filter(item => item.name === activeTrade)[0]
                  ?.children.map((item, i) => (
                    <>
                      <View className={"title"}>{item.name}</View>
                      <View key={item.name + i} className={"labels"}>
                        {item.children.map(tag => (
                          <View
                            key={tag.name + i}
                            className={classNames("tips-item", {
                              "tips-item-active": tips.includes(tag.name)
                            })}
                            onClick={() => {
                              handleTipsClick(tag.name);
                            }}
                          >
                            {tag.name}
                          </View>
                        ))}
                      </View>
                    </>
                  ))}
            </View>
          </View>
        </ScrollView>
      </View>
      <View className={classNames("save-button")}>
        <AtButton
          type="primary"
          className={classNames("submit-button")}
          onClick={() => {
            saveTips();
          }}
        >
          保存
        </AtButton>
      </View>
    </View>
  );
};

export default TipsChoose;
