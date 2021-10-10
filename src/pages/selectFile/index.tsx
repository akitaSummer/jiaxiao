import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtButton, AtMessage, AtAccordion, AtToast } from "taro-ui";
import { useSelector, useDispatch } from "react-redux";

import {
  StoreType,
  UserStateType,
  UserFileType,
  RecommendsStateType,
  userClearType
} from "../../store";
import { downloadFile, recommendsUrl, resumePost } from "../../api";

import classNames from "classnames";

enum ToastStatus {
  Error = "error",
  Loading = "loading",
  Success = "success"
}

const LoaingStatus = {
  [ToastStatus.Error]: "投递失败",
  [ToastStatus.Loading]: "投递中",
  [ToastStatus.Success]: "投递成功"
};

const SelectFile = () => {
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const recommends = useSelector<StoreType, RecommendsStateType>(
    state => state.recommends
  );
  const dispatch = useDispatch();
  const [selectResumeFile, setSelectResumeFile] = useState<UserFileType | null>(
    null
  );
  const [
    selectProductionFile,
    setSelectProductionFile
  ] = useState<UserFileType | null>(null);
  const [selectFile, setSelectFile] = useState<UserFileType | null>(null);
  const [resumeShow, setResumeShow] = useState(true);
  const [productionShow, setProductionShow] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMask, setToastMask] = useState(false);
  const [toastStatus, setToastStatus] = useState<ToastStatus>(
    ToastStatus.Loading
  );

  return (
    <View
      className={classNames("select-file", {
        ios: Taro.getSystemInfoSync().system.includes("iOS")
      })}
    >
      <AtMessage />
      <View className={"tips-container"}>
        <Text className={"tips"}>请选择要投递的简历和作品集</Text>
      </View>
      <AtAccordion
        title={"简历"}
        isAnimation={false}
        open={resumeShow}
        onClick={() => setResumeShow(!resumeShow)}
      >
        {userInfo.userInfoFromDb.nickname &&
          userInfo.userFiles.map((item, i) => (
            <View
              onClick={async () => {
                setSelectFile(item);
              }}
              className={classnames("info_item", {
                selected: selectFile?.id === item.id
              })}
              key={item.name + item.id}
            >
              <Text className={classnames("item_name")}>{item.name}</Text>
              <View
                className={classnames("at-icon", "delete")}
                onClick={async e => {
                  e.stopPropagation();
                  try {
                    Taro.atMessage({
                      message: "简历下载中",
                      type: "warning"
                    });
                    // @ts-ignore
                    const { tempFilePath } = await downloadFile(
                      userInfo.accessToken,
                      item.path,
                      item.name
                    );
                    Taro.atMessage({
                      message: "简历下载完成",
                      type: "success"
                    });
                    Taro.openDocument({
                      filePath: tempFilePath
                    });
                  } catch (e) {
                    Taro.atMessage({
                      message: "预览简历失败",
                      type: "error"
                    });
                  }
                }}
              >
                预览
              </View>
            </View>
          ))}
        <AtButton
          className={classNames("upload-production")}
          type="primary"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/fileDetail/index?type=resume",
              complete: () => {
                dispatch(userClearType());
              }
            });
          }}
        >
          上传简历
        </AtButton>
      </AtAccordion>

      <AtAccordion
        title={"作品集"}
        isAnimation={false}
        open={productionShow}
        onClick={() => setProductionShow(!productionShow)}
      >
        {userInfo.userInfoFromDb.nickname &&
          userInfo.userProductions.map((item, i) => (
            <View
              onClick={async () => {
                setSelectProductionFile(item);
              }}
              className={classnames("info_item", {
                selected: selectProductionFile?.id === item.id
              })}
              key={item.name + item.id}
            >
              <Text className={classnames("item_name")}>{item.name}</Text>
              <View
                className={classnames("at-icon", "delete")}
                onClick={async e => {
                  e.stopPropagation();
                  try {
                    Taro.atMessage({
                      message: "作品集下载中",
                      type: "warning"
                    });
                    // @ts-ignore
                    const { tempFilePath } = await downloadFile(
                      userInfo.accessToken,
                      item.path,
                      item.name
                    );
                    Taro.atMessage({
                      message: "作品集下载完成",
                      type: "success"
                    });
                    Taro.openDocument({
                      filePath: tempFilePath
                    });
                  } catch (e) {
                    Taro.atMessage({
                      message: "作品集简历失败",
                      type: "error"
                    });
                  }
                }}
              >
                预览
              </View>
            </View>
          ))}
        <AtButton
          className={classNames("upload-production")}
          type="primary"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/fileDetail/index?type=production",
              complete: () => {
                dispatch(userClearType());
              }
            });
          }}
        >
          上传作品集
        </AtButton>
      </AtAccordion>

      <View
        className={classNames("button-group", {
          ios: Taro.getSystemInfoSync().system.includes("iOS")
        })}
      >
        <AtButton
          type="primary"
          disabled={!selectFile}
          className={classNames("submit-button")}
          onClick={async () => {
            if (
              !userInfo.userInfoFromDb.phone ||
              !userInfo.userInfoFromDb.email
            ) {
              Taro.atMessage({
                message: "请先将您的个人信息填写完整",
                type: "error"
              });
              return Taro.navigateTo({
                url: "/pages/infoEdit/index?needInfo=true",
                complete: () => {
                  dispatch(userClearType());
                }
              });
            }
            if (!selectFile) return;
            setToastOpen(true);
            try {
              const { data } = await resumePost(
                userInfo.accessToken,
                `${recommends.currentRecommend.origin}_${recommends.currentRecommend.type}`,
                `${recommends.currentRecommend.jobId}`,
                recommends.currentRecommend.name,
                `${selectFile.id}`,
                selectProductionFile ? `${selectProductionFile.id}` : null
              );
              setToastStatus(ToastStatus.Success);
              setTimeout(() => {
                Taro.navigateBack({
                  complete: () => {
                    setToastOpen(false);
                  }
                });
              }, 400);
            } catch (e) {
              setToastStatus(ToastStatus.Error);
              setTimeout(() => {
                setToastOpen(false);
              }, 300);
            }
          }}
        >
          {selectFile === null ? "请选择一份简历" : "投递"}
        </AtButton>
      </View>
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

export default SelectFile;
