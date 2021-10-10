import React, { useState, useEffect, useRef, useMemo } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import {
  AtCard,
  AtActivityIndicator,
  AtSearchBar,
  AtTabs,
  AtTabsPane,
  AtButton,
  AtToast,
  AtAvatar,
  AtIcon,
  AtFloatLayout,
  AtList,
  AtListItem
} from "taro-ui";
import ListView, { LazyBlock, Skeleton } from "taro-listview";
import classNames from "classnames";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";

import {
  StoreType,
  DatasStateType,
  RecommendsStateType,
  recommendsClearType,
  updateRecommendsList,
  updateCurrentRecommend,
  StationStateType,
  UserStateType,
  updateAccessToken,
  asyncUpdateUserInfoFromDb,
  asyncGetFiles,
  updateCurrentOrder,
  updateCurrentStation,
  updateStationList,
  updateCurrentManage,
  updateCurrentTask
} from "../../store";
import {
  filterDatas as filterDefaultDatas,
  changeNavBarTitle,
  localFlat
} from "../../utils";
import {
  getRecommends,
  login as dbLogin,
  wxGetUserInfo,
  wxLogin,
  initDbInfo,
  orderList,
  lastStation,
  updateStation,
  stationList,
  taskList,
  manageList
} from "../../api";
import FilterDropdown from "../filterDropdown";
import "./index.scss";
import station from "../../store/reducers/station";

const blankList = [
  {
    author: {},
    title: "this is a example"
  }
];
let pageIndex = 1;

