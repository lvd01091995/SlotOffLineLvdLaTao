

cc.Class({
    extends: cc.Component,

    properties: {
        timeMove: 0,
        sprAtlas: cc.SpriteAtlas,
        sprAtlasBlur: cc.SpriteAtlas,
        listItem: [cc.Node],
        itemBlur: cc.Node,
        numCol: null,
        typeItem: null,
        listIdView: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.startPos = this.node.position;
        this.Slot20JPGameView = Global.GameView;
        this.isHaveJPItem = false;

    },
    update() {
    },
    getRanNum(min_value, max_value) {
        let random_number = Math.random() * (max_value - min_value) + min_value;
        return Math.floor(random_number);
    },
    setRandomId(isTurnOnSon) {
        let ranId1 = this.getRanNum(0, 13);
        let ranId2 = this.getRanNum(0, 13);
        let ranId3 = this.getRanNum(0, 13);
        let listdata = [ranId1, ranId2, ranId3];
        this.setSpriteListItem(listdata, isTurnOnSon);
    },
    setSpriteListItem(listData, isTurnOnSon = false) {
        for (let i = 0; i < 3; i++) {
            if (!isTurnOnSon) {
                let nameSpr = listData[i];
                this.listItem[i].getComponent(cc.Sprite).spriteFrame = this.sprAtlas.getSpriteFrame(nameSpr);
                this.listItem[i].setContentSize(cc.size(130, 130));
            }
            this.listItem[i].active = !isTurnOnSon;
        }
        this.itemBlur.active = isTurnOnSon;
        if (isTurnOnSon) {
            let randomBlur = this.getRanNum(1, 4);
            this.itemBlur.getComponent(cc.Sprite).spriteFrame = this.sprAtlasBlur.getSpriteFrame("blur" + randomBlur);
        }
        this.listIdView = listData.slice();
    },
    getWordPosItem(item) {// Lay Toa do cua item con
        let posWorld = this.node.convertToWorldSpaceAR(item);
        let posInGameView = this.Slot20JPGameView.gameView.node.convertToNodeSpaceAR(posWorld);
        return posInGameView;
    },
    showItemEff(index) {
        this.showGrayColor();
        this.listItem[index].stopAllActions();
        this.listItem[index].color = cc.Color.WHITE;
        this.listItem[index].runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.3, 1.1), cc.scaleTo(0.3, 1.0))));
    },
    offItemEff() {
        for (let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].stopAllActions();
            this.listItem[i].scale = 1;
            this.listItem[i].color = cc.Color.WHITE;
        }
    },
    showGrayColor() {
        for (let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].stopAllActions();
            this.listItem[i].color = cc.Color.GRAY;
        }
    },
    getScatterItem() {
        let data = {
            id: null,
            pos: null
        }
        for (let i = 0; i < this.listIdView.length; i++) {
            let id = this.listIdView[i];
            if (id === 12) {
                data.pos = this.getWordPosItem(this.listItem[i]);
                data.id = id;
                this.Slot20JPGameView.gameView.scatterCount++;
                this.Slot20JPGameView.gameView.listScatter.push(data);
            }
        }
    },
    getItemWithId(id) {
        let listItem = [];
        for (let i = 0; i < this.listIdView.length; i++) {
            if (this.listIdView[i] === id)
                listItem.push(this.listItem[i]);
        }
        return listItem;
    },
    getItemWildNum() {
        let count = 0;
        for (let i = 0; i < 3; i++) {
            if (this.listIdView[i] === 11) {
                let isInLine = this.Slot20JPGameView.gameView.checkIsItemInWinLine(this.numCol, i)
                if (isInLine)
                    count++
            }
        }
        return count;
    },
    getPosShowItemWild() {
        let countWild = this.getItemWildNum();
        let posData = [];
        let posWild = cc.v2(this.listItem[0].x, (this.listItem[0].y + this.listItem[1].y) / 2);
        let posShowWild1 = this.getWordPosItem(posWild);
        posWild = cc.v2(this.listItem[0].x, (this.listItem[1].y + this.listItem[2].y) / 2);
        let posShowWild2 = this.getWordPosItem(posWild);
        let posShowWild3 = this.getWordPosItem(this.listItem[1]);
        switch (countWild) {
            case 3:
                let data = {};
                data.pos = posShowWild3;
                data.animName = "3o";
                posData.push(data);
                break;
            case 2:
                if (this.listIdView[0] === 11 && this.listIdView[1] === 11) {
                    let data = {};
                    data.pos = posShowWild1;
                    data.animName = "2o";
                    posData.push(data);
                }
                else if (this.listIdView[1] === 11 && this.listIdView[2] === 11) {
                    let data = {};
                    data.pos = posShowWild2;
                    data.animName = "2o";
                    posData.push(data);
                }
                else {
                    for (let i = 0; i < 3; i++) {
                        if (this.listIdView[i] === 11) {
                            let data = {};
                            data.pos = this.getWordPosItem(this.listItem[i]);
                            data.animName = "1o";
                            posData.push(data);
                        }
                    }
                }
                break;
            case 1:
                for (let i = 0; i < 3; i++) {
                    if (this.listIdView[i] === 11) {
                        let data = {};
                        data.pos = this.getWordPosItem(this.listItem[i]);
                        data.animName = "1o";
                        posData.push(data);
                    }
                }
                break;
        }
        return posData;

    }
});;
