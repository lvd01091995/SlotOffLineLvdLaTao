
var DailyBonus = cc.Class({
    extends: cc.Component,

    properties: {
        content1: cc.Node,
        content2: cc.Node,
        item: cc.Prefab,
        bg: cc.Node,
        mask: cc.Node,
        listItem: [],
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
    },
    //" 10|110|0100000|11010101011|00|1110|0001010|11|"
    start() {

    },
    init() {

        for (let i = 0; i < 7; i++) {
            let item = cc.instantiate(this.item).getComponent("DailyBonusItem");
            if (i < 4) {
                this.content1.addChild(item.node);
            } else {
                this.content2.addChild(item.node);
            }
            this.listItem.push(item);
        }


    },
    setInfo() {
        let day = new Date();
        let dayNum = day.getDay();

        if (dayNum === 0) dayNum = 7;
        for (let i = 0; i < 7; i++) {
            this.listItem[i].dayNum = i + 1;
            if (this.listItem[i].dayNum < dayNum) {
                this.listItem[i].setInfo(i, false);
            }
            else if (this.listItem[i].dayNum > dayNum) {
                if (this.listItem[i].dayNum === dayNum + 1)
                    this.listItem[i].setInfo(i, true, true);
                else {
                    this.listItem[i].setInfo(i, true, false);
                }

            }
            else this.listItem[i].setInfo(i, true, false, true);
        }
    },
    updateMoney() {
        this.onClose();
        console.log("======================== Nhan chip hang ngay")
        require("Slot20LineJPView").instance.receiveChipDaily();
        require("Slot20LineJPView").instance.showGetMoreChipDaily();
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
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');//String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
    },
    // update (dt) {},
});
module.exports = DailyBonus;
