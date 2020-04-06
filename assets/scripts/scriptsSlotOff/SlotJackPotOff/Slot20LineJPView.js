var AC_TAG_SHOWEFFWINLINE = 1
var ZINDEX_ITEMANIM = 30
var ZINDEX_LINE = 10
var ZINDEX_RULE = 40


var SPRITE_FREESPIN = 2
var SPRITE_SPIN = 0
var SPRITE_STOPSPIN = 1
var SPRITE_STOPAUTO = 3
var SPIRTE_AUTOSPIN = 4

var IDANIM_WILD = 3
var IDANIM_SCATTER = 1
var TIME_SHOW_LINE = 1.5;
var IDANIM_BIGWIN = 10;
var IDANIM_MEGAWIN = 10;
var IDANIM_JACKPOT = 7;
var IDANIM_SPEEDSPIN = 11;
var IDANIM_ZOCOBICTEP = 6;
var IDANIM_HOAKENBINH = 5;

var ACTION_TAG_UPDATEJACKPOT = 1;
var SPEED_NORMAL = 0.15;
var SPEED_AUTO = 0.1;
var TYPE_REWARD = {
    FREECHIP: 1,
    BONUS: 2
}
var TEXT_RECEIVE_BONUS = "You have receive %d chips successfully!";
var TEXT_RECEIVE_FREESPIN = "You have receive 3 freespins successfully!";
var TEXT_GET_MORE_CHIP_DAILY = "Watch video ads to get x2 chips daily !";
var TEXT_AD_NOT_READY = "Ads reward is not available now,\n Please wait a few seconds";
var Slot20LineJPView = cc.Class({
    extends: cc.Component,

    properties: {

        itemSlotPr: cc.Prefab,
        itemAnim: cc.Prefab,
        historyJpPr: cc.Prefab,
        JP_Rule: cc.Prefab,
        shopPref: cc.Prefab,
        dailyBonusPr: cc.Prefab,
        popupAdsPr: cc.Prefab,
        dialog_util: cc.Prefab,

        count: 0,
        clickSpinCount: 0,
        listLineRect: [],
        listPosRect: [],
        listItemMiniResult: [cc.Sprite],
        listSprBtn: [cc.SpriteFrame],
        listItem: [cc.Node],

        animMask: cc.SpriteFrame,
        sprAtlas: cc.SpriteAtlas,
        //listIconVip: [cc.Sprite],
        //listSpriteFrameVip: [cc.SpriteFrame],

        blackMask: cc.Node,
        itemAnimTest: cc.Node,
        parentItemNode: cc.Node,
        itemMiniResult: cc.Node,
        bkg_mid: cc.Node,
        bkg_Top: cc.Node,
        bkg_Bottom: cc.Node,
        bkg_Maxbet: cc.Node,
        bkg_TotalBet: cc.Node,
        setting: cc.Node,
        bkg_rule: cc.Node,
        animChip: cc.Node,

        btn_Spin: cc.Button,
        btn_autoSpin: cc.Button,

        lb_markBet: cc.Label,
        lb_ChipWinRound: cc.Label,
        lb_Chip: cc.Label,
        lb_Result: cc.Label,
        lb_info: cc.Label,
        lb_titleWin: cc.Label,

        lb_JackPot: cc.Label,

        lb_titleBet: cc.Label

    },
    // LIFE-CYCLE CALLBACKS:
    update(dt) {
    },
    onLoad() {
        Slot20LineJPView.instance = this;
        // this.nodeGroupMenu.onHideItem(1);
        //  this.nodeGroupMenu.onHideItem(2);
        cc.sys.garbageCollect();
        this.listOriginItem = [];
        this.listCheckStopCol = [false, false, false, false, false];
        this.listColor = [
            '#69C4C9', '#067048', '#25A0F0', '#6AF28E', '#003CC3',
            '#1DC42C', '#6C58B1', '#97B158', '#0F0098', '#6700BE',
            '#920E48', '#F277E2', '#BC8B15', '#AC6456', '#E17512',
            '#E8C500', '#F0E915', '#FD93A1', '#C735D4', '#FF0C04',
            '#69C4C9', '#067048', '#25A0F0', '#6AF28E', '#003CC3',
            '#1DC42C', '#6C58B1', '#97B158', '#0F0098', '#6700BE',
            '#920E48', '#F277E2', '#BC8B15', '#AC6456', '#E17512',
            '#E8C500', '#F0E915', '#FD93A1', '#C735D4', '#FF0C04',
            '#69C4C9', '#067048', '#25A0F0', '#6AF28E', '#003CC3',
            '#1DC42C', '#6C58B1', '#97B158', '#0F0098', '#6700BE'
        ];

        this.isAutoSpin = false;
        this.isClickSpin = false;
        this.isHave2Scatter = false;
        this.isHaveFiveOfaKind = false;
        this.isStop = true;
        this.isCheckScatterItem3 = false;
        this.isRunEffPlusMoney = false;
        this.canSpin = false;

        this.winningLine = [];
        this.listWinLineNode = [];

        this.listItemAnim = [];
        this.listDataAnimLine = [];
        this.listAnimId = [];
        this.listSpriteId = [];
        this.listAnimWS = [];
        this.skeData = [];
        this.listMarkBet = [];
        this.listScatter = [];
        this.listCollum = [];

        this.markIndex = 0;
        this.freeSpinCount = 0;
        this.speedSpin = 0.15;
        this.agPlayer = 0;
        this.winType = 0;
        this.firstAnim = null;
        this.delayTimeCheckJP = 0;
        this.totalAgWinLine = 0;
        this.itemWidth = 0;
        this.itemHeight = 0;
        this.scatterCount = 0;
        this.bkg_mid.opacity = 0;
        this.bkg_Bottom.opacity = 0;
        this.bkg_Top.opacity = 0;
        this.totalWin = 0;
        this.startNum = 0;
        this.endNum = 0;
        this.deltaNum = 0;
        this.timeShow = 0;
        this.curNum = 0;
        this.jackPotWin = 0;
        this.mathCount = 0;
        this.curChip = 0;
        this.chipBonusDaily = 0;
        this.bkg_Top.position = cc.v2(0, cc.winSize.height / 2 + 100);
        this.bkg_Bottom.position = cc.v2(0, -cc.winSize.height / 2 - 100);
        this.curJackPotNum = require("GameManager").getInstance().curJackPotSlot;
        this.jackPotEndNum = 0;
        this.initPosItem = cc.v2(this.parentItemNode.width / 10, this.parentItemNode.height / 2);
        this.animPool = new cc.NodePool("animPool");
        this.blackMaskBig = this.node.getChildByName("bkg_black");
        this.countInitItem = 0;
        this.freeSpinLeft = 0;
        this.isFreeSpin = false;
        Global.GameView = this.node.parent.getComponent("DataForGameSlotMaChine");
        this.setJackPot();

        this.dataListBetDefault = [];
        this.typeReward = 0;
        this.listReward = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
        this.spinCount = 0;
        require("GameManager").getInstance().curGameId = GAME_ID.SLOT_20_LINE_JP;
        require("GameManager").getInstance().gameView = this;
    },
    setJackPot(delta = null) {
        if (delta == null) {
            this.jpCurrent = cc.sys.localStorage.getItem("JackPot");
            if (this.jpCurrent == null || typeof this.jpCurrent === "undefined") {
                cc.sys.localStorage.setItem("JackPot", 0);
                this.jpCurrent = 0;
            }
            else {
                this.jpCurrent = parseInt(this.jpCurrent);
                this.lb_JackPot.string = this.formatNumber(this.jpCurrent);
                cc.log("JpCurtent=" + this.jpCurrent);
            }

        } else {
            require("GameManager").getInstance().effRunNumber(this.lb_JackPot, this.jpCurrent, this.jpCurrent + parseInt(delta), 1);
            this.jpCurrent += parseInt(delta);
            cc.sys.localStorage.setItem("JackPot", this.jpCurrent);

        }

    },
    start() {
        // require("NetworkManager").getInstance().sendUpdateJackPot(GAME_ID.SLOT_20_LINE_JP);
        // this.schedule(() => {
        //     require("NetworkManager").getInstance().sendUpdateJackPot(GAME_ID.SLOT_20_LINE_JP);
        // }, 10)

        // this.lb_titleBet.string = "MaxBet
    },
    startEffect() {
        this.bkg_Top.stopAllActions();
        this.bkg_Bottom.stopAllActions();
        this.bkg_mid.stopAllActions();
        this.bkg_Top.runAction(cc.spawn(cc.moveTo(0.5, cc.v2(0, cc.winSize.height / 2)), cc.fadeTo(0.5, 255)));
        this.bkg_Bottom.runAction(cc.spawn(cc.moveTo(0.5, cc.v2(0, -cc.winSize.height / 2)), cc.fadeTo(0.5, 255)));
        this.bkg_mid.runAction(cc.sequence(cc.fadeTo(0.5, 255), cc.callFunc(() => {
            this.canSpin = true;
        })));
        this.parentItemNode.getComponent(cc.Button).interactable = true;
        this.daily = cc.instantiate(this.dailyBonusPr).getComponent("DailyBonus");
        this.daily.init();
    },
    handleCTable(data) {
        //   var data = JSON.parse(data);
        console.log('0---------->   handleCTable')
        this.scheduleOnce(() => {
            this.initItemSlot(data.views);
        }, 0.5);
        this.lb_info.node.active = true;
        this.lb_info.string = "Press Spin To Play";
        this.payLine = data.payLine;
        this.listMarkBet = [];
        this.lb_ChipWinRound.string = "0";
        this.agPlayer = data.level.agUser;
        this.playerName = data.ArrP[0].N;
        console.log("-=-=-=>>   ", data.MarkBet)
        this.dataListBetDefault = data.MarkBet
        for (let i = 0; i < data.MarkBet.length; i++) {
            if (data.MarkBet[i] * 20 <= this.agPlayer)
                this.listMarkBet.push(data.MarkBet[i]);
        }
        this.curMarkBet = 0;
        this.getCurMarkBet();
        this.lb_markBet.string = this.curMarkBet === 0 ? "0" : require("GameManager").getInstance().formatNumber(this.curMarkBet * 20);

        console.log("5:  " + this.lb_markBet.string)
        this.lb_Chip.string = require("GameManager").getInstance().formatNumber(this.agPlayer);
        this.playerVip = data.ArrP[0].VIP;
        // this.updateVip();


        this.setMarkBetInfo();

        console.log(this.curMarkBet)
        console.log(this.listMarkBet)
        console.log(this.listMarkBet[0])
        console.log(this.agPlayer)

        if (this.curMarkBet >= this.listMarkBet[this.listMarkBet.length - 1])
            this.lb_titleBet.string = "MaxBet"
        // if (this.listMarkBet.length > 0 && this.curMarkBet !== this.listMarkBet[this.listMarkBet.length - 1])
        // this.onClickMaxBet()
        if (this.agPlayer <= 0 || (data.MarkBet.length > 0 && this.agPlayer < data.MarkBet[0] * 20)) {
            this.btn_Spin.interactable = false;
            this.btn_autoSpin.interactable = false
        }
    },
    updateCurMarkBet() {
        this.listMarkBet = [];
        for (let i = 0; i < this.dataListBetDefault.length; i++) {
            if (this.dataListBetDefault[i] * 20 <= this.agPlayer)
                this.listMarkBet.push(this.dataListBetDefault[i]);
        }
        if (this.isFreeSpin) this.listMarkBet = this.dataListBetDefault;
        cc.log("List mark bet==" + this.listMarkBet);
    },
    getCurMarkBet() {
        for (let i = 0; i < this.listMarkBet.length; i++) {
            let markBet = this.listMarkBet[i];
            if (markBet * 20 <= this.agPlayer / 20) {
                this.curMarkBet = markBet;
                this.markIndex = i;
            } else if (this.listMarkBet[0] * 20 > this.agPlayer / 20) {
                this.curMarkBet = this.listMarkBet[0];
                this.markIndex = 0;
                this.setMarkBetInfo();
            }
        }
        if (this.listMarkBet.length <= 0 || this.listMarkBet[0] * 20 > this.agPlayer) {
            this.markIndex = -1;
            // this.curMarkBet = 0;
        }
        if (this.isFreeSpin) {
            this.markIndex = this.listMarkBet.length;
            this.setMarkBetInfo();
        }
    },
    initItemSlot(dataView) {
        let delta = 0;
        this.listCollum.length = 0;
        for (let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].node.destroy();
        }
        this.listItem.length = 0;
        for (let i = 0; i < 15; i++) {
            let item1 = cc.instantiate(this.itemSlotPr).getComponent("ItemSlot20JP");
            let item2 = cc.instantiate(this.itemSlotPr).getComponent("ItemSlot20JP");
            let item3 = cc.instantiate(this.itemSlotPr).getComponent("ItemSlot20JP");

            this.initHeightItem = item1.node.height;
            item1.node.position = cc.v2(this.initPosItem.x + 136 * delta, this.initPosItem.y);
            this.parentItemNode.addChild(item1.node);
            this.countInitItem++;
            item1.typeItem = 1;
            item1.numCol = delta;
            item1.setSpriteListItem(dataView[delta]);
            this.resetPosY1 = this.initPosItem.y;
            if (delta === 3) {
                let pos = this.parentItemNode.convertToWorldSpaceAR(item1.node.position);
                this.posAnimSpeedX = this.bkg_mid.convertToNodeSpaceAR(pos).x;
            }

            item2.node.position = cc.v2(item1.node.x, item1.node.position.y + item1.node.height);
            this.parentItemNode.addChild(item2.node);
            this.countInitItem++;
            item2.typeItem = 2;
            item2.numCol = delta;
            item2.setRandomId(false);
            this.resetPosY2 = item2.node.position.y;

            item3.node.position = cc.v2(item1.node.x, item2.node.position.y + item2.node.height);
            this.parentItemNode.addChild(item3.node);
            this.countInitItem++;
            item3.typeItem = 3;
            item3.numCol = delta;
            item3.setRandomId(false);
            this.resetPosY3 = item3.node.position.y;

            let listItem = [];
            listItem.push(item1.node, item2.node, item3.node);
            this.listCollum.push(listItem);
            this.listItem.push(item1, item2, item3);
            delta++;
            i += 2;
        }
        this.startEffect();
        this.initItemAnim();
    },

    initItemAnim() { //init san 5 anim dau game luon;
        // for (let i = 0; i < 5; i++) {
        //     let itemAnim = cc.instantiate(this.itemAnim).getComponent("ItemAnimation");
        //     this.node.addChild(itemAnim.node, ZINDEX_ITEMANIM);
        //     itemAnim.node.active = false;
        //     this.listItemAnim.push(itemAnim);
        // }
        this.firstAnim = cc.instantiate(this.itemAnim).getComponent("ItemAnimation");
        this.firstAnim.node.getChildByName("animMask").active = false;
        this.node.addChild(this.firstAnim.node, ZINDEX_ITEMANIM);
        this.firstAnim.node.active = false;
        this.firstAnim.animation.skeletonData = null;

    },
    onClickSpin(event, data) {
        if (!this.canSpin) {
            return
        };

        // console.log("=====onClickSpin 0 " + this.listMarkBet.length + "   " + this.agPlayer)
        // console.log("=====onClickSpin 1 ", this.listMarkBet)
        console.log("=====isfreespin=" + this.isFreeSpin)
        if (!this.isFreeSpin) {
            if (this.clickSpinCount > 1 ||
                this.listMarkBet.length <= 0 ||
                (this.listMarkBet.length > 0 && this.agPlayer < this.listMarkBet[0] * 20)) return;
        }
        console.log("=====onClickSpin")
        if (this.clickSpinCount > 0) {
            cc.log("ClickSpin=" + this.clickSpinCount);
            if (this.isFreeSpin)
                this.setBtnSpr(this.btn_Spin, SPRITE_FREESPIN);
            else
                this.setBtnSpr(this.btn_Spin, SPRITE_SPIN);
            this.isAutoSpin = false;
            if (this.isStop)
                this.resetForNextSpin();
            return;
        };
        this.spinCount++;
        if (this.freeSpinLeft > 0) this.freeSpinLeft--;
        this.playSoundEff("clickspin");
        this.curChip = this.agPlayer;
        if (!this.isFreeSpin) {
            require("GameManager").getInstance().effRunNumber(this.lb_Chip, this.curChip, this.curChip - (this.curMarkBet * 20), 1);
            this.agPlayer -= this.curMarkBet * 20;
        }
        this.curChip = this.agPlayer;
        this.setJackPot((this.curMarkBet * 20) * 0.2);
        //this.lb_Chip.string = require("GameManager").getInstance().formatNumber(this.agPlayer);
        this.btn_Spin.interactable = false;
        this.clickSpinCount++;
        if (this.isFreeSpin) this.curMarkBet = 500;
        Global.GameView.slotView(this.curMarkBet * 20);
        this.isStop = false;
        this.blackMask.active = false;
        for (let i = 0; i < this.listCheckStopCol.length; i++) {
            this.listCheckStopCol[i] = false;
        }
        this.lb_info.node.active = true;
        this.lb_info.string = "Playing 20 lines. Good luck!";
        let acSpin = cc.callFunc(() => {
            this.playSoundEff("wheelspin");
            for (let i = 0; i < this.listCollum.length; i++) {
                let collum = this.listCollum[i];
                for (let j = 0; j < collum.length; j++) {
                    let item = collum[j].getComponent("ItemSlot20JP");
                    let posUp = cc.v2(item.node.position.x, item.node.position.y + 60); // move len 1 doan.xong moi chay.hihi
                    let posDown = cc.v2(item.node.position.x, item.node.position.y - this.initHeightItem);
                    let acRunUp = cc.moveTo(0.15, posUp).easing(cc.easeSineOut(0.05));
                    let acRunDown = cc.moveTo(this.speedSpin, posDown);
                    let acSetBlur = cc.callFunc(() => {
                        item.setSpriteListItem(item.listIdView, true);
                    });

                    let acRun = cc.sequence(acRunUp, cc.spawn(acSetBlur, acRunDown));
                    let acCheck = cc.callFunc(() => {
                        item.typeItem--;
                        cc.log("listcheck stop==" + this.listCheckStopCol[i]);
                        if (!this.listCheckStopCol[i] && item.numCol === i) { //running
                            if (item.typeItem < 0) { //reset item position
                                item.node.position = cc.v2(item.node.position.x, this.resetPosY2);
                                item.typeItem = 2;
                                //if (this.isCheckScatterItem3 && item.numCol > 2)
                                item.setRandomId(true);
                            }
                            let speed = this.speedSpin;
                            if (i === 4 && !this.isAutoSpin)
                                speed = SPEED_NORMAL;
                            let acRun = cc.moveTo(speed, cc.v2(item.node.position.x, item.node.position.y - this.initHeightItem));
                            item.node.runAction(cc.sequence(acRun, acCheck));
                        }
                        else if (this.listCheckStopCol[i] && item.numCol === i) { //Stop roi ne.
                            let timedel = 0;
                            if (i === 3 && this.isCheckScatterItem3)
                                timedel = 0;

                            if (item.typeItem < 0) {
                                item.node.position = cc.v2(item.node.position.x, this.resetPosY2);
                                item.typeItem = 2;
                                item.setSpriteListItem(this.finishView[i], false);
                                this.listOriginItem.push(item.node);
                            }

                            if (item.typeItem === 0) {
                                item.node.position = cc.v2(item.node.position.x, this.resetPosY3);
                                item.typeItem = 3;
                            }
                            let speed = this.isAutoSpin ? SPEED_AUTO : SPEED_NORMAL;
                            if (i === 2 && this.isCheckScatterItem3) {
                                this.speedSpin = SPEED_AUTO;
                                timedel = 2;
                                cc.loader.loadRes(ResDefine.slot_speedspin_1010, sp.SkeletonData, (err, aniClip) => {
                                    if (err) {
                                        return;
                                    }
                                    let skeData = aniClip;
                                    let data = {
                                        dir: ResDefine.slot_speedspin_1010,
                                        skeData: skeData
                                    }
                                    this.skeData.push(data);
                                    this.setInfoAnim(this.firstAnim, skeData, cc.v2(this.posAnimSpeedX, -7), cc.v2(0.7, 0.77));
                                    this.firstAnim.node.parent = this.bkg_mid;
                                    this.firstAnim.node.zIndex = this.parentItemNode.zIndex + 1;
                                    this.firstAnim.playAnimation2("animation", true);
                                });
                            }
                            let deltaX = this.isAutoSpin ? 30 : 40;
                            let posDown = cc.v2(item.node.position.x, item.node.position.y - this.initHeightItem - deltaX);
                            let posUp = cc.v2(item.node.position.x, item.node.position.y - this.initHeightItem);
                            let acRunDown = cc.moveTo(0.2, posDown).easing(cc.easeSineOut());

                            let acRunUp1 = cc.moveTo(speed, posUp).easing(cc.easeSineIn());
                            let acRunUp2 = cc.spawn(acRunUp1, cc.callFunc(() => {
                                this.listCheckStopCol[i + 1] = true;
                            }));
                            let acRunUp3 = cc.sequence(acRunUp1, cc.delayTime(timedel), cc.callFunc(() => {
                                this.listCheckStopCol[i + 1] = true;
                            }));
                            let acRunUp = acRunUp1;
                            if (this.isAutoSpin && this.isCheckScatterItem3)
                                acRunUp = acRunUp3;
                            else if (this.isAutoSpin)
                                acRunUp = acRunUp2;
                            let acSetBlur = cc.callFunc(() => {
                                item.setSpriteListItem(item.listIdView, false);
                            });
                            item.node.runAction(cc.sequence(cc.spawn(acRunDown, acSetBlur),
                                cc.spawn(acRunUp, cc.callFunc(() => {
                                    this.playSoundEff("stopspin");
                                })),
                                cc.delayTime(timedel), cc.callFunc(() => {
                                    if (i === 4 && item.typeItem === 2) {
                                        for (let i = 0; i < this.winningLine.length; i++) {
                                            this.initLineWin(this.winningLine[i].lineWin, this.winningLine[i].color);
                                        }
                                        require('SoundManager1').instance.stopWheel();
                                        this.getScatterItem();
                                        this.checkWildWinInLine();
                                        this.acShowWinLine();
                                    }
                                    item.typeItem--;
                                    if (i === 3 && this.isCheckScatterItem3) {
                                        this.firstAnim.node.active = false;
                                        this.firstAnim.animation.skeletonData = null;
                                    }
                                    //  if (!this.isAutoSpin)
                                    this.listCheckStopCol[i + 1] = true;
                                })));
                        }
                    });
                    item.node.stopAllActions();
                    item.node.runAction(cc.sequence(acRun, acCheck));
                }
            }
        });
        this.node.runAction(acSpin);
        // this.stateGame = STATE_GAME.PLAYING;     Ï
    },
    onClickAutoSpin() {
        // if (!this.isAutoSpin) require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickAutoSpin_%s", require('GameManager').getInstance().getCurrentSceneName()));
        // else require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickStopAutoSpin_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.isAutoSpin = !this.isAutoSpin;
        this.speedSpin = SPEED_AUTO;
        let sprite = this.isAutoSpin ? SPRITE_STOPAUTO : SPIRTE_AUTOSPIN;
        this.setBtnSpr(this.btn_autoSpin, sprite);
        if (!this.isStop) {
            require('SoundManager1').instance.playButton();
            return;
        }

        // console.log("-=-=-=>>   " + this.curMarkBet)
        // console.log("-=-=-=>>   " + this.agPlayer)
        if (this.isStop && this.curMarkBet > 0 && this.agPlayer >= this.curMarkBet * 20) {
            this.onClickSpin();
        }
    },
    handleSpin(data) {
        // data = {
        //     slotViews: [[10, 6, 11], [8, 7, 9], [4, 2, 3], [4, 4, 5], [5, 6, 8]],
        //     creditWin: 2,
        //     lineDetail: [{ lineId: 2, win: 2000 }, { lineId: 6, win: 2000 }, { lineId: 14, win: 2000 }],
        //     freeSpinLeft: 0,
        //     winType: 0,
        //     freeSpin: false,
        //     agWin: 0,
        //     AG: 1212480,
        //     level: { levelUser: 2, curLevelExp: 14, maxLevelExp: 19, agUser: 20872 },
        //     MarkBet: [5, 50, 500, 5000, 25000, 50000, 250000, 500000, 2500000, 5000000]
        // }
        // if (this.spinCount % 5 === 0) {
        //     let jackpot = parseInt(cc.sys.localStorage.getItem("JackPot"));
        //     let message = {
        //         evt: "jackpotwin",
        //         N: "haiduy17",
        //         M: jackpot,
        //         G: 1000000
        //     }
        //     require("HandleServicePacket").handleService(JSON.stringify(message));
        //     data.AG += jackpot;
        //     data.agWin += jackpot;
        //     cc.sys.localStorage.setItem("agSlotOffline", data.AG);
        //     data.slotViews[1][1] = 12;
        //     data.slotViews[2][1] = 12;
        //     data.slotViews[3][1] = 12;
        // }

        this.finishData = data;
        this.finishView = data.slotViews;
        this.isCheckScatterItem3 = false;
        if (this.finishView[1].includes(12) && this.finishView[2].includes(12))
            this.isCheckScatterItem3 = true;
        this.getLineWin(data.lineDetail);
        setTimeout(() => {
            this.onStopSpin();
        }, 500);
        this.totalWin = data.agWin !== 0 ? data.agWin : this.totalWin;
        this.agPlayer = data.AG;
        this.winType = data.winType;
        this.isFreeSpin = this.freeSpinLeft > 0 ? true : false;
        this.listMarkBet = [];

        if (data.MarkBet.length > 0 && this.agPlayer < data.MarkBet[0] * 20)
            this.listMarkBet.push(data.MarkBet[0]);

        for (let i = 0; i < data.MarkBet.length; i++) {
            if (data.MarkBet[i] * 20 <= this.agPlayer)
                this.listMarkBet.push(data.MarkBet[i]);
        }
        if (this.isFreeSpin) this.listMarkBet = this.dataListBetDefault;
        if (this.curMarkBet > this.listMarkBet.slice().pop()) {
            this.markIndex = this.listMarkBet.length - 1;
            if (this.markIndex >= 0)
                this.curMarkBet = this.listMarkBet[this.markIndex];
            else {
                // this.curMarkBet = 0
            }
        }

        this.lb_markBet.string = require("GameManager").getInstance().formatNumber(this.curMarkBet * 20);
    },
    showItemAnimJP() {
        this.playSoundEff("wildscatter");
        for (let i = 0; i < this.listScatter.length; i++) {
            let data = this.listScatter[i];
            let anim = this.getAnimFromPool(this.listAnimWS);
            cc.loader.loadRes(ResDefine.jp_12, sp.SkeletonData, (err, aniClip) => {
                if (err) {
                    return;
                }
                let skeData = aniClip;
                let data1 = {
                    dir: ResDefine.jp_12,
                    skeData: skeData
                }
                this.skeData.push(data1);
                this.setInfoAnim(anim, skeData, data.pos, 1.0);
                this.node.addChild(anim.node, ZINDEX_ITEMANIM);
                anim.playAnimation2("1o", true);
            });
        }
    },
    showAnimOneWinLine() {
        this.blackMaskBig.active = false;
        if (this.listWinLineNode.length === 0) {
            this.setBtnSpr(this.btn_Spin, SPRITE_SPIN);
            this.btn_Spin.interactable = !this.isAutoSpin;
            this.firstAnim.node.active = false;
            this.firstAnim.animation.skeletonData = null;
            this.firstAnim.node.getChildByName("lb_Money").active = false;
            this.resetForNextSpin();
            return;
        }
        setTimeout(() => {
            this.btn_Spin.interactable = !this.isAutoSpin;
            if (!this.isAutoSpin) {
                this.setBtnSpr(this.btn_Spin, SPRITE_STOPSPIN);
            }
        }, 300);
        this.firstAnim.node.active = false;
        this.firstAnim.animation.skeletonData = null;
        this.firstAnim.node.getChildByName("lb_Money").active = false;
        if (this.clickSpinCount === 2) {
            return;
        }
        let len = this.listWinLineNode.length
        for (let i = 0; i < len; i++) { //show line and anim.Not have JP;
            this.node.runAction(cc.sequence(cc.delayTime(i * 2.0),
                cc.callFunc(() => {
                    for (let i = 0; i < this.listWinLineNode.length; i++) {
                        this.listWinLineNode[i].node.active = false;
                    }
                    if (this.isAutoSpin && this.listWinLineNode.length > 1) {
                        this.resetForNextSpin();
                        return;
                    }
                    this.playSoundEff("showline");
                    this.turnOffMiniResult();
                    this.turnOffAnim();
                    for (let i = 0; i < this.listLineRect.length; i++) {
                        this.listLineRect[i].active = false;
                    }
                    let lineWin = this.winningLine[i].lineWin;
                    this.listPosRect.length = 0;
                    let listIdAnim = [];
                    setTimeout(() => {
                        if (this.node && this.listWinLineNode.length > 0) {
                            this.listWinLineNode[i].node.active = true;
                        }
                    }, 50);
                    let listPos = [];
                    for (let j = 0; j < lineWin.length; j++) { //[1,2,1,2,1,];
                        let item = this.listOriginItem[j].getComponent("ItemSlot20JP");
                        let indexItemSon = lineWin[j]
                        let pos = item.getWordPosItem(item.listItem[indexItemSon]);
                        listPos.push(pos);
                        let idAnim = item.listIdView[indexItemSon];
                        listIdAnim.push(idAnim);
                    }
                    this.idMini = -1;
                    this.showListAnim(listPos, listIdAnim, this.winningLine[i].color, this.winningLine[i].pays);

                })));
        }
    },
    showAllWinLine() {
        this.updateMoney();
        this.blackMaskBig.active = false;
        if (this.listWinLineNode.length !== 0)
            this.blackMask.active = true;
        this.firstAnim.node.active = false;
        this.firstAnim.animation.skeletonData = null;
        if (this.listWinLineNode.length > 1) {
            for (let i = 0; i < this.listWinLineNode.length; i++) {
                this.node.runAction(cc.sequence(cc.delayTime(0.15 * i), cc.callFunc(() => {
                    this.listWinLineNode[i].node.active = true;
                })));
            }
        }
        this.turnOffAnim();
        this.turnOffMiniResult();
        this.isStop = true;

    },
    showAnim5OfAkind() {
        this.blackMaskBig.active = true;
        this.firstAnim.node.active = true;
        cc.loader.loadRes(ResDefine.slot_fiveOfaKind_1010, sp.SkeletonData, (err, aniClip) => {
            if (err) {
                return;
            }
            let skeData = aniClip;
            let data = {
                dir: ResDefine.slot_fiveOfaKind_1010,
                skeData: skeData
            }
            this.skeData.push(data);
            let animName = "animation";
            this.setInfoAnim(this.firstAnim, skeData, cc.v2(0, 0), cc.v2(1, 1));
            this.firstAnim.node.parent = this.node;
            this.firstAnim.zIndex = ZINDEX_ITEMANIM + 1;
            this.firstAnim.playAnimation2(animName);
        });

    },
    handleJackPotWin(nameWin, jackpot) {
        //    if (nameWin === this.playerName) {
        cc.log("Handle jackpot Win");
        this.isHave3Scatter = true;
        this.jackPotWin = jackpot;
        // }
    },
    showAnimJackPot() {
        this.playSoundEff("freespin");
        this.blackMaskBig.active = false;
        this.turnOffAnim();
        this.firstAnim.node.active = false;
        this.firstAnim.animation.skeletonData = null;
        cc.loader.loadRes(ResDefine.jp_jpwin, sp.SkeletonData, (err, aniClip) => {
            if (err) {
                return;
            }
            let skeData = aniClip;
            let data = {
                dir: ResDefine.jp_jpwin,
                skeData: skeData
            }
            this.skeData.push(data);
            let animName = "animations";
            this.setInfoAnim(this.firstAnim, skeData, cc.v2(0, 0), cc.v2(cc.winSize.width / 1280, cc.winSize.height / 720));
            this.firstAnim.node.parent = this.node;
            this.firstAnim.playAnimation2(animName, true);
            let timeShow = 1.5;
            let lbMoney = this.firstAnim.node.getChildByName("lb_Money");
            lbMoney.active = true;
            lbMoney.opacity = 255;
            lbMoney.setScale(0.8);
            lbMoney.getComponent(cc.Label);
            lbMoney.position = cc.v2(0, -70 * (cc.winSize.height / 720));
            cc.log("jackpot win==" + this.jackPotWin);
            this.createEffNumRun(0, this.jackPotWin, timeShow, lbMoney.getComponent(cc.Label));
            lbMoney.runAction(cc.sequence(cc.scaleTo(timeShow, 1.2),
                cc.scaleTo(0.5, 1.0).easing(cc.easeBackOut()),
                cc.delayTime(0.9),
                cc.fadeTo(0.5, 0)));
            cc.sys.localStorage.setItem("JackPot", 0);
            this.jpCurrent = 0;
            this.lb_JackPot.string = 0;
        });

    },
    showAnimAllWild() {
        this.playSoundEff("wildscatter");
        let listLineCheckWild = [];
        for (let i = 0; i < this.winningLine.length; i++) {
            let data = {
                lineWinId: [],
                lineWin: []
            }
            let lineWinId = this.winningLine[i].lineWinId;
            if (lineWinId.includes(11)) {
                data.lineWinId = lineWinId;
                data.lineWin = this.winningLine[i].lineWin;
            }
            listLineCheckWild.push(data);
        }
        let listItemWild = [];
        for (let i = 0; i < listLineCheckWild.length; i++) {
            let lineWinId = listLineCheckWild[i].lineWinId;
            let countWildCheck = this.checkIndexToShowAnim(listLineCheckWild[i].lineWinId);
            for (let j = 0; j <= countWildCheck; j++) {
                let item = this.listOriginItem[j].getComponent("ItemSlot20JP");
                if (lineWinId[j] === 11) {
                    listItemWild.push(item);
                }
            }
        }
        for (let i = 0; i < listItemWild.length; i++) {
            this.showAnimItemWild(listItemWild[i]);
        }
    },
    showAnimItemWild(item) {
        let posData = item.getPosShowItemWild();
        let size = posData.length;
        for (let i = 0; i < size; i++) {
            let anim = this.getAnimFromPool(this.listAnimWS);
            let animName = posData[i].animName;
            let pos = posData[i].pos;
            cc.loader.loadRes(ResDefine.jp_11, sp.SkeletonData, (err, aniClip) => {
                if (err) {
                    return;
                }
                let skeData = aniClip;
                let data = {
                    dir: ResDefine.jp_11,
                    skeData: skeData
                }
                this.skeData.push(data);
                this.setInfoAnim(anim, skeData, pos, 1.0, false);
                this.node.addChild(anim.node, ZINDEX_ITEMANIM);
                anim.playAnimation2(animName, true);
            });
        }
    },
    setInfoAnim(anim, skedata, pos, scale, isTurnOnMask = false, isTurnOnLb = false) {
        anim.node.active = true;
        anim.node.zIndex = ZINDEX_ITEMANIM;
        let sprMask = anim.node.getChildByName("animMask");
        sprMask.active = isTurnOnMask;
        sprMask.getComponent(cc.Sprite).spriteFrame = this.animMask;
        sprMask.setContentSize(cc.size(200, 166));
        anim.animation.node.setScale(scale);
        anim.node.position = pos;
        anim.initAnimation(skedata);
        let lbMoney = anim.node.getChildByName("lb_Money");
        lbMoney.active = isTurnOnLb;
    },
    showAnimBigWin() {
        this.playSoundEff("bigwin");
        this.blackMaskBig.active = true;
        this.firstAnim.node.active = false;
        this.firstAnim.animation.skeletonData = null;
        cc.loader.loadRes(ResDefine.slot_MegaBigWin_1010, sp.SkeletonData, (err, aniClip) => {
            if (err) {
                return;
            }
            let skeData = aniClip;
            let data = {
                dir: ResDefine.slot_MegaBigWin_1010,
                skeData: skeData
            }
            this.skeData.push(data);
            let animName = "bigwin";
            this.setInfoAnim(this.firstAnim, skeData, cc.v2(0, 0), cc.v2(1, 1));
            this.firstAnim.node.parent = this.node;
            this.firstAnim.node.zIndex = ZINDEX_ITEMANIM + 1;
            this.firstAnim.playAnimation2(animName, true);
            let lbMoney = this.firstAnim.node.getChildByName("lb_Money");
            lbMoney.active = true;
            lbMoney.opacity = 255;
            lbMoney.scale = 1.0;
            lbMoney.position = cc.v2(0, -60);
            this.createEffNumRun(0, this.totalWin, this.timeShowBigMega - 1, lbMoney.getComponent(cc.Label));
            lbMoney.runAction(cc.sequence(cc.scaleTo(this.timeShowBigMega - 1, 1.2), cc.scaleTo(0.5, 1.0).easing(cc.easeBackOut()), cc.delayTime(0.2), cc.scaleTo(0.2, 0)));
        });
    },

    showAnimHugeWin() {
        this.playSoundEff("megawin");
        this.blackMaskBig.active = true;
        cc.loader.loadRes(ResDefine.slot_MegaBigWin_1010, sp.SkeletonData, (err, aniClip) => {
            if (err) {
                return;
            }
            let skeData = aniClip;
            let data = {
                dir: ResDefine.slot_MegaBigWin_1010,
                skeData: skeData
            }
            this.skeData.push(data);
            let animName = "megawin";
            this.setInfoAnim(this.firstAnim, skeData, cc.v2(0, 0), cc.v2(1, 1), false, true);
            this.firstAnim.playAnimation2(animName, false);
        });

    },
    onStopSpin() {
        //require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickStopSpin_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.listCheckStopCol[0] = true;
        // let timedel = this.isCheckScatterItem3 ? 4500 : 2500;
        // if (this.isAutoSpin)
        //     timedel = this.isCheckScatterItem3 ? 4000 : 2000;
        // setTimeout(() => {
        //     // this.getScatterItem();
        //     // for (let i = 0; i < this.winningLine.length; i++) {
        //     //     this.initLineWin(this.winningLine[i].lineWin, this.winningLine[i].color);
        //     // }
        //     //this.checkWildWinInLine();
        //     //   this.acShowWinLine();
        // }, timedel);
    },
    getScatterItem() {
        this.listScatter.length = 0;
        for (let i = 0; i < this.listItem.length; i++) {
            let item = this.listItem[i];
            if (item.node.position.y > this.initPosItem.y - 100 && item.node.position.y < this.initPosItem.y + 10) {
                //this.listOriginItem.push(item.node);
                item.getScatterItem();
            }
            else item.setRandomId(false);
        }
        this.checkScatterItem();
    },
    initLineWin(lineWin, color) {
        let lineWinPos = [];
        for (let i = 0; i < lineWin.length; i++) {
            let item = this.listOriginItem[i].getComponent("ItemSlot20JP");
            let posItem = item.getWordPosItem(item.listItem[lineWin[i]]);
            lineWinPos.push(posItem);
        }
        this.drawLine(lineWinPos, color);
    },
    getLineWin(data) {
        for (let i = 0; i < data.length; i++) {
            let idLine = data[i].lineId
            let lineWinDat = {
                lineWin: [],
                lineWinId: [],
                color: null,
                pays: null
            }
            let lineid = [];
            for (let j = 0; j < this.payLine[idLine].length; j++) {
                let id = this.payLine[idLine][j];
                lineid.push(this.finishView[j][id]);
            }
            lineWinDat.lineWin = this.payLine[data[i].lineId];
            lineWinDat.color = this.listColor[data[i].lineId];
            lineWinDat.pays = data[i].win;
            lineWinDat.lineWinId = lineid;
            this.winningLine.push(lineWinDat);
        }
        this.checkFiveOfaKind();
    },
    acShowWinLine() {
        let timeShowBigWin = 0;
        let timeShowMegaWin = 0;
        let timeShowOneLine = TIME_SHOW_LINE * this.listWinLineNode.length;
        let timeShowJackPot = 0;
        let timeShowFiveOfaKind = 0;
        let timeShowWildWin = 0;
        let timeShowAllLine = 0;

        if (this.listWinLineNode.length > 1)
            timeShowAllLine = this.listWinLineNode.length * 0.15 + 0.7;
        //if (timeShowAllLine < 1.5 && timeShowAllLine > 0) timeShowAllLine = 1.5;
        if (this.isHaveFiveOfaKind)
            timeShowFiveOfaKind = 3;
        if (this.isWildWinInLine || this.isHave2Scatter)
            timeShowWildWin = 2;
        if (this.isHave3Scatter)
            timeShowJackPot = 4.0;
        if (this.winType === 1)
            timeShowBigWin = 3.0;
        if (this.winType === 2) {
            timeShowBigWin = 2.7;
            timeShowMegaWin = 3.0;
        }
        this.timeShowBigMega = timeShowBigWin + timeShowMegaWin;
        let acShowAllWinLine = cc.callFunc(() => {
            this.showAllWinLine();
        });
        let acShowOneWinLine = cc.callFunc(() => {
            let timeDel = this.isAutoSpin ? TIME_SHOW_LINE - 0.5 : 0;
            let acCheck = cc.callFunc(() => {
                if (this.isAutoSpin)
                    this.resetForNextSpin();
            })
            this.node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(() => { this.showAnimOneWinLine(); }), cc.delayTime(timeDel), acCheck, cc.delayTime(timeShowOneLine))));
        });
        let acShowAnimScatter = cc.callFunc(() => {
            if (this.isHave2Scatter)
                this.showItemAnimJP();
        });
        let acShowAnimFiveOfaKind = cc.callFunc(() => {
            if (this.isHaveFiveOfaKind) {
                this.showAnim5OfAkind();
            }
        });
        let acShowAnimJackPot = cc.callFunc(() => { // cho anim Jackpot
            if (this.isHave3Scatter) {
                this.showAnimJackPot();
            }
        });
        let acShowWildWinInLine = cc.callFunc(() => {
            if (this.isWildWinInLine)
                this.showAnimAllWild();
        });
        let acShowAnimBigWin = cc.callFunc(() => {
            if (this.winType === 1 || this.winType === 2) {
                this.showAnimBigWin();
            }
        });
        let acShowAnimMegaWin = cc.callFunc(() => {
            if (this.winType === 2) {
                this.showAnimHugeWin();
            }
        });
        let acShow = cc.sequence(acShowAnimScatter,
            acShowWildWinInLine, cc.delayTime(timeShowWildWin),
            acShowAllWinLine, cc.delayTime(timeShowAllLine),
            acShowAnimJackPot, cc.delayTime(timeShowJackPot),
            acShowAnimFiveOfaKind, cc.delayTime(timeShowFiveOfaKind),
            acShowAnimBigWin, cc.delayTime(timeShowBigWin),
            acShowAnimMegaWin, cc.delayTime(timeShowMegaWin),
            acShowOneWinLine);
        this.node.runAction(acShow);
        this.lb_info.node.active = false;
    },
    drawLine(listLineWinPos, color) {
        let line = this.createLine(color);
        line.moveTo(listLineWinPos[0].x - 126 / 2, listLineWinPos[0].y);
        line.lineTo(listLineWinPos[0].x, listLineWinPos[0].y);
        let len = listLineWinPos.length;
        for (let i = 1; i < len; i++) {
            line.lineJoin = cc.Graphics.LineJoin.ROUND;
            line.lineTo(listLineWinPos[i].x, listLineWinPos[i].y);
        }
        line.lineTo(listLineWinPos[len - 1].x + 126 / 2, listLineWinPos[len - 1].y);
        line.stroke();
        line.node.active = false;
        this.listWinLineNode.push(line);
    },
    createLine(color, isRect, lineWidth = 5) {
        let lineWin = new cc.Node();
        lineWin.name = "Line";
        let line = lineWin.addComponent(cc.Graphics);
        line.lineWidth = lineWidth;
        line.lineCap = cc.Graphics.LineCap.ROUND;
        line.strokeColor = new cc.Color().fromHEX(color);
        line.node.active = true;
        this.node.addChild(line.node, ZINDEX_LINE);
        if (isRect) line.node.zIndex = ZINDEX_ITEMANIM + 1;
        this.listLineRect.push(line.node);
        return line;
    },
    showListAnim(listPos, listId, color, agWin) {
        let count = this.checkIndexToShowAnim(listId);
        for (let i = 0; i <= count; i++) {
            // this.showItemAnim(i, listPos[i], listId[i], agWin);
            this.setItemMiniResult(listId[i], i, agWin);
            let posMove = cc.v2(0, 0);
            let posRect = listPos[i];
            //  this.drawRect(posRect, color);
        }

    },
    checkIndexToShowAnim(listId) {
        let count = 0;
        let idCheck = listId[0];
        for (let i = 1; i < listId.length; i++) {
            if (idCheck !== 11 && idCheck !== 12) {
                if (listId[i] === idCheck || listId[i] === 11) {
                    count++
                }
                else break;
            } else if (idCheck === 11) {
                idCheck = listId[i];
                if (listId[i] !== 12)
                    count++
            }
        }
        return count;
    },
    showItemAnim(index, pos, id, agWin, isTurnOnMask = true) {
        this.setItemMiniResult(id, index, agWin);
        // let itemAnim = this.listItemAnim[index];
        let itemAnim = this.getAnimFromPool(this.listItemAnim);
        let idAnim = id;
        let animName;
        let scale = 1.0;
        let resPath = "";
        if (id < 4) {
            idAnim = IDANIM_ZOCOBICTEP;
            resPath = ResDefine.jp_0_3;
            switch (id) {
                case 0:
                    animName = "tep";
                    break;
                case 1:
                    animName = "bich";
                    break;
                case 2:
                    animName = "zo";
                    break;
                case 3:
                    animName = "co";
                    break;
            }
        }
        else if (id < 8) {
            resPath = ResDefine.jp_4_7;
            idAnim = IDANIM_HOAKENBINH;
            switch (id) {
                case 4:
                    animName = "09";
                    break;
                case 5:
                    animName = "07";
                    break;
                case 6:
                    animName = "06";
                    break;
                case 7:
                    animName = "08";
                    break;
            }
        } else {
            animName = "1o";
            switch (id) {
                case 11:
                    idAnim = IDANIM_WILD;
                    resPath = ResDefine.jp_11;
                    break;
                case 12:
                    idAnim = IDANIM_SCATTER;
                    resPath = ResDefine.jp_12;
                    break;
                case 10:
                    resPath = ResDefine.jp_10;
                    idAnim = 0;
                    break;
                case 9:
                    resPath = ResDefine.jp_9;
                    idAnim = 4;
                    break;
                case 8:
                    resPath = ResDefine.jp_8;
                    idAnim = 2;
                    break;
            }
        }
        cc.loader.loadRes(resPath, sp.SkeletonData, (err, aniClip) => {
            if (err) {
                return;
            }
            let skeData = aniClip;
            let data = {
                dir: resPath,
                skeData: skeData
            };
            this.skeData.push(data);
            itemAnim.initAnimation(skeData);
            itemAnim.node.position = pos;
            itemAnim.node.active = true;
            itemAnim.animation.node.scale = scale;
            let sprMask = itemAnim.node.getChildByName("animMask");
            sprMask.active = isTurnOnMask;
            sprMask.getComponent(cc.Sprite).spriteFrame = this.animMask;
            sprMask.setContentSize(cc.size(135, 131));
            this.node.addChild(itemAnim.node, ZINDEX_ITEMANIM);
            itemAnim.playAnimation(animName, true, true, true);
        });
    },
    setItemMiniResult(id, index, agWin) {
        if (id !== 11) {
            this.idMini = id;
            for (let i = 0; i < index; i++) {
                this.listItemMiniResult[i].node.getComponent(cc.Sprite).spriteFrame = this.sprAtlas.getSpriteFrame(id.toString());
            }
        }
        if (id === 11 && this.idMini !== -1) id = this.idMini;
        this.listItemMiniResult[index].node.active = true;
        let itemSpr = this.listItemMiniResult[index].node.getComponent(cc.Sprite);
        itemSpr.spriteFrame = this.sprAtlas.getSpriteFrame(id.toString());
        this.lb_Result.string = "";
        this.itemMiniResult.active = true;
    },
    turnOffMiniResult() {
        for (let i = 0; i < this.listItemMiniResult.length; i++) {
            this.listItemMiniResult[i].node.active = false;
        }
    },
    turnOffAnim(isPutBackPool = false) {
        this.putAnimBackPool(this.listAnimWS);
        for (let i = 0; i < this.listItemAnim.length; i++) {
            this.listItemAnim[i].animation.skeletonData = null;
            this.listItemAnim[i].node.active = false;
        }
        if (isPutBackPool) {
            this.putAnimBackPool(this.listItemAnim);
        }
    },
    checkFiveOfaKind() {
        this.isHaveFiveOfaKind = false;
        let count = 0;

        for (let i = 0; i < this.winningLine.length; i++) {
            let listId = [];
            let lineWin = this.winningLine[i].lineWin;
            for (let j = 0; j < lineWin.length; j++) {
                listId.push(this.finishView[j][lineWin[j]]);
            }
            count = this.checkIndexToShowAnim(listId);
            if (count === 4) {
                this.isHaveFiveOfaKind = true;
                return;
            }

        }
    },
    checkWildWinInLine() {
        this.isWildWinInLine = false;
        for (let i = 0; i < this.winningLine.length; i++) {
            let lineWinId = this.winningLine[i].lineWinId;
            this.countWild = this.checkIndexToShowAnim(lineWinId);
            for (let j = 0; j <= this.countWild; j++) {
                if (lineWinId[j] === 11)
                    this.isWildWinInLine = true;
            }
        }
    },
    checkIsItemInWinLine(numCol, index) {
        let bool = false;
        let size = this.winningLine.length;
        for (let i = 0; i < size; i++) {
            let lineWin = this.winningLine[i].lineWin;
            if (lineWin[numCol] === index) {
                bool = true;
            }
        }
        return bool;
    },
    checkScatterItem() {
        this.isHave2Scatter = this.scatterCount > 1 ? true : false;
    },
    drawRect(posRect, color) {
        let lineRect = this.createLine(color, true, 4);
        let posRect1 = cc.v2(posRect.x - 129 / 2, posRect.y - 130 / 2);
        lineRect.moveTo(posRect1);
        lineRect.rect(posRect1.x, posRect1.y, 130, 130);
        this.listLineRect.push(lineRect.node);
        lineRect.stroke();
    },
    destroyLine() {
        for (let i = 0; i < this.listWinLineNode.length; i++) {
            this.listWinLineNode[i].destroy();
        }
        this.listWinLineNode.length = 0;
        for (let i = 0; i < this.listLineRect.length; i++) {
            this.listLineRect[i].destroy();
        }
        this.listLineRect.length = 0;
    },
    resetForNextSpin() {
        cc.NGWlog("SlotJP:reset for nexxt spin");
        if (require('GameManager').getInstance().user.vip < 1)
            //require("NetworkManager").getInstance().sendUpVip();
            this.node.stopAllActions();
        this.blackMask.active = false;
        this.destroyLine();
        this.turnOffAnim(true);
        this.winningLine.length = 0;
        this.clickSpinCount = 0;
        this.listAnimId.length = 0;
        this.listSpriteId.length = 0;
        this.scatterCount = 0;
        this.btn_autoSpin.interactable = true;
        this.isHave3Scatter = false;
        this.listOriginItem.length = 0;
        if (this.agPlayer < this.listMarkBet[0] * 20 && !this.isFreeSpin) {
            this.isAutoSpin = false;
        }
        this.setBtnSpr(this.btn_autoSpin, SPIRTE_AUTOSPIN);
        if (this.isFreeSpin)
            this.setBtnSpr(this.btn_Spin, SPRITE_FREESPIN);
        else this.setBtnSpr(this.btn_Spin, SPRITE_SPIN);
        this.lb_info.node.active = true;
        let canSpin = this.agPlayer >= this.listMarkBet[0] * 20 ? true : false;
        if (this.isFreeSpin) {
            canSpin = true;
            this.listMarkBet
        }
        this.btn_Spin.interactable = canSpin;
        this.btn_autoSpin.interactable = canSpin;
        this.parentItemNode.getComponent(cc.Button).interactable = canSpin;
        if (this.agPlayer >= this.listMarkBet[0] * 20 || this.isFreeSpin)
            this.lb_info.string = "Press Spin To Play";
        else {
            this.lb_info.string = "You Do Not Have Enough Chips.";
        }

        this.lb_titleWin.string = "Last Win";
        if (this.isAutoSpin && this.agPlayer >= this.listMarkBet[0] * 20) {
            this.lb_info.string = "Playing 20 lines. Good luck!";
            this.speedSpin = SPEED_AUTO;
            this.setBtnSpr(this.btn_autoSpin, SPRITE_STOPAUTO);
            this.onClickSpin();
        }
        else
            this.speedSpin = SPEED_NORMAL;
        this.itemMiniResult.active = false;
        this.setMarkBetInfo();
        this.releaseAtsset();
    },
    setBtnSpr(button, index) {
        button.node.getComponent(cc.Sprite).spriteFrame = this.listSprBtn[index];
    },
    onClickPlusMarkBet() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickAddChipBet_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        if (this.isFreeSpin) this.listMarkBet = this.dataListBetDefault;
        if (!this.isStop || this.listMarkBet.length <= 1 || this.isAutoSpin) return;
        if (this.markIndex < this.listMarkBet.length - 1)
            this.markIndex++;
        else this.markIndex = 0;

        if (this.markIndex >= this.listMarkBet.length) this.markIndex = this.listMarkBet.length - 1;

        this.curMarkBet = this.listMarkBet[this.markIndex];
        this.lb_markBet.string = require("GameManager").getInstance().formatMoney(this.curMarkBet * 20);

        console.log("2:  " + this.lb_markBet.string)

        this.lb_titleBet.string = this.markIndex >= this.listMarkBet.length - 1 ? "MaxBet" : "Bet"
        this.setMarkBetInfo();
    },
    onClickMinusMarkBet() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSubChipBet_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        if (!this.isStop || this.listMarkBet.length <= 1 || this.isAutoSpin) return;
        if (this.isFreeSpin) this.listMarkBet = this.dataListBetDefault;
        if (this.markIndex > 0)
            this.markIndex--;
        else
            this.markIndex = this.listMarkBet.length - 1;

        if (this.markIndex < 0) this.markIndex = 0;

        this.curMarkBet = this.listMarkBet[this.markIndex];
        this.lb_markBet.string = require("GameManager").getInstance().formatMoney(this.curMarkBet * 20);

        console.log("3:  " + this.lb_markBet.string)

        this.setMarkBetInfo();
    },
    setMarkBetInfo() {
        cc.log("mark index=" + this.markIndex)
        if (this.markIndex < this.listMarkBet.length - 1) {
            this.bkg_TotalBet.active = true;
            this.bkg_Maxbet.active = false;
            // this.lb_markBet.node.position = cc.v2(5, -14);
            this.lb_titleBet.string = "Bet"
        }
        else {
            this.bkg_TotalBet.active = false;
            this.bkg_Maxbet.active = true;
            //  this.lb_markBet.node.position = cc.v2(5, -11);
            this.lb_titleBet.string = "MaxBet";
        }
    },
    onClickMaxBet() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickMaxBet_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (this.agPlayer < this.listMarkBet[0] * 20) return;
        require('SoundManager1').instance.playButton();
        if (!this.isStop || this.isAutoSpin || this.markIndex < 0) return;
        if (this.markIndex === this.listMarkBet.length - 1) {
            this.onClickSpin();
            return;
        }
        this.markIndex = this.listMarkBet.length - 1;
        this.curMarkBet = this.listMarkBet[this.markIndex];
        this.lb_markBet.string = require("GameManager").getInstance().formatNumber(this.curMarkBet * 20);

        console.log("4:  " + this.lb_markBet.string)
        this.lb_titleBet.string = "MaxBet"
        this.setMarkBetInfo();
    },
    getRanNum(min_value, max_value) {
        let random_number = Math.random() * (max_value - min_value) + min_value;
        return Math.floor(random_number);
    },
    createEffNumRun(startNum, endNum, timeShow, label) {
        label.node.active = true;
        this.endNum = endNum;
        this.deltaNum = this.endNum - this.startNum;
        this.timeShow = timeShow;
        this.numPerSec = this.deltaNum / this.timeShow;
        this.curNum = startNum;
        this.isRunEffPlusMoney = true;
        this.effRunNumber(timeShow, label, this.curNum, this.endNum, this.numPerSec);
    },

    effRunNumber(timeShow, label, curNum, endNum, numPerSec, isJp = false) {
        let delta = numPerSec / 20;
        if (delta < 0) delta = 1;
        let acPlus = cc.callFunc(() => {
            curNum += delta;
            if (curNum >= endNum) {
                curNum = endNum;
                if (isJp) this.curJackPotNum = endNum;
            }
            label.string = require("GameManager").getInstance().formatNumber(Math.round(curNum));
        });
        let acCheck = cc.callFunc(() => {
            if (curNum >= endNum) {
                if (isJp) this.curJackPotNum = endNum;
                label.node.stopActionByTag(0);
            }
        });
        let acRunLb = cc.repeat(cc.sequence(acPlus, cc.delayTime(0.05), acCheck), timeShow * 20);
        acRunLb.setTag(0);
        label.node.runAction(acRunLb);
    },

    updateVip() {
        let vip = this.playerVip;
        if (vip >= 10) {
            vip = 10;
        }
        let vip1 = Math.floor(vip / 2);
        let vip2 = vip % 2;

        for (let i = 0; i < this.listIconVip.length; i++) {
            if (i + 1 <= vip1) {
                this.listIconVip[i].spriteFrame = this.listSpriteFrameVip[2];
            } else if (vip2 != 0) {
                vip2 = 0;
                this.listIconVip[i].spriteFrame = this.listSpriteFrameVip[1];
            } else {
                this.listIconVip[i].spriteFrame = this.listSpriteFrameVip[0];
            }
        }
    },
    createEffJPNumRun(timeShow) {
        let deltaJP = this.jackPotEndNum - this.curJackPotNum;
        let numPerSecJP = deltaJP / timeShow;
        this.effRunNumber(timeShow, this.lb_JackPot, this.curJackPotNum, this.jackPotEndNum, numPerSecJP, true);
    },
    // setJackPot(jackpot) {
    //     this.curJackPotNum = jackpot;
    //     this.lb_JackPot.string = require("GameManager").getInstance().formatNumber(jackpot);
    // },
    handleJackpot() {
        // let jackpot = require("GameManager").getInstance().curJackPotSlot;
        let jackpot = parseInt(cc.sys.localStorage.getItem("JackPot"));
        cc.NGWlog("SLỌTP:JP end num==" + jackpot);
        if (this.curJackPotNum === 0 || this.curJackPotNum >= jackpot) {
            this.curJackPotNum = jackpot;
            this.lb_JackPot.string = require("GameManager").getInstance().formatNumber(this.curJackPotNum);
        } else {
            this.jackPotEndNum = jackpot;
            this.createEffJPNumRun(7);
        }
    },
    onClickShop() {
        require('SoundManager1').instance.playButton();
        let shopview = cc.instantiate(this.shopPref).getComponent("ShopView");
        this.ShopView = shopview;
        this.node.addChild(shopview.node, ZINDEX_ITEMANIM + 1);
        return;
        // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShop_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SMLSocketIO').getInstance().emitSIOCCCNew(cc.js.formatStr("ClickShop_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (!this.isStop) return;
        require('SoundManager1').instance.playButton();
        Global.ShopView.isShowMain = false;
        require("UIManager").instance.onShowShop();
    },
    onClickRule(event, data) {
        if (data == 1) require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickGuide_%s", require('GameManager').getInstance().getCurrentSceneName()));
        let rule = cc.instantiate(this.JP_Rule);
        this.node.addChild(rule, ZINDEX_RULE);
        rule.getComponent("PopupEffect").onPopOn();
    },
    onClickJackPotHis() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickJackPotHis_%s", require('GameManager').getInstance().getCurrentSceneName()));
        //require("NetworkManager").getInstance().sendJackPotHistory();
        let historyJP = cc.instantiate(this.historyJpPr).getComponent("HistoryJPView");
        this.node.addChild(historyJP.node, ZINDEX_RULE);
        historyJP.initItem();
    },
    cleanGame() {
        require('SoundManager1').instance.stopWheel();
        // if (this.nodeGroupMenu != null && this.nodeGroupMenu.node.getParent()) this.nodeGroupMenu.node.removeFromParent(false);
    },
    getAnimFromPool(listAnim) {
        let anim;
        if (this.animPool.size() < 1) {
            anim = cc.instantiate(this.itemAnim).getComponent("ItemAnimation");
        } else {
            anim = this.animPool.get().getComponent("ItemAnimation");
        }
        if (listAnim != null)
            listAnim.push(anim);
        return anim;
    },
    putAnimBackPool(listAnim) {
        let i = 0;
        let size = listAnim.length;
        for (i = 0; i < size; i++) {
            this.animPool.put(listAnim[i].node);
        }
        listAnim.length = 0;
    },
    playSoundEff(state) {
        let soundManager = require('SoundManager1').instance;
        let resSound = "";
        switch (state) {
            case "clickspin":
                resSound = ResDefine.slot_spin;
                break;
            case "wheelspin":
                resSound = ResDefine.slot_wheel;
                break;
            case "stopspin":
                resSound = ResDefine.slot_stop;
                break;
            case "megawin":
                resSound = ResDefine.slot_megawin;
                break;
            case "bigwin":
                resSound = ResDefine.slot_bigwin;
                break;
            case "freespin":
                resSound = ResDefine.slot_freespin;
                break;
            case "wildscatter":
                resSound = ResDefine.slot_wild_scatter;
                break;
            case "showline":
                resSound = ResDefine.slot_show_line;
                break;
            case "scatter1":
                resSound = ResDefine.slot_scatter1;
                break;
            case "scatter2":
                resSound = ResDefine.slot_scatter2;
                break;
            case "scatter3":
                resSound = ResDefine.slot_scatter3;
                break;
        }
        if (resSound !== ResDefine.slot_wheel)
            soundManager.dynamicallyPlayMusic(resSound);
        else soundManager.playWheel();
    },
    updateMoney() {
        require("GameManager").getInstance().effRunNumber(this.lb_Chip, this.curChip, this.agPlayer, 0.8);
        if (this.finishData.agWin !== 0) this.lb_titleWin.string = "Win";
        this.lb_ChipWinRound.string = require("GameManager").getInstance().formatNumber(this.totalWin);

        require('GameManager').getInstance().user.ag = this.agPlayer;
        require('SMLSocketIO').getInstance().emitUpdateInfo();
        this.setMarkBetInfo()
    },
    onClickBack() {
        cc.log("On Click Back");
        require('SoundManager1').instance.playButton();
        this.setting.active = true;
        // this.node.destroy();
    },
    onClickRule() {
        this.bkg_rule.zIndex = ZINDEX_LINE + 1;
        this.bkg_rule.active = true;
        this.bkg_rule.getComponent("PopupEffect").onPopOn();

    },
    onClickDailyBonus() {
        require('SoundManager1').instance.playButton();
        this.daily.setInfo();
        this.node.addChild(this.daily.node, ZINDEX_LINE + 1);
    },
    receiveChipDaily() {
        let curAg = cc.sys.localStorage.getItem("agSlotOffline");
        curAg = parseInt(curAg);
        cc.log("Curag player=" + curAg);
        this.lb_Chip.string = this.formatNumber(curAg);
        this.agPlayer = curAg;

        console.log("----> Chip ng choi " + this.agPlayer)
        this.animChip.active = true;
        this.animChip.zIndex = ZINDEX_ITEMANIM + 100;
        this.animChip.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
        this.animChip.runAction(cc.sequence(cc.delayTime(2.0), cc.callFunc(() => {
            this.animChip.active = false;
        })));
        this.updateCurMarkBet()
        this.getCurMarkBet()
        console.log(this.listMarkBet)
        console.log(this.curMarkBet)
        if (this.listMarkBet.length > 0 && this.curMarkBet !== this.listMarkBet[this.listMarkBet.length - 1])
            this.onClickMaxBet()

        if (this.agPlayer <= 0 || (this.listMarkBet.length > 0 && this.agPlayer < this.listMarkBet[0] * 20) && !this.isFreeSpin) {
            this.btn_Spin.interactable = false;
            this.btn_autoSpin.interactable = false
        } else {
            this.btn_Spin.interactable = true;
            this.btn_autoSpin.interactable = true
        }
    },
    receiveChipReward() {
        console.log("RECEICHIP REWARD");
        if (this.typeReward === TYPE_REWARD.BONUS) {
            let ranNum = this.getRanNum(0, 10);
            let bonus = this.listReward[ranNum];
            if (this.chipBonusDaily !== 0) {
                bonus = this.chipBonusDaily;
                this.chipBonusDaily = 0;
            }
            let curAg = cc.sys.localStorage.getItem("agSlotOffline");
            curAg = parseInt(curAg);
            curAg += bonus;
            cc.sys.localStorage.setItem("agSlotOffline", curAg);
            let text = TEXT_RECEIVE_BONUS.replace("%d", require("GameManager").getInstance().formatNumber(bonus));
            this.onShowConfirmDialog(text, () => {
                this.receiveChipDaily();
            });
        }
        else if (this.typeReward === TYPE_REWARD.FREECHIP) {
            this.freeSpinLeft += 3;
            this.setBtnSpr(this.btn_Spin, SPRITE_FREESPIN);
            this.isFreeSpin = true;
            this.updateCurMarkBet()
            this.getCurMarkBet();
            this.lb_markBet.string = "10,000";
            if (this.isStop) this.resetForNextSpin();
            let text = TEXT_RECEIVE_FREESPIN;
            this.onShowConfirmDialog(text);
        }
    },
    formatNumber(number, width = 3) {
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');//String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
    },
    onCloseRule() {
        this.bkg_rule.getComponent("PopupEffect").onPopOff(false, true);
    },
    closeGame() {
        console.log("destroy slot game");
        require("SoundManager1").instance.stopWheel();
        Global.GameView.btnPlay.interactable = true;
        this.node.destroy();
    },
    onClickWatchAdsFree(event, data) {
        let popup = cc.instantiate(this.popupAdsPr).getComponent("PopupAdsSlot");
        this.node.addChild(popup.node, ZINDEX_ITEMANIM + 10);
        if (data === "freespin") {
            popup.type = 1;
            this.typeReward = TYPE_REWARD.FREECHIP;
        } else {
            this.typeReward = TYPE_REWARD.BONUS;
            popup.type = 2;
        }
        popup.onPopOn();
    },
    releaseAtsset() {
        cc.sys.garbageCollect();
        if (this.skeData.length > 10) {
            for (let i = 0; i < this.skeData.length; i++) {
                cc.loader.release(this.skeData[i].skeData);
            }
            this.skeData.length = 0;
            cc.NGWlog("SlotJp:Release asset xong!");
        }
    },
    onShowConfirmDialog(message, func_1 = null, isAds = false) {
        var dialogPre = cc.instantiate(this.dialog_util);
        var dialog = dialogPre.getComponent("DialogUtil");
        if (isAds) dialog.isAds = true;
        dialog.setContent(message);
        dialog.setNameButton("Confirm");
        dialog.setFunctionCallBack(func_1, null, null);
        this.node.addChild(dialogPre, ZINDEX_ITEMANIM + 10);
        // dialog.onPopOn();
        cc.log("onShowConfirmDialog===message=" + message);
    },
    showGetMoreChipDaily() {
        let text = TEXT_GET_MORE_CHIP_DAILY;
        let func = () => {
            if (require("GameManager").getInstance().isAdsReady) {
                require("Util").onShowAds();
                this.typeReward = TYPE_REWARD.BONUS;
                this.isAutoSpin = false;
                cc.log("Show ADS Len Cho Tao");
            } else {
                cc.log("Lam Deo Gi co Ads");
                let func = () => {
                    require("Util").onRequestAds();
                }
                this.onShowConfirmDialog(TEXT_AD_NOT_READY, func);

            }
        };
        this.onShowConfirmDialog(text, func, true);
    }

});
export default Slot20LineJPView
