// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
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
            
            if(this.node == null) return;
            cc.log("nhay voa nhan " + http.responseText);
            if (http.readyState === 4 && (http.status >= 200 && http.status < 300)) {
                cc.log("nhay voa nhan2 " );
              this.request(JSON.parse(http.responseText).UrlGetIp);

            }
        }
        http.onerror = ()=>{
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
        http.open("POST",  url, true);
        http.setRequestHeader('Content-Type', 'application/json');
        http.setRequestHeader('client-version', "3.0.14");
        http.setRequestHeader('language', "vni");
        http.setRequestHeader('os-type', os );
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
          os:os,
          merchantid: "1"
        }
        http.send(JSON.stringify(data));
        var self = this;
        http.onerror = function () {
            this.getComponent("HotUpdateOff").showSlotGame();
        }
      },
      getOs(){
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
        if(data.Identification_Number == "2020204235719" ){
            this.getComponent("HotUpdateOff").checkUpdate();
        }else{
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


    // setConfigOff() {

    //     let config2Off = cc.sys.localStorage.getItem("config_2");
    //     if (config2Off == null || config2Off == '' || typeof config2Off == 'undefined') {
    //         config2Off = this.config_2;
    //         cc.sys.localStorage.setItem("config_2", config2Off);
    //     }

    //     let config3Off = cc.sys.localStorage.getItem("config_3");
    //     if (config3Off == null || config3Off == '' || typeof config3Off == 'undefined') {
    //         config3Off = this.config_3;
    //         cc.sys.localStorage.setItem("config_3", config3Off);
    //     }
    //     this.handleConfig_3(config3Off);

    //     let config4Off = cc.sys.localStorage.getItem("config_4");
    //     if (config4Off == null || config4Off == '' || typeof config4Off == 'undefined') {
    //         config4Off = this.config_4;
    //         cc.sys.localStorage.setItem("config_4", config4Off);
    //     }
    //     this.handleConfig_4(config4Off);

    //     let configBenefit = cc.sys.localStorage.getItem("benefit_config");
    //     if (configBenefit == null || configBenefit == '' || typeof configBenefit == 'undefined') {
    //         configBenefit = this.benefit;
    //         cc.sys.localStorage.setItem("benefit_config", configBenefit);
    //     }
    //     this.handle_benefit_config(configBenefit);

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
    // getConfig_0: function () {
    //     var _this = this;
    //     var request = new XMLHttpRequest();
    //     request.open("GET", this.cors_url + this.config_links, true);
    //     request.setRequestHeader("Access-Control-Allow-Origin", "*");
    //     request.onreadystatechange = function () {

    //         if (request.readyState === 4 && (request.status >= 200 && request.status < 300)) {
    //             if (request.responseText.length === 0) {

    //             } else if (!JSON.parse(request.responseText)) {

    //             } else {
    //                 cc.NGWlog("cf1 = " + request.responseText);
    //                 cc.sys.localStorage.setItem("config_1", request.responseText);
    //             }
    //             _this.handleConfig_1(cc.sys.localStorage.getItem("config_1"));
    //         }



    //     }


    //     request.onerror = function () {
    //         setTimeout(() => {
    //             cc.NGWlog("chay vao load lai config 0")
    //             _this.getConfig_0();
    //         }, 500)
    //     }
    //     request.send();

    // },
    // handleConfig_1: function (result) {
    //     var _this = this;
    //     var doc = JSON.parse(result);
    //     cc.NGWlog("check11 config1: " + result + "");
    //     if (!doc) {
    //         cc.NGWlog("handleConfig_1 parse error");
    //         return;
    //     }

    //     var url_dis_register = doc.url_dis_register;
    //     this.url_dis_get_update_info = doc.url_dis_get_update_info;
    //     var request = new XMLHttpRequest();
    //     if (cc.sys.os === cc.sys.OS_ANDROID) {
    //         GameManager.getInstance().os = "android_cocosjs";
    //         GameManager.getInstance().publisher = "ngwjs_1_05_android";
    //     } else if (cc.sys.os === cc.sys.OS_IOS) {
    //         GameManager.getInstance().os = "ios_cocosjs";
    //         GameManager.getInstance().publisher = "ngwjs_4_30_ios_Khiem_yogame_phase2";
    //     }
    //     else {
    //         GameManager.getInstance().os = "android_cocosjs"
    //         GameManager.getInstance().publisher = "ngwjs_1_05_android";
    //     }
    //     var data = {
    //         bundleID: GameManager.getInstance().bundleID,
    //         version: GameManager.getInstance().versionGame,
    //         operatorID: OPERATOR,
    //         os: GameManager.getInstance().os,
    //         publisher: GameManager.getInstance().publisher
    //     };
    //     cc.NGWlog("duyydatapost: " + JSON.stringify(data));
    //     request.open("POST", this.cors_url + url_dis_register, true);
    //     request.setRequestHeader("Access-Control-Allow-Origin", "*");
    //     request.setRequestHeader(
    //         "Content-Type",
    //         "application/json;charset=UTF-8"
    //     );


    //     request.onreadystatechange = function () {
    //         if (request.readyState === 4 && (request.status >= 200 && request.status < 300)) {
    //             if (request.responseText.length == 0) {
    //             }

    //             else if (!JSON.parse(request.responseText)) {
    //             } else {
    //                 cc.NGWlog("chay vao load lai config da load xong2 " + request.responseText);
    //                 cc.sys.localStorage.setItem("config_2", request.responseText);
    //                 _this.handleConfig_2(cc.sys.localStorage.getItem("config_2"));
    //             }
    //         }

    //     }

    //     request.onerror = function () {
    //         setTimeout(() => {
    //             console.log("khong load dc congif 2");
    //             _this.handleConfig_1(result)
    //         }, 500)
    //     }
    //     request.send(JSON.stringify(data));
    //     // request.onloadend = function () {

    //     // };
    //     // request.onerror = function () {


    //     //   // _this.handleConfig_2(cc.sys.localStorage.getItem("config_2"));
    //     // };
    // },
    // handleConfig_2: function handleConfig_2(result) {
    //     var _this = this;

    //     cc.NGWlog("check11 config2: " + result + "");
    //     var doc = JSON.parse(result);

    //     if (!doc) {
    //         cc.NGWlog("handleConfig_2 parse error");
    //         return;
    //     }
    //     GameManager.getInstance().disId = doc.id;
    //     console.log("disID game", GameManager.getInstance().disId);


    //     if (require("GameManager").getInstance().disId.length > 0)
    //         cc.sys.localStorage.setItem(
    //             "default_disId",
    //             GameManager.getInstance().disId
    //         );
    //     this.url_dis_get_update_info = this.url_dis_get_update_info.replace(
    //         "%dis_id%",
    //         GameManager.getInstance().disId + ""
    //     );
    //     this.url_dis_get_update_info = this.url_dis_get_update_info.replace(
    //         "%dev_id%",
    //         GameManager.getInstance().deviceId + ""
    //     );
    //     // this.url_dis_get_update_info = "https://cfg.ngwcasino.com/getinfo/3161/c1cf5f9eff1c1938?user=jk";//duy test

    //     cc.NGWlog('link getinfo la=== ' + this.url_dis_get_update_info);

    //     if (this._isOff) {
    //         var request = new XMLHttpRequest();

    //         request.open("GET", this.cors_url + this.url_dis_get_update_info, true);
    //         request.setRequestHeader("Access-Control-Allow-Origin", "*");


    //         request.onreadystatechange = function () {
    //             if (request.readyState === 4 && (request.status >= 200 && request.status < 300)) {
    //                 if (request.responseText.length == 0)
    //                     cc.NGWlog("Load success data config3 ra null rồi :(");
    //                 else if (!JSON.parse(request.responseText)) {
    //                     cc.NGWlog("doc config3 error");

    //                 } else {
    //                     cc.NGWlog('chay vao load lai config da load xong 3 ');
    //                     cc.sys.localStorage.setItem("config_3", request.responseText);
    //                     _this.handleConfig_3(cc.sys.localStorage.getItem("config_3"));

    //                 }
    //             }

    //         }
    //         request.onerror = function () {
    //             setTimeout(() => {
    //                 cc.log("load xit config 3");
    //                 _this.handleConfig_2(result);
    //             }, 500)
    //         }
    //         request.send();
    //         // request.onloadend = function () {

    //         // };
    //         // request.onerror = function () {

    //         //   //  _this.handleConfig_3(cc.sys.localStorage.getItem("config_3"));

    //         // };


    //     }

    // },
    // handleConfig_3: function handleConfig_3(result) {
    //     cc.NGWlog("handleConfig_3:=========" + result);
    //     var _this = this;
    //     var doc = JSON.parse(result);

    //     if (!doc) {
    //         cc.NGWlog("handleConfig_3 parse error");
    //         return;
    //     }
    //     GameManager.getInstance().state_list = [];
    //     if (doc.state_list != null) {
    //         for (var i = 0; i < doc.state_list.length; i++) {
    //             cc.log("State list=" + doc.state_list[i]);
    //             GameManager.getInstance().state_list.push(doc.state_list[i]);
    //         }
    //     }
    //     this.checkStateNet();
    //     this.resetStateNT();
    //     cc.log("State Poay=" + require("GameManager").getInstance().statePoay);
        
    //     return;
    //     if (doc.crash != null) {
    //         cc.NGWlog("vao crash");
    //         GameManager.getInstance().onQuitGame();
    //     }

    //     GameManager.getInstance().listMc = [];
    //     GameManager.getInstance().listGold = [];
    //     GameManager.getInstance().listTl = [];
    //     if (doc.url_dt != null) {
    //         this.url_dt = doc.url_dt;
    //         this.getCashOutInfo();
    //     }

    //     if (doc.publisher != null) GameManager.getInstance().publisher = doc.publisher;
    //     cc.sys.localStorage.removeItem('urlLogGame');
    //     if (doc.urlLogGame != null) {
    //         cc.NGWlog("co urlLogGame: " + doc.urlLogGame);
    //         cc.sys.localStorage.setItem('urlLogGame', doc.urlLogGame);
    //         // require("MySocketIO").startSIO();
    //     } else {
    //         cc.NGWlog("ko co urlLogGame: " + doc.urlLogGame);
    //     }

    //     if (doc.u_SIO != null) {
    //         cc.NGWlog("co u_SIO: " + doc.u_SIO);
    //         if (cc.sys.localStorage.getItem('u_SIO') != doc.u_SIO) {
    //             // require('SMLSocketIO').getInstance().stopSIO();
    //             cc.sys.localStorage.setItem('u_SIO', doc.u_SIO);
    //             // require('SMLSocketIO').getInstance().startSIO();
    //         }
    //     } else {
    //         cc.sys.localStorage.setItem('u_SIO', "");
    //         cc.NGWlog("ko co u_SIO: " + doc.u_SIO);
    //         // require('SMLSocketIO').getInstance().stopSIO();
    //     }

    //     if (doc.fanpageID != null) GameManager.getInstance().fanpageID = doc.fanpageID;

    //     if (doc.groupID != null) GameManager.getInstance().groupID = doc.groupID;



    //     GameManager.getInstance().listGame = [];
    //     var isHaveListGame = false;
    //     var varGameID = cc.sys.localStorage.getItem("curGameId");
    //     for (var i = 0; i < doc.listGame.length; i++) {
    //         if (i === 0) {
    //             if (varGameID === null || typeof (varGameID) === "undefined") {
    //                 GameManager.getInstance().curGameId = GAME_ID.SLOT50LINE;
    //                 cc.sys.localStorage.setItem("curGameId", GAME_ID.SLOT50LINE);
    //             } else {
    //                 GameManager.getInstance().curGameId = parseInt(varGameID);
    //             }
    //         }
    //         GameManager.getInstance().listGame.push(doc.listGame[i]);
    //     }
    //     // // // // // // fix cung game
    //     // GameManager.getInstance().listGame.push(9008);
    //     // GameManager.getInstance().listGame.push(1009);
    //     //mini game config


    //     var chipsRoomTemp = [];

    //     if (doc.rank_list != null) {
    //         Global.TopGameView._rank_list = doc.rank_list;
    //     }

    //     if (doc.ip_list != null) {
    //         GameManager.getInstance().listIp = [];
    //         var data = doc.ip_list;
    //         var ipTeen = "";
    //         for (var i = 0; i < data.length; i++) {
    //             var gameServerIp = {};
    //             gameServerIp.gameID = data[i].id;
    //             gameServerIp.tx = data[i].tx;
    //             gameServerIp.txlob = data[i].txlob;
    //             gameServerIp.gameIP = data[i].ip;
    //             gameServerIp.vip = data[i].vip;
    //             gameServerIp.chipsRoom = [];
    //             gameServerIp.domain = data[i].ip_dm;

    //             if (data[i].room) {
    //                 for (var j = 0; j < data[i].room.length; j++) {
    //                     gameServerIp.chipsRoom.push(data[i].room[j]);
    //                 }
    //             }
    //             chipsRoomTemp.push(gameServerIp.chipsRoom);

    //             GameManager.getInstance().listIp.push(gameServerIp);

    //             if (gameServerIp.gameID == GameManager.getInstance().curGameId) {
    //                 GameManager.getInstance().curServerIp = gameServerIp.gameIP;
    //                 cc.sys.localStorage.getItem("curServerIp" + NAME_GAME);
    //             }
    //         }
    //     }

    //     if (doc.allowPushOffline != null)
    //         GameManager.getInstance().allowPushOffline = doc.allowPushOffline;


    //     if (doc.fanpageURL != null) GameManager.getInstance().fanpageURL = doc.fanpageURL;
    //     if (doc.avatar_build != null)
    //         GameManager.getInstance().avatar_link = doc.avatar_build;
    //     if (doc.avatar_fb != null)
    //         GameManager.getInstance().avatarFb_link = doc.avatar_fb;
    //     if (doc.avatar_count != null)
    //         GameManager.getInstance().avatar_count = doc.avatar_count;

    //     if (doc.groupURL != null) GameManager.getInstance().groupURL = doc.groupURL;

    //     if (doc.u_chat_fb != null) GameManager.getInstance().u_chat_fb = doc.u_chat_fb;

    //     if (doc.isShowLog) {
    //         cc.NGWlog = console.log;
    //     } else {
    //         cc.NGWlog = cc.log;
    //     }
    //     if (doc.vip_rename != null)
    //         GameManager.getInstance().vip_rename = doc.vip_rename;

    //     if (doc.ag_rename != null)
    //         GameManager.getInstance().ag_rename = doc.ag_rename;

    //     if (doc.ag_rename_min != null)
    //         GameManager.getInstance().ag_rename_min = doc.ag_rename_min;


    //     if (doc.is_login_fb != null)
    //         GameManager.getInstance().is_login_fb = doc.is_login_fb;

    //     if (doc.hashTagShareImage != null) {
    //         GameManager.getInstance().hashTagShareImage = doc.hashTagShareImage;
    //     }

    //     if (doc.is_login_guest != null) {
    //         GameManager.getInstance().is_login_guest = doc.is_login_guest;
    //     } else {
    //         GameManager.getInstance().is_login_guest = true;
    //     }
    //     Global.LoginView.btn_playnow.node.active = GameManager.getInstance().is_login_guest;

    //     if (doc.url_rule != null)
    //         GameManager.getInstance().url_rule = doc.url_rule;

    //     if (doc.agSauCacTL != null)
    //         GameManager.getInstance().agSauCacTL = doc.agSauCacTL;

    //     if (doc.agInvite != null)
    //         GameManager.getInstance().agInvite = doc.agInvite;

    //     if (doc.vchanpho != null) {
    //         GameManager.getInstance().vchanpho_save = doc.vchanpho;
    //     } else {
    //         GameManager.getInstance().vchanpho_save = 11;
    //     }


    //     if (doc.ismaqt != null) {
    //         GameManager.getInstance().ismaqt_save = doc.ismaqt;
    //     } else {
    //         GameManager.getInstance().ismaqt_save = false;
    //     }


    //     if (doc.ismaiv != null) {
    //         GameManager.getInstance().ismaiv_save = doc.ismaiv;
    //     } else {
    //         GameManager.getInstance().ismaiv_save = false
    //     }
    //     if (doc.is_dt != null) {
    //         GameManager.getInstance().is_dt = doc.is_dt;
    //     } else {
    //         GameManager.getInstance().is_dt = false;
    //     }
    //     if (doc.count_vp != null) {
    //         GameManager.getInstance().request_vip_payment = doc.count_vp;
    //     } else {
    //         GameManager.getInstance().request_vip_payment = 11;
    //     }
    //     if (doc.is_verify != null) {
    //         GameManager.getInstance().isVerifyMobile = doc.is_verify;
    //     }
    //     if (doc.isBn != null) {
    //         GameManager.getInstance().isBn = doc.isBn;
    //         //require("GameManager").getInstance().isBn = true;//duy
    //     } else {
    //         GameManager.getInstance().isBn = false;
    //     }

    //     if (doc.iap != null) {
    //         GameManager.getInstance().iap_config = doc.iap;
    //     } else {
    //         GameManager.getInstance().iap_config = true;
    //     }

    //     if (doc.time_loadcf != null)
    //         GameManager.getInstance().time_loadcf = doc.time_loadcf;

    //     //GameManager.getInstance().somoso_ceoda = false;
    //     //GameManager.getInstance().cearode_ceoda = false;
    //     //GameManager.getInstance().wayve_ceoda = false;
    //     //GameManager.getInstance().chamdo_ceoda = false;
    //     //GameManager.getInstance().diemde = false;
    //     //GameManager.getInstance().molo_enhipe = false;
    //     GameManager.getInstance().state_list = [];
    //     if (doc.state_list != null) {
    //         for (var i = 0; i < doc.state_list.length; i++) {
    //             GameManager.getInstance().state_list.push(doc.state_list[i]);
    //         }
    //     }

    //     if (doc.state_net != null) {
    //         GameManager.getInstance().state_net = doc.state_net;//son
    //     } else {
    //         GameManager.getInstance().state_net = true;
    //     }

    //     GameManager.getInstance().resetUse_p();
    //     if (doc.use_p != null) {
    //         for (let i = 0; i < doc.use_p.length; i++) {
    //             let namp = doc.use_p[i].name;
    //             // let state = doc.use_p[i].state;
    //             if (namp === "p1") {
    //                 // cc.NGWlog('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ', doc.use_p[i]);
    //                 GameManager.getInstance().dcb_ceoda_save = doc.use_p[i];
    //             } else if (namp === "p2") {
    //                 GameManager.getInstance().cell_card_save = doc.use_p[i];
    //             } else if (namp === "p3") {
    //                 GameManager.getInstance().wing_ceoda_save = doc.use_p[i];
    //             } else if (namp === "p4") {
    //                 //GameManager.getInstance().cell_card_save = state;
    //             } else if (namp === "p5") {
    //                 GameManager.getInstance().asia_wei_luy_save = doc.use_p[i];
    //             } else if (namp === "p6") {
    //                 GameManager.getInstance().paygo_save = doc.use_p[i];
    //             }

    //             else if (namp === "i") {
    //                 GameManager.getInstance().iap_config = doc.use_p[i];
    //             }
    //         }
    //     }
    //     if (doc.u_p != null) {
    //         GameManager.getInstance().u_p = doc.u_p;
    //     } else {
    //         GameManager.getInstance().u_p = ""
    //     }

    //     if (doc.u_p_asia != null) {
    //         GameManager.getInstance().u_p_asia = doc.u_p_asia;
    //     } else {
    //         GameManager.getInstance().u_p_asia = ""
    //     }

    //     if (doc.u_p_wing != null) {
    //         GameManager.getInstance().u_p_wing = doc.u_p_wing;
    //     } else {
    //         GameManager.getInstance().u_p_wing = ""
    //     }

    //     if (doc.u_p_fortumo != null) {
    //         GameManager.getInstance().u_p_fortumo = doc.u_p_fortumo;
    //     } else {
    //         GameManager.getInstance().u_p_fortumo = ""
    //     }

    //     if (doc.u_p_paygo != null) {
    //         GameManager.getInstance().u_p_paygo = doc.u_p_paygo;
    //     } else {
    //         GameManager.getInstance().u_p_paygo = ""
    //     }

    //     this.checkStateNet();
    //     this.resetStateNT();

    //     if (doc.ket != null) {
    //         var value = doc.ket.fee_chanpho;
    //         GameManager.getInstance().ketDataConfig = doc.ket;
    //         GameManager.getInstance().ketDataConfig.fee = [];
    //         for (var i = 0; i < value.length; i++) {
    //             GameManager.getInstance().ketDataConfig.fee.push(value[i]);
    //         }
    //     }
    //     if (doc.everyDayNoti != null) {
    //         GameManager.getInstance().everyDayNoti = doc.everyDayNoti;
    //     }
    //     if (doc.hotline != null) {
    //         cc.sys.localStorage.setItem("hotline", doc.hotline);
    //     }
    //     GameManager.getInstance().status = doc.status;
    //     if (doc.status) {
    //         // LAY THONG TIN UPDATE
    //         // khi status==true thi moi ton tai cac truong duoi day.
    //         GameManager.getInstance().mode = doc.umode;
    //         cc.sys.localStorage.setItem("mode", GameManager.getInstance().mode);
    //         GameManager.getInstance().op1 = doc.uop1;
    //         GameManager.getInstance().op2 = doc.uop2;
    //         GameManager.getInstance().msg = doc.umsg;
    //         GameManager.getInstance().link = doc.utar;
    //     } else {
    //         GameManager.getInstance().op1 = "";
    //         GameManager.getInstance().op2 = "";
    //         GameManager.getInstance().msg = "";
    //         GameManager.getInstance().link = "";
    //         GameManager.getInstance().mode = 0;
    //     }
    //     if (this._isOff) {
    //         var url_payment_config = doc.url_chip_in_game;
    //         var request = new XMLHttpRequest();
    //         request.open("GET", this.cors_url + url_payment_config, true);
    //         request.setRequestHeader("Access-Control-Allow-Origin", "*");
    //         if (cc.sys.isNative) {
    //             request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    //         }
    //         request.send();
    //         request.onload = function () {
    //             //  cc.NGWlog("config_4: ", request.responseText);
    //             if (request.responseText.length == 0) {

    //             }
    //             else if (!JSON.parse(request.responseText)) {
    //             } else {
    //                 cc.sys.localStorage.setItem("config_4", request.responseText);
    //                 //cc.NGWlog('config4 la=== ' + request.responseText);
    //             }
    //             _this.handleConfig_4(cc.sys.localStorage.getItem("config_4"));
    //         };

    //         request.onerror = function () {
    //             // cc.NGWlog("load error");
    //             //  setTimeout(()=>{
    //             //   _this.handleConfig_3(result);
    //             //  },500)
    //             _this.handleConfig_4(cc.sys.localStorage.getItem("config_4"));
    //         };
    //     }


    //     var url_text_en = doc.url_text_en;
    //     cc.NGWlog("text en:" + doc.url_text_en);
    //     var url_text_other = doc.url_text_cam;
    //     if (url_text_en.localeCompare("") != 0) {
    //         var request111 = new XMLHttpRequest();
    //         request111.open("GET", this.cors_url + url_text_en, true);
    //         request111.setRequestHeader("Access-Control-Allow-Origin", "*");
    //         if (cc.sys.isNative) {
    //             request111.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    //         }
    //         request111.send();


    //         request111.onloadend = function () {

    //             if (request111.responseText.length == 0)
    //                 cc.NGWlog("Load success data configtext ra null rồi :(");
    //             else if (!JSON.parse(request111.responseText)) {
    //             } else {
    //                 cc.sys.localStorage.setItem(
    //                     "config_text_lang_en",
    //                     request111.responseText
    //                 );
    //             }


    //         };

    //         request111.onerror = function () {
    //             cc.NGWlog("load error");
    //         };
    //     }

    //     if (url_text_other.localeCompare("") != 0) {
    //         var request1 = new XMLHttpRequest();

    //         request1.open("GET", this.cors_url + url_text_other, true);
    //         request1.setRequestHeader("Access-Control-Allow-Origin", "*");
    //         if (cc.sys.isNative) {
    //             request1.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    //         }
    //         request1.send();


    //         request1.onload = function () {
    //             if (request1.responseText.length == 0)
    //                 cc.NGWlog("Load success data configtext ra null rồi :(");
    //             else if (!JSON.parse(request1.responseText)) {
    //                 cc.NGWlog("doc configtext error");

    //             } else {
    //                 cc.NGWlog('set dc text cam');
    //                 cc.sys.localStorage.setItem(
    //                     "config_text_lang_cam",
    //                     request1.responseText
    //                 );
    //             }

    //         };

    //         request1.onerror = function () {
    //             cc.NGWlog("load error");
    //         };
    //     }

    //     // benefit
    //     if (this._isOff) {
    //         var url_benefit_config = doc.u_benefit;
    //         var request_bebefit = new XMLHttpRequest();

    //         request_bebefit.open("GET", this.cors_url + url_benefit_config, true);
    //         request_bebefit.setRequestHeader("Access-Control-Allow-Origin", "*");
    //         if (cc.sys.isNative) {
    //             request_bebefit.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    //         }
    //         request_bebefit.send();


    //         request_bebefit.onload = function () {
    //             // cc.NGWlog("config_benefit: ", request_bebefit.responseText);
    //             if (request_bebefit.responseText.length == 0)
    //                 cc.NGWlog("Load success data benefit ra null rồi :(");
    //             else if (!JSON.parse(request_bebefit.responseText)) {
    //                 cc.NGWlog("doc benefit error");

    //             } else {
    //                 cc.sys.localStorage.setItem(
    //                     "benefit_config",
    //                     request_bebefit.responseText
    //                 );
    //                 _this.handle_benefit_config(
    //                     cc.sys.localStorage.getItem("benefit_config")
    //                 );
    //             }
    //         };

    //         request_bebefit.onerror = function () {
    //             cc.NGWlog("load error");
    //             _this.handle_benefit_config(
    //                 cc.sys.localStorage.getItem("benefit_config")
    //             );
    //         };
    //     }
    //     if (this._isOff) {
    //         cc.NGWlog("chay vao setInfoButonWithConfig " + GameManager.getInstance().is_dt);
    //         Global.MainView.setInfoButonWithConfig();
    //         if (require("GameManager").getInstance().status) {
    //             if (require("GameManager").getInstance().mode == 0) { // mode == 0, vao thang ko can hoi
    //                 cc.NGWlog('umode0: show login');
    //                 // showcc.NGWlogin();
    //             } else if (require("GameManager").getInstance().mode == 1) { // mode == 1, hoi update, 2 lua chon
    //                 cc.NGWlog('umode1');
    //                 GameManager.getInstance().onShowWarningDialog(
    //                     GameManager.getInstance().msg,
    //                     DIALOG_TYPE.TWO_BTN,
    //                     GameManager.getInstance().op1,
    //                     () => {
    //                         cc.sys.openURL(require("GameManager").getInstance().link);
    //                         GameManager.getInstance().onQuitGame();
    //                     },
    //                     GameManager.getInstance().op2
    //                 );

    //             } else if (require("GameManager").getInstance().mode == 2) { // mode == 2, hoi update, khong lua chon
    //                 cc.NGWlog('umode2');
    //                 GameManager.getInstance().onShowWarningDialog(
    //                     GameManager.getInstance().msg,
    //                     DIALOG_TYPE.ONE_BTN,
    //                     GameManager.getInstance().op1,
    //                     () => {
    //                         cc.sys.openURL(require("GameManager").getInstance().link);
    //                         GameManager.getInstance().onQuitGame();
    //                     }
    //                 );

    //             }
    //             else if (require("GameManager").getInstance().mode == 3) { // mode == 3, thong bao, 1 lua chon OK va vao game
    //                 cc.NGWlog('umode3');
    //                 require("UIManager").instance.onShowConfirmDialog(require("GameManager").getInstance().msg);
    //             }
    //             else if (require("GameManager").getInstance().mode == 4) { // mode == 4, thong bao, 1 lua chon OK va finish
    //                 cc.NGWlog('umode4');
    //                 GameManager.getInstance().onShowWarningDialog(
    //                     GameManager.getInstance().msg,
    //                     DIALOG_TYPE.ONE_BTN,
    //                     GameManager.getInstance().op1,
    //                     () => {
    //                         GameManager.getInstance().onQuitGame();
    //                     }
    //                 );

    //             }
    //         }
    //     }



    // },
    // handleConfig_4: function handleConfig_4(result) {
    //     cc.log("config4 la== " + result);
    //     try {
    //         var doc = JSON.parse(result);
    //     } catch (err) {
    //         cc.NGWlog("========> handleConfig_4:  " + err);
    //     }

    //     if (doc.iap !== null) {
    //         GameManager.getInstance().listIAP = doc.iap;
    //         if (IS_RUN_INSTANT_FACEBOOK)
    //             return;
    //     }
    //     if (doc.DCB !== null) {
    //         GameManager.getInstance().listDCB = doc.DCB;
    //     }
    //     if (doc.WING !== null) {
    //         GameManager.getInstance().listWing = doc.WING;
    //     }
    //     if (doc.CELL_CARD !== null) {
    //         GameManager.getInstance().listCellCard = doc.CELL_CARD;
    //     }
    //     if (doc.asia !== null) {
    //         GameManager.getInstance().listAsia = doc.asia;
    //     }

    //     if (doc.paygo !== null) {
    //         GameManager.getInstance().listPaygo = doc.paygo;
    //     }
    //     // if (doc.pay !== null) {
    //     //  GameManager.getInstance().listAsia = doc.asia;
    //     // }



    //     if (this._isOff) {

    //         let isViewShop = false;
    //         if (Global.ShopView.node.parent != null) {
    //             isViewShop = true;
    //         }
    //         cc.loader.loadRes('prefabsPopup/ShopView', (er, prefab) => {
    //             let item = cc.instantiate(prefab).getComponent('ShopView');
    //             if (isViewShop) {
    //                 require('UIManager').instance.instantiate_parent.addChild(item.node);
    //                 Global.ShopView.node.destroy();
    //                 Global.ShopView = item;
    //             }
    //         })
    //     }

    // },

    // handle_benefit_config: function handle_benefit_config(result) {
    //     GameManager.getInstance().list_benefit = [];
    //     GameManager.getInstance().list_topgamer = [];

    //     var doc = JSON.parse(result);
    //     // cc.NGWlog("benefit = " + doc + "type = " + typeof (doc));
    //     // cc.NGWlog(doc);

    //     if (!doc) {
    //         cc.NGWlog("benefit_config parse error");
    //         return;
    //     }
    //     if (doc.benefit != null) {
    //         var data = doc.benefit;

    //         for (var i = 0; i < data.length; i++) {
    //             var item = {};
    //             item.nameEn = data[i].des_en;
    //             item.nameMy = data[i].des_mm;
    //             item.vector_vip_bool = [];
    //             item.vector_vip_num = [];
    //             item.vector_vip_percent = [];
    //             var arr = data[i].vip;
    //             for (var j = 0; j < arr.length; j++) {
    //                 if (
    //                     item.nameEn.localeCompare("Using Safe") == 0 ||
    //                     item.nameEn.localeCompare("Daily Giftcode") == 0
    //                 )
    //                     item.vector_vip_bool.push(arr[j]);
    //                 else item.vector_vip_num.push(arr[j]);

    //                 if (item.nameEn.localeCompare(" % Bonus Payment") == 0)
    //                     item.vector_vip_percent.push(arr[j]);
    //             }

    //             GameManager.getInstance().list_benefit.push(item);
    //         }

    //     }
    //     if (doc.jackpot != null) {
    //         GameManager.getInstance().binhJPListMark = doc.jackpot[0].mark;
    //         GameManager.getInstance().binhJPListChip = doc.jackpot[0].chip;
    //     }
    //     if (doc.top != null) {
    //         GameManager.getInstance().list_topgamer = doc.top;
    //         // var data = doc.top;

    //         // for (var i = 0; i < data.length; i++) {
    //         //   var item = {};
    //         //   item.id_game = data[i].gameid;
    //         //   item.nameEn = data[i].des_en;
    //         //   item.nameMy = data[i].des_mm;
    //         //   item.txt_link = data[i].url_img;
    //         //   item.txt_link_js = data[i].url_img_js;

    //         //   cc.NGWlog('TXT_LINK', item.txt_link);
    //         //   cc.NGWlog('TXT_LINK_JS', item.txt_link_js);
    //         //  GameManager.getInstance().list_topgamer.push(item);
    //         // }
    //     }

    //     if (doc.agInvite != null) {
    //         GameManager.getInstance().agInvite = doc.agInvite;
    //     }
    //     if (doc.agInviteFr != null) {
    //         GameManager.getInstance().agInviteFr = doc.agInviteFr;
    //     }
    //     if (doc.agShareImg != null) {
    //         GameManager.getInstance().agShareImg = doc.agShareImg;
    //     }
    //     if (doc.agContactAd != null) {
    //         GameManager.getInstance().agContactAd = doc.agContactAd;
    //     }
    //     if (doc.agVerify != null) {
    //         GameManager.getInstance().agVerify = doc.agVerify;
    //     }

    //     if (doc.agRename != null) {
    //         GameManager.getInstance().agRename = doc.agRename;
    //     }
    // },

    // start() {
    //     // if (IS_RUN_INSTANT_FACEBOOK) {
    //     //     FBInstant.player.getSignedPlayerInfoAsync().then(function (result) {
    //     //         cc.NGWlog("--------> FB ", result);
    //     //         GameManager.getInstance().access_token = result.getSignature();
    //     //     });
    //     // }
    //     // this.node.position = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2);
    // },
    // checkStateNet() {
    //     cc.NGWlog("====D checkStateNet", GameManager.getInstance().state_net, GameManager.getInstance().ishaveSimCam, GameManager.getInstance().disId);
    //     if (require("GameManager").getInstance().state_net) {
    //         if (cc.sys.os === cc.sys.OS_IOS) {
    //             for (var i = 0; i < GameManager.getInstance().state_list.length; i++) {
    //                 if (require("GameManager").getInstance().mccsim1 == GameManager.getInstance().state_list[i]
    //                     || GameManager.getInstance().mccsim2 == GameManager.getInstance().state_list[i]) {
    //                     GameManager.getInstance().ishaveSimCam = true;
    //                     break;
    //                 }
    //             }
    //         }
    //         else {
    //             GameManager.getInstance().ishaveSimCam = true;
    //         }
    //     }
    // },

    // resetStateNT() {
    //     cc.NGWlog("====D reset State", GameManager.getInstance().state_net, GameManager.getInstance().ishaveSimCam, GameManager.getInstance().disId);
    //     if (require("GameManager").getInstance().state_net && !require("GameManager").getInstance().ishaveSimCam) {
    //         GameManager.getInstance().statePoay = false;
    //     } else {
    //         GameManager.getInstance().statePoay = true;
    //     }

    //     // if (require("GameManager").getInstance().statePoay) {
    //     //     GameManager.getInstance().dcb_ceoda = Object.assign({}, GameManager.getInstance().dcb_ceoda_save)
    //     //     GameManager.getInstance().cell_card = Object.assign({}, GameManager.getInstance().cell_card_save);
    //     //     GameManager.getInstance().wing_ceoda = Object.assign({}, GameManager.getInstance().wing_ceoda_save);
    //     //     GameManager.getInstance().asia_wei_luy = Object.assign({}, GameManager.getInstance().asia_wei_luy_save);
    //     //     GameManager.getInstance().paygo = Object.assign({}, GameManager.getInstance().paygo_save);

    //     //     GameManager.getInstance().vchanpho = GameManager.getInstance().vchanpho_save;
    //     //     GameManager.getInstance().ismaqt = GameManager.getInstance().ismaqt_save;
    //     //     GameManager.getInstance().ismaiv = GameManager.getInstance().ismaiv_save;

    //     // } else {
    //     //     //   // cc.NGWlog("An payyyyy");
    //     //     GameManager.getInstance().dcb_ceoda.state = false;
    //     //     GameManager.getInstance().cell_card.state = false;
    //     //     GameManager.getInstance().wing_ceoda.state = false;
    //     //     GameManager.getInstance().asia_wei_luy.state = false;
    //     //     GameManager.getInstance().paygo.state = false;
    //     //     GameManager.getInstance().ismaqt = false;
    //     //     GameManager.getInstance().ismaiv = false;
    //     //     GameManager.getInstance().vchanpho = 11;
    //     // }
    // },
    // getCashOutInfo() {
    //     var _this = this;
    //     var request = new XMLHttpRequest();
    //     request.open("GET", this.cors_url + this.url_dt, true);
    //     request.setRequestHeader("Access-Control-Allow-Origin", "*");
    //     request.send();
    //     request.onloadend = function () {
    //         // cc.NGWlog("Doi Thuong ===test lai la: ", request.responseText);
    //         if (request.responseText.length === 0) {
    //         } else if (!JSON.parse(request.responseText)) {
    //             cc.NGWlog("cashout = " + request.responseText);
    //         } else {
    //             cc.sys.localStorage.setItem("cashout", request.responseText);
    //         }
    //         _this.handleCashOutInfo(cc.sys.localStorage.getItem("cashout"));
    //     };

    //     request.onerror = function () {
    //         _this.handleCashOutInfo(cc.sys.localStorage.getItem("cashout"));
    //     };

    // },
    // handleCashOutInfo(result) {
    //     var _this = this;
    //     var doc = JSON.parse(result);
    //     GameManager.getInstance().listAgDT = doc.dt_list;
    //     GameManager.getInstance().listAgency = doc.dt_info;
    //     //  require('UIManager').instance.instantiate_parent.addChild(Global.CashOutView.node);
    //     //  Global.CashOutView.node.removeFromParent();
    // },

    // update (dt) {},
});
export default LoadingGameOff;