var SoundManager1 = cc.Class({
    extends: cc.Component,

    properties: {
        audioSource: {
            default: null,
            type: cc.AudioSource,
        },
        soundGamelist: {
            default: null,
            type: cc.AudioClip,
        },
        bkg_SoundInGame: {
            default: null,
            type: cc.AudioClip,
        },
        soundWheel: {
            default: null,
            type: cc.AudioClip,
        },
        currentAudio: 0,
        soundActive: 0,
    },
    onLoad() {
        this.soundInGame = this.bkg_SoundInGame;
        SoundManager1.instance = this;
        let musicBkg = null;
        cc.loader.loadResDir('sounds', cc.AudioClip, (error, result) => {
            if (error !== null) {
            }
            cc.NGWlog('--------------------------> loadAllSound');
            var sound = cc.sys.localStorage.getItem("sound");
            if (sound === "on" || sound == null) {
                cc.sys.localStorage.setItem("sound", "on");
                this.turnOnSFX();
                this.playMusicBackground();
            } else {
                this.turnOffSFX();
                this.stopMusic();
            }
        });

    },

    start() {
    },
    /* Start :  Change Method Load Sound => dynamically */

    dynamicallyPlayMusic(_soundResource, _loop = false, _isSFX = true) {
        if (_isSFX) {
            if (this.isSFX == true) {
                cc.loader.loadRes(_soundResource, cc.AudioClip, (err, clip) => {
                    if (err) return;
                    this.currentAudio = cc.audioEngine.play(clip, _loop, 1);
                });
            } else {
                return;
            }
        } else {
            cc.audioEngine.stopAll();
            cc.loader.loadRes(_soundResource, cc.AudioClip, (err, clip) => {
                this.currentAudio = cc.audioEngine.play(clip, _loop, 0.7);
            });
        }
    },
    dynamicallyStopMusic() {
        cc.audioEngine.stop(this.currentAudio);
    },
    playMusicBackground1() {
        cc.loader.loadRes(bkg_sound, cc.AudioClip, (err, clip) => {
            if (err) return;
            else {
                this.soundInGame = clip;
                this.audioSource.stop();
                this.audioSource.clip = this.soundInGame;
                this.audioSource.play();
            }
        });
    },
    playMusicBackground() {
        cc.NGWlog("soundmanagerLdeo co gameview!! ");
        this.audioSource.stop();
        // this.audioSource.clip = this.soundGamelist;
        this.audioSource.play();
    },
    stopMusic() {
        this.audioSource.stop();
    },
    playMusicIngame() { // this.dynamicallyPlayMusic('sounds/table_music', true, false);
        cc.audioEngine.stopAll();
        this.currentAudio = cc.audioEngine.play(this.soundInGame, true, 1);
    },
    stopEffect() {
        cc.audioEngine.stopAllEffects();
    },
    turnOffSFX() {
        this.isSFX = false;
    },
    turnOnSFX() {
        this.isSFX = true;;
    },

    _playSFX(clip) {
        if (!this.isSFX) return;
        cc.audioEngine.playEffect(clip, false);
    },

    playButton() {
        this.dynamicallyPlayMusic(ResDefine.buttonAudio);
    },

    playWheel() {
        let music = cc.sys.localStorage.getItem("sound");
        if (music === "on") {
            this.audioWheel = cc.audioEngine.play(this.soundWheel, true, 1);
        }

    },
    stopWheel() {
        if (this.audioWheel != null) {
            cc.audioEngine.stop(this.audioWheel);
        }

    },
});

export default SoundManager1;