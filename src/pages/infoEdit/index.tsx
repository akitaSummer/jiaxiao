import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Picker, ScrollView } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import {
  AtForm,
  AtButton,
  AtInput,
  AtList,
  AtListItem,
  AtMessage,
  AtToast,
  AtSearchBar,
  AtFloatLayout,
  AtTag
} from "taro-ui";
import { useSelector, useDispatch } from "react-redux";

// import AtFloatLayout from "../../components/float-layout";
import {
  StoreType,
  DatasStateType,
  UserStateType,
  asyncSubmitUserInfoToDb,
  asyncUpdateUserInfoFromDb,
  userClearType,
  updateUserInfoEdit,
  asyncUpdateSchoolList,
  updateSchoolList,
  restUserInfoEdit,
  SUBMITUSERINFOTODB,
  UPDATE_USERINFOEDITTIPS,
  USER_ERROR
} from "../../store";
import { degreeList } from "../../utils";

import classNames from "classnames";

enum ToastStatus {
  Error = "error",
  Loading = "loading",
  Success = "success"
}

const InfoEdit = () => {
  const [toastOpen, setToastOpen] = useState(false);
  const [schoolListShow, setSchoolListShow] = useState(false);
  const [toastStatus, setToastStatus] = useState<ToastStatus>(
    ToastStatus.Success
  );
  const [toastMessage, setToastMessage] = useState("");
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const datas = useSelector<StoreType, DatasStateType>(state => state.datas);
  const schoolList = useMemo(() => datas.schoolList, [datas]);
  const [school, setSchool] = useState([...schoolList]);
  const dispatch = useDispatch();
  const info = useMemo(() => userInfo.userInfoEdit, [userInfo]);
  const [schoolSearchValue, setSchoolSearchValue] = useState(info.school);

  const reset = () => {
    dispatch(restUserInfoEdit());
  };

  const submit = () => {
    if (
      !Object.keys(info).every(item => {
        if (item === "exp" || item === "tips") {
          return true;
        } else {
          return !!info[item];
        }
      })
    ) {
      setToastOpen(true);
      setToastStatus(ToastStatus.Error);
      setToastMessage("个人信息必须填写完整");
      setTimeout(() => {
        setToastOpen(false);
      }, 500);
      return;
    }
    dispatch(asyncSubmitUserInfoToDb(userInfo.accessToken, info));
  };

  const handleChange = (value, target) => {
    dispatch(updateUserInfoEdit(value, target));
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value;
  };

  useEffect(() => {
    dispatch(updateSchoolList([]));
    if (userInfo.actionType !== UPDATE_USERINFOEDITTIPS) {
      reset();
    }
    return () => {
      console.log(1);
      dispatch(userClearType());
    };
  }, []);

  useEffect(() => {
    if (!!schoolSearchValue) {
      dispatch(asyncUpdateSchoolList(schoolSearchValue));
    } else {
      dispatch(updateSchoolList([]));
    }
  }, [schoolSearchValue]);

  useEffect(() => {
    const newList = [...schoolList];
    setSchool(
      newList.length === 0
        ? !!schoolSearchValue
          ? [schoolSearchValue]
          : newList
        : newList
    );
  }, [schoolList]);

  useEffect(() => {
    if (userInfo.actionType === SUBMITUSERINFOTODB) {
      setToastOpen(true);
      setToastStatus(ToastStatus.Success);
      setToastMessage("更新成功");
      setTimeout(() => {
        Taro.navigateBack();
        setToastOpen(false);
        dispatch(userClearType());
      }, 500);
    } else if (userInfo.actionType === USER_ERROR) {
      setToastOpen(true);
      setToastStatus(ToastStatus.Error);
      setToastMessage("更新失败");
      setTimeout(() => {
        setToastOpen(false);
      }, 500);
    }
  }, [userInfo]);

  useEffect(() => {
    const {
      router: { params }
    } = getCurrentInstance();
    if (params.needInfo === "true") {
      Taro.atMessage({
        message: "请先将您的个人信息填写完整",
        type: "error"
      });
    }
  }, []);

  return (
    <View className="info-edit">
      <AtForm
      // onSubmit={() => {
      //   submit();
      // }}
      // onReset={() => {
      //   reset();
      // }}
      >
        <AtMessage />
        <AtInput
          name="name"
          title="姓名"
          type="text"
          placeholder="请输入您的真实姓名"
          value={info.name}
          onChange={v => handleChange(v, "name")}
        />
        <AtInput
          name="phone"
          title="手机号"
          type="phone"
          placeholder="请输入您的手机号"
          value={info.phone}
          onChange={v => handleChange(v, "phone")}
        />
        <AtInput
          name="email"
          title="email"
          type="text"
          placeholder="请输入您的email"
          value={info.email}
          onChange={v => handleChange(v, "email")}
        />
        <View className={classNames("form-item")}>
          <View className={classNames("item-title")}>
            <Text>毕业院校</Text>
          </View>
          <Text
            className={classNames("item-value", {
              "item-empty": !info.school
            })}
            onClick={() => {
              setSchoolListShow(true);
            }}
          >
            {info.school || "请选择您的院校"}
          </Text>
        </View>
        <View className={classNames("degree-list")}>
          <Picker
            mode="selector"
            range={degreeList}
            onChange={v => {
              handleChange(degreeList[v.detail.value], "degree");
            }}
          >
            <AtList>
              <AtListItem title="学历" extraText={info.degree} />
            </AtList>
          </Picker>
        </View>
        {/* <AtInput
          name="exp"
          title="工作年限"
          type="number"
          placeholder="请输入您的工作年限"
          value={`${info.exp}`}
          onChange={v => handleChange(v, "exp")}
        />
        <View className={classNames("form-item")}>
          <View className={classNames("item-title")}>
            <Text>意向岗位</Text>
          </View>
          <View
            className={classNames("item-value", {
              "item-empty": info.tips
            })}
            onClick={() => {
              Taro.navigateTo({ url: "/pages/tipsChoose/index" });
            }}
          >
            {!!info.tips ? (
              info.tips.split(",").map((item, i) => (
                <AtTag key={item + i} type="primary" circle active>
                  {item}
                </AtTag>
              ))
            ) : (
              <Text className={"item-empty"}>请选择您的意向岗位，最多三个</Text>
            )}
          </View>
        </View> */}
        <View className={classNames("limit-alert")}>
          <View className="at-icon at-icon-alert-circle"></View>
          个人信息三个月内只能更新三次！
        </View>
        <View
          className={classNames("button-group", {
            ios: Taro.getSystemInfoSync().system.includes("iOS")
          })}
        >
          <AtButton
            type="primary"
            formType="submit"
            className={classNames("submit-button")}
            onClick={() => {
              submit();
            }}
          >
            提交
          </AtButton>
          <AtButton formType="reset" onClick={() => reset()}>
            重置
          </AtButton>
        </View>
      </AtForm>
      <AtFloatLayout
        isOpened={schoolListShow}
        title="请选择院校"
        onClose={() => {
          setSchoolListShow(false);
        }}
      >
        <View className={classNames("school-float")}>
          <AtSearchBar
            actionName="搜索"
            value={schoolSearchValue}
            onChange={v => {
              setSchoolSearchValue(v);
            }}
            onActionClick={() => {
              setSchoolSearchValue(schoolSearchValue);
            }}
          />
          <ScrollView scrollY className={classNames("scroll-container")}>
            <AtList className={classNames("school-list")}>
              {school.map((item, i) => {
                return (
                  <AtListItem
                    className={classNames("school-list-item", {
                      "school-select": item === info.school
                    })}
                    title={item}
                    key={item + i}
                    onClick={() => {
                      setSchoolListShow(false);
                      handleChange(item, "school");
                    }}
                  />
                );
              })}
            </AtList>
          </ScrollView>
        </View>
      </AtFloatLayout>
      <AtToast
        duration={0}
        isOpened={toastOpen}
        status={toastStatus}
        text={toastMessage}
        hasMask
      />
    </View>
  );
};

export default InfoEdit;
