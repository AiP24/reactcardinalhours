import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Component } from "react";
import DesktopComponent from "./Components/DesktopComponent";
type AppProps = {};
class App extends Component {
  constructor(props: AppProps) {
    super(props);
    this.state = {};
  }
  getMobile(): boolean {
    const platforms = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];
    return platforms.some((platform) => {
      return navigator.userAgent.match(platform);
    });
  }
  render() {
    return <DesktopComponent />;
  }
  componentDidMount(): void {
    //Reloading since the timers drastically slow when the tab is inactive;
    //I am too lazy to do any date subtraction to correct the times for now. The time will only be off by a min at most
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") window.location.reload();
    });
  }

  componentWillUnmount(): void {
    document.removeEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") window.location.reload();
    });
  }
}

export default App;
