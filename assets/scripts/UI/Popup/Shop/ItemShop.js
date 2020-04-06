
cc.Class({

    extends: cc.Component,

    properties: {
        lb_bonus: {
            default: null,
            type: cc.Label
        },
        lb_chip: {
            default: null,
            type: cc.Label
        },
        lb_price: {
            default: null,
            type: cc.Label
        },
        lb_rate: {
            default: null,
            type: cc.Label
        },
        icChip: cc.Sprite,
        partner: "",
        url_l: "",
        amount: 0,
        payType: 0,
        shop: null,
        listSprChip: [cc.SpriteFrame],
    },

    init(data, partner, url, payType, shop, index) {
        // cc.NGWlog('---> Data Item ', data);
        cc.NGWlog('----> State: ' + partner + ' Url: ' + url + " PayType: " + payType);
        // amount: 0.99
        // baseChip: 1000000
        // chip: 1800
        // gameCurency: "Chips"
        // localCurency: "$"
        // mDisplay: "1,800 Chips"
        // mDisplayAmount: "$0.99"
        // mDisplayBaseChip: "1,000,000 Chips"
        // percentBonus: 20
        this.icChip.spriteFrame = this.listSprChip[index];
        this.shop = shop;
        this.partner = partner;
        this.url_l = url;
        this.payType = payType;
        if (this.partner === 'iap') {
            this.amount = data.cost;
        } else
            this.amount = data.amount;

        this.lb_chip.string = data.mDisplay;
        this.lb_price.string = data.mDisplayAmount;
        this.lb_rate.string = "1" + data.localCurency + " = " + require('GameManager').getInstance().formatNumber(Math.floor(data.chip / data.amount)) + " Chips";
        // if (data.percentBonus > 0) {
        //     this.lb_bonus.string = "+" + data.percentBonus + "%";
        //     this.lb_bonus.node.getParent().active = true;
        // } else {
        //     this.lb_bonus.node.getParent().active = false;
        // }
    },

    onClickPrice() {
        let otps = {};
        let str_lik = '';
        cc.NGWlog('---------> IAP:  ', (require('GameManager').getInstance().bundleID + "." + this.amount +".pack"));
        require('Util').onBuyIap((require('GameManager').getInstance().bundleID + "." + this.amount+".pack"));
        cc.sys.localStorage.setItem("itemiapSlotOffline", this.amount);
        Global.ShopView.nodeLoading.active = true;
        return;

    },
});

