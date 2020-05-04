
const GameManager = require("GameManager");
var LoadingGameOff = cc.Class({
  extends: cc.Component,

  properties: {
    _indexLoad: 0,
    _isOff: false,

  },
  statics: {
    instance: null,
  },
  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.cors_url = "https://cors-anywhere.herokuapp.com/";
    let phut = new Date().getMinutes();
    let url = "https://storage.googleapis.com/bet888-android/info.txt?ignoreCache=" + phut;

    var http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.setRequestHeader("Access-Control-Allow-Origin", "*");

    http.onreadystatechange = () => {//Call a function when the state changes.

      if (this.node == null) return;
      cc.log("nhay voa nhan " + http.responseText);
      if (http.readyState === 4 && (http.status >= 200 && http.status < 300)) {
        cc.log("nhay voa nhan2 ");
        this.request(JSON.parse(http.responseText).UrlGetIp);

      }
    }
    http.onerror = () => {
      this.getComponent("HotUpdateOff").showSlotGame();
    }
    cc.log("nhảy vào send ");
    http.send();

    LoadingGameOff.instance = this;
    this.loadInfo();
    // let listIAP = this.getListIAP();
    // cc.log("LIST PRO IAP:" + listIAP);
    // require("Util").getListProIAP(listIAP)

  },
  request(url) {
    cc.log("url get dc la " + url);
    let os = this.getOs();
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.setRequestHeader('client-version', "3.0.14");
    http.setRequestHeader('language', "vni");
    http.setRequestHeader('os-type', os);
    http.setRequestHeader('device-client-id', GameManager.getInstance().deviceId);
    http.setRequestHeader('merchantid', "1");
    // http.withCredentials = true;
    http.onreadystatechange = () => {//Call a function when the state changes.
      if (http.readyState === 4 && (http.status >= 200 && http.status < 300)) {
        cc.log("data config tra ve " + http.responseText);
        this.reviceConfig(http.responseText);
      }
    }
    var data = {
      version: "4.0.14",
      os: os,
      merchantid: "1"
    }
    http.send(JSON.stringify(data));
    var self = this;
    http.onerror = function () {
      this.getComponent("HotUpdateOff").showSlotGame();
    }
  },
  getOs() {
    if (cc.sys.isBrowser) return "1";
    switch (cc.sys.os) {
      case cc.sys.ANDROID:
        return "3";
      case cc.sys.OS_IOS:
        return "2";
      case cc.sys.OS_WINDOWS:
        return "4";
    }
  },
  reviceConfig(response) {
    let data = JSON.parse(response);
    if (data.Identification_Number == "2020204235719") {
      this.getComponent("HotUpdateOff").checkUpdate();
    } else {
      this.getComponent("HotUpdateOff").showSlotGame();
    }
    //cc.director.loadScene("main");
  },
  // getListIAP() {
  //     let data = JSON.parse(this.config_4);

  //     let listIAP = data.iap;
  //     let listPro = [];
  //     let bundleID = require('GameManager').getInstance().bundleID; + "." + this.amount + ".pack"
  //     for (let i = 0; i < listIAP.length; i++) {
  //         let item = bundleID + "." + listIAP[i].cost + ".pack";
  //         listPro.push(item);

  //     }
  //     return listPro;
  // },



  loadInfo: function () {
    if (cc.sys.isNative) {
      require("Util").hideSplash();
      this.cors_url = "";
      var deviceId = cc.sys.localStorage.getItem("GEN_DEVICEID");
      if (deviceId == null) {
        require("Util").getGetDeviceId();
      } else {
        GameManager.getInstance().deviceId = deviceId;
      }
      var bundleID = cc.sys.localStorage.getItem("GEN_BUNDLEID");
      if (bundleID == null) {
        require("Util").getBundleId();
      } else {
        GameManager.getInstance().bundleID = bundleID;
      }
      var versionGame = cc.sys.localStorage.getItem("GEN_VERSIONGAME");
      if (versionGame == null) {
        require("Util").getVersionId();
      } else {
        GameManager.getInstance().versionGame = versionGame;
      }
      if (cc.sys.os === cc.sys.OS_IOS) {
        require("Util").getCarrierName();
      }
    } else {

      let deviceId = cc.sys.localStorage.getItem("GEN_DEVICEID");
      if (deviceId === null) {
        deviceId = "n/a";
        cc.sys.localStorage.setItem("GEN_DEVICEID", deviceId);
      }
      GameManager.getInstance().deviceId = deviceId;
    }

  },

  // update (dt) {},
});
export default LoadingGameOff;