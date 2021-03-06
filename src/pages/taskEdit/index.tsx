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
      setToastMessage("??????????????????????????????");
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
    // ????????????????????????????????? value ??????????????? `return value` ?????????????????????????????????
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
      setToastMessage("????????????");
      setTimeout(() => {
        Taro.navigateBack();
        setToastOpen(false);
        dispatch(userClearType());
      }, 500);
    } else if (userInfo.actionType === USER_ERROR) {
      setToastOpen(true);
      setToastStatus(ToastStatus.Error);
      setToastMessage("????????????");
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
        message: "???????????????????????????????????????",
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
          title="??????"
          type="text"
          placeholder="???????????????"
          value={taskTitle}
          onChange={v => setTaskTitle(v as string)}
        />
        <AtList>
          <AtListItem title="???????????????" />
        </AtList>
        <AtTextarea
          count={false}
          value={taskContent}
          onChange={v => setTaskContent(v as string)}
          maxLength={400}
          placeholder="???????????????"
        />
        <AtInput
          name="phone"
          title="?????????"
          type="phone"
          placeholder="????????????????????????"
          value={taskPhone}
          onChange={v => setTaskPhone(v as string)}
        />
        <AtInput
          name="email"
          title="email"
          type="text"
          placeholder="???????????????email"
          value={taskEmail}
          onChange={v => setTaskEmail(v as string)}
        />
        {/*// @ts-ignore*/}
        <Picker mode="date" onChange={v => handleChange(v, "date")}>
          <AtList>
            <AtListItem
              title="???????????????"
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
          title="????????????"
          type="number"
          placeholder="???????????????????????????"
          value={`${info.exp}`}
          onChange={v => handleChange(v, "exp")}
        />
        <View className={classNames("form-item")}>
          <View className={classNames("item-title")}>
            <Text>????????????</Text>
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
              <Text className={"item-empty"}>??????????????????????????????????????????</Text>
            )}
          </View>
        </View> */}
        {/* <View className={classNames("limit-alert")}>
          <View className="at-icon at-icon-alert-circle"></View>
          ?????????????????????????????????????????????
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
            ??????
          </AtButton>
          <AtButton formType="reset" onClick={() => reset()}>
            ??????
          </AtButton>
        </View>
      </AtForm>
      <AtFloatLayout
        isOpened={schoolListShow}
        title="???????????????"
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