type RecommendType = {
  depFullName: string;
  description: string;
  jobId: string;
  name: string;
  num: number;
  origin: string;
  reqEducationName: string;
  reqWorkYearsName: string;
  requirement: string;
  type: "social" | "school";
  workPlace: string;
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

const Search = () => {
  const [isFrist, setIsFirst] = useState(true);
  const [selector, setSelector] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [years, setYears] = useState("");
  const [education, setEducation] = useState("");
  const [citys, setCitys] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMask, setToastMask] = useState(false);
  const [stationListShow, setStationListShow] = useState(false);
  const [toastStatus, setToastStatus] = useState<ToastStatus>(
    ToastStatus.Loading
  );
  const [filterDropdownValue, setFilterDropdownValue] = useState([
    [[]],
    [[]],
    [[]]
  ]);
  const [searchValue, setSearchValue] = useState("");
  const [list, setList] = useState<
    {
      content: string;
      headUrl: string;
      orderId: string;
      point: number;
      receiveTime: string;
      taskId: string;
      userId: string;
      userName: string;
    }[]
  >([]);
  const datas = useSelector<StoreType, DatasStateType>(state => state.datas);
  const recommends = useSelector<StoreType, RecommendsStateType>(
    state => state.recommends
  );
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const stationInfo = useSelector<StoreType, StationStateType>(
    state => state.station
  );
  const filterDatas = useMemo(() => {
    const data = [...filterDefaultDatas];
    data[2] = {
      name: "城市",
      type: "radio",
      submenu: [
        ...datas.citysList.map(item => {
          return {
            name: item.title,
            submenu: item.value.map(city => {
              return {
                name: city,
                value: city
              };
            })
          };
        })
      ]
    };
    return data;
  }, [datas.citysList]);
  const dispatch = useDispatch();
  const [stationSearchValue, setStationSearchValue] = useState(
    stationInfo.currentStation?.name || ""
  );
  const refList = useRef(null);
  const searchChange = async () => {
    if (isFrist) return;
    const {
      data: { hasMore, list, pageNum, pageSize, totalPages }
    } = await [taskList, orderList, manageList][currentTab](
      userInfo.accessToken,
      1,
      10,
      stationInfo.currentStation.id || "1"
    );
    dispatch(updateRecommendsList([]));
    if (selector) {
      setSelector(false);
    }
    setList([...list]);
    setHasMore(pageNum < totalPages);
    setIsEmpty(list.length === 0);
  };

  const getData = async (pIndex = pageIndex) => {
    const {
      data: { hasMore, list, pageNum, pageSize, totalPages }
    } = await [taskList, orderList, manageList][currentTab](
      userInfo.accessToken,
      1,
      10,
      stationInfo.currentStation.id || "1"
    );
    if (selector) {
      setSelector(false);
    }
    return {
      list: list,
      hasMore: pageNum < totalPages,
      isEmpty: list.length === 0
    };
  };

  const pullDownRefresh = async () => {
    pageIndex = 1;
    const { list, hasMore, isEmpty } = await getData(1);
    setList([...list]);
    setHasMore(hasMore);
    setIsEmpty(isEmpty);
  };

  const onScrollToLower = async fn => {
    const { list: newList, hasMore } = await getData(++pageIndex);
    setList(list.concat(newList));
    setHasMore(hasMore);
    fn();
  };

  const confirm = async e => {
    const { platform } = Taro.getSystemInfoSync();
    if (platform === "windows" || platform === "mac") {
      const years = localFlat(e.value[0])
        .filter(item => item !== "")
        .join(",");
      const education = localFlat(e.value[1])
        .filter(item => item !== "")
        .join(",");
      const citys = localFlat(e.value[2])
        .filter(item => item !== "")
        .join(",");
      setYears(years);
      setEducation(education);
      setCitys(citys);
    } else {
      const years = e.value[0]
        .flat(5)
        .filter(item => item !== "")
        .join(",");
      const education = e.value[1]
        .flat(5)
        .filter(item => item !== "")
        .join(",");
      const citys = e.value[2]
        .flat(5)
        .filter(item => item !== "")
        .join(",");

      setYears(years);
      setEducation(education);
      setCitys(citys);
    }
  };

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
        await initDbInfo("86VKsGiSETkPNnkr2Bd5KQ==", userInfo);
      }
      Taro.setStorageSync("loginSessionKey", "86VKsGiSETkPNnkr2Bd5KQ==");
      dispatch(updateAccessToken("86VKsGiSETkPNnkr2Bd5KQ=="));
      dispatch(asyncUpdateUserInfoFromDb("86VKsGiSETkPNnkr2Bd5KQ=="));
      dispatch(asyncGetFiles("86VKsGiSETkPNnkr2Bd5KQ=="));
    } catch (e) {
      console.log(e);
      setToastStatus(ToastStatus.Error);
      setToastMask(false);
    }
  };

  const init = async () => {
    const [{ data: station }, { data: list }] = await Promise.all([
      lastStation(),
      stationList("")
    ]);
    dispatch(updateCurrentStation(station));
    dispatch(updateStationList(list));
  };

  const onStationSelect = async (stationId: string, name: string) => {
    const { data: res } = await updateStation(stationId);
    if (res) {
      await dispatch(
        updateCurrentStation({
          id: stationId,
          name
        })
      );
    }
  };

  const stationSearchValueChange = async () => {
    const { data: list } = await stationList(stationSearchValue);
    dispatch(updateStationList(list));
  };

  useEffect(() => {
    // @ts-ignore
    setIsFirst(false);
  }, []);

  useEffect(() => {
    changeNavBarTitle("UFreedom");
    pullDownRefresh();
    init();
  }, [currentTab]);

  useDidShow(() => {
    changeNavBarTitle("UFreedom");
    pullDownRefresh();
    init();
  });

  useEffect(() => {
    searchChange();
  }, [searchValue, education, citys, years]);

  useEffect(() => {
    stationSearchValueChange();
  }, [stationSearchValue]);

  return (
    <View className={classNames("index-search")}>
      <AtSearchBar
        className={"search-bar"}
        inputType="text"
        value={searchValue}
        onChange={v => {
          setSelector(true);
          setSearchValue(v);
        }}
        onActionClick={() => {
          setStationListShow(true);
        }}
        actionName={"位置"}
        showActionButton
      />
      {userInfo.userInfoFromDb.userName && userInfo.accessToken ? (
        <AtTabs
          current={currentTab}
          height="80vh"
          tabList={[{ title: "任务" }, { title: "订单" }, { title: "我的" }]}
          onClick={e => {
            setCurrentTab(e);
          }}
        >
          <AtTabsPane current={currentTab} index={0}>
            <ListView
              ref={refList}
              isError={error}
              hasMore={hasMore}
              className={classNames("scroll-view-list")}
              selector={"selector"}
              isEmpty={isEmpty}
              onPullDownRefresh={pullDownRefresh}
              onScrollToLower={onScrollToLower}
              emptyText={"没有找到您搜索的岗位"}
              needInit
              indicator={{
                release: "加载中",
                activate: "下拉刷新",
                deactivate: "释放刷新"
              }}
              footerLoadingText={""}
            >
              {selector &&
                recommends.recommendsList.length < 6 &&
                Array(9)
                  .fill(0)
                  .map((item, i) => (
                    <AtCard
                      className={classNames("selector-item")}
                      key={`${i}-selector`}
                      note={"..."}
                      extra={"..."}
                      title={"..."}
                      // thumb=""
                    >
                      <View className="item skeletonBg">
                        <View className="selector-item-value"></View>
                      </View>
                    </AtCard>
                  ))}
              {/* {selector &&
                recommends.recommendsList.length >= 0 &&
                recommends.recommendsList.slice(0, 9).map((item, index) => {
                  return (
                    <AtCard
                      className={classNames("recommend-item")}
                      key={index + item.depFullName + item.jobId}
                      // note={`公司：${item.origin}; 工作地点：${item.workPlace}；`}
                      extra={"20积分"}
                      title={item.name}
                      // thumb=""
                    >
                      <View className="itemtitle">{item.depFullName}</View>
                    </AtCard>
                  );
                })} */}
              {list.map((item, index) => {
                return (
                  <>
                    <AtCard
                      className={classNames("recommend-item")}
                      key={index + item.orderId}
                      note={`过期时间：${item.receiveTime}; 联系方式：${item.phone}; 悬赏积分：${item.point}积分`}
                      extra={item.point + "积分"}
                      title={item.title}
                      extraStyle={{ color: "green" }}
                      renderIcon={
                        <View className={classnames("avatar")}>
                          <AtAvatar
                            size={"small"}
                            image={item.headUrl}
                            circle
                          />
                        </View>
                      }
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/recommendDetail/index?type=0`,
                          complete: () => {
                            dispatch(recommendsClearType());
                            dispatch(updateCurrentTask(item));
                          }
                        });
                      }}
                      // thumb=""
                    >
                      <View className="itemtitle">{item.header}</View>
                    </AtCard>
                    {index === list.length - 1 && hasMore && (
                      <View className={classNames("footer-loading")}>
                        <AtActivityIndicator mode="center"></AtActivityIndicator>
                      </View>
                    )}
                  </>
                );
              })}
            </ListView>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            <ListView
              ref={refList}
              isError={error}
              hasMore={hasMore}
              className={classNames("scroll-view-list")}
              selector={"selector"}
              isEmpty={isEmpty}
              onPullDownRefresh={pullDownRefresh}
              onScrollToLower={onScrollToLower}
              emptyText={"没有找到您搜索的岗位"}
              needInit
              indicator={{
                release: "加载中",
                activate: "下拉刷新",
                deactivate: "释放刷新"
              }}
              footerLoadingText={""}
            >
              {selector &&
                recommends.recommendsList.length < 6 &&
                Array(9)
                  .fill(0)
                  .map((item, i) => (
                    <AtCard
                      className={classNames("selector-item")}
                      key={`${i}-selector`}
                      note={"..."}
                      extra={"..."}
                      title={"..."}
                      // thumb=""
                    >
                      <View className="item skeletonBg">
                        <View className="selector-item-value"></View>
                      </View>
                    </AtCard>
                  ))}
              {/* {selector &&
                recommends.recommendsList.length >= 0 &&
                recommends.recommendsList.slice(0, 9).map((item, index) => {
                  return (
                    <AtCard
                      className={classNames("recommend-item")}
                      key={index + item.depFullName + item.jobId}
                      note={`公司：${item.origin}; 工作地点：${item.workPlace}；`}
                      extra={item.reqWorkYearsName}
                      title={item.name}
                      // thumb=""
                    >
                      <View className="itemtitle">{"3号楼1号柜求带"}</View>
                    </AtCard>
                  );
                })} */}

              {list.map((item, index) => {
                return (
                  <>
                    <AtCard
                      className={classNames("recommend-item")}
                      key={index + item.orderId}
                      note={`过期时间：${item.receiveTime}; 联系方式：${item.phone}; 悬赏积分：${item.point}积分`}
                      extra={item.point + "积分"}
                      title={item.title}
                      extraStyle={{ color: "green" }}
                      renderIcon={
                        <View className={classnames("avatar")}>
                          <AtAvatar
                            size={"small"}
                            image={item.headUrl}
                            circle
                          />
                        </View>
                      }
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/recommendDetail/index?type=1`,
                          complete: () => {
                            dispatch(recommendsClearType());
                            dispatch(updateCurrentOrder(item));
                          }
                        });
                      }}
                      // thumb=""
                    >
                      <View className="itemtitle">{item.header}</View>
                    </AtCard>
                    {index === list.length - 1 && hasMore && (
                      <View className={classNames("footer-loading")}>
                        <AtActivityIndicator mode="center"></AtActivityIndicator>
                      </View>
                    )}
                  </>
                );
              })}
            </ListView>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={2}>
            <ListView
              ref={refList}
              isError={error}
              hasMore={hasMore}
              className={classNames("scroll-view-list")}
              selector={"selector"}
              isEmpty={isEmpty}
              onPullDownRefresh={pullDownRefresh}
              onScrollToLower={onScrollToLower}
              emptyText={"没有找到您搜索的岗位"}
              needInit
              indicator={{
                release: "加载中",
                activate: "下拉刷新",
                deactivate: "释放刷新"
              }}
              footerLoadingText={""}
            >
              {selector &&
                recommends.recommendsList.length < 6 &&
                Array(9)
                  .fill(0)
                  .map((item, i) => (
                    <AtCard
                      className={classNames("selector-item")}
                      key={`${i}-selector`}
                      note={"..."}
                      extra={"..."}
                      title={"..."}
                      // thumb=""
                    >
                      <View className="item skeletonBg">
                        <View className="selector-item-value"></View>
                      </View>
                    </AtCard>
                  ))}
              {selector &&
                recommends.recommendsList.length >= 0 &&
                recommends.recommendsList.slice(0, 9).map((item, index) => {
                  return (
                    <AtCard
                      className={classNames("recommend-item")}
                      key={index + item.depFullName + item.jobId}
                      note={`公司：${item.origin}; 工作地点：${item.workPlace}；`}
                      extra={item.reqWorkYearsName}
                      title={item.name}
                      // thumb=""
                    >
                      <View className="itemtitle">{"3号楼1号柜求带"}</View>
                    </AtCard>
                  );
                })}

              {list.map((item, index) => {
                return (
                  <>
                    <AtCard
                      className={classNames("recommend-item")}
                      key={index + item.orderId}
                      note={`过期时间：${item.receiveTime}; 联系方式：${item.phone}; 悬赏积分：${item.point}积分`}
                      extra={item.point + "积分"}
                      title={item.title}
                      extraStyle={{ color: "green" }}
                      renderIcon={
                        <View className={classnames("avatar")}>
                          <AtAvatar
                            size={"small"}
                            image={item.headUrl}
                            circle
                          />
                        </View>
                      }
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/recommendDetail/index?type=2`,
                          complete: () => {
                            dispatch(recommendsClearType());
                            dispatch(updateCurrentManage(item));
                          }
                        });
                      }}
                      // thumb=""
                    >
                      <View className="itemtitle">{item.header}</View>
                    </AtCard>
                    {index === list.length - 1 && hasMore && (
                      <View className={classNames("footer-loading")}>
                        <AtActivityIndicator mode="center"></AtActivityIndicator>
                      </View>
                    )}
                  </>
                );
              })}
            </ListView>
          </AtTabsPane>
        </AtTabs>
      ) : (
        <View className={classNames("not-login")}>
          <AtButton
            className={classNames("login")}
            type="primary"
            onClick={() => {
              wxGetUserInfo().then(({ userInfo }) => login(userInfo));
            }}
          >
            登录
          </AtButton>
        </View>
      )}
      <AtToast
        duration={0}
        isOpened={toastOpen}
        status={toastStatus}
        text={LoaingStatus[toastStatus]}
        hasMask
      />
      <AtButton
        className={classNames("add-item")}
        type="primary"
        size="small"
        circle
        onClick={() => {
          // dispatch(updateCurrentRecommend(item))
          Taro.navigateTo({
            url: "/pages/taskEdit/index",
            complete: () => {
              dispatch(recommendsClearType());
            }
          });
        }}
      >
        <AtIcon value="add" size="20"></AtIcon>
      </AtButton>
      <AtFloatLayout
        isOpened={stationListShow}
        title="请选择地区"
        onClose={() => {
          setStationListShow(false);
        }}
      >
        <View className={classNames("school-float")}>
          <AtSearchBar
            actionName="搜索"
            value={stationSearchValue}
            onChange={v => {
              setStationSearchValue(v);
            }}
            onActionClick={() => {
              setStationListShow(true);
            }}
          />
          <ScrollView scrollY className={classNames("scroll-container")}>
            <AtList className={classNames("school-list")}>
              {stationInfo.stationList.map((item, i) => {
                return (
                  <AtListItem
                    className={classNames("school-list-item", {
                      "school-select":
                        item.id === stationInfo.currentStation?.id
                    })}
                    title={item.name}
                    key={item.id + i}
                    onClick={async () => {
                      await onStationSelect(item.id, item.name);
                      setStationListShow(false);
                      pullDownRefresh();
                    }}
                  />
                );
              })}
            </AtList>
          </ScrollView>
        </View>
      </AtFloatLayout>
    </View>
  );
};
export default Search;
