

cc.Class({
    extends: cc.Component,

    properties: {
        lb_day: cc.Label,
        lb_recieve: cc.Label,
        lb_Money: cc.Label,
        listSpr_Active: [cc.Label],
        listSpr_Deactive: [cc.SpriteFrame],
        listSpr_Active: [cc.SpriteFrame],
        sprIcon: cc.Sprite,
        dayNum: -1,
        animBg: cc.Node,
        bg: cc.Node,
        btn_recieve: cc.Button,
        agRecieve: 0,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.runAction(cc.scaleTo(0.5, 1, 1).easing(cc.easeBackOut()));
    },

    start() {

    },
    setInfo(index, isActive, isTomorow, isToday = false) {
        let listBonnus = [1000, 5000, 10000, 50000, 100000, 500000, 1000000];
        this.lb_day.string = "Day " + (index + 1);
        this.animBg.active = isActive;
        this.bg.active = !isActive;
        this.btn_recieve.interactable = isActive;
        this.lb_Money.string = this.formatNumber(listBonnus[index]);
        this.agRecieve = listBonnus[index];
        let spr = isActive ? this.listSpr_Active[index] : this.listSpr_Deactive[index];
        this.sprIcon.spriteFrame = spr;
        this.lb_recieve.string = isTomorow ? "Tomorrow" : "Receive";
        if (isActive && !isTomorow) {
            if (isToday) {
                let todayRecieve = cc.sys.localStorage.getItem("todayRecieved");
                if (todayRecieve != null) {
                    todayRecieve = parseInt(todayRecieve);
                    if (todayRecieve === this.dayNum) {
                        this.btn_recieve.interactable = false;
                    } else this.btn_recieve.interactable = true;
                } else this.btn_recieve.interactable = true;
            }
            else this.btn_recieve.interactable = false;
        } else if (isActive && isTomorow) {
            this.btn_recieve.interactable = false;
            this.btn_recieve.enableAutoGrayEffect = false;
        }
    },
    formatNumber(number, width = 3) {
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');//String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
    },
    onClickRecieve() {
        let curAg = cc.sys.localStorage.getItem("agSlotOffline");
        curAg = parseInt(curAg) + this.agRecieve;
        cc.sys.localStorage.setItem("agSlotOffline", curAg);
        this.node.parent.parent.parent.getComponent("DailyBonus").updateMoney();
        cc.sys.localStorage.setItem("todayRecieved", this.dayNum);
        require("Slot20LineJPView").instance.chipBonusDaily = this.agRecieve;
    }
    // update (dt) {},
});
