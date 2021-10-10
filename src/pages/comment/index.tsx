import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Picker, ScrollView } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { AtTextarea, AtButton, AtToast } from "taro-ui";
import { useSelector, useDispatch } from "react-redux";

// import AtFloatLayout from "../../components/float-layout";
import { StoreType, DatasStateType, UserStateType } from "../../store";
import { submitComment } from "../../api";

import classNames from "classnames";

enum ToastStatus {
  Error = "error",
  Loading = "loading",
  Success = "success"
}

const Comment = () => {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastStatus, setToastStatus] = useState<ToastStatus>(
    ToastStatus.Success
  );
  const [toastMessage, setToastMessage] = useState("");
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const datas = useSelector<StoreType, DatasStateType>(state => state.datas);
  const dispatch = useDispatch();
  const [commentMessage, setCommentMessage] = useState("");

  const submit = async () => {
    setToastOpen(true);
    setToastStatus(ToastStatus.Loading);
    setToastMessage("提交中");
    try {
      const { statusCode, errMsg } = await submitComment(
        userInfo.accessToken,
        userInfo.userInfoFromDb.id,
        commentMessage
      );
      if (statusCode < 200 || statusCode >= 300) {
        throw new Error(errMsg);
      }
      setToastStatus(ToastStatus.Success);
      setToastMessage("提交成功，谢谢您的反馈");
      setTimeout(() => {
        setToastOpen(false);
        Taro.navigateBack();
      }, 500);
    } catch (e) {
      setToastStatus(ToastStatus.Error);
      setToastMessage("提交失败，请稍后重试");
      setTimeout(() => {
        setToastOpen(false);
      }, 500);
      console.log(e);
    }
  };

  return (
    <View className="comment-page">
      <AtTextarea
        className={"comment-textarea"}
        value={commentMessage}
        onChange={v => setCommentMessage(v)}
        maxLength={500}
        height={320}
        placeholder="你的意见是..."
      />
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
      </View>
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

export default Comment;
