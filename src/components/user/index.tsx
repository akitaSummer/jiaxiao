import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { View, Text } from "@tarojs/components";
import { AtAvatar, AtToast, AtButton, AtTag } from "taro-ui";
import Taro, { getUserInfo } from "@tarojs/taro";
import { useSelector, useDispatch } from "react-redux";

import {
  StoreType,
  UserStateType,
  updateAccessToken,
  asyncUpdateUserInfoFromDb,
  UPDATE_USERINFOFROMDB,
  userClearType,
  USER_ERROR,
  asyncGetFiles
} from "../../store";
import {
  wxLogin,
  login as dbLogin,
  wxGetUserInfo,
  initDbInfo
} from "../../api";
import { changeNavBarTitle } from "../../utils";

import "./index.scss";

const showInfo = [
  "name",
  "sex",
  "email",
  "degree",
  "school",
  "tips",
  "lottery",
  "achievement"
];

const showInfoMap = {
  name: {
    name: "姓名",
    icon: "icon-name"
  },
  sex: {
    name: "性别",
    icon: "icon-sex"
  },
  email: {
    name: "email",
    icon: "icon-email"
  },
  // city: {
  //   name: "城市",
  //   icon: "icon-shangquan"
  // },
  degree: {
    name: "学历",
    icon: "icon-academicdegree"
  },
  school: {
    name: "学校",
    icon: "icon-school"
  },
  lottery: {
    name: "抽奖",
    icon: "icon-dazhuanpan",
    onClick: () => {
      Taro.navigateTo({
        url: "/pages/lottery/index"
      });
    }
  },
  achievement: {
    name: "成就",
    icon: "icon-xunzhang",
    onClick: () => {
      Taro.navigateTo({
        url: "/pages/achievement/index"
      });
    }
  }
  // tips: {
  //   name: "意向",
  //   icon: "icon-line-codesslashdaimasxiegang"
  // }
};

enum ToastStatus {
  Error = "error",
  Loading = "loading",
  Success = "success"
}

const LoaingStatus = {
  [ToastStatus.Error]: "登录失败",
  [ToastStatus.Loading]: "登录中",
  [ToastStatus.Success]: "登录成功"
};

