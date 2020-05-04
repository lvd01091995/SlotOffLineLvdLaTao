
var GameManager = cc.Class({
  name: "GameManager",
  properties: {
    instance: {
      default: null
    },

    cors_url: "https://cors-anywhere.herokuapp.com/",
    curGameId: 0,
    curGameViewId: 0,
    curJackPotSlot: 0,
    gameView: null,
    isAdsReady:false,
    isSuccesAds:false,
  },
  statics: {
    getInstance: function () {
      if (this.instance == null) {
        this.instance = new GameManager();
      }
      return this.instance;
    }
  },
  formatNumber(number, width = 3) {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');//String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
  },

  formatMoney(money) {
    // char k[] = { 'K', '\0'};
    // char m[] = { 'M', '\0'};
    // char b[] = { 'B', '\0'};
    // char u[] = { '\0'};
    let format = "";
    let mo = Math.abs(money);
    //int cha;
    if (mo >= 1000000000) {
      mo /= 1000000000;
      format = "B";
    } else if (mo >= 1000000) {
      mo /= 1000000;
      format = "M";
    } else {
      return this.formatNumber(money);
    }

    let str = money.toString() + "0";
    let str1 = mo.toString() + "a";

    let idex = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] !== str1[i]) {
        idex = i;
        break;
      }

    }

    return (money < 0 ? "-" : "") + Math.floor(mo) + "," + str.toString()[idex] + str.toString()[idex + 1] + format;
  },
  formatMoneyChip(money) { // hoi duc va hien truoc khi su dung.thanks!
    let format = "";
    let mo = Math.abs(money);
    //int cha;
    if (mo >= 1000000000) {
      mo /= 1000000000;
      format = "b";
    } else if (mo >= 1000000) {
      mo /= 1000000;
      format = "m";
    } else if (mo >= 1000) {
      mo /= 1000;
      format = "k";
    } else {
      return this.formatNumber(money);
    }

    return money < 0 ? "-" + mo + format : mo + format;
  },
  effRunNumber(lb, curValue, lastValue, timeRun) {
    lb.node.stopAllActions();
    if(curValue===lastValue) return;
    lb.string = curValue;
    let deltaNum = lastValue - curValue;
    let numPerTime = deltaNum / (timeRun*20);
    let acPlus = cc.repeat(cc.sequence(cc.callFunc(() => {
      curValue += numPerTime;
      if (deltaNum > 0) {
        if (curValue >= lastValue) {
          curValue = lastValue;
          lb.node.stopActionByTag(0);
        }
      } else {
        if (curValue <= lastValue) {
          curValue = lastValue;
          lb.node.stopActionByTag(0);
        }
      }
      lb.string = require("GameManager").getInstance().formatNumber(Math.round(curValue));
    }), cc.delayTime(timeRun / 20)), 20*timeRun);
    acPlus.setTag(0);
    let acScale1 = cc.scaleTo(timeRun * (2 / 3), 1.1).easing(cc.easeSineOut());
    let acScale2 = cc.scaleTo(timeRun * (1 / 3), 1.0).easing(cc.easeSineIn());
    let acScale = cc.sequence(acScale1, acScale2);
    //lb.node.runAction(cc.spawn(acPlus, acScale));
    lb.node.runAction(acPlus);
  },
  handleJackPot(jsonData) {
    if (this.gameView.node != null) {
      if (this.curGameId === GAME_ID.BINH)
        this.gameView.setJackPot(jsonData.G);
      if (this.curGameId === GAME_ID.SLOT_20_LINE_JP)
        this.gameView.setJackPot(jsonData.G);
    }
  },
  handleJackPotWin(jsonData) {
    let jackpot = jsonData.G;
    let name = jsonData.N;
    let jpwin = jsonData.M;

    if (this.gameView != null && this.gameView.node != null) {
      if (this.curGameId === GAME_ID.BINH) {
        this.gameView.setJackPot(jackpot);
        this.gameView.showJackpotWin(name, jpwin);
      }
      if (this.curGameId === GAME_ID.SLOT_20_LINE_JP) {
        this.gameView.handleJackpot(jackpot);
        this.gameView.handleJackPotWin(name, jpwin);
      }
    }
  },
  userNapTienSuccess(jsonData) {
    if (jsonData != null) {
      this.onShowConfirmDialog(jsonData.msg);
    }
    // require('NetworkManager').getInstance().sendUAG();
    // require('SMLSocketIO').getInstance().emitUpdateInfo();
  }
});
module.exports = GameManager;
