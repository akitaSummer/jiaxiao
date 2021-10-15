import React, { useEffect, useState, useMemo } from "react";
import classnames from "classnames";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro, {
  getCurrentInstance,
  useShareAppMessage,
  useShareTimeline
} from "@tarojs/taro";
import { AtButton, AtToast, AtMessage } from "taro-ui";
import { useSelector, useDispatch } from "react-redux";

import {
  StoreType,
  RecommendsStateType,
  UserStateType,
  updateCurrentRecommend,
  updateAccessToken,
  asyncUpdateUserInfoFromDb,
  asyncGetFiles,
  UPDATE_USERINFOFROMDB,
  USER_ERROR,
  OriderStateType,
  ManageStateType,
  TaskStateType,
  updateTaskEdit
} from "../../store";
import {
  wxLogin,
  login as dbLogin,
  initDbInfo,
  wxGetUserInfo,
  getRecommends,
  orderDetail,
  cancelOrder,
  finshOrder,
  taskDetail,
  manageDetail,
  receiveTask,
  undoTask,
  OverTask
} from "../../api";

import classNames from "classnames";

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

const RecommendDetail = () => {
  const recommends = useSelector<StoreType, RecommendsStateType>(
    state => state.recommends
  );
  const order = useSelector<StoreType, OriderStateType>(state => state.order);
  const task = useSelector<StoreType, TaskStateType>(state => state.task);
  const manage = useSelector<StoreType, ManageStateType>(state => state.manage);
  const UserInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const dispatch = useDispatch();
  const recommendInfo = useMemo(() => recommends.currentRecommend, [
    recommends
  ]);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMask, setToastMask] = useState(false);
  const [toastStatus, setToastStatus] = useState<ToastStatus>(
    ToastStatus.Loading
  );
  const {
    router: {
      params: { type }
    }
  } = getCurrentInstance();
  const [detail, setDetail] = useState<{
    title: string;
    content: string;
    gps: string;
    headUrl: string;
    orderFlows: string[];
    orderId: string;
    phone: string;
    point: 0;
    receiveTime: string;
    status: string;
    taskId: string;
    userId: string;
    userName: string;
  } | null>(null);
  console.log(
    [
      task.currentTask?.taskId,
      order.currentOrder?.taskId,
      manage.currentManage?.taskId
    ][Number(type)]
  );
  useEffect(() => {
    return () => {
      dispatch(updateCurrentRecommend());
    };
  }, []);

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

  const getRecommendInfoById = async (id: string) => {
    const {
      data: { datas }
    } = await getRecommends(1, 10, id, "");

    dispatch(updateCurrentRecommend(datas[0]));
  };

  const getOrderDetail = async () => {
    const { data } = await [taskDetail, orderDetail, manageDetail][
      Number(type)
    ](
      UserInfo.accessToken,
      [
        task.currentTask?.taskId,
        order.currentOrder?.taskId,
        manage.currentManage?.taskId
      ][Number(type)]
    );
    setDetail(data);
  };

  useEffect(() => {
    if (toastOpen && order.currentOrder?.taskId) {
      setToastStatus(ToastStatus.Success);
    } else {
      setToastStatus(ToastStatus.Error);
    }
  }, [order]);

  useEffect(() => {
    if (toastStatus !== ToastStatus.Loading) {
      setToastMask(false);
      setTimeout(() => {
        setToastOpen(false);
      }, 500);
    }
  }, [toastStatus]);

  // useEffect(() => {
  //   const {
  //     router: { params }
  //   } = getCurrentInstance();
  //   if (params.id) {
  //     dispatch(updateCurrentRecommend());
  //     getRecommendInfoById(params.id);
  //   }
  // }, []);

  useEffect(() => {
    getOrderDetail();
  }, []);

  useShareAppMessage(res => {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    return {
      title: `${recommendInfo.name}`,
      path: `/pages/recommendDetail/index?id=${recommendInfo.jobId}`
    };
  });

  useShareTimeline(() => {
    return {
      title: `${recommendInfo.name}`,
      path: `/pages/recommendDetail/index?id=${recommendInfo.jobId}`
    };
  });

  return (
    <View
      className={classNames("recommend-detail", {
        ios: Taro.getSystemInfoSync().system.includes("iOS")
      })}
    >
      <AtMessage />
      <ScrollView className={"recommend-info"} scrollY>
        {detail ? (
          <View className={classNames("at-article", "info-container")}>
            <View className={classNames("at-article__h1", "info-h1")}>
              {detail.title}
            </View>
            <View className={classNames("at-article__info", "info-info")}>
              {detail.status}&nbsp;&nbsp;|&nbsp;&nbsp;
              {detail.point}
              &nbsp;&nbsp;|&nbsp;&nbsp;{detail.receiveTime}
              &nbsp;&nbsp;|&nbsp;&nbsp;
              {detail.phone}
            </View>
            <View className={classNames("at-article__content", "info_content")}>
              <View
                className={classNames("at-article__section", "info_section")}
              >
                {/* <View className={classNames("at-article__h2", "info-h2")}>
                  职位部门
                </View>
                <View
                  className={classNames("at-article__h2", "info-p-container")}
                >
                  <Text className={classNames("at-article__p", "info-p")}>
                    {order.currentOrder?.point}
                  </Text>
                </View> */}

                <View className={classNames("at-article__h2", "info-h2")}>
                  任务描述
                </View>
                <View
                  className={classNames("at-article__h2", "info-p-container")}
                >
                  <Text className={classNames("at-article__p", "info-p")}>
                    {detail.content}
                  </Text>
                </View>

                <View className={classNames("at-article__h2", "info-h2")}>
                  附图
                </View>
                <View
                  className={classNames("at-article__h2", "info-p-container")}
                >
                  <View className={classNames("at-article__p", "info-p")}>
                    <Image src={detail.headUrl} mode={"aspectFill"} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View className={classNames("at-article", "info-container")}>
            <View
              className={classNames("at-article__h1", "info-h1", "skeletonBg")}
            ></View>
            <View className={classNames("at-article__info", "info-info")}>
              <View className={classNames("skeletonBg")} />
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <View className={classNames("skeletonBg")} />
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <View className={classNames("skeletonBg")} />
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <View className={classNames("skeletonBg")} />
            </View>
            <View className={classNames("at-article__content", "info_content")}>
              <View
                className={classNames("at-article__section", "info_section")}
              >
                {/* <View className={classNames("at-article__h2", "info-h2")}>
                  职位部门
                </View>
                <View
                  className={classNames("at-article__h2", "info-p-container")}
                >
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                </View> */}

                <View className={classNames("at-article__h2", "info-h2")}>
                  任务描述
                </View>
                <View
                  className={classNames("at-article__h2", "info-p-container")}
                >
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                </View>

                <View className={classNames("at-article__h2", "info-h2")}>
                  附图
                </View>
                <View
                  className={classNames("at-article__h2", "info-p-container")}
                >
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      {detail && ["发布", "进行中", "已处理"].includes(detail.status) && (
        <View className={classNames("button-group")}>
          {[
            {
              type: 1,
              status: "进行中"
            },
            {
              type: 2,
              status: "进行中"
            },
            {
              type: 2,
              status: "发布"
            },
            {
              type: 2,
              status: "已处理"
            }
          ].filter(
            item => item.type === Number(type) && item.status === detail.status
          ).length > 0 && (
            <AtButton
              type="secondary"
              disabled={false}
              className={classNames("submit-button", {
                ios: Taro.getSystemInfoSync().system.includes("iOS")
              })}
              onClick={() => {
                UserInfo.userInfoFromDb.userName
                  ? (async () => {
                      try {
                        const res = await [
                          {
                            type: 1,
                            status: "进行中",
                            method: cancelOrder
                          },
                          {
                            type: 2,
                            status: "进行中",
                            method: cancelOrder
                          },
                          {
                            type: 2,
                            status: "发布",
                            method: (accessToken: string, taskId: string) => {}
                          },
                          {
                            type: 2,
                            status: "已处理",
                            method: (accessToken: string, taskId: string) => {
                              dispatch(
                                updateTaskEdit({
                                  content: task.currentTask.content,
                                  invalidTime: task.currentTask.receiveTime,
                                  point: task.currentTask.point,
                                  positionId: task.currentTask.positionId,
                                  title: task.currentTask.title
                                })
                              );
                              Taro.navigateTo({
                                url: "/pages/taskEdit/index",
                                complete: () => {}
                              });
                            }
                          }
                        ]
                          .filter(
                            item =>
                              item.type === Number(type) &&
                              item.status === detail.status
                          )[0]
                          .method(UserInfo.accessToken, detail.taskId);
                        if (!res) {
                          return;
                        }
                        if (res.data) {
                          Taro.atMessage({
                            message: `${
                              [
                                {
                                  type: 1,
                                  status: "进行中",
                                  name: "取消"
                                },
                                {
                                  type: 2,
                                  status: "进行中",
                                  name: "取消"
                                },
                                {
                                  type: 2,
                                  status: "发布",
                                  name: "修改"
                                },
                                {
                                  type: 2,
                                  status: "已处理",
                                  name: "修改"
                                }
                              ].filter(
                                item =>
                                  item.type === Number(type) &&
                                  item.status === detail.status
                              )[0].name
                            }成功"`,
                            type: "success"
                          });
                          setTimeout(() => {
                            Taro.navigateBack();
                          }, 500);
                        } else {
                          Taro.atMessage({
                            message: "操作失败",
                            type: "error"
                          });
                        }
                      } catch (e) {
                        Taro.atMessage({
                          message: "操作失败",
                          type: "error"
                        });
                      }
                    })()
                  : wxGetUserInfo().then(({ userInfo }) => login(userInfo));
              }}
            >
              {UserInfo.userInfoFromDb.userName
                ? [
                    {
                      type: 1,
                      status: "进行中",
                      name: "取消订单"
                    },
                    {
                      type: 2,
                      status: "进行中",
                      name: "取消订单"
                    },
                    {
                      type: 2,
                      status: "发布",
                      name: "修改订单"
                    },
                    {
                      type: 2,
                      status: "已处理",
                      name: "有问题请联系接单人"
                    }
                  ].filter(
                    item =>
                      item.type === Number(type) &&
                      item.status === detail.status
                  )[0].name
                : "请先登录"}
            </AtButton>
          )}
          {[
            {
              type: 0,
              status: "发布"
            },
            {
              type: 1,
              status: "进行中"
            },
            {
              type: 2,
              status: "进行中"
            },
            {
              type: 2,
              status: "发布"
            },
            {
              type: 2,
              status: "已处理"
            }
          ].filter(
            item => item.type === Number(type) && item.status === detail.status
          ).length > 0 && (
            <AtButton
              type="primary"
              disabled={false}
              className={classNames("submit-button", {
                ios: Taro.getSystemInfoSync().system.includes("iOS")
              })}
              onClick={async () => {
                UserInfo.userInfoFromDb.userName
                  ? (async () => {
                      try {
                        const { data } = await [
                          {
                            type: 0,
                            status: "发布",
                            method: receiveTask
                          },
                          {
                            type: 1,
                            status: "进行中",
                            method: finshOrder
                          },
                          {
                            type: 2,
                            status: "进行中",
                            method: finshOrder
                          },
                          {
                            type: 2,
                            status: "发布",
                            method: undoTask
                          },
                          {
                            type: 2,
                            status: "已处理",
                            method: OverTask
                          }
                        ]
                          .filter(
                            item =>
                              item.type === Number(type) &&
                              item.status === detail.status
                          )[0]
                          .method(UserInfo.accessToken, detail.taskId);
                        if (data) {
                          Taro.atMessage({
                            message: `${
                              [
                                {
                                  type: 0,
                                  status: "发布",
                                  name: "接单"
                                },
                                {
                                  type: 1,
                                  status: "进行中",
                                  name: "完成"
                                },
                                {
                                  type: 2,
                                  status: "进行中",
                                  name: "完成"
                                },
                                {
                                  type: 2,
                                  status: "发布",
                                  name: "撤单"
                                },
                                {
                                  type: 2,
                                  status: "已处理",
                                  name: "结束"
                                }
                              ].filter(
                                item =>
                                  item.type === Number(type) &&
                                  item.status === detail.status
                              )[0].name
                            }成功`,
                            type: "success"
                          });
                          setTimeout(() => {
                            Taro.navigateBack();
                          }, 500);
                        } else {
                          Taro.atMessage({
                            message: "操作失败",
                            type: "error"
                          });
                        }
                      } catch (e) {
                        Taro.atMessage({
                          message: "操作失败",
                          type: "error"
                        });
                      }
                    })()
                  : wxGetUserInfo().then(({ userInfo }) => login(userInfo));
              }}
            >
              {UserInfo.userInfoFromDb.userName
                ? `${
                    [
                      {
                        type: 0,
                        status: "发布",
                        name: "接单"
                      },
                      {
                        type: 1,
                        status: "进行中",
                        name: "完成"
                      },
                      {
                        type: 2,
                        status: "进行中",
                        name: "完成"
                      },
                      {
                        type: 2,
                        status: "发布",
                        name: "撤单"
                      },
                      {
                        type: 2,
                        status: "已处理",
                        name: "结束"
                      }
                    ].filter(
                      item =>
                        item.type === Number(type) &&
                        item.status === detail.status
                    )[0].name
                  }订单`
                : "请先登录"}
            </AtButton>
          )}
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

export default RecommendDetail;
