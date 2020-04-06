
var ZINDEX_ITEMANIM = 30
var ZINDEX_LINE = 10
var ZINDEX_RULE = 40

var SPRITE_SPIN = 0
var SPRITE_FREESPIN = 1
var SPRITE_STOP = 2


var SPEED_NORMAL = 0.15;
var SPEED_AUTO = 0.1;

var SlotJapanView = cc.Class({
    extends: cc.Component,

    properties: {

        itemSlotPr: cc.Prefab,
        itemAnim: cc.Prefab,
        inca_Rule: cc.Prefab,
        dailyBonusPr: cc.Prefab,

        count: 0,
        clickSpinCount: 0,
        listLineRect: [],
        listPosRect: [],
        listAllItem: [],
        listItemMiniResult: [cc.Sprite],
        listSprBtn: [cc.SpriteFrame],
        listItem: [cc.Node],

        animMask: cc.SpriteFrame,
        sprAtlas: cc.SpriteAtlas,
        // listIconVip: [cc.Sprite],
        // listSpriteFrameVip: [cc.SpriteFrame],

        blackMask: cc.Node,
        itemAnimTest: cc.Node,
        parentItemNode: cc.Node,
        itemMiniResult: cc.Node,
        bkg_mid: cc.Node,
        bkg_Top: cc.Node,
        bkg_Bottom: cc.Node,
        setting: cc.Node,

        btn_Spin: cc.Button,
        shopPref: cc.Prefab,
        //  btn_autoSpin: cc.Button,

        lb_markBet: cc.Label,
        lb_ChipWinRound: cc.Label,
        lb_Chip: cc.Label,
        lb_Result: cc.Label,
        lb_info: cc.Label,
        lb_titleWin: cc.Label,
        lb_freeSpinLeft: cc.Label,
        lb_TypeMark: cc.Label,
        lb_numLine1: cc.Label,
        lb_numLine2: cc.Label,
        bkg_rule: cc.Node,
        animChip: cc.Node,
    },
    statics: {
        instance: null
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        SlotJapanView.instance = this;
        // this.nodeGroupMenu.onHideItem(1);
        // this.nodeGroupMenu.onHideItem(2);
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
        this.winningLine = [];
        this.listWinLineNode = [];
        this.listItemAnim = [];
        this.listDataAnimLine = [];
        this.listSpriteId = [];
        this.listPosItem = [cc.v2(95, 290), cc.v2(300, 260), cc.v2(506, 260), cc.v2(702, 260), cc.v2(894, 260)];
        this.listAnimWS = [];
        this.listAnimBkgFree = [];
        this.skeData = [];

        this.speedSpin = SPEED_NORMAL;
        this.agPlayer = 0;
        this.markIndex = 0;
        this.winType = 0;
        this.firstDelay = 2;
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
        this.curJackPotNum = 0;
        this.jackPotEndNum = 0;
        this.timeHoldSpin = 0;
        this.timeHoldSpin = 0;
        this.totalAgFSP = 0;
        this.spinCountCheck = 0;
        this.timeRunSpin = 0;

        this.bkg_Top.position = cc.v2(0, cc.winSize.height / 2 + 100);
        this.bkg_Bottom.position = cc.v2(0, -cc.winSize.height / 2 - 100);
        this.initPosItem = cc.v2(this.parentItemNode.width / 10, this.parentItemNode.height / 2);


        this.isClickSpin = false;
        this.isHoldSpin = false;
        this.isRunJPNum = false;
        this.isRunEffPlusMoney = false;
        this.isHaveFiveOfaKind = false;
        this.isCheckScatterItem3 = false;

        this.isAutoSpin = false;
        this.isHave2Scatter = false;
        this.isStop = true;
        this.isShowBigWin = false;
        this.isShowHugeWin = false;
        this.isCountFSPAg = false;
        this.canSpin = false;

        this.firstAnim = null;
        this.lb_Money = null;
        this.animBtnSpin = this.btn_Spin.node.getChildByName("ItemAnimation").getComponent("ItemAnimation");
        this.blackMaskBig = this.node.getChildByName("bkg_black");
        this.animPool = new cc.NodePool("animPool");
        this.fakeData = null;
        Global.GameView = this.node.parent.getComponent("DataForGameSlotMaChine");
        this.ShopView = null;
        //this.bkg_rule.position=cc.v2(cc.win)

    },
    update(dt) {
        if (this.isHoldSpin) {
            this.timeHoldSpin += dt;
            if (this.timeHoldSpin >= 1 && this.isStop) {
                this.onClickAutoSpin();
                this.setStateSpinBtn();
                this.isHoldSpin = false;
                this.timeHoldSpin = 0.0;
            }
        }
    },
    start() {
        // this.btn_Spin.node.on("touchstart", () => {
        //     this.timeHoldSpin = 0;
        //     this.isHoldSpin = true;
        // });
        // this.btn_Spin.node.on("touchend", () => {
        //     this.isHoldSpin = false;
        // });
        this.node.on("touchstart", (touch) => {
            cc.log("touch start");
            if (this.btn_Spin.node.getBoundingBoxToWorld().contains(touch.getLocation())) {
                this.timeHoldSpin = 0;
                this.isHoldSpin = true;
            }
        });
        this.node.on("touchend", (touch) => {
            if (this.isHoldSpin) {
                if (this.btn_Spin.node.getBoundingBoxToWorld().contains(touch.getLocation())) {
                    this.isHoldSpin = false;
                    cc.log("time hold spin=" + this.timeHoldSpin);
                    if (this.timeHoldSpin < 1) {
                        this.onClickSpin();
                    }
                }
                this.timeHoldSpin = 0.0;
            }
        });
    },
    startEffect() {
        this.bkg_Top.stopAllActions();
        this.bkg_Bottom.stopAllActions();
        this.bkg_mid.stopAllActions();
       // this.bkg_Top.runAction(cc.spawn(cc.moveTo(0.5, cc.v2(0, cc.winSize.height / 2)), cc.fadeTo(0.5, 255)));
       this.bkg_Top.runAction(cc.spawn(cc.moveTo(0.5, cc.v2(0, this.bkg_mid.height/2+this.bkg_Top.height/1.2)), cc.fadeTo(0.5, 255)));
        // this.bkg_Bottom.runAction(cc.spawn(cc.moveTo(0.5, cc.v2(0, -cc.winSize.height / 2)), cc.fadeTo(0.5, 255)));
        this.bkg_Bottom.runAction(cc.spawn(cc.moveTo(0.5, cc.v2(0, -this.bkg_mid.height/2-this.bkg_Bottom.height/1.5)), cc.fadeTo(0.5, 255)));
        this.bkg_mid.runAction(cc.sequence(cc.fadeTo(0.5, 255), cc.callFunc(() => {
            this.canSpin = true;
        })));
        this.daily = cc.instantiate(this.dailyBonusPr).getComponent("DailyBonus");
        this.daily.init();
    },
    handleCTable(data) {
        //var data = JSON.parse(data.data);
        this.scheduleOnce(() => {
            this.initItemSlot(data.views);
        }, 0.5);
        //  this.initItemSlot(data.views);
        this.payLine = data.payLine;
        this.lb_numLine1.string = this.payLine.length;
        this.lb_numLine2.string = this.payLine.length;
        this.listMarkBet = [];
        this.isFreeSpin = data.freeSpinCount !== 0 ? true : false;
        this.freeSpinLeft = data.freeSpinCount;
        this.setStateSpinBtn();
        this.lb_ChipWinRound.string = "0";
        this.agPlayer = data.level.agUser;
        for (let i = 0; i < data.MarkBet.length; i++) {
            if (data.MarkBet[i] * 20 <= this.agPlayer)
                this.listMarkBet.push(data.MarkBet[i]);
        }
        this.getCurMarkBet(data.singleLineBet);
        this.lb_markBet.string = this.curMarkBet === 0 ? "0" : this.formatNumber(this.curMarkBet * 20);
        this.lb_Chip.string = this.formatNumber(this.agPlayer);
        this.playerVip = data.ArrP[0].VIP;
        //  this.updateVip();


    },
    getCurMarkBet(singleLine) {
        for (let i = 0; i < this.listMarkBet.length; i++) {
            if (singleLine === 0) {
                let markBet = this.listMarkBet[i];
                if (markBet * 20 <= this.agPlayer / 20) {
                    this.curMarkBet = markBet;
                    this.markIndex = i;
                    if (i === this.listMarkBet.length - 1)
                        this.lb_TypeMark.string = "Max Bet";
                } else if (this.listMarkBet[0] * 20 > this.agPlayer / 20) {
                    this.curMarkBet = this.listMarkBet[0];
                    this.markIndex = 0;
                }
            } else {
                if (this.listMarkBet.includes(singleLine)) {
                    this.curMarkBet = singleLine;
                    this.markIndex = this.listMarkBet.indexOf(singleLine);
                }
            }
        }
        if (this.listMarkBet.length < 1 || this.listMarkBet[0] * 20 > this.agPlayer) {
            this.markIndex = -1;
            this.curMarkBet = 0;
        }

    },
    initItemSlot(dataView) {
        let delta = 0;
        this.listCollum = [];
        for (let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].node.destroy();
        }
        this.listItem = [];
        for (let i = 0; i < 15; i++) {
            let item1 = cc.instantiate(this.itemSlotPr).getComponent("ItemSlotJapan");
            let item2 = cc.instantiate(this.itemSlotPr).getComponent("ItemSlotJapan");
            let item3 = cc.instantiate(this.itemSlotPr).getComponent("ItemSlotJapan");
            this.listAllItem.push(item1, item2, item3);
            this.initHeightItem = item1.node.height;
            item1.node.position = cc.v2(this.listPosItem[delta].x, this.initPosItem.y);
            this.parentItemNode.addChild(item1.node);
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
            item2.typeItem = 2;
            item2.numCol = delta;
            item2.setSpriteListItem(dataView[delta]);
            this.resetPosY2 = item2.node.position.y;

            item3.node.position = cc.v2(item1.node.x, item2.node.position.y + item2.node.height);
            this.parentItemNode.addChild(item3.node);
            item3.typeItem = 3;
            item3.numCol = delta;
            item3.setSpriteListItem(dataView[delta]);
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
        for (let i = 0; i < 5; i++) {
            let itemAnim = cc.instantiate(this.itemAnim).getComponent("ItemAnimation");
            this.node.addChild(itemAnim.node, ZINDEX_ITEMANIM);
            itemAnim.node.active = false;
            this.listItemAnim.push(itemAnim);
        }
        this.firstAnim = cc.instantiate(this.itemAnim).getComponent("ItemAnimation");
        this.firstAnim.node.getChildByName("animMask").active = false;

        this.node.addChild(this.firstAnim.node, ZINDEX_ITEMANIM);
        this.firstAnim.node.active = false;
        this.firstAnim.animation.skeletonData = null;

    },
    onClickSpin(event, data) {
        if (!this.canSpin && !this.isAutoSpin) return;
        if (data == 1)
            if (this.clickSpinCount > 1 || this.agPlayer < this.listMarkBet[0] * 20) return;
        if (!this.isStop && this.isFreeSpin) {
            return;
        }
        if (this.clickSpinCount > 0) {
            this.isAutoSpin = false;
            this.setStateSpinBtn();
            if (this.isStop)
                this.resetForNextSpin();
            return;
        }
        if (this.listMarkBet.length === 0) {
            this.lb_info.string = "You Do Not Have Enough Chips.";
            return;
        }
        this.playSoundEff("clickspin");
        if (!this.isFreeSpin) {
            this.agPlayer -= this.curMarkBet * 20;
            this.lb_Chip.string = this.agPlayer >= 0 ? this.formatNumber(this.agPlayer) : 0;
        }
        else {
            if (this.listAnimBkgFree.length === 0)
                this.showAnimBkgFreeSpin();
            else {
                this.lbFreeAnim.string = this.finishData.freeSpinLeft - 1 + " Free Spin Left";
            }
        }
        this.clickSpinCount++;
        //this.stateGame=STATE_GAME.PLAYING;
        //  require('NetworkManager').getInstance().sendSpinSlot(this.curMarkBet, this.isFreeSpin); //slot off
        // require('DataForGameSlotMaChine').getInstance().slotView(this.curMarkBet * 20);
        Global.GameView.slotView(this.curMarkBet * 20);
        this.isStop = false;
        this.setStateSpinBtn();
        this.blackMask.active = false;
        for (let i = 0; i < this.listCheckStopCol.length; i++) {
            this.listCheckStopCol[i] = false;
        }
        // this.lb_info.node.active = true; //slot off
        //  this.lb_info.string = "Playing 20 lines. Good luck!";
        let acSpin = cc.callFunc(() => {
            this.playSoundEff("wheelspin");
            for (let i = 0; i < this.listCollum.length; i++) {
                let collum = this.listCollum[i];
                for (let j = 0; j < collum.length; j++) {
                    let item = collum[j].getComponent("ItemSlotJapan");
                    let posUp = cc.v2(item.node.position.x, item.node.position.y + 60); // move len 1 doan.xong moi chay.hihi
                    let posDown = cc.v2(item.node.position.x, item.node.position.y - this.initHeightItem);
                    let acRunUp = cc.moveTo(0.15, posUp).easing(cc.easeSineOut());
                    let acRunDown = cc.moveTo(this.speedSpin, posDown);
                    let acSetBlur = cc.callFunc(() => {
                        item.setSpriteListItem(item.listIdView, true);
                    });

                    let acRun = cc.sequence(acRunUp, cc.spawn(acSetBlur, acRunDown));
                    let acCheck = cc.callFunc(() => {
                        item.typeItem--;
                        if (!this.listCheckStopCol[i] && item.numCol === i) { //running
                            if (item.typeItem < 0) { //reset item position
                                item.node.position = cc.v2(item.node.position.x, this.resetPosY2);
                                item.typeItem = 2;
                                // if (this.isCheckScatterItem3 && item.numCol > 2)
                                //     item.setRandomId(false);
                            }
                            let speed = this.speedSpin;
                            if (i === 4 && !this.isAutoSpin && this.isCheckScatterItem3)
                                speed = SPEED_NORMAL;
                            let acRun = cc.moveTo(speed, cc.v2(item.node.position.x, item.node.position.y - this.initHeightItem));
                            item.node.runAction(cc.sequence(acRun, acCheck));
                            if (item.typeItem < 0)
                                item.setRandomId(false);
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
                            let speed = this.isAutoSpin ? 0.1 : 0.15;
                            if (i === 2 && this.isCheckScatterItem3) {
                                this.speedSpin = SPEED_AUTO;
                                let posX = this.bkg_mid.width / 7;
                                timedel = 2;
                                // cc.loader.loadRes(ResDefine.slot_speedspin_9008, sp.SkeletonData, (err, aniClip) => {
                                //     if (err) {
                                //         return;
                                //     }
                                //     let skeData = aniClip;
                                //     let data = {
                                //         dir: ResDefine.slot_speedspin_9008,
                                //         skeData: skeData
                                //     }
                                //     this.skeData.push(data);
                                //     this.setInfoAnim(this.firstAnim, skeData, cc.v2(this.posAnimSpeedX, 20), cc.v2(0.9, 0.85));
                                //     this.firstAnim.node.parent = this.bkg_mid;
                                //     this.firstAnim.node.zIndex = this.parentItemNode.zIndex + 1;
                                //     this.firstAnim.playAnimation2("animation", true);
                                // });
                            }
                            let deltaX = this.isAutoSpin ? 30 : 50;
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
                            if (this.isAutoSpin && this.isCheckScatterItem3) acRunUp = acRunUp3;
                            else if (this.isAutoSpin) acRunUp = acRunUp2;
                            let acSetBlur = cc.callFunc(() => {
                                item.setSpriteListItem(item.listIdView, false);
                            });
                            item.node.runAction(cc.sequence(cc.spawn(acRunDown, acSetBlur),
                                cc.spawn(acRunUp, cc.callFunc(() => {
                                    setTimeout(() => {
                                        if (this.node != null)
                                            if (item.numCol === 4)
                                                require('SoundManager1').instance.stopWheel();
                                    }, 200);
                                    this.playSoundEff("stopspin");
                                    this.canSpin = false;
                                })),
                                cc.delayTime(timedel), cc.callFunc(() => {
                                    if (i === 4 && item.typeItem === 2) {
                                        for (let i = 0; i < this.winningLine.length; i++) {
                                            this.initLineWin(this.winningLine[i].lineWin, this.winningLine[i].color);
                                        }
                                        require('SoundManager1').instance.stopWheel();
                                        this.getOriginItem();
                                        this.checkWildWinInLine();
                                        this.acShowWinLine();
                                        //this.stateGame=STATE_GAME.WAITING;
                                    }
                                    item.typeItem--;
                                    if (i === 3 && this.isCheckScatterItem3) {
                                        this.firstAnim.node.active = false;
                                        this.firstAnim.animation.skeletonData = null;
                                    }
                                    if (!this.isAutoSpin)
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
        // //this.stateGame = STATE_GAME.PLAYING;

    },
    setStateSpinBtn(forceState = null) {
        let state;
        if (this.isStop) {
            if (this.isFreeSpin)
                state = "freespinOn";
            else state = "spinOn";
        }
        else {
            state = this.isAutoSpin ? "autoSpin" : "spinOff";
            state = this.isFreeSpin ? "freespinOff" : state;
        }
        if (forceState !== null) state = forceState;
        switch (state) {
            case "spinOn":
                this.animBtnSpin.playAnimation2("spin", true);
                break;
            case "spinOff":
                this.animBtnSpin.node.active = false;
                this.btn_Spin.getComponent(cc.Sprite).spriteFrame = this.listSprBtn[SPRITE_SPIN];
                break;
            case "freespinOn":
                this.animBtnSpin.node.active = true;
                this.animBtnSpin.playAnimation2("freespin", true);
                this.btn_Spin.interactable = true;
                break;
            case "freespinOff":
                this.animBtnSpin.node.active = false;
                this.btn_Spin.getComponent(cc.Sprite).spriteFrame = this.listSprBtn[SPRITE_FREESPIN];
                break;
            case "autoSpin":
                this.animBtnSpin.node.active = false;
                this.btn_Spin.getComponent(cc.Sprite).spriteFrame = this.listSprBtn[SPRITE_STOP];
                break;
        }
    },
    onClickAutoSpin() {
        cc.NGWlog("SlotINCA:on click auto spin");
        this.isAutoSpin = !this.isAutoSpin;
        this.setStateSpinBtn();
        if (this.isStop) {
            this.speedSpin = SPEED_AUTO;
            this.onClickSpin();
        }
        // this.resetForNextSpin();
    },
    handleSpin(data) {

        // data = {
        //     slotViews: [[11, 6, 7], [1, 12, 9], [10, 12, 4], [10, 6, 7], [11, 11, 5]],
        //     creditWin: 2,
        //     lineDetail: [{ lineId: 0, win: 12345 }],
        //     freeSpinLeft: 0,
        //     winType: 0,
        //     freeSpin: false,
        //     agWin: 12345,
        //     AG: 1212480,
        //     level: { levelUser: 2, curLevelExp: 14, maxLevelExp: 19, agUser: 20872 },
        //     MarkBet: [5, 50, 500, 5000, 25000, 50000, 250000, 500000, 2500000, 5000000]
        // }
        //    this.spinCountCheck++;
        //    this.onClickFake(this.spinCountCheck);
        //    if (this.fakeData !== null) data = this.fakeData;
        //test
        this.finishData = data;
        this.finishView = data.slotViews;
        this.isCheckScatterItem3 = false;
        if (this.finishView[1].includes(12) && this.finishView[2].includes(12))
            this.isCheckScatterItem3 = true;
        this.getLineWin(data.lineDetail);
        setTimeout(() => {
            if (this.node)
                this.onStopSpin();
        }, 500);
        if (data.freeSpin) {
            this.totalAgFSP += data.agWin;
        }
        this.totalWin = data.agWin !== 0 ? data.agWin : this.totalWin;
        //   this.totalWin= data.freeSpin ?
        this.agPlayer = data.AG;
        this.winType = data.winType;
        this.freeSpinLeft = data.freeSpinLeft;
        this.isFreeSpin = data.freeSpinLeft !== 0 ? true : false;
        this.isCountAgFreeSpin = this.isFreeSpin;
        this.listMarkBet = [];
        for (let i = 0; i < data.MarkBet.length; i++) {
            if (data.MarkBet[i] * 20 <= this.agPlayer)
                this.listMarkBet.push(data.MarkBet[i]);
            if (this.agPlayer < data.MarkBet[0] * 20)
                this.listMarkBet.push(data.MarkBet[0]);
        }
        if (this.curMarkBet > this.listMarkBet.slice().pop()) {
            this.curMarkBet = this.listMarkBet[this.listMarkBet.length - 1];
            this.markIndex = this.listMarkBet.length - 1;
        }
        this.lb_markBet.string = this.formatNumber(this.curMarkBet * 20);
    },
    showAnimScatter() {
        this.playSoundEff("wildscatter");
        for (let i = 0; i < this.listScatter.length; i++) {
            let data = this.listScatter[i];
            let anim = this.getAnimFromPool(this.listAnimWS);
            cc.loader.loadRes(ResDefine.inca_12, sp.SkeletonData, (err, aniClip) => {
                if (err) {
                    return;
                }
                let skeData = aniClip;
                let data1 = {
                    dir: ResDefine.inca_12,
                    skeData: skeData
                }
                this.skeData.push(data1);
                this.setInfoAnim(anim, skeData, data.pos, 0.8);
                this.node.addChild(anim.node);
                anim.playAnimation2("animation", true);
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
    showAnimOneWinLine() {
        this.blackMaskBig.active = false;
        this.btn_Spin.interactable = !this.isAutoSpin;
        if (this.listWinLineNode.length === 0 || (this.isAutoSpin && this.listWinLineNode.length > 1)) {
            this.canSpin = true;
            this.setStateSpinBtn();
            this.firstAnim.node.active = false;
            this.firstAnim.animation.skeletonData = null;
            this.firstAnim.node.getChildByName("lb_Money").active = false;
            this.resetForNextSpin();
            return;
        }
        if (!this.isAutoSpin) {
            setTimeout(() => {
                if (this.node) {
                    this.canSpin = true;
                    this.setStateSpinBtn();
                }
            }, 300);
        }
        else this.canSpin = true;
        this.firstAnim.node.active = false;
        this.firstAnim.animation.skeletonData = null;
        this.firstAnim.node.getChildByName("lb_Money").active = false;
        if (this.clickSpinCount === 2) {
            return;
        }
        let len = this.listWinLineNode.length;
        let acCheckNextSpin = cc.callFunc(() => {
            if (this.isAutoSpin || (this.finishData.freeSpin && this.finishData.freeSpinLeft !== 0)) {
                this.resetForNextSpin();
                return;
            }
        });
        for (let i = 0; i < len; i++) {
            this.node.runAction(cc.sequence(cc.delayTime(i * 1.5),
                cc.callFunc(() => {
                    for (let i = 0; i < this.listWinLineNode.length; i++) {
                        this.listWinLineNode[i].node.active = false;
                    }
                    this.playSoundEff("showline");
                    // this.turnOffAnim();
                    // this.turnOffMiniResult();
                    for (let i = 0; i < this.listLineRect.length; i++) {
                        this.listLineRect[i].active = false;
                    }
                    let lineWin = this.winningLine[i].lineWin;
                    this.listPosRect = [];
                    let listIdAnim = [];
                    setTimeout(() => {
                        if (this.node && this.listWinLineNode.length > 0) {
                            this.listWinLineNode[i].node.active = true;
                        }
                    }, 50);
                    let listPos = [];
                    for (let j = 0; j < lineWin.length; j++) { //[1,2,1,2,1,];
                        let item = this.listOriginItem[j].getComponent("ItemSlotJapan");
                        let indexItemSon = lineWin[j]
                        let pos = item.getWordPosItem(item.listItem[indexItemSon]);
                        listPos.push(pos);
                        let idAnim = item.listIdView[indexItemSon];
                        listIdAnim.push(idAnim);
                    }
                    this.idMini = -1;
                    //   this.showListAnim(listPos, listIdAnim, this.winningLine[i].color, this.winningLine[i].pays);
                }), cc.delayTime(1.3), acCheckNextSpin));
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
                this.node.runAction(cc.sequence(cc.delayTime(SPEED_NORMAL * i), cc.callFunc(() => {
                    this.listWinLineNode[i].node.active = true;
                })));
            }
        }
        this.turnOffAnim();
        this.turnOffMiniResult();
        this.isStop = true;
        // //this.stateGame = STATE_GAME.WAITING;     
        // if(cc.sys.localStorage.getItem("isBack") == 'true' && !this.isAutoSpin && !this.isFreeSpin) {
        //     require('NetworkManager').getInstance().sendExitGame();
        // }
    },
    showAnim5OfAkind() {
        this.blackMaskBig.active = true;
        this.firstAnim.node.active = true;
        this.firstAnim.animation.skeletonData = null;
        cc.loader.loadRes(ResDefine.slot_fiveOfaKind_9008, sp.SkeletonData, (err, aniClip) => {
            if (err) {
                return;
            }
            let skeData = aniClip;
            let data = {
                dir: ResDefine.slot_fiveOfaKind_9008,
                skeData: skeData
            }
            this.skeData.push(data);
            let animName = "animation";
            this.setInfoAnim(this.firstAnim, skeData, cc.v2(0, 0), cc.v2(1, 1));
            this.firstAnim.node.parent = this.node;
            this.firstAnim.playAnimation2(animName, true);
        });

    },
    showAnimFreeSpin() {
        this.playSoundEff("freespin");
        this.blackMaskBig.active = true;
        this.turnOffAnim();
        this.firstAnim.node.active = false;
        this.firstAnim.animation.skeletonData = null;
        cc.loader.loadRes(ResDefine.slot_freespinAnim_9008, sp.SkeletonData, (err, aniClip) => {
            if (err) {
                return;
            }
            let skeData = aniClip;
            let data = {
                dir: ResDefine.slot_freespinAnim_9008,
                skeData: skeData
            }
            this.skeData.push(data);
            let animName = "animation";
            this.setInfoAnim(this.firstAnim, skeData, cc.v2(0, 0), cc.v2(1, 1));
            this.firstAnim.node.parent = this.node;
            this.firstAnim.playAnimation2(animName, true);
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
        for (let i = 0; i < listLineCheckWild.length; i++) {
            let data = listLineCheckWild[i];
            let countWildCheck = this.checkIndexToShowAnim(data.lineWinId);
            for (let j = 0; j <= countWildCheck; j++) {
                let item = this.listOriginItem[j].getComponent("ItemSlotJapan");
                if (data.lineWinId[j] === 11) {
                    let pos = item.getWordPosItem(item.listItem[data.lineWin[j]]);
                    let anim = this.getAnimFromPool(this.listAnimWS);
                    cc.loader.loadRes(ResDefine.inca_11, sp.SkeletonData, (err, aniClip) => {
                        if (err) {
                            return;
                        }
                        let skeData = aniClip;
                        let data1 = {
                            dir: ResDefine.inca_11,
                            skeData: skeData
                        }
                        this.skeData.push(data1);
                        this.setInfoAnim(anim, skeData, pos, 0.8, false);
                        this.node.addChild(anim.node, ZINDEX_ITEMANIM);
                        anim.playAnimation2("animation", true);
                    });
                }
            }
        }
    },
    showAnimBigWin() {
        this.playSoundEff("bigwin");
        this.blackMaskBig.active = true;
        this.firstAnim.node.active = false;
        this.firstAnim.animation.skeletonData = null;
        cc.loader.loadRes(ResDefine.slot_MegaBigWin_9008, sp.SkeletonData, (err, aniClip) => {
            if (err) {
                return;
            }
            let skeData = aniClip;
            let data = {
                dir: ResDefine.slot_MegaBigWin_9008,
                skeData: skeData
            }
            this.skeData.push(data);
            let animName = "bigwin";
            this.setInfoAnim(this.firstAnim, skeData, cc.v2(0, 0), cc.v2(1, 1));
            this.firstAnim.node.parent = this.node;
            this.firstAnim.playAnimation2(animName, true);
            let lbMoney = this.firstAnim.node.getChildByName("lb_Money");
            lbMoney.active = true;
            lbMoney.opacity = 255;
            lbMoney.scale = 0.8;
            this.lb_Money = lbMoney.getComponent(cc.Label);
            this.lb_Money.node.position = cc.v2(0, -60);
            let agWin = this.finishData.freeSpin ? this.totalAgFSP : this.finishData.agWin;
            this.createEffNumRun(lbMoney.getComponent(cc.Label), 0, agWin, this.timeShowBigMega - 1);
            lbMoney.runAction(cc.sequence(cc.scaleTo(this.timeShowBigMega - 1, 1.2), cc.scaleTo(0.5, 1.0).easing(cc.easeBackOut()), cc.delayTime(0.1), cc.scaleTo(0.1, 0)));
        });

    },
    showAnimHugeWin() {
        cc.NGWlog("INCA:showAnimHugeWin===============");
        this.playSoundEff("megawin");
        this.blackMaskBig.active = true;
        let animName = "megawin";
        this.firstAnim.playAnimation2(animName, true);
    },
    showAnimBkgFreeSpin() {
        let animIndex = this.bkg_mid.getChildByName("bg_spin").zIndex - 1;
        let animBkg = this.getAnimFromPool(this.listAnimBkgFree);
        cc.loader.loadRes(ResDefine.slot_khungFree_9008, sp.SkeletonData, (err, aniClip) => {
            if (err) {
                return;
            }
            let skeData = aniClip;
            let data = {
                dir: ResDefine.slot_khungFree_9008,
                skeData: skeData
            }
            this.skeData.push(data);
            this.setInfoAnim(animBkg, skeData, cc.v2(0, 0), cc.v2(1 * (cc.winSize.width / 1280), 0.75));
            this.bkg_mid.addChild(animBkg.node, animIndex);
            animBkg.playAnimation2("animation", true);
        });
        let animVien = this.getAnimFromPool(this.listAnimBkgFree);
        cc.loader.loadRes(ResDefine.slot_vienFree_9008, sp.SkeletonData, (err, aniClip) => {
            if (err) {
                return;
            }
            let skeData = aniClip;
            let data = {
                dir: ResDefine.slot_vienFree_9008,
                skeData: skeData
            }
            this.skeData.push(data);
            this.setInfoAnim(animVien, skeData, cc.v2(0, 0), cc.v2(0.97, 0.97));
            this.bkg_mid.addChild(animVien.node, animIndex);
            animVien.playAnimation2("animation", true);
            this.showAnimFreeNum();
        });

    },
    showAnimFreeNum() {
        let animIndex = this.parentItemNode.zIndex + 1;
        let animFreeNum = this.getAnimFromPool(this.listAnimBkgFree);
        cc.loader.loadRes(ResDefine.slot_freenum_9008, sp.SkeletonData, (err, aniClip) => {
            if (err) {
                return;
            }
            let skeData = aniClip;
            let data = {
                dir: ResDefine.slot_freenum_9008,
                skeData: skeData
            }
            this.skeData.push(data);
            this.setInfoAnim(animFreeNum, skeData, cc.v2(0, 254), cc.v2(0.9, 1), false, true);
            this.lbFreeAnim = animFreeNum.node.getChildByName("lb_Money").getComponent(cc.Label);
            this.lbFreeAnim.node.position = cc.v2(0, 10);
            this.lbFreeAnim.string = this.freeSpinLeft - 1 + " Free Spin Left";
            this.lbFreeAnim.fontSize = 65;
            this.lbFreeAnim.lineHeight = 90;
            this.node.addChild(animFreeNum.node, animIndex);
            animFreeNum.playAnimation2("animation", true);
        });
    },
    onStopSpin() {
        this.listOriginItem = [];
        this.listCheckStopCol[0] = true;
        let timedel = this.isCheckScatterItem3 ? this.timeRunSpin + 2000 : this.timeRunSpin;
        // if (this.isAutoSpin) timedel = this.isCheckScatterItem3 ? 3800 : 1800;
        // setTimeout(() => {
        //    if (this.node) {
        //this.getOriginItem();
        // for (let i = 0; i < this.winningLine.length; i++) {
        //     this.initLineWin(this.winningLine[i].lineWin, this.winningLine[i].color);
        // }
        // this.checkWildWinInLine();
        //this.acShowWinLine();
        //   }
        //  }, timedel);
    },
    getOriginItem() {
        this.listScatter = [];
        for (let i = 0; i < this.listItem.length; i++) {
            let item = this.listItem[i];
            if (item.node.position.y > this.initPosItem.y - 100 && item.node.position.y < this.initPosItem.y + 10) {
                // this.listOriginItem.push(item.node);
                //item.getScatterItem();
            }
            // else item.setRandomId(false);
        }
        this.isHave2Scatter = this.scatterCount > 1 ? true : false;
    },
    initLineWin(lineWin, color) {
        let lineWinPos = [];
        for (let i = 0; i < lineWin.length; i++) {
            let item = this.listOriginItem[i].getComponent("ItemSlotJapan");
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
        cc.log("SLOTINCa: ACSHOW WIN LINE");
        if (!this.isFreeSpin) {
            if (this.totalAgFSP >= 20 * this.curMarkBet * 20)
                this.isShowBigWin = true;
            if (this.totalAgFSP >= 50 * this.curMarkBet * 20)
                this.isShowHugeWin = true;
            if (this.finishData.freeSpin) {
                for (let i = 0; i < this.listAnimBkgFree.length; i++) {
                    // this.putAnimBackPool(this.listAnimBkgFree[i].node);
                    this.listAnimBkgFree[i].node.destroy();
                }
                this.listAnimBkgFree = [];
            }
        }
        if (!this.isFreeSpin && this.finishData.freeSpin) {
            this.totalWin = this.totalAgFSP;
        }
        if (!this.finishData.freeSpin)
            this.lb_ChipWinRound.string = this.formatNumber(this.totalWin);
        else this.lb_ChipWinRound.string = this.formatNumber(this.totalAgFSP);
        if (this.finishData.agWin !== 0 && !this.finishData.freeSpin)
            this.lb_titleWin.string = "Win";
        if (this.finishData.freeSpin)
            this.lb_titleWin.string = "Total Win";
        let timeShowBigWin = 0;
        let timeShowMegaWin = 0;
        let timeShowOneLine = 1.5 * this.listWinLineNode.length;
        let timeShowScatter = 0;
        let timeShowFiveOfaKind = 0;
        let timeShowWildWin = 0;
        let timeShowAllLine = 0;

        if (this.listWinLineNode.length > 1)
            timeShowAllLine = this.listWinLineNode.length * SPEED_NORMAL + 0.7;
        // if (timeShowAllLine < 1.0 && timeShowAllLine > 0) timeShowAllLine = 1.0;
        if (this.isHaveFiveOfaKind)
            timeShowFiveOfaKind = 2;
        if (this.isWildWinInLine || this.isHave2Scatter)
            timeShowWildWin = 1.3;
        let listCheck = [100, 101, 102];
        if (listCheck.includes(this.winType))
            timeShowScatter = 2.0;
        listCheck = [1, 101, 102];
        if ((listCheck.includes(this.winType) && !this.finishData.freeSpin) || this.isShowBigWin)
            timeShowBigWin = 3.0;
        listCheck = [2, 102];
        if ((listCheck.includes(this.winType) && !this.finishData.freeSpin) || this.isShowHugeWin) {
            timeShowBigWin = 2.7;
            timeShowMegaWin = 3.0;
        }
        this.timeShowBigMega = timeShowBigWin + timeShowMegaWin;
        let acShowAllWinLine = cc.callFunc(() => {
            this.showAllWinLine();
        });
        let acShowOneWinLine = cc.callFunc(() => {
            this.node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(() => { this.showAnimOneWinLine(); }), /*cc.delayTime(timeDel), acCheck,*/ cc.delayTime(timeShowOneLine))));
        });
        let acShowAnimScatter = cc.callFunc(() => {
            if (this.isHave2Scatter)
                this.showAnimScatter();
        });
        let acShowAnimFiveOfaKind = cc.callFunc(() => {
            if (this.isHaveFiveOfaKind) {
                this.showAnim5OfAkind();
            }
        });
        let acShowAnimFreeSpin = cc.callFunc(() => {
            let listCheck = [100, 101, 102];
            if (listCheck.includes(this.winType)) {
                this.showAnimFreeSpin();
            }
        });
        let acShowWildWinInLine = cc.callFunc(() => {
            if (this.isWildWinInLine)
                this.showAnimAllWild();
        });
        let acShowAnimBigWin = cc.callFunc(() => {
            let typeWin = [1, 2, 101, 102];
            if ((typeWin.includes(this.winType) && !this.finishData.freeSpin) || this.isShowBigWin)
                this.showAnimBigWin();
        });
        let acShowAnimMegaWin = cc.callFunc(() => {
            let typeWin = [2, 102];
            if ((typeWin.includes(this.winType) && !this.finishData.freeSpin) || this.isShowHugeWin) {
                this.showAnimHugeWin();
            }
        });
        // let acShow = cc.sequence(acShowAnimScatter,
        //     acShowWildWinInLine, cc.delayTime(timeShowWildWin),
        //     acShowAllWinLine, cc.delayTime(timeShowAllLine),
        //     acShowAnimFreeSpin, cc.delayTime(timeShowScatter),
        //     acShowAnimFiveOfaKind, cc.delayTime(timeShowFiveOfaKind),
        //     acShowAnimBigWin, cc.delayTime(timeShowBigWin),
        //     acShowAnimMegaWin, cc.delayTime(timeShowMegaWin),
        //     acShowOneWinLine);
        let acShow = cc.sequence(acShowAllWinLine, cc.delayTime(timeShowAllLine),
            acShowOneWinLine);
        this.node.runAction(acShow);
        this.lb_info.node.active = false;
    },
    drawLine(listLineWinPos, color) {
        let line = this.createLine(color);
        line.moveTo(listLineWinPos[0].x - 180 / 2, listLineWinPos[0].y);
        line.lineTo(listLineWinPos[0].x, listLineWinPos[0].y);
        let len = listLineWinPos.length;
        for (let i = 1; i < len; i++) {
            line.lineJoin = cc.Graphics.LineJoin.ROUND;
            line.lineTo(listLineWinPos[i].x, listLineWinPos[i].y);
        }
        line.lineTo(listLineWinPos[len - 1].x + 180 / 2, listLineWinPos[len - 1].y);
        line.stroke();
        line.node.active = false;
        this.listWinLineNode.push(line);
    },
    createLine(color, isRect, lineWidth = 5) {
        let lineWin = new cc.Node();
        let line = lineWin.addComponent(cc.Graphics);
        // line.miterLimit = 10;
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
            this.showItemAnim(i, listPos[i], listId[i], agWin);
            let posMove = cc.v2(0, 0);
            let posRect = listPos[i];
            let index = i === 0 ? 0 : 1;
            this.drawRect(posRect, color, index);
        }

    },
    checkIndexToShowAnim(listId) {
        let count = 0;
        let idCheck = listId[0];
        for (let i = 1; i < listId.length; i++) {
            if (idCheck !== 11) {
                if (listId[i] === idCheck || listId[i] === 11)
                    count++
                else break;
            } else {
                idCheck = listId[i];
                count++
            }
        }
        return count;
    },
    showItemAnim(index, pos, id, agWin, isTurnOnMask = true) {
        this.setItemMiniResult(id, index, agWin);
        let itemAnim = this.listItemAnim[index];
        // let idAnim = id;
        let animName;
        let scale = 1.0;
        let resPath = "";
        if (id < 4) {
            //  idAnim = IDANIM_JQKA;
            resPath = ResDefine.inca_0_3;
            scale = 0.9;
            switch (id) {
                case 0:
                    animName = "K";
                    break;
                case 1:
                    animName = "Q";
                    break;
                case 2:
                    animName = "J";
                    break;
                case 3:
                    animName = "A";
                    break;
            }
        }
        else if (id > 3 && id < 8) {
            //   idAnim = IDANIM_ZOCOBICHTEP;
            resPath = ResDefine.inca_4_7;
            switch (id) {
                case 4:
                    animName = "bich";
                    break;
                case 5:
                    animName = "co";
                    break;
                case 6:
                    animName = "zo";
                    break;
                case 7:
                    animName = "tep";
                    break;
            }
        }
        else {
            animName = "animation";
            switch (id) {
                case 8:
                    //idAnim = IDANIM_ITEM8;
                    resPath = ResDefine.inca_8;
                    scale = 0.9;
                    break;
                case 9:
                    scale = 0.9;
                    // idAnim = IDANIM_ITEM9;
                    resPath = ResDefine.inca_9;
                    break;
                case 10:
                    //idAnim = IDANIM_ITEM10;
                    resPath = ResDefine.inca_10;
                    scale = 0.9;
                    break;
                case 11:
                    // idAnim = IDANIM_WILD;
                    resPath = ResDefine.inca_11;
                    scale = 0.8;
                    break;
                case 12:
                    // idAnim = IDANIM_SCATTER;
                    resPath = ResDefine.inca_12;
                    scale = 0.8;
                    break;
            }
        }
        let skeData;
        cc.loader.loadRes(resPath, sp.SkeletonData, (err, aniClip) => {
            if (err) {
                return;
            }
            skeData = aniClip;
            let data = {
                dir: resPath,
                skeData: skeData
            }
            this.skeData.push(data);
            itemAnim.initAnimation(skeData);
            itemAnim.node.position = pos;
            itemAnim.node.active = true;
            itemAnim.animation.node.scale = scale;
            let sprMask = itemAnim.node.getChildByName("animMask");
            sprMask.active = isTurnOnMask;
            sprMask.getComponent(cc.Sprite).spriteFrame = this.animMask;
            sprMask.setContentSize(cc.size(186, 148));
            itemAnim.playAnimation2(animName, true);
        });

    },
    setItemMiniResult(id, index, agWin) {
        return;
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
        this.lb_Result.string = "Pays " + this.formatMoney(agWin) + " Chips";
        //this.itemMiniResult.active = true;
    },
    turnOffMiniResult() {
        for (let i = 0; i < this.listItemMiniResult.length; i++) {
            this.listItemMiniResult[i].node.active = false;
        }
    },
    turnOffAnim() {
        for (let i = 0; i < this.listAnimWS.length; i++) {
            this.listAnimWS[i].node.destroy();
        }
        this.listAnimWS = [];
        for (let i = 0; i < this.listItemAnim.length; i++) {
            this.listItemAnim[i].node.active = false;
            this.listItemAnim[i].animation.skeletonData = null;
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
        let listCheck = [];
        this.isWildWinInLine = false;
        for (let i = 0; i < this.winningLine.length; i++) {
            let lineWin = this.winningLine[i].lineWin;
            for (let j = 0; j < lineWin.length; j++) {
                listCheck.push(this.finishView[j][lineWin[j]]);
            }
        }
        this.countWild = this.checkIndexToShowAnim(listCheck);
        for (let i = 0; i <= this.countWild; i++) {
            if (listCheck[i] === 11)
                this.isWildWinInLine = true;
        }
    },
    checkScatterItem() {

    },
    drawRect(posRect, color) {
        let lineRect = this.createLine(color, true, 4);
        let posRect1 = cc.v2(posRect.x - 182 / 2, posRect.y - 146 / 2);
        lineRect.moveTo(posRect1);
        lineRect.rect(posRect1.x, posRect1.y, 180, 146);
        this.listLineRect.push(lineRect.node);
        lineRect.stroke();
    },
    resetForNextSpin() {
        cc.NGWlog("SlotJP:reset for nexxt spin");
        require('SoundManager1').instance.dynamicallyStopMusic();
        this.node.stopAllActions();
        this.canSpin = true;
        this.blackMask.active = false;
        for (let i = 0; i < this.listWinLineNode.length; i++) {
            this.listWinLineNode[i].destroy();
        }
        this.turnOffAnim();
        for (let i = 0; i < this.listLineRect.length; i++) {
            this.listLineRect[i].destroy();
        }
        this.listLineRect = [];
        this.listWinLineNode = [];
        this.winningLine = [];
        this.clickSpinCount = 0;
        this.scatterCount = 0;
        this.isShowBigWin = false;
        this.isShowHugeWin = false;
        this.blackMaskBig.active = false;
        this.lb_titleWin.string = this.isFreeSpin ? "Total Win" : "Last Win";
        if (!this.isFreeSpin) this.totalAgFSP = 0;
        if (this.finishData.freeSpin || this.isAutoSpin) this.speedSpin = SPEED_AUTO;
        else this.speedSpin = SPEED_NORMAL;
        this.setStateSpinBtn();
        if (this.agPlayer < this.listMarkBet[0] * 20)
            this.btn_Spin.interactable = false;
        // this.itemMiniResult.active = false; //slot off
        this.firstDelay = 2;
        // this.lb_info.node.active = true; //slot off
        if (this.agPlayer >= this.listMarkBet[0] * 20) {
            this.parentItemNode.getComponent(cc.Button).interactable = true;
            this.lb_info.string = this.isAutoSpin ? "Playing 20 lines. Good luck!" : "Press Spin To Play";
        }
        else {
            this.parentItemNode.getComponent(cc.Button).interactable = false;
            this.btn_Spin.interactable = false;
            this.btn_Spin.interactable = false;
            this.lb_info.string = "You Do Not Have Enough Chips.";
        }
        if (this.isAutoSpin || this.finishData.freeSpinLeft > 0)
            this.onClickSpin();
        this.releaseAtsset();
    },
    onClickPlusMarkBet() {
        require('SoundManager1').instance.playButton();
        if (!this.isStop || this.isFreeSpin || this.markIndex < 0 || this.isAutoSpin) return;
        if (this.markIndex < this.listMarkBet.length - 1) {
            this.markIndex++;
            if (this.markIndex === this.listMarkBet.length - 1)
                this.lb_TypeMark.string = "Max Bet";
        }
        else {
            this.markIndex = 0;
            this.lb_TypeMark.string = "Bet";
        }
        this.curMarkBet = this.listMarkBet[this.markIndex];
        this.lb_markBet.string = this.formatMoney(this.curMarkBet * 20);
    },
    onClickMinusMarkBet() {
        require('SoundManager1').instance.playButton();
        if (!this.isStop || this.isFreeSpin || this.markIndex < 0 || this.isAutoSpin) return;
        if (this.markIndex > 0) {
            this.markIndex--;
            this.lb_TypeMark.string = "Bet";
        }
        else {
            this.markIndex = this.listMarkBet.length - 1;
            this.lb_TypeMark.string = "Max Bet";
        }
        this.curMarkBet = this.listMarkBet[this.markIndex];
        this.lb_markBet.string = this.formatMoney(this.curMarkBet * 20);
    },
    onClickMaxBet() {
        if (this.agPlayer < this.listMarkBet[0] * 20) return;
        require('SoundManager1').instance.playButton();
        if (!this.isStop || this.isFreeSpin || this.markIndex < 0 || this.isAutoSpin) return;
        if (this.markIndex === this.listMarkBet.length - 1) {
            this.onClickSpin();
            return;
        }
        this.lb_TypeMark.string = "Max Bet";
        this.markIndex = this.listMarkBet.length - 1;
        this.curMarkBet = this.listMarkBet[this.markIndex];
        this.lb_markBet.string = this.formatNumber(this.curMarkBet * 20);
    },
    getRanNum(min_value, max_value) {
        let random_number = Math.random() * (max_value - min_value) + min_value;
        return Math.floor(random_number);
    },
    createEffNumRun(label, startNum, endNum, timeShow) {
        label.node.active = true;
        this.endNum = endNum;
        this.deltaNum = this.endNum - this.startNum;
        this.numPerSec = this.deltaNum / timeShow;
        this.curNum = startNum;
        this.isRunEffPlusMoney = true;
        this.effRunNumber(timeShow, label, this.curNum, this.endNum, this.numPerSec);
    },
    effRunNumber(timeShow, label, curNum, endNum, numPerSec) {
        let delta = numPerSec / 20;
        if (delta < 0) delta = 1;
        let acPlus = cc.callFunc(() => {
            curNum += delta;
            if (curNum >= endNum) {
                curNum = endNum;
            }
            label.string = this.formatNumber(Math.floor(curNum));
        });
        let acCheck = cc.callFunc(() => {
            if (curNum >= endNum)
                label.node.stopActionByTag(0);
        });
        let acLbRun = cc.repeat(cc.sequence(acPlus, cc.delayTime(0.05), acCheck), timeShow * 20);
        acLbRun.setTag(0);
        label.node.runAction(acLbRun);
    },
    updateVip() {
        // let vip = this.playerVip;
        // if (vip >= 10) {
        //     vip = 10;
        // }
        // let vip1 = Math.floor(vip / 2);
        // let vip2 = vip % 2;

        // for (let i = 0; i < this.listIconVip.length; i++) {
        //     if (i + 1 <= vip1) {
        //         this.listIconVip[i].spriteFrame = this.listSpriteFrameVip[2];
        //     } else if (vip2 != 0) {
        //         vip2 = 0;
        //         this.listIconVip[i].spriteFrame = this.listSpriteFrameVip[1];
        //     } else {
        //         this.listIconVip[i].spriteFrame = this.listSpriteFrameVip[0];
        //     }
        // }
    },

    updateMoney() {
        if (this.finishData.freeSpinLeft !== 0) return;
        this.lb_Chip.string = this.agPlayer >= 0 ? this.formatNumber(this.agPlayer) : 0;
        if (this.finishData.agWin !== 0) this.lb_titleWin.string = "Win";
        this.lb_ChipWinRound.string = this.formatNumber(this.totalWin);
    },

    onClickShop() {
        require('SoundManager1').instance.playButton();
        let shopview = cc.instantiate(this.shopPref).getComponent("ShopView");
        this.ShopView = shopview;
        this.node.addChild(shopview.node, ZINDEX_LINE + 1);
        return;
        //require('SoundManager1').instance.playButton();
        if (!this.isStop) return;
        //require('SoundManager1').instance.playButton();
        Global.ShopView.isShowMain = false;
        require("UIManager").instance.onShowShop();
    },
    cleanGame() {
        //require('SoundManager1').instance.stopWheel();
        if (this.nodeGroupMenu != null && this.nodeGroupMenu.node.getParent()) this.nodeGroupMenu.node.removeFromParent(false);

    },
    onClickRule() {
        this.bkg_rule.zIndex = ZINDEX_LINE + 1;
        this.bkg_rule.active = true;
       this.bkg_rule.getComponent("PopupEffect").onPopOn();
       
    },
    onCloseRule() {
        this.bkg_rule.getComponent("PopupEffect").onPopOff(false,true);
    },
    closeGame(){
        console.log("destroy slot game");
        require("SoundManager1").instance.stopWheel();
        Global.GameView.btnPlay.interactable=true;
        this.node.destroy();
    },
    getAnimFromPool(listManage) {
        // let anim;
        // cc.NGWlog("SlotINca anim pool size="+this.animPool.size());
        // if (this.animPool.size() < 1) {
        //     let item = cc.instantiate(this.itemAnim);
        //     this.animPool.put(item);
        // }
        let anim = cc.instantiate(this.itemAnim).getComponent("ItemAnimation");
        listManage.push(anim);
        return anim;
    },
    putAnimBackPool(animNode) {
        // cc.NGWlog("SlotINca:push anim bkg free back");
        // this.animPool.put(animNode);

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
    stopSoundEff() {
        let soundManager = require('SoundManager1').instance;
        soundManager.dynamicallyStopMusic();
    },
    onClickFake(data) {
        let fakeData;
        switch (parseInt(data)) {
            case 1:
                fakeData = {
                    slotViews: [[7, 9, 0], [9, 12, 6], [0, 12, 7], [12, 9, 9], [11, 9, 7]],
                    creditWin: 40,
                    lineDetail: [{ lineId: 0, win: 250 }, { lineId: 7, win: 100 }, { lineId: 9, win: 200 }, { lineId: 15, win: 100 }],
                    freeSpinLeft: 10,
                    winType: 100,
                    freeSpin: false,
                    agWin: 5000,
                    AG: 20872,
                    level: { levelUser: 2, curLevelExp: 14, maxLevelExp: 19, agUser: 20872 },
                    MarkBet: [1, 5, 25, 50, 250, 500]
                }
                break;
            case 2:
                fakeData = {
                    slotViews: [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]],
                    creditWin: 40,
                    lineDetail: [{ lineId: 0, win: 250 }],
                    freeSpinLeft: 9,
                    winType: 0,
                    freeSpin: true,
                    agWin: 5000,
                    AG: 25872,
                    level: { levelUser: 2, curLevelExp: 14, maxLevelExp: 19, agUser: 20872 },
                    MarkBet: [1, 5, 25, 50, 250, 500]
                }
                break;
            case 3:
                fakeData = {
                    slotViews: [[2, 2, 2], [2, 2, 2], [2, 2, 2], [2, 2, 2], [2, 2, 2]],
                    creditWin: 40,
                    lineDetail: [],
                    freeSpinLeft: 8,
                    winType: 0,
                    freeSpin: true,
                    agWin: 20000,
                    AG: 30999,
                    level: { levelUser: 2, curLevelExp: 14, maxLevelExp: 19, agUser: 20872 },
                    MarkBet: [1, 5, 25, 50, 250, 500]
                }
                break;
            case 4:
                fakeData = {
                    slotViews: [[3, 3, 3], [3, 3, 3], [3, 3, 3], [3, 3, 3], [3, 3, 3]],
                    creditWin: 40,
                    lineDetail: [],
                    freeSpinLeft: 0,
                    winType: 0,
                    freeSpin: true,
                    agWin: 0,
                    AG: 30999,
                    level: { levelUser: 2, curLevelExp: 14, maxLevelExp: 19, agUser: 20872 },
                    MarkBet: [1, 5, 25, 50, 250, 500]
                }
                break;
        }
        if (data > 4) fakeData = null;
        this.fakeData = fakeData;
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
    releaseAtsset() {
        cc.sys.garbageCollect();
        if (this.skeData.length > 10) {
            for (let i = 0; i < this.skeData.length; i++) {
                cc.loader.release(this.skeData[i].skeData);
            }
            this.skeData = [];
            cc.NGWlog("SlotJp:Release asset xong!");
        }
    },
    onClickDailyBonus() {
        require('SoundManager1').instance.playButton();
        this.daily.setInfo();
        this.node.addChild(this.daily.node, ZINDEX_LINE + 1);
    },
    onClickChangeUI() {
        require('SoundManager1').instance.playButton();
        for (let i = 0; i < this.listAllItem.length; i++) {
            let item = this.listAllItem[i];
            if (item.type === 0) item.type = 1;
            else item.type = 0;
            item.switchUI();
        }

    },
    onClickBack() {
        require('SoundManager1').instance.playButton();
        this.setting.active = true;
        // this.node.destroy();
    },
    receiveChipDaily() {
        let curAg = cc.sys.localStorage.getItem("agSlotOffline");
        curAg=parseInt(curAg);
        cc.log("Curag player="+curAg);
        this.lb_Chip.string = this.formatNumber(curAg);
        this.agPlayer=curAg;
        this.animChip.active = true;
        this.animChip.runAction(cc.sequence(cc.delayTime(2.0), cc.callFunc(() => {
            this.animChip.active = false;
        })));
    },
    updateDaily() {

    }

});
module.exports = SlotJapanView;