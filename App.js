import React, { Component } from 'react';
import { Provider } from "react-redux";
import store from "./src/store";
import Navigation from "./src/route/navigation";
import Splash from "./src/screen/splashScreen/splashScreen";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    )
  }
}

export default App;