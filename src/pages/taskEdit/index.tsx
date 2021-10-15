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
  AtTag,
  AtTextarea,
  AtImagePicker
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
  USER_ERROR,
  TaskStateType,
  updateTaskEdit
} from "../../store";
import { degreeList } from "../../utils";
import { addTask } from "../../api";

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
  const taskInfo = useSelector<StoreType, TaskStateType>(state => state.task);
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const datas = useSelector<StoreType, DatasStateType>(state => state.datas);
  const schoolList = useMemo(() => datas.schoolList, [datas]);
  // const [school, setSchool] = useState([...schoolList]);
  const dispatch = useDispatch();
  const info = useMemo(() => taskInfo.taskEdit, [taskInfo]);
  // const [schoolSearchValue, setSchoolSearchValue] = useState(info.school);

  const [taskTitle, setTaskTitle] = useState(taskInfo.taskEdit?.title || "");
  const [taskContent, setTaskContent] = useState(
    taskInfo.taskEdit?.content || ""
  );
  const [taskPhone, setTaskPhone] = useState(taskInfo.taskEdit?.phone || "");
  const [taskEmail, setTaskEmail] = useState(taskInfo.taskEdit?.email || "");
  const [taskTime, setTaskTime] = useState(
    taskInfo.taskEdit?.invalidTime || ""
  );
  const [taskImg, setTaskImg] = useState<string[]>(
    taskInfo.taskEdit?.img || []
  );

  const reset = () => {
    dispatch(restUserInfoEdit());
  };

  const submit = async () => {
    if (!taskTitle || !taskContent || !taskPhone || !taskEmail || !taskTime) {
      setToastOpen(true);
      setToastStatus(ToastStatus.Error);
      setToastMessage("个人信息必须填写完整");
      setTimeout(() => {
        setToastOpen(false);
      }, 500);
      return;
    }
    // dispatch(updateTaskEdit(userInfo.accessToken, info));
    console.log(
      taskTitle,
      taskContent,
      taskPhone,
      taskEmail,
      taskTime,
      taskImg
    );
    await addTask({
      content: taskContent,
      invalidTime: taskTime,
      point,
      positionId,
      title: taskTitle
    });
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

  // useEffect(() => {
  //   if (!!schoolSearchValue) {
  //     dispatch(asyncUpdateSchoolList(schoolSearchValue));
  //   } else {
  //     dispatch(updateSchoolList([]));
  //   }
  // }, [schoolSearchValue]);

  // useEffect(() => {
  //   const newList = [...schoolList];
  //   setSchool(
  //     newList.length === 0
  //       ? !!schoolSearchValue
  //         ? [schoolSearchValue]
  //         : newList
  //       : newList
  //   );
  // }, [schoolList]);

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
          name="title"
          title="标题"
          type="text"
          placeholder="请输入标题"
          value={taskTitle}
          onChange={v => setTaskTitle(v as string)}
        />
        <AtList>
          <AtListItem title="请填写内容" />
        </AtList>
        <AtTextarea
          count={false}
          value={taskContent}
          onChange={v => setTaskContent(v as string)}
          maxLength={400}
          placeholder="请填写内容"
        />
        <AtInput
          name="phone"
          title="手机号"
          type="phone"
          placeholder="请输入您的手机号"
          value={taskPhone}
          onChange={v => setTaskPhone(v as string)}
        />
        <AtInput
          name="email"
          title="email"
          type="text"
          placeholder="请输入您的email"
          value={taskEmail}
          onChange={v => setTaskEmail(v as string)}
        />
        {/*// @ts-ignore*/}
        <Picker mode="date" onChange={v => handleChange(v, "date")}>
          <AtList>
            <AtListItem
              title="请选择日期"
              extraText={"2018-04-22"}
              onClick={v => {
                setTaskTime(v.timeStamp.toString());
              }}
            />
          </AtList>
        </Picker>
        <AtImagePicker
          length={5}
          files={taskImg.map(item => {
            return {
              url: item
            };
          })}
          onChange={v => {
            setTaskImg(v.map(item => item.url));
          }}
          onFail={() => {}}
          onImageClick={() => {}}
        />
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
        {/* <View className={classNames("limit-alert")}>
          <View className="at-icon at-icon-alert-circle"></View>
          个人信息三个月内只能更新三次！
        </View> */}
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
      ></AtFloatLayout>
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
