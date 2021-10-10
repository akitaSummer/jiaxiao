import Taro from "@tarojs/taro";

export const localFlat = (arr: any[]): any[] => {
  return arr.reduce((prev: any[], item) => {
    if (Array.isArray(item)) {
      return prev.concat(localFlat(item));
    } else {
      prev.push(item);
      return prev;
    }
  }, []);
};

export const changeNavBarTitle = async (title: string) => {
  const { platform } = await Taro.getSystemInfo();
  platform !== "android" &&
    Taro.setNavigationBarTitle({
      title
    });
};

export const degreeList = ["大专", "本科", "硕士", "博士"];
export const tipsList = [
  {
    trade: "开发",
    tips: ["Java", "js", "golang", "rust", "c++"]
  },
  {
    trade: "其他",
    tips: ["产品", "运维", "hr"]
  }
];

export const filterDatas: {
  name: string;
  type: string;
  submenu: {
    name?: string;
    submenu: {
      name: string;
      value: string;
    }[];
  }[];
}[] = [
  // {
  //   // name:'智能排序',
  //   type: "hierarchy",
  //   submenu: [
  //     {
  //       name: "智能排序",
  //       value: "智能排序"
  //     },
  //     {
  //       name: "离我最近",
  //       value: "离我最近"
  //     },
  //     {
  //       name: "人均从高到低",
  //       value: "人均从高到低"
  //     },
  //     {
  //       name: "人均从低到高",
  //       value: "人均从低到高"
  //     }
  //   ]
  // },
  {
    name: "工作年限",
    type: "filter",
    submenu: [
      {
        submenu: [
          {
            name: "实习",
            value: "实习"
          },
          {
            name: "1-3年",
            value: "1-3年"
          },
          {
            name: "3-5年",
            value: "3-5年"
          },
          {
            name: "5-10年",
            value: "5-10年"
          }
        ]
      }
    ]
  },
  {
    name: "学历",
    type: "filter",
    submenu: [
      {
        submenu: [
          {
            name: "大专",
            value: "大专"
          },
          {
            name: "本科",
            value: "本科"
          },
          {
            name: "硕士",
            value: "硕士"
          },
          {
            name: "博士",
            value: "博士"
          }
        ]
      }
    ]
  },
  {
    name: "城市",
    type: "radio",
    submenu: [
      {
        submenu: [
          {
            name: "杭州市",
            value: "杭州市"
          },
          {
            name: "北京市",
            value: "北京市"
          },
          {
            name: "上海市",
            value: "上海市"
          },
          {
            name: "广州市",
            value: "广州市"
          }
        ]
      }
    ]
  }
];
