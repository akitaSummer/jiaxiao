import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { View, Text } from "@tarojs/components";
import Taro, { Current } from "@tarojs/taro";
import { AtButton, AtMessage } from "taro-ui";
import { useSelector, useDispatch } from "react-redux";

import {
  StoreType,
  UserStateType,
  asyncUpdateFile,
  asyncDelFile
} from "../../store";
import { downloadFile } from "../../api";

import classNames from "classnames";

const FileDetail = () => {
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const dispatch = useDispatch();
  const type = Current.router.params.type;
  const typeName = type === "production" ? "作品集" : "简历";

  return (
    <View
      className={classNames("file-detail", {
        ios: Taro.getSystemInfoSync().system.includes("iOS")
      })}
    >
      <AtMessage />
      <View className={"tips-container"}>
        <Text className={"tips"}>点击文件名即可预览</Text>
      </View>
      {userInfo.userInfoFromDb.nickname &&
        (type === "production"
          ? userInfo.userProductions
          : userInfo.userFiles
        ).map((item, i) => (
          <View
            onClick={async () => {
              try {
                Taro.atMessage({
                  message: `${typeName}下载中`,
                  type: "warning"
                });
                // @ts-ignore
                const { tempFilePath } = await downloadFile(
                  userInfo.accessToken,
                  item.path,
                  item.name
                );
                Taro.atMessage({
                  message: `${typeName}下载完成`,
                  type: "success"
                });
                Taro.openDocument({
                  filePath: tempFilePath
                });
              } catch (e) {
                console.log(e);
                Taro.atMessage({
                  message: `预览${typeName}失败`,
                  type: "error"
                });
              }
            }}
            className={classnames("info_item")}
            key={item.name + item.id}
          >
            <Text className={classnames("item_name")}>{item.name}</Text>
            <View
              className={classnames("at-icon", "at-icon-close", "delete")}
              onClick={() => {
                dispatch(asyncDelFile(userInfo.accessToken, item.id));
              }}
            />
          </View>
        ))}
      <View
        className={classNames("button-group", {
          ios: Taro.getSystemInfoSync().system.includes("iOS")
        })}
      >
        <AtButton
          type="primary"
          disabled={
            (type === "production"
              ? userInfo.userProductions
              : userInfo.userFiles
            ).length >= 3
          }
          className={classNames("submit-button")}
          onClick={() => {
            const { platform } = Taro.getSystemInfoSync();
            if (platform === "windows" || platform === "mac") {
              return Taro.atMessage({
                message: `目前仅支持手机端上传功能`,
                type: "error"
              });
            }
            Taro.chooseMessageFile({
              count: 1,
              extension: ["pdf", "word"],
              type: "file",
              success: data => {
                const { tempFiles } = data;
                const { name, path } = tempFiles[0];
                Taro.atMessage({
                  message: `${typeName}上传中,请稍等...`,
                  type: "warning"
                });
                dispatch(
                  asyncUpdateFile(
                    userInfo.accessToken,
                    name.replace(/(^\s+)|(\s+$)|\s+/g, "_"),
                    path,
                    type
                  )
                );
              },
              fail: () => {
                Taro.atMessage({
                  message: `${typeName}上传失败`,
                  type: "error"
                });
              }
            });
          }}
        >
          {(type === "production"
            ? userInfo.userProductions
            : userInfo.userFiles
          ).length >= 3
            ? `${typeName}最多只能上传3份`
            : "上传"}
        </AtButton>
      </View>
    </View>
  );
};

export default FileDetail;
