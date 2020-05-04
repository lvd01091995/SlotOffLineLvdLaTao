var TEXT_LIMIT = "You Have Received Bonus Today!";
var TEXT_RECEIVE = "Congratulation! \nYou Have Receive %s Chip Bonus!";
var DailyBonus = cc.Class({
    extends: cc.Component,

    properties: {
        content1: cc.Node,
        content2: cc.Node,
        item: cc.Prefab,
        bg: cc.Node,
        mask: cc.Node,
        listItem: [],
        bkg_Rotate: cc.Node,
        btn_Spin: cc.Button,
        canSpin: true,
        animChip: sp.Skeleton,
        lb_info: cc.Label,
        dayNum: -1,
    },

    // LIFE-CYCLE CALLBACKS:
    statics: {
        getInstance: function () {
            if (this.instance = null) {
                this.instance = new DailyBonus();
            }
            return this.instance;
        }
    },
    onLoad() {
        this.onPopon();
        this.bg.scale = cc.v2(0.8, 0.8);
        this.bg.opacity = 1;
        this.bkg_Rotate.rotation = 11.25;
        this.listAcRotate = [];
        this.randBonus = 0;
        this.listBonus = [100, 1000, 500, 100, 10000, 2000, 1000, 500, 100, 1000, 5000, 1000, 500, 100, 10000, 500, 100]
    },
    //" 10|110|0100000|11010101011|00|1110|0001010|11|"
    start() {

    },
    init() {

        // for (let i = 0; i < 7; i++) {
        //     let item = cc.instantiate(this.item).getComponent("DailyBonusItem");
        //     if (i < 4) {
        //         this.content1.addChild(item.node);
        //     } else {
        //         this.content2.addChild(item.node);
        //     }
        //     this.listItem.push(item);
        // }


    },
    setInfo(randBonus) {
        if (!this.canSpin) {
            this.btn_Spin.interactable = false;
        }
        this.randBonus = randBonus;
        let day = new Date();
        let dayNum = day.getDay();

        if (dayNum === 0) dayNum = 7;
        this.dayNum = dayNum; //today
        let todayRecieve = cc.sys.localStorage.getItem("todayRecieved");
        if (todayRecieve != null) {
            todayRecieve = parseInt(todayRecieve);
            if (todayRecieve === this.dayNum) {
                this.btn_Spin.interactable = false;
                this.lb_info.string = TEXT_LIMIT;
            } else this.btn_Spin.interactable = true;
        } else this.btn_Spin.interactable = true;
    },
    onClickSpin() {
        this.btn_Spin.interactable = false;
        let angle = this.randBonus * 22.5;
        require('SoundManager1').instance.playWheel();
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.slot_spin);
        cc.log("Quay Them 1 Goc==" + angle);
        cc.log("Bonus get===" + this.listBonus[this.randBonus]);
        let time = 0.5;
        this.listAcRotate = [];
        for (let i = 0; i < 5; i++) {
            time = 0.5 + (0.1 * i);
            let acRotateBy = cc.rotateBy(time, 360);
            this.listAcRotate.push(acRotateBy);

        }
        let lastDuration = 0;
        let acCheck = cc.callFunc(() => {
            if (this.listAcRotate.length > 0) {
                lastDuration = this.listAcRotate[0].getDuration();
                let action = this.listAcRotate.shift();
                this.bkg_Rotate.runAction(cc.sequence(action, acCheck));
            } else {
                // this.bkg_Rotate.rotation = 11.25;
                this.bkg_Rotate.runAction(cc.sequence(cc.rotateBy(lastDuration + 0.5, angle + 15).easing(cc.easeSineOut()),
                    cc.rotateBy(1.0, -15).easing(cc.easeSineIn()),
                    cc.callFunc(() => {
                        require('SoundManager1').instance.stopWheel();
                        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.slot_stop);
                        this.animChip.node.active = true;
                        this.lb_info.string = TEXT_RECEIVE.replace("%s", require("GameManager").getInstance().formatNumber(this.listBonus[this.randBonus]));
                        this.scheduleOnce(() => {
                            this.animChip.node.active = false;
                            this.updateMoney();
                        }, 1.8);
                    })));
            }
        });
        this.bkg_Rotate.runAction(cc.sequence(this.listAcRotate[0], acCheck));
        let curAg = cc.sys.localStorage.getItem("agSlotOffline");
        curAg = parseInt(curAg) + this.listBonus[this.randBonus];
        cc.sys.localStorage.setItem("agSlotOffline", curAg);
        cc.sys.localStorage.setItem("todayRecieved", this.dayNum);
        require("Slot20LineJPView").instance.chipBonusDaily = this.agRecieve;

    },

    updateMoney() {
      //  this.onClose();
        console.log("======================== Nhan chip hang ngay")
        require("Slot20LineJPView").instance.receiveChipDaily();
        //   require("Slot20LineJPView").instance.showGetMoreChipDaily();
    },
    onClose() {
        require('SoundManager1').instance.playButton();
        this.node.removeFromParent();
    },
    onPopon() {
        require('SoundManager1').instance.playButton();
        this.mask.active = true;
        this.bg.runAction(cc.spawn(cc.fadeTo(0.3, 255), cc.scaleTo(0.3, 1, 1).easing(cc.easeBackOut())));
    },
    formatNumber(number, width = 3) {
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    },
    // update (dt) {},
});
module.exports = DailyBonus;
