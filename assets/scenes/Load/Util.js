var GET_ANDROID_ID = "1";
var GET_BUNDLE_ID = "2";
var GET_VERSION_ID = "3";
var LOGIN_FACEBOOK = "4";
var GET_PATH_FOR_SCREENSHOT = "5";
var VEYRY_PHONE = "6";
var CHAT_ADMIN = "7";
var DEVICE_VERSION = "8";
var SHARE_FACEBOOK = "9";
var LOG_EVENT_TRACKING = "10";
var BUY_IAP = "11";
var SHARE_CODE_MESSAGE = "12";
var SEND_TAG_ONESIGNAL = "13";
var OPEN_FANPAGE = "14";
var OPEN_GROUP = "15";
var CHECK_NETWORK = "16";
var PUSH_NOTI_OFFLINE = "17";
var SHARE_SUCCESS = "18";
var CARRIER_NAME = "19";//for IOS
var CHECK1SIM = "20";//for Android
var CHECK2SIM = "21";
var HIDESPLASH = "22";
var GET_INFO_DEVICE_SML = "23";
var CALL_PHONE = "24";
var WEB_VIEW = "25";
var CLOSE_WEB_VIEW = "26";
var REQUEST_ADS = "27";
var ADS_STATUS = "28";
var WATCTH_ADS = "29";
var ADS_CLOSE = "30";
var GET_LIST_PRO_IAP = "31"

