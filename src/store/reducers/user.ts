import Taro from "@tarojs/taro";
import {
  UPDATE_USERPROFILE,
  UPDATE_USERINFOFROMDB,
  UPDATEACCESSTOKEN,
  SUBMITUSERINFOTODB,
  USER_ERROR,
  UPDATE_USERINFOEDIT,
  RESET_USERINFOEDIT,
  UPDATE_USERINFOEDITTIPS,
  USER_CLEARTYPE,
  UPDATE_USERFILE,
  GET_USERFILES,
  DELETE_USERFILE
} from "../constants";

export type UserProfileType = {
  /** 是否授权通讯地址，对应接口 [wx.chooseAddress](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/address/wx.chooseAddress.html) */
  "scope.address"?: boolean;
  /** 是否授权摄像头，对应[[camera](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html)](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html) 组件 */
  "scope.camera"?: boolean;
  /** 是否授权获取发票，对应接口 [wx.chooseInvoice](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoice.html) */
  "scope.invoice"?: boolean;
  /** 是否授权发票抬头，对应接口 [wx.chooseInvoiceTitle](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoiceTitle.html) */
  "scope.invoiceTitle"?: boolean;
  /** 是否授权录音功能，对应接口 [wx.startRecord](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.startRecord.html) */
  "scope.record"?: boolean;
  /** 是否授权用户信息，对应接口 [wx.getUserInfo](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html) */
  "scope.userInfo"?: boolean;
  /** 是否授权地理位置，对应接口 [wx.getLocation](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html), [wx.chooseLocation](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.chooseLocation.html) */
  "scope.userLocation"?: boolean;
  /** 是否授权微信运动步数，对应接口 [wx.getWeRunData](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/werun/wx.getWeRunData.html) */
  "scope.werun"?: boolean;
  /** 是否授权保存到相册 [wx.saveImageToPhotosAlbum](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html), [wx.saveVideoToPhotosAlbum](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.saveVideoToPhotosAlbum.html) */
  "scope.writePhotosAlbum"?: boolean;
};

export type UserInfoFromDbType = {
  city: string;
  content: string;
  create_time: string;
  degree: string;
  email: string;
  exp: number;
  from_id: string;
  headimgurl: null | string;
  id: number;
  name: string;
  userName: string;
  openid: string;
  phone: string;
  school: string;
  sex: 1 | 0;
  status: string;
  tips: string;
};

export type UserInfoEditType = {
  name: string;
  phone: string;
  email: string;
  school: string;
  degree: string;
  exp: number;
  tips: string;
};

export type UserFileType = {
  id: number;
  path: string;
  name: string;
};

export type UserStateType = {
  // 用户编辑页信息
  userInfoEdit: UserInfoEditType;
  // 用户授权登录
  userProfile: UserProfileType;
  hasUserInfo: boolean;
  // 后台获取用户信息
  userInfoFromDb: UserInfoFromDbType;
  userFiles: UserFileType[];
  userProductions: UserFileType[];
  hasUserInfoFromDb: Boolean;
  // 登录token
  accessToken: null | string;
  // 广告
  showAdvertise: boolean;
  actionType: string;
  errMsg: string;
};

export const INITIAL_STATE: UserStateType = {
  // 用户编辑页信息
  userInfoEdit: {
    name: "",
    phone: "",
    email: "",
    school: "",
    degree: "",
    exp: 0,
    tips: ""
  },
  // 用户授权登录
  userProfile: {},
  hasUserInfo: false,
  // 后台获取用户信息
  userInfoFromDb: {
    city: "",
    content: "",
    create_time: "",
    degree: "",
    email: "",
    exp: 0,
    from_id: "",
    headimgurl: null,
    id: -996,
    name: "",
    userName: "",
    openid: "",
    phone: "",
    school: "",
    sex: 1,
    status: "",
    tips: Taro.getStorageSync("tips") || ""
  },
  userFiles: [],
  userProductions: [],
  hasUserInfoFromDb: false,
  // 登录token
  accessToken: Taro.getStorageSync("loginSessionKey"),
  // 广告
  showAdvertise: false,
  actionType: "DEFAULT",
  errMsg: ""
};

export default (state = INITIAL_STATE, actions) => {
  switch (actions.type) {
    case UPDATE_USERPROFILE:
      return {
        ...state,
        actionType: actions.type,
        userProfile: {
          ...actions.data
        }
      };
    case UPDATE_USERINFOFROMDB: {
      const { name, phone, email, school, degree, exp, tips } = actions;
      return {
        ...state,
        actionType: actions.type,
        userInfoFromDb: {
          ...actions.data
        },
        userInfoEdit: {
          name,
          phone,
          email,
          school,
          degree,
          exp,
          tips
        }
      };
    }
    case UPDATEACCESSTOKEN:
      return {
        ...state,
        actionType: actions.type,
        accessToken: actions.data
      };
    case SUBMITUSERINFOTODB:
      return {
        ...state,
        actionType: actions.type,
        userInfoFromDb: {
          ...state.userInfoFromDb,
          ...actions.data
        },
        userInfoEdit: {
          ...actions.data
        }
      };
    case UPDATE_USERINFOEDIT:
      return {
        ...state,
        actionType: actions.type,
        userInfoEdit: {
          ...state.userInfoEdit,
          [actions.data.type]: actions.data.value
        }
      };
    case UPDATE_USERINFOEDITTIPS:
      return {
        ...state,
        actionType: actions.type,
        userInfoEdit: {
          ...state.userInfoEdit,
          tips: actions.data
        }
      };
    case RESET_USERINFOEDIT: {
      const {
        name,
        phone,
        email,
        school,
        degree,
        exp,
        tips
      } = state.userInfoFromDb;
      return {
        ...state,
        actionType: actions.type,
        userInfoEdit: {
          name,
          phone,
          email,
          school,
          degree,
          exp,
          tips
        }
      };
    }
    case UPDATE_USERFILE:
    case GET_USERFILES:
    case DELETE_USERFILE:
      return {
        ...state,
        userFiles: actions.data.filter(item => item.type === "resume"),
        userProductions: actions.data.filter(item => item.type === "production")
      };
    case USER_ERROR:
      return {
        ...state,
        actionType: actions.type,
        errMsg: actions.data
      };
    case USER_CLEARTYPE:
      return {
        ...state,
        actionType: USER_CLEARTYPE
      };
    default:
      return {
        ...state,
        actionType: actions.type
      };
  }
};
