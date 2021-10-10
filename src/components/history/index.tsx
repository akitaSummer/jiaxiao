import React, { useState, useEffect, useRef, useMemo } from "react";
import Taro from "@tarojs/taro";
import { View, Image, ScrollView } from "@tarojs/components";
import { AtCard, AtActivityIndicator, AtSearchBar } from "taro-ui";
import ListView, { LazyBlock, Skeleton } from "taro-listview";
import classNames from "classnames";
import { useSelector, useDispatch } from "react-redux";

import {
  StoreType,
  DatasStateType,
  RecommendsStateType,
  recommendsClearType,
  updateRecommendsList,
  updateCurrentRecommend,
  UserStateType
} from "../../store";
import {
  filterDatas as filterDefaultDatas,
  changeNavBarTitle,
  localFlat
} from "../../utils";
import { getRecommends } from "../../api";
import FilterDropdown from "../filterDropdown";
import "./index.scss";

import goodsList from "./goodsList";

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
let ImageLoadList = [];
const Search = () => {
  const [isFrist, setIsFirst] = useState(true);
  const [selector, setSelector] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [years, setYears] = useState("");
  const [education, setEducation] = useState("");
  const [citys, setCitys] = useState("");
  const [filterDropdownValue, setFilterDropdownValue] = useState([
    [[]],
    [[]],
    [[]]
  ]);
  const [searchValue, setSearchValue] = useState("");
  const [list, setList] = useState<RecommendType[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [goodsLeft, setGoodsLeft] = useState<any[]>([]);
  const [goodsRight, setGoodsRight] = useState<any[]>([]);
  const [imageLoadList, setImageLoadList] = useState<any[]>([]);
  const [imgWidth, setImgWidth] = useState(0);
  const datas = useSelector<StoreType, DatasStateType>(state => state.datas);
  const recommends = useSelector<StoreType, RecommendsStateType>(
    state => state.recommends
  );
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
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
  const refList = useRef(null);
  const searchChange = async () => {
    if (isFrist) return;
    dispatch(updateRecommendsList([]));
    const {
      data: { datas, pageNum, totalPages }
    } = await getRecommends(
      1,
      10,
      searchValue,
      userInfo.userInfoFromDb.tips,
      years,
      education,
      citys
    );
    if (selector) {
      setSelector(false);
    }
    setList([...datas]);
    dispatch(updateRecommendsList([...datas]));
    setHasMore(pageNum < totalPages);
    setIsEmpty(datas.length === 0);
  };

  const getData = async (pIndex = pageIndex) => {
    const {
      data: { datas, pageNum, totalPages }
    } = await getRecommends(
      pIndex,
      10,
      searchValue,
      userInfo.userInfoFromDb.tips,
      years,
      education,
      citys
    );
    if (selector) {
      setSelector(false);
    }
    return {
      list: datas,
      hasMore: pageNum < totalPages,
      isEmpty: datas.length === 0
    };
  };

  const pullDownRefresh = async () => {
    pageIndex = 1;
    const { list, hasMore, isEmpty } = await getData(1);
    setList([...list]);
    dispatch(updateRecommendsList([...list]));
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

  const onImageLoad = e => {
    console.log(e.currentTarget.id);
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height; //图片原始高度
    let ImgWidth = imgWidth; //图片设置的宽度
    let scale = ImgWidth / oImgW; //比例计算
    let imgHeight = oImgH * scale; //自适应高度

    //初始化ImageLoadList数据
    ImageLoadList.push({
      id: parseInt(e.currentTarget.id),
      height: imgHeight
    });
    //载入全部的图片进入ImageLoadList数组，若数量和goodsList中相等，进入图片排序函数
    if (ImageLoadList.length === goodsList.length) {
      handleImageLoad(ImageLoadList);
    }
    // console.log(ImageLoadList)
  };
  const handleImageLoad = ImageLoadList => {
    console.log("hello", ImageLoadList);
    //对无序的列表进行排序
    for (let i = 0; i < ImageLoadList.length - 1; i++)
      for (let j = 0; j < ImageLoadList.length - i - 1; j++) {
        if (ImageLoadList[j].id > ImageLoadList[j + 1].id) {
          let temp = ImageLoadList[j];
          ImageLoadList[j] = ImageLoadList[j + 1];
          ImageLoadList[j + 1] = temp;
        }
      }
    //现在的列表在goodList的基础上，多了height属性
    console.log("ImageLoadList", ImageLoadList);
    //为现在的列表添加value值

    for (let i = 0; i < goodsList.length; i++) {
      ImageLoadList[i].value = goodsList[i].value;
      ImageLoadList[i].image = goodsList[i].image;
      console.log("ImageLoadList[i].height", ImageLoadList[i].height);
      ImageLoadList[i].imgStyle = { height: ImageLoadList[i].height + "rpx" };
    }
    console.log("ImageLoadList", ImageLoadList);
    //对现在的列表进行操作
    let leftHeight = 0;
    let rightHeight = 0;
    let left = [];
    let right = [];
    //遍历数组
    for (let i = 0; i < ImageLoadList.length; i++) {
      console.log("左边的高度", leftHeight, "右边边的高度", rightHeight);
      if (leftHeight <= rightHeight) {
        console.log("第", i + 1, "张放左边了");
        left.push(ImageLoadList[i]);
        leftHeight += ImageLoadList[i].height;
        console.log("left", left);
      } else {
        console.log("第", i + 1, "张放右边了");
        right.push(ImageLoadList[i]);
        rightHeight += ImageLoadList[i].height;
        console.log("right", right);
      }
    }
    setGoodsRight(right);
    setGoodsLeft(left);
  };

  useEffect(() => {
    // @ts-ignore
    setIsFirst(false);
  }, []);

  useEffect(() => {
    changeNavBarTitle("UFreedom");

    Taro.getSystemInfo({
      success: res => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.5;
        setImgWidth(imgWidth);
      }
    });
  }, []);

  useEffect(() => {
    searchChange();
  }, [searchValue, education, citys, years]);

  return (
    <View className={classNames("index-history")}>
      <AtSearchBar
        className={"search-bar"}
        inputType="text"
        value={searchValue}
        onChange={v => {
          setSelector(true);
          setSearchValue(v);
        }}
        onActionClick={() => {
          searchChange();
        }}
        actionName={"搜索"}
      />
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
        <View className={"goods"}>
          <View style={{ display: "none" }}>
            {goodsList.map((item, index) => {
              return (
                <Image
                  onLoad={onImageLoad}
                  id={"" + index}
                  src={item.image}
                ></Image>
              );
            })}
          </View>

          <ScrollView>
            {
              <View className={"goods-left"}>
                {goodsLeft.map((item, index) => {
                  return (
                    <View className={"goods-item"}>
                      <Image
                        src={item.image}
                        className={"goods-img"}
                        style={item.imgStyle}
                        id={"" + index}
                        mode="widthFix"
                      />
                      <View className={"goods-name"}>{item.value}</View>
                    </View>
                  );
                })}
              </View>
            }
          </ScrollView>

          <ScrollView>
            {
              <View className={"goods-right"}>
                {goodsRight.map((item, index) => {
                  return (
                    <View className={"goods-item"}>
                      <Image
                        src={item.image}
                        className={"goods-img"}
                        style={item.imgStyle}
                        id={"" + index}
                        mode="widthFix"
                      />
                      <View className={"goods-name"}>{item.value}</View>
                    </View>
                  );
                })}
              </View>
            }
          </ScrollView>
        </View>
        {/* {selector &&
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
                <View className="itemtitle">{item.depFullName}</View>
              </AtCard>
            );
          })}

        {list.map((item, index) => {
          return (
            <>
              <AtCard
                className={classNames("recommend-item")}
                key={index + item.depFullName + item.jobId}
                note={`公司：${item.origin}; 工作地点：${item.workPlace}`}
                extra={item.reqWorkYearsName}
                title={item.name}
                onClick={() => {
                  dispatch(updateCurrentRecommend(item));
                  Taro.navigateTo({
                    url: "/pages/recommendDetail/index",
                    complete: () => {
                      dispatch(recommendsClearType());
                    }
                  });
                }}
                // thumb=""
              >
                <View className="itemtitle">{item.depFullName}</View>
              </AtCard>
              {index === list.length - 1 && hasMore && (
                <View className={classNames("footer-loading")}>
                  <AtActivityIndicator mode="center"></AtActivityIndicator>
                </View>
              )}
            </>
          );
        })} */}
        {hasMore && (
          <View className={classNames("footer-loading")}>
            <AtActivityIndicator mode="center"></AtActivityIndicator>
          </View>
        )}
      </ListView>
    </View>
  );
};
export default Search;