cc.NativeCallJS = function (evt, params) {
    cc.NGWlog('iNativeCallJS------------------------>   DEMO ' + evt + "     " + params);
    switch (evt) {
        case GET_ANDROID_ID:
            require('GameManager').getInstance().deviceId = params;
            cc.sys.localStorage.setItem("GEN_DEVICEID", params);
            cc.NGWlog('gia tri deviceid la===' + params);
            break;
        case GET_BUNDLE_ID:
            require('GameManager').getInstance().bundleID = params;
            cc.sys.localStorage.setItem("GEN_BUNDLEID", params);
            cc.NGWlog('gia tri bundleID la===' + params);
            break;
        case GET_VERSION_ID:
            require('GameManager').getInstance().versionGame = params;
            cc.sys.localStorage.setItem("GEN_VERSIONGAME", params);
            cc.NGWlog('gia tri versionGame la===' + params);
            break;
        case LOGIN_FACEBOOK:
            cc.NGWlog('tra ve token la===' + params);
            require('GameManager').getInstance().access_token = params;
            cc.sys.localStorage.setItem('Token', params);
            require('NetworkManager').getInstance().onLogin("1", params, false);
            break;
        case VEYRY_PHONE:
            let phone = params;
            cc.NGWlog('Goi Ham Verify phone trong util!!');
            require('NetworkManager').getInstance().sendVeryfyPhone(phone)
            require('GameManager').getInstance().number_verify = phone;
            Global.MissionView.onClose();
            break;
        case DEVICE_VERSION:
            require('GameManager').getInstance().deviceVersion = params;
            break;
        case GET_PATH_FOR_SCREENSHOT:
            // cc.sys.localStorage.setItem('pathSceenShot', params);
            require('GameManager').getInstance().pathScreenShot = params;
            break;

        case CHECK_NETWORK:
            if (params === "-1") {
                cc.NGWlog("Chuc mung ban da duoc ra dao!!!");
            }
            break;
        case CARRIER_NAME:
            cc.NGWlog("mcc la: " + params);
            require('GameManager').getInstance().mccsim1 = parseInt(params);
            break;
        case CHECK1SIM:
            cc.NGWlog("===D: check 1 sim", params);
            require('GameManager').getInstance().mccsim1 = parseInt(params);
            break;
        case CHECK2SIM:
            cc.NGWlog("===D: check 2 sim", params);
            if (params.indexOf("_") !== -1) {//co 2 sim tren may
                var listCountrycode = params.split("_");
                cc.NGWlog("listCountrycode", listCountrycode);
                for (var i = 0; listCountrycode.length; i++) {
                    if (i == 0) require('GameManager').getInstance().mccsim1 = parseInt(listCountrycode[0]);
                    if (i == 1) require('GameManager').getInstance().mccsim2 = parseInt(listCountrycode[1]);
                }
            } else {//chi co 1 sim tren may
                require('GameManager').getInstance().mccsim1 = parseInt(params);
            }
            break;
        case GET_INFO_DEVICE_SML:
            cc.NGWlog("GET_INFO_DEVICE_SML====" + params);
            let listIndexMark = [];
            let listParams = [];
            for (let i = 0; i < params.length; i++) {
                if (params[i] === ",") {
                    listIndexMark.push(i);
                }
            }
            let index = 0;
            for (let i = 0; i < listIndexMark.length; i++) {
                let str = params.slice(index, listIndexMark[i]);
                listParams.push(str);
                index = listIndexMark[i] + 1;
            }
            //Tiếng Việt,Redmi Note 4,1.03,24,xiaomi

            require('GameManager').getInstance().language = listParams[0];
            require('GameManager').getInstance().devicename = listParams[1];
            require('GameManager').getInstance().versionGame = listParams[2];
            require('GameManager').getInstance().osversion = listParams[3];
            require('GameManager').getInstance().brand = listParams[4];
            break;
        case "100":
            cc.NGWlog("iaploggggsigndata:=====" + params);
            require('GameManager').getInstance().signdata = params;
            break;
        case "101":
            cc.NGWlog("iaploggggsignature:=====" + params);
            require('GameManager').getInstance().signature = params;

            let _Signdata = require('GameManager').getInstance().signdata;
            let _Signature = require('GameManager').getInstance().signature;

            cc.NGWlog("iaploggggsigndata:" + _Signdata);
            cc.NGWlog("iaploggggsignature:" + _Signature);

            if (_Signdata == null || _Signdata == '' || _Signature == null || _Signature == '') {
                cc.NGWlog("iaploggggko sendIAPResult");
            } else {
                cc.NGWlog("iaploggggco sendIAPResult");
                require('NetworkManager').instance.sendIAPResult(_Signdata, _Signature);
            }
            break;
        case "200":
            Global.ShopView.nodeLoading.active = false;
            if (params !== "Failed") {
                var ag = parseInt(cc.sys.localStorage.getItem("agSlotOffline"));
                if (ag === null) {
                    ag = 0;
                }
                var itemiap = cc.sys.localStorage.getItem("itemiapSlotOffline");
                cc.log("itemiap" + itemiap);
                let agItem = 0;
                switch (parseInt(itemiap)) {
                    case 1: {
                        agItem = require("GameManager").getInstance().listIAP[0].chip;
                        break;
                    }
                    case 2: {
                        agItem = require("GameManager").getInstance().listIAP[1].chip;
                        break;
                    }
                    case 5: {
                        agItem = require("GameManager").getInstance().listIAP[2].chip;
                        // ag += 350000;
                        break;
                    }
                    case 20: {
                        agItem = require("GameManager").getInstance().listIAP[3].chip;
                        // ag += 64000;
                        break;
                    }
                    case 50: {
                        agItem = require("GameManager").getInstance().listIAP[4].chip;
                        // ag += 64000;
                        break;
                    }
                    case 100: {
                        agItem = require("GameManager").getInstance().listIAP[5].chip;
                        // ag += 64000;
                        break;
                    }

                }
                cc.log("Chip Mua La:" + agItem);
                ag += agItem;
                cc.sys.localStorage.removeItem("itemiapSlotOffline");
                cc.sys.localStorage.setItem("agSlotOffline", ag);
                require("Slot20LineJPView").instance.receiveChipDaily();
                let agShop = require("GameManager").getInstance().formatNumber(parseInt(agItem));
                let text = "You have purchase " + agShop + " chips successfully!";
                require("Slot20LineJPView").instance.onShowConfirmDialog(text);
                if (Global.ShopView.node.parent) {
                    Global.ShopView.updateChip();
                }
            }

            break;
        case SHARE_FACEBOOK:
            if (params === "0") {
                cc.NGWlog("Share khong thanh cong");
            } else if (params === "1") {
                cc.NGWlog("Share thanh cong");
                require("NetworkManager").getInstance().sendShareImageFb();
            }

            break;
        case CLOSE_WEB_VIEW:
            cc.NGWlog("BO MAY CLOSE WEB VIEW");
            require("NetworkManager").getInstance().sendUAG();
            break;
        case ADS_STATUS:
            require("GameManager").getInstance().isAdsReady = true;
            break;
        case ADS_CLOSE:
            cc.log("ADS CLOSE PARAMS==" + params);
            require("GameManager").getInstance().isAdsReady = false;
            if (params === "Success") {
                require("GameManager").getInstance().isSuccesAds = true;
            } else if (params === "Dismiss" && require("GameManager").getInstance().isSuccesAds === true) {
                require("GameManager").getInstance().isSuccesAds = false;
                require("Slot20LineJPView").instance.receiveChipReward();
            }

            break;
    }
    if (cc.sys.os === cc.sys.OS_IOS && cc.game.isPaused) cc.director.startAnimation();
};

cc.NativeCallIAP = function (evt, params) {
    cc.NGWlog('iapobj------------------------>' + evt + params);
    switch (evt) {
        case "100":
            cc.NGWlog("iaploggggsigndata:=====" + params);
            require('GameManager').getInstance().signdata = params;
            break;
        case "101":
            cc.NGWlog("iaploggggsignature:=====" + params);
            require('GameManager').getInstance().signature = params;

            let _Signdata = require('GameManager').getInstance().signdata;
            let _Signature = require('GameManager').getInstance().signature;

            cc.NGWlog("iaploggggsigndata:" + _Signdata);
            cc.NGWlog("iaploggggsignature:" + _Signature);

            if (_Signdata == null || _Signdata == '' || _Signature == null || _Signature == '') {
                cc.NGWlog("iaploggggko sendIAPResult");
            } else {
                cc.NGWlog("iaploggggco sendIAPResult");
                require('NetworkManager').instance.sendIAPResult(_Signdata, _Signature);
            }
            break;
    }
};

