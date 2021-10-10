import React from "react";
import "./app.scss";

import { Provider } from "react-redux";

import configStore from "./store";

const store = configStore();

const App = props => {
  return <Provider store={store}>{props.children}</Provider>;
};

export default App;