const User: React.FC<{}> = () => {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMask, setToastMask] = useState(false);
  const [toastStatus, setToastStatus] = useState<ToastStatus>(
    ToastStatus.Loading
  );
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const dispatch = useDispatch();

  const login = async (userInfo: any) => {
    setToastOpen(true);
    setToastMask(true);
    setToastStatus(ToastStatus.Loading);
    try {
      const wxRes = await wxLogin();
      const {
        data: { access_token, id }
      } = await dbLogin(wxRes.code);
      if (!id) {
        await initDbInfo(access_token, userInfo);
      }
      Taro.setStorageSync("loginSessionKey", access_token);
      dispatch(updateAccessToken(access_token));
      dispatch(asyncUpdateUserInfoFromDb(access_token));
      dispatch(asyncGetFiles(access_token));
    } catch (e) {
      console.log(e);
      setToastStatus(ToastStatus.Error);
      setToastMask(false);
    }
  };

  const goToInfoEdit = () => {
    Taro.navigateTo({
      url: "/pages/infoEdit/index",
      complete: () => {
        dispatch(userClearType());
      }
    });
  };

  useEffect(() => {
    changeNavBarTitle("我的");
  }, []);

  useEffect(() => {
    if (
      toastOpen &&
      userInfo.userInfoFromDb.userName &&
      userInfo.actionType === UPDATE_USERINFOFROMDB
    ) {
      setToastStatus(ToastStatus.Success);
    }
    if (
      toastOpen &&
      !userInfo.userInfoFromDb.userName &&
      userInfo.actionType === USER_ERROR
    ) {
      setToastStatus(ToastStatus.Error);
    }
  }, [userInfo]);

  useEffect(() => {
    if (toastStatus !== ToastStatus.Loading) {
      setToastMask(false);
      setTimeout(() => {
        setToastOpen(false);
      }, 500);
    }
  }, [toastStatus]);

  return (
    <View className="index">
      <View
        className={classnames("at-row", "user-avatar")}
        onClick={() => {
          userInfo.userInfoFromDb.userName && userInfo.accessToken
            ? goToInfoEdit()
            : wxGetUserInfo().then(({ userInfo }) => login(userInfo));
        }}
      >
        <View className={classnames("at-col", "avatar")}>
          <AtAvatar size={"large"} image={userInfo.userInfoFromDb.headimgurl} />
        </View>
        <View className={classnames("at-col", "detail")}>
          <Text className={classnames("nickname")}>
            {userInfo.userInfoFromDb.userName && userInfo.accessToken
              ? userInfo.userInfoFromDb.userName
              : "请先登录"}
          </Text>
          {userInfo.userInfoFromDb.userName && userInfo.accessToken ? (
            <Text className={classnames("tel")}>
              tel: {userInfo.userInfoFromDb.phone}
            </Text>
          ) : (
            <View style={{ width: 48 }}>
              <AtButton
                type="secondary"
                size="small"
                circle
                // onClick={() =>
                //   wxGetUserInfo().then(({ userInfo }) => login(userInfo))
                // }
              >
                登录
              </AtButton>
            </View>
          )}
        </View>
        {userInfo.userInfoFromDb.userName && userInfo.accessToken && (
          <View className={classnames("at-icon", "at-icon-chevron-right")} />
        )}
      </View>
      {userInfo.userInfoFromDb.userName &&
        showInfo.map(item => {
          return item === "tips" ? null : (
            <View
              className={classnames("info_item")}
              onClick={showInfoMap[item].onClick || ""}
            >
              <View
                className={classnames("iconfont", showInfoMap[item].icon)}
              ></View>
              <Text className={classnames("item_name")}>
                {showInfoMap[item].name}
              </Text>
              <View>{userInfo.userInfoFromDb[item]}</View>
              {showInfoMap[item].onClick && (
                <View className={classnames("value-right")}>
                  <View
                    className={classnames("at-icon", "at-icon-chevron-right")}
                  />
                </View>
              )}
            </View>
          );
        })}
      {/* {userInfo.userInfoFromDb.nickname && (
        <View
          className={classnames("info_item")}
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/fileDetail/index?type=resume",
              complete: () => {
                dispatch(userClearType());
              }
            });
          }}
        >
          <View className={classnames("iconfont", "icon-filesearch")}></View>
          <Text className={classnames("item_name")}>简历</Text>
          <View className={classnames("value-right")}>
            <View className={classnames("at-icon", "at-icon-chevron-right")} />
          </View>
        </View>
      )}
      {userInfo.userInfoFromDb.nickname && (
        <View
          className={classnames("info_item")}
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/fileDetail/index?type=production",
              complete: () => {
                dispatch(userClearType());
              }
            });
          }}
        >
          <View className={classnames("iconfont", "icon-zuopin")}></View>
          <Text className={classnames("item_name")}>作品集</Text>
          <View className={classnames("value-right")}>
            <View className={classnames("at-icon", "at-icon-chevron-right")} />
          </View>
        </View>
      )} */}
      {userInfo.userInfoFromDb.userName && userInfo.userInfoFromDb.id && (
        <View
          className={classnames("info_item")}
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/comment/index",
              complete: () => {
                dispatch(userClearType());
              }
            });
          }}
        >
          <View className={classnames("iconfont", "icon-comment")}></View>
          <Text className={classnames("item_name")}>意见反馈</Text>
          <View className={classnames("value-right")}>
            <View className={classnames("at-icon", "at-icon-chevron-right")} />
          </View>
        </View>
      )}
      <AtToast
        duration={0}
        isOpened={toastOpen}
        status={toastStatus}
        text={LoaingStatus[toastStatus]}
        hasMask
      />
    </View>
  );
};

export default User;