var Util = cc.Class({
    statics: {
        onCallNative(evt, params) {
            if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onCallFromJavascript", "(Ljava/lang/String;Ljava/lang/String;)V", evt, params);
            } else if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("AppController", "onCallFromJavaScript:andParams:", evt, params);
            }
        },
        getGetDeviceId() {
            Util.onCallNative(GET_ANDROID_ID, "");
        },
        getBundleId() {
            Util.onCallNative(GET_BUNDLE_ID, "");
        },
        getVersionId() {
            Util.onCallNative(GET_VERSION_ID, "");
        },
        onLoginFb(reLogin = "0") {
            Util.onCallNative(LOGIN_FACEBOOK, "" + reLogin);
        },
        onVeryPhone() {
            Util.onCallNative(VEYRY_PHONE, "");
        },
        onChatAdmin() {
            // let data = {
            //     pageID: require('GameManager').getInstance().fanpageID,
            //     pageUrl: require('GameManager').getInstance().fanpageURL
            // };
            // cc.NGWlog('pageID la===' + require('GameManager').getInstance().fanpageID)
            // cc.NGWlog('pageURL la===' + require('GameManager').getInstance().fanpageURL)
            // let str = JSON.stringify(data);
            // Util.onCallNative(CHAT_ADMIN, str);
            cc.sys.openURL(require("GameManager").getInstance().u_chat_fb);
        },
        getDeviceVersion() {
            Util.onCallNative(DEVICE_VERSION, "");
        },
        onShareFb(imgPath) {
            cc.NGWlog(' SHARE FACEBOOK!!!');
            var data = {
                path: imgPath,
                hasTag: require("GameManager").getInstance().hashTagShareImage
            };

            Util.onCallNative(SHARE_FACEBOOK, JSON.stringify(data));
        },
        getPathForScreenshot() {
            Util.onCallNative(GET_PATH_FOR_SCREENSHOT, "");
        },
        sendLogEvent(params) {
            Util.onCallNative(LOG_EVENT_TRACKING, params);
        },
        onBuyIap(itemID) {
            console.log("OnbuyIAP");
            Util.onCallNative(BUY_IAP, itemID);
        },
        shareCodeMessage(code) {
            Util.onCallNative(SHARE_CODE_MESSAGE, code);
        },
        sendLogEvent(params) {
            let data = {
                param: params
            };
            Util.onCallNative(LOG_EVENT_TRACKING, JSON.stringify(data));
        },
        sendTagOneSignal(key, value) {
            let data = {
                key: key,
                value: value
            };
            Util.onCallNative(SEND_TAG_ONESIGNAL, JSON.stringify(data));
            cc.NGWlog("sendTagOneSignal: " + JSON.stringify(data));
        },

        openFanpage() {
            let data = {
                pageID: require('GameManager').getInstance().fanpageID,
                pageUrl: require('GameManager').getInstance().fanpageURL
            };

            Util.onCallNative(OPEN_FANPAGE, JSON.stringify(data));
        },
        openGroup() {
            let data = {
                groupID: require('GameManager').getInstance().groupID,
                groupUrl: require('GameManager').getInstance().groupURL
            };
            // cc.NGWlog('---->  openGroup');
            Util.onCallNative(OPEN_GROUP, JSON.stringify(data));
        },

        checkNetwork() {
            // Util.onCallNative(CHECK_NETWORK, "");
        },

        getCarrierName() {
            Util.onCallNative(CARRIER_NAME, "");
        },

        sendCheck1Sim() {
            cc.NGWlog("sendCheck1Sim");
            Util.onCallNative(CHECK1SIM, "");
        },

        sendCheck2Sim() {
            cc.NGWlog("sendCheck2Sim");
            Util.onCallNative(CHECK2SIM, "");
        },

        pushNotiOffline(data) {
            cc.NGWlog("UtilCocos: Push noti offline!");
            Util.onCallNative(PUSH_NOTI_OFFLINE, data);
        },
        hideSplash() {
            Util.onCallNative(HIDESPLASH, "");
        },
        getInfoDeviceSML() {
            cc.NGWlog("Call Android:getInfoDeviceSML");
            Util.onCallNative(GET_INFO_DEVICE_SML, "");
            let deviceId = cc.sys.localStorage.getItem("GEN_DEVICEID");
            if (deviceId == null) {
                require("Util").getGetDeviceId();
            }
        },
        onCallPhone(phoneNumber) {
            Util.onCallNative(CALL_PHONE, phoneNumber);
        },
        onCallWebView(url) {
            Util.onCallNative(WEB_VIEW, url);
        },
        onRequestAds() {
            console.log("Util:request Ads");
            Util.onCallNative(ADS_STATUS);
        },
        onShowAds() {
            Util.onCallNative(WATCTH_ADS)
        },
        getListProIAP(listIAP) {
            if (cc.sys.os === cc.sys.OS_IOS) {
                let data = {};
                data.param = listIAP;
                Util.onCallNative(GET_LIST_PRO_IAP, JSON.stringify(data));
            }
        }

    }
});

module.exports = Util;