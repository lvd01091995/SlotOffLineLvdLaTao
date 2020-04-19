// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        toggle: cc.Toggle,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var sound = cc.sys.localStorage.getItem("sound");
        if (sound === "on" || sound == null ) {
            this.toggle.isChecked=true;
            this.toggle.node.getChildByName("Background").active = false;
        } else {
            this.toggle.isChecked=false;
        }
    },
    onEnable() {
    },
    start() {

    },
    onClickToggle() {
        require('SoundManager1').instance.playButton();
        if (this.toggle.isChecked) {
            this.toggle.node.getChildByName("Background").active = false;
            cc.sys.localStorage.setItem("sound", "on");
            require('SoundManager1').instance.turnOnSFX();
            require('SoundManager1').instance.playMusicBackground();
        } else {
            this.toggle.node.getChildByName("Background").active = true;
            cc.sys.localStorage.setItem("sound", "off");
            require('SoundManager1').instance.turnOffSFX();
            require('SoundManager1').instance.stopMusic();
        }
    },
    onClose() {
        require('SoundManager1').instance.playButton();
       
    },
    onClickBack() {
        require('SoundManager1').instance.turnOffSFX();
        require("Slot20LineJPView").instance.closeGame();
    },
    onClickRule() {
        require('SoundManager1').instance.playButton();
        require("Slot20LineJPView").instance.onClickRule();
        this.onClose();
    },


    // update (dt) {},
});
