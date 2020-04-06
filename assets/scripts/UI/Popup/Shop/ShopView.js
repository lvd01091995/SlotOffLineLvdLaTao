var TAB_TYPE = cc.Enum({
    SMS: 4,
    ASIA: 1,
    CELLCARD: 2,
    WING: 3,
    IAP: 0,
    PAYGO: 5
});
const GameManager = require("GameManager");
cc.Class({
    extends: cc.Component,

    properties: {
        lb_chip: {
            default: null,
            type: cc.Label
        },

        webview: cc.WebView,

        listSpriteFrameIconNet: {//0 - SMS, 1 - asia, 2-cell, 4-iap, 3-wing ,5-paygo
            default: [],
            type: [cc.SpriteFrame]
        },
        listSpriteFrameTabLef: {//0 - active, 1-deactive
            default: [],
            type: [cc.SpriteFrame]
        },
        listSpriteFrameTabRight: {//0 - active, 1-deactive
            default: [],
            type: [cc.SpriteFrame]
        },
        listButtonTabLeft: {
            default: [],
            type: [cc.Button],
            visible: false
        },
        listButtonTabRight: {//0-Smart, 1-CellCard
            default: [],
            type: [cc.Button]
        },

        listItemShop: {
            default: [],
            type: [require('ItemShop')]
        },

        prefabTabNet: {
            default: null,
            type: cc.Node
        },

        prefabItemShop: {
            default: null,
            type: cc.Node
        },

        listViewTabNet: {
            default: null,
            type: cc.ScrollView
        },
        listViewContent: {
            default: null,
            type: cc.ScrollView
        },
        cur_tab_left: -1,
        cur_tab_right: -1,

        editPhoneNumber: {
            default: null,
            type: cc.EditBox
        },
        amountFortumo: 0,
        icon_ios: {
            default: null,
            type: cc.SpriteFrame
        },
        nodeLoading:cc.Node,
        _userVip: 0
    },
    onLoad(){
        Global.ShopView= this;
    },
    start() {
        cc.NGWlog('ShopView: Chay vao start!');
        this.onClickTabRight(this.listButtonTabRight[0], 1);
        // this.init();
    },

    onEnable() {
        cc.NGWlog('ShopView: Chay vao onEnable!');

        this._userVip = GameManager.getInstance().user.vip;
        //  this._userVip = 5;
        this.updateChip();
        this.cur_tab_left = -1;

        this.initTabLeft();
    },

    initTabLeft() {
        // cc.sys.os = cc.sys.OS_IOS;//duy test
        //0 - SMS, 1 - asia, 2-cell, 4-iap, 3-wing 5-paygo
        if (this.listButtonTabLeft.length === 0) {
            let obj = cc.instantiate(this.prefabTabNet).getComponent(cc.Button);
            obj.node.active = true;
            this.listViewTabNet.content.addChild(obj.node);
            this.listButtonTabLeft.push(obj);
            obj.node.getChildByName('IconNet').getComponent(cc.Sprite).spriteFrame = this.icon_ios;
            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "ShopView";
            eventHandler.handler = "onClickTab"
            eventHandler.customEventData = i;

            obj.clickEvents.push(eventHandler);
        }

        let isClick = -1;


        if (GameManager.getInstance().iap_config.v > this._userVip)
            this.listButtonTabLeft[i].node.active = false;
        else if (isClick === -1) {
            isClick = i;
        }
        if (GameManager.getInstance().iap_config.v <= this._userVip) {
            this.listButtonTabLeft[i].node.active = true;
        }
        isClick = -1;
        if (!GameManager.getInstance().iap_config)
            this.listButtonTabLeft[i].node.active = false;
        else if (isClick === -1) {
            isClick = i;
        }
        this.listButtonTabLeft[TAB_TYPE.IAP].node.active = false;
        this.listViewContent.node.getComponent(cc.Widget).HorizontalCenter = true;
        this.listViewContent.node.getComponent(cc.Widget).left = false;
        this.listViewContent.node.getComponent(cc.Widget).right = false;
        this.listViewContent.node.getComponent(cc.Widget).updateAlignment();
        this.cur_tab_right = 0;
        let boo = false;
        let indR = -1;

        if (!boo && indR !== -1) {
            this.onClickTabRight(this.listButtonTabRight[indR], 1);
        }

        if (isClick !== -1 && isClick < this.listButtonTabLeft.length)
            this.onClickTab(this.listButtonTabLeft[isClick], null);
        
    },
    //Phan duoi nay se xoa het
    moveUp() {
        return;
        GameManager.getInstance().setCurView(CURRENT_VIEW.PAYMENT);
        this.node.position = cc.v2(0, 0);
        this.updateChip();

        //  this.reloadListview();
    },
    updateChip() {
       // this.lb_chip.string = GameManager.getInstance().formatNumber(GameManager.getInstance().user.ag);
       let agPlayer =cc.sys.localStorage.getItem("agSlotOffline");
       agPlayer=parseInt(agPlayer);
       this.lb_chip.string = this.formatNumber(agPlayer);
       console.log("Update chip slot==:"+agPlayer);
    },
    formatNumber(number, width = 3) {
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');//String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
    },
    reloadListview() {
        cc.log("chay vao reload list view shop");
        var listData = [];
        var listNum = 0;
        let payType;
        let partner;

        var str_lik = GameManager.getInstance().u_p;
        cc.NGWlog('----> vao day 28989898989 ', this.cur_tab_left);

        this.listViewContent.node.height = cc.winSize.height * 0.8;//580;
        this.listButtonTabRight[0].node.getParent().active = false;
        let dataShop = '{"iap":[{"amount":0.99,"chip":60000,"percentBonus":67,"localCurency":"USD","gameCurency":"Chips","mDisplay":"60,000 Chips","mDisplayAmount":"0.99 USD","mDisplayBaseChip":"36,000 Chips","baseChip":36000,"cost":1},{"amount":1.99,"chip":128000,"percentBonus":78,"localCurency":"USD","gameCurency":"Chips","mDisplay":"128,000 Chips","mDisplayAmount":"1.99 USD","mDisplayBaseChip":"72,000 Chips","baseChip":72000,"cost":2},{"amount":4.99,"chip":350000,"percentBonus":94,"localCurency":"USD","gameCurency":"Chips","mDisplay":"350,000 Chips","mDisplayAmount":"4.99 USD","mDisplayBaseChip":"180,000 Chips","baseChip":180000,"cost":5},{"amount":19.99,"chip":1280000,"percentBonus":78,"localCurency":"USD","gameCurency":"Chips","mDisplay":"1,280,000 Chips","mDisplayAmount":"19.99 USD","mDisplayBaseChip":"720,000 Chips","baseChip":720000,"cost":20},{"amount":49.99,"chip":3200000,"percentBonus":78,"localCurency":"USD","gameCurency":"Chips","mDisplay":"3,200,000 Chips","mDisplayAmount":"49.99 USD","mDisplayBaseChip":"1,800,000 Chips","baseChip":1800000,"cost":50},{"amount":99.99,"chip":7000000,"percentBonus":94,"localCurency":"USD","gameCurency":"Chips","mDisplay":"7,000,000 Chips","mDisplayAmount":"99.99 USD","mDisplayBaseChip":"3,600,000 Chips","baseChip":3600000,"cost":100}]}'
        dataShop = JSON.parse(dataShop);
        listData = dataShop.iap;
        //GameManager.getInstance().listIAP;
        partner = 'iap';
        if (listData.length < this.listItemShop.length) {
            for (let i = listData.length; i < this.listItemShop.length; i++) {
                this.listItemShop[i].node.active = false;
            }
        }
        let booCo = false;
        for (let i = 0; i < listData.length; i++) {
            let itemS = null;
            if (i < this.listItemShop.length) {
                itemS = this.listItemShop[i];
            } else {
                itemS = cc.instantiate(this.prefabItemShop).getComponent('ItemShop');
                // this.itemS;
                this.listViewContent.content.addChild(itemS.node);
                this.listItemShop.push(itemS);
                booCo = true;

            }
            itemS.node.setScale(0);
            itemS.node.active = true;
            itemS.init(listData[i], partner, str_lik, payType, this,i);
            itemS.node.stopAllActions();
            itemS.interactable = false;
            itemS.node.runAction(cc.sequence(cc.delayTime(i * 0.1), cc.scaleTo(.1, 1.0).easing(cc.easeBackOut()), cc.callFunc(() => {
                itemS.interactable = true;
            })));
            if (cc.sys.os === cc.sys.OS_IOS) {
                // if (GameManager.getInstance().bundleID === "com.naga.slots") {
                //     if ((listData[i].cost == 50 || listData[i].cost == 100) && partner === 'iap') {
                //         itemS.node.active = false;
                //     }
                // } else if (GameManager.getInstance().bundleID === "pe.csn.bcr") {
                //     if ((listData[i].cost == 20 || listData[i].cost == 50 || listData[i].cost == 100) && partner === 'iap') {
                //         itemS.node.active = false;
                //     }
                // }
            }
        }
        if (booCo && this.listViewContent.node.active === false) {
            this.listViewContent.node.active = true;
        }
        this.listViewContent.scrollToTop(0.1);
        console.log("bundleid=" + GameManager.getInstance().bundleID);
    },

    onClose() {
        let curAg = cc.sys.localStorage.getItem("agSlotOffline");
        curAg=parseInt(curAg);
        this.node.parent.getComponent("Slot20LineJPView").lb_Chip.string = this.formatNumber(curAg);
        this.node.parent.getComponent("Slot20LineJPView").ShopView=null;
        this.node.parent.getComponent("Slot20LineJPView").agPlayer=curAg;
        this.node.destroy();
        return;
        cc.NGWlog('ShopView:On Close!');
        require('SoundManager1').instance.playButton();
        if (GameManager.getInstance().gameView === null)
            GameManager.getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
        else if (GameManager.getInstance().gameView !== null)
            GameManager.getInstance().setCurView(GameManager.getInstance().curGameViewId);

        require('NetworkManager').getInstance().sendUAG();
        require('UIManager').instance.onHideView(this.node, true);
    },

    onClickTab(event, data) {
        cc.NGWlog('---------> onClickTab ', event, data);
        for (let i = 0; i < this.listButtonTabLeft.length; i++) {
            if (event.target === this.listButtonTabLeft[i].node) {
                cc.NGWlog('--------> co thang trung ', i);
                if (data == i) require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTab_%s_%s", data, GameManager.getInstance().getCurrentSceneName()));
                // listSpriteFrameTabLef
                if (this.cur_tab_left === i) return;
                cc.NGWlog('--------> co thang trung 2', i);
                this.listButtonTabLeft[i].node.getComponent(cc.Sprite).spriteFrame = this.listSpriteFrameTabLef[0];
                this.cur_tab_left = i;

            } else {
                cc.NGWlog('--------> ko trung ', i);
                this.listButtonTabLeft[i].node.getComponent(cc.Sprite).spriteFrame = this.listSpriteFrameTabLef[1];
            }
        }
        cc.NGWlog('-=-=-=-=   reloadListview');
        this.reloadListview();
    },

    onClickTabRight(event, data) {

        for (let i = 0; i < this.listButtonTabRight.length; i++) {
            if (event.target === this.listButtonTabRight[i].node) {
                cc.NGWlog('--------> co thang trung ', i);
                if (data == i) require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTab_%s_%s", event.target.name, GameManager.getInstance().getCurrentSceneName()));
                if (this.cur_tab_right === i) return;
                this.listButtonTabRight[i].node.getComponent(cc.Sprite).spriteFrame = this.listSpriteFrameTabRight[0];
                this.cur_tab_right = i;
            } else {
                cc.NGWlog('--------> ko trung ', i);
                this.listButtonTabRight[i].node.getComponent(cc.Sprite).spriteFrame = this.listSpriteFrameTabRight[1];
            }
        }
        if (data !== 1)
            this.reloadListview();
    },

    onInputPhone(amount) {
        this.amountFortumo = amount;
        cc.NGWlog("----->  onInputPhone();");
        this.editPhoneNumber.string = '';
        this.editPhoneNumber.node.getParent().getParent().getParent().getParent().active = true;
    },
   

    onClickCloseIputPhone() {
        this.editPhoneNumber.string = '';
        this.editPhoneNumber.node.getParent().getParent().getParent().getParent().active = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCloseInput_%s", GameManager.getInstance().getCurrentSceneName()));
    },
    onClickVip() {
        return;
        require('SoundManager1').instance.playButton();
        var item = cc.instantiate(this.item_vip);
        this.node.addChild(item);
    },
    onPutBackPool() {
        return;
        for (let i = 0; i < this.listview.content.children.length; i++) {
            cc.NGWlog('Put back shop pool!');
            require('UIManager').instance.shopPool.put(this.listview.content.children[i]);
        }
    },
    scollEvent() {
        return;
        for (let i = 0; i < this.listview.content.children.length; i++) {
            let item = this.listview.content.children[i];
            let pos = this.listview.content.convertToWorldSpaceAR(item.position);
            pos = this.node.convertToNodeSpaceAR(pos);
            //getComponent('ItemShop').bkg
            item.active = true;
        }
    },
    openUrl(url) {
        return;
        // this.webView.node.active = true;
        // this.webView.node.getParent().active = true;
        // this.webView.url = url;
        require("Util").onCallWebView(url);
    },
    turnOffWebView() {
        this.webView.node.getParent().active = false;
        this.webView.url = "";
        require('NetworkManager').getInstance().sendUAG();
    },
    contactAdmin() {
        cc.NGWlog('Contact admin!!!!');
        cc.sys.openURL(GameManager.getInstance().u_chat_fb);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowMessageFacebook_%s", GameManager.getInstance().getCurrentSceneName()));
    }
});
