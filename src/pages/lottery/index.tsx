import React, { useState, useEffect, useMemo, useRef } from "react";
import { View, Text, Picker, ScrollView } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { AtTextarea, AtButton, AtToast } from "taro-ui";
import { useSelector, useDispatch } from "react-redux";

// import AtFloatLayout from "../../components/float-layout";
import { StoreType, DatasStateType, UserStateType } from "../../store";
import { submitComment } from "../../api";
import { LuckyWheel } from "taro-luck-draw/react";

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
  const luckyRef = useRef<HTMLDivElement>(null);

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
    <View
      className="comment-page"
      style={{ width: "100%", display: "flex", justifyContent: "center" }}
    >
      <LuckyWheel
        ref={luckyRef}
        width="300px"
        height="300px"
        blocks={[{ padding: "13px", background: "#d64737" }]}
        prizes={[
          {
            title: "1元红包",
            background: "#f9e3bb",
            fonts: [{ text: "1元红包", top: "18%" }]
          },
          {
            title: "100元红包",
            background: "#f8d384",
            fonts: [{ text: "100元红包", top: "18%" }]
          },
          {
            title: "0.5元红包",
            background: "#f9e3bb",
            fonts: [{ text: "0.5元红包", top: "18%" }]
          },
          {
            title: "2元红包",
            background: "#f8d384",
            fonts: [{ text: "2元红包", top: "18%" }]
          },
          {
            title: "10元红包",
            background: "#f9e3bb",
            fonts: [{ text: "10元红包", top: "18%" }]
          },
          {
            title: "50元红包",
            background: "#f8d384",
            fonts: [{ text: "50元红包", top: "18%" }]
          }
        ]}
        buttons={[
          { radius: "50px", background: "#d64737" },
          { radius: "45px", background: "#fff" },
          { radius: "41px", background: "#f6c66f", pointer: true },
          {
            radius: "35px",
            background: "#ffdea0",
            fonts: [{ text: "开始\n抽奖", fontSize: "18px", top: -18 }]
          }
        ]}
        defaultStyle={{
          fontColor: "#d64737",
          fontSize: "14px"
        }}
        onStart={() => {
          // 点击抽奖按钮会触发star回调
          // 调用抽奖组件的play方法开始游戏
          // @ts-ignore
          luckyRef.current.play();
          // 模拟调用接口异步抽奖
          setTimeout(() => {
            // 假设拿到后端返回的中奖索引
            const index = (Math.random() * 6) >> 0;
            // 调用stop停止旋转并传递中奖索引
            // @ts-ignore
            luckyRef.current.stop(index);
          }, 2500);
        }}
        onEnd={prize => {
          // 抽奖结束会触发end回调
          console.log(prize);
        }}
      ></LuckyWheel>
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
