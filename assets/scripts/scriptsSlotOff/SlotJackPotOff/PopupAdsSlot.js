var TYPEADS = {
    FREECHIP: 1,
    BONUS: 2,
}
var TEXT_AD_NOT_READY = "Ads reward is not available now,\n Please wait a few seconds"
cc.Class({
    extends: require("PopupEffect"),

    properties: {
        listSprBkg: [cc.SpriteFrame]
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.typeAds = 0;
    },

    start() {
        this.bkg.getComponent(cc.Sprite).spriteFrame = this.listSprBkg[this.type - 1];
    },
    onClickConfirm() {
        //show video adward
        cc.log("Confirm");
        if (require("GameManager").getInstance().isAdsReady) {
            require("Util").onShowAds();
            require("Slot20LineJPView").instance.isAutoSpin = false;
            cc.log("Show ADS Len Cho Tao");
        } else {
            cc.log("Lam Deo Gi co Ads");
            let func = () => {
                require("Util").onRequestAds();
            }
            require("Slot20LineJPView").instance.onShowConfirmDialog(TEXT_AD_NOT_READY, func);

        }
        this.onPopOff(true);
    },

    onClose() {
        this.onPopOff(true);
    }

    // update (dt) {},
});
