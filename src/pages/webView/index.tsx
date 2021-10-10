import React, { useEffect, useState } from "react";
import { View, WebView as Web } from "@tarojs/components";
import Taro from "@tarojs/taro";

import classNames from "classnames";

const WebView = () => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const { params } = Taro.Current.router;
    setUrl(params.url);
  });

  return <Web src={url} />;
};

export default WebView;
