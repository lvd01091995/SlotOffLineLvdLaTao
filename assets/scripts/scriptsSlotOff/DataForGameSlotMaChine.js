var DataForGameSlotMaChine = cc.Class({
    extends: cc.Component,

    properties: {
        instantiate_parent: {
            default: null,
            type: cc.Node
        },

        btnPlay: {
            default: null,
            type: cc.Button
        },
        ic_Game: cc.Node,
        baseReels: [],
        payLine: [],
        viewSlot: [],
        payTable: [],
        winningLine: [],
        winType: 0,
        creditWin: 0,
    },

    statics: {
        getInstance: function () {
            if (this.instance == null) {
                this.instance = new DataForGameSlotMaChine();
            }
            return this.instance;
        }
    },
    onLoad() {
        cc.log("chay vao onload");
        var bundleID = cc.sys.localStorage.getItem("GEN_BUNDLEID");
        if (bundleID == null) {
            require("Util").getBundleId();
        } else {
            require("GameManager").getInstance().bundleID = bundleID;
        }
        this.gameView = null;
        this.showSlotGame();
    },


    start() {
        console.log('------> js size X ', cc.winSize.width)
        console.log('------> js size Y ', cc.winSize.height)
        this.btnPlay.node.x = cc.winSize.width * .225
        this.btnPlay.node.y = -cc.winSize.height * .225
    },

    showSlotGame() {
        this.node.active = true;
        this.node.runAction(cc.sequence(cc.fadeTo(1.0, 255).easing(cc.easeSineOut()), cc.callFunc(() => {
            this.btnPlay.interactable = true;
        })));
    },
    initSlot() {
        this.baseReels = [];
        this.baseReels.push([0, 4, 11, 1, 3, 2, 5, 9, 0, 4, 2, 7, 8, 0, 5, 2, 6, 10, 0, 5, 1, 3, 9, 4, 2, 7, 8, 0, 5, 2, 6, 9, 0, 5, 2, 4, 10, 0, 5, 1, 7, 9, 2, 5]);
        this.baseReels.push([4, 1, 11, 2, 7, 0, 9, 5, 1, 3, 8, 4, 2, 6, 12, 4, 0, 3, 1, 8, 4, 2, 6, 0, 10, 4, 1, 3, 2, 12, 4, 0, 7, 1, 8, 2, 4, 0, 9, 1, 6, 2, 8, 0]);
        this.baseReels.push([1, 7, 11, 5, 1, 7, 8, 6, 0, 3, 12, 4, 1, 6, 9, 5, 2, 7, 10, 1, 3, 2, 8, 1, 3, 0, 9, 5, 1, 3, 10, 6, 0, 3, 8, 7, 1, 6, 12, 3, 2, 5, 9, 3]);
        this.baseReels.push([5, 2, 11, 3, 0, 6, 1, 5, 12, 2, 4, 0, 10, 3, 1, 7, 3, 2, 11, 5, 4, 6, 0, 5, 12, 1, 3, 7, 2, 4, 8, 0, 3, 6, 1, 4, 12, 2, 5, 7, 0, 4, 9, 1]);
        this.baseReels.push([7, 0, 11, 4, 6, 1, 9, 5, 10, 2, 7, 3, 8, 0, 4, 9, 1, 6, 5, 10, 2, 8, 3]);

        this.payLine = [];
        this.payLine.push([1, 1, 1, 1, 1]);  //1
        this.payLine.push([0, 0, 0, 0, 0]);  //2
        this.payLine.push([2, 2, 2, 2, 2]);	//3
        this.payLine.push([0, 1, 2, 1, 0]);	//4
        this.payLine.push([2, 1, 0, 1, 2]);	//5
        this.payLine.push([0, 0, 1, 2, 2]);	//6
        this.payLine.push([2, 2, 1, 0, 0]);	//7
        this.payLine.push([1, 0, 1, 2, 1]);	//8
        this.payLine.push([1, 2, 1, 0, 1]);	//9
        this.payLine.push([1, 0, 0, 1, 0]);	//10
        this.payLine.push([1, 2, 2, 1, 2]);	//11
        this.payLine.push([0, 1, 0, 0, 1]);	//12
        this.payLine.push([2, 1, 2, 2, 1]);	//13
        this.payLine.push([0, 2, 0, 2, 0]);	//14
        this.payLine.push([2, 0, 2, 0, 2]);	//15
        this.payLine.push([1, 0, 2, 0, 1]);	//16
        this.payLine.push([1, 2, 0, 2, 1]);	//17
        this.payLine.push([0, 1, 1, 1, 0]);	//18
        this.payLine.push([2, 1, 1, 1, 2]);	//19
        this.payLine.push([0, 2, 2, 2, 0]);  //20

        this.viewSlot = [];
        this.viewSlot.push([2, 5, 9]);
        this.viewSlot.push([1, 3, 2]);
        this.viewSlot.push([5, 9, 3]);
        this.viewSlot.push([7, 0, 4]);
        this.viewSlot.push([6, 5, 10]);

        this.payTable = [];
        this.payTable.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        this.payTable.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        this.payTable.push([0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 10, 2]);
        this.payTable.push([5, 5, 5, 10, 10, 10, 15, 15, 25, 25, 50, 250, 5]);
        this.payTable.push([25, 25, 25, 50, 50, 50, 75, 75, 125, 125, 250, 2500, 0]);
        this.payTable.push([125, 125, 125, 250, 250, 250, 500, 500, 750, 750, 1250, 10000, 0]);

        this.winningLine = [];
        this.winType = 0;
        this.creditWin = 0;
        this.agJackpot = 0;
    },

    creatGame() {
        var arrP = [];
        var pl = {
            id: 123456,
            N: "Naga123456",
            Url: "Naga123456",
            AG: this.getMoney(),
            LQ: 0,
            VIP: 10,
            isStart: true,
            IK: 0,
            sIP: "192.168.1.1",
            G: 3,
            Av: 5,
            FId: 0,
            GId: 0,
            UserType: 1,
            TotalAG: 0,
            timeToStart: 0,
            currentExp: 0,
            currentLevel: 0,
            expNextLevel: 0,
        };

        arrP.push(pl);

        var data = {
            N: "Auto",
            M: 1,
            ArrP: arrP,
            Id: 9999,
            V: 0,
            S: 1,
            issd: true,
            views: this.viewSlot,
            payLine: this.payLine,
            payTable: this.payTable,
            freeSpinCount: 0,
            level: {
                levelUser: 0,
                curLevelExp: 0,
                maxLevelExp: 4,
                agUser: this.getMoney()
            },
            MarkBet: this.getMarkBet(),
            singleLineBet: 0,
        };

        var dataSlot = {
            evt: 'ctable',
            data: data
        };
        this.gameView.handleCTable(data);
    },


    slotView(bet) {

        this.initSlot();
        this.singleLineBet = bet;

        this.getSlotResult();
        this.getCreditWin();

        if (this.creditWin > 10000)
            this.winType += 2;
        else if (this.creditWin > 1000)
            this.winType += 1;

        var agWin = this.creditWin * bet / 20;
        var agSpin = bet;

        var ag = this.getMoney();
        if (require("Slot20LineJPView").instance.isFreeSpin === false) {
            ag = ag + agWin + this.agJackpot - agSpin;
        } else {
            ag = ag + agWin + this.agJackpot;
        }
        cc.sys.localStorage.setItem("agSlotOffline", ag);

        var dataSlot = {
            evt: 'slotViews',
            slotViews: this.viewSlot,
            creditWin: this.creditWin,
            winningLine: this.winningLine,
            lineDetail: this.winningLine,
            freeSpinLeft: 0,
            winType: this.winType,
            freeSpin: false,
            agWin: agWin,
            AG: this.getMoney(),
            level: {
                levelUser: 0,
                curLevelExp: 0,
                maxLevelExp: 4,
                agUser: this.getMoney(),
            },
            MarkBet: this.getMarkBet(),
            singleLineBet: 0,
        };

        //  require('HandleGamePacket').handleGame(JSON.stringify(dataSlot));
        cc.log("data finish=" + JSON.stringify(dataSlot));
        this.gameView.handleSpin(dataSlot);

        this.creditWin = 0;
        this.winType = 0;
        this.winningLine = [];
    },

    showGame() {
        // cc.sys.localStorage.removeItem('agSlotOffline')
        // this.btnPlay.interactable = false;
        cc.loader.loadRes('prefab/Slot20JackPot', (err, prefab) => {
            this.gameView = cc.instantiate(prefab).getComponent("Slot20LineJPView");
            this.node.addChild(this.gameView.node);
            this.gameView.node.name = "GameView";
            this.initSlot();
            this.creatGame();
        });

    },

    getData() {
        if (this.gameView !== null) {
            this.creatGame();
        }
        else {
            this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(() => {
                this.getData();
            })));
        }
    },

    getMoney() {
        var ag = cc.sys.localStorage.getItem("agSlotOffline");
        if (ag === null) {
            cc.sys.localStorage.setItem("agSlotOffline", 100000);
            ag = cc.sys.localStorage.getItem("agSlotOffline");
        }

        return parseInt(ag);
    },

    getMarkBet() {
        // var arr = [];
        let tmp = [];
        tmp.push(1);
        tmp.push(5);
        tmp.push(25);
        tmp.push(50);
        tmp.push(250);
        tmp.push(500);

        // let ag = this.getMoney();

        // for (let i = 0; i < tmp.length; i++) {
        //     if (tmp[i] * 20 <= ag)
        //         arr.push(tmp[i]);
        // }

        return tmp;
    },

    getSlotResult() {
        var tmp = [];

        for (let i = 0, r, u, d; i < this.viewSlot.length && i < this.baseReels.length; i++) {
            u = Math.floor(Math.random() * this.baseReels[i].length);
            r = u + 1;
            d = u + 2;

            r = r % this.baseReels[i].length;
            d = d % this.baseReels[i].length;

            tmp.push([this.baseReels[i][u], this.baseReels[i][r], this.baseReels[i][d]]);
        }

        this.viewSlot = [];
        this.viewSlot = tmp;
        // [[2, 6, 10], [4, 2, 6], [8, 6, 0], [1, 4, 12], [6, 5, 10]]
         //this.viewSlot = [[2, 6, 10], [11, 2, 6], [8, 12, 0], [1, 4, 12], [6, 5, 10]];
        let cout12 = 0;
        for (let i = 1; i < this.viewSlot.length - 1; i++) {
            if (this.viewSlot[i].includes(12)) {
                cout12++;
            }
        }
        if (cout12 > 2) {
            let jackpot = parseInt(cc.sys.localStorage.getItem("JackPot"));
            let message = {
                evt: "jackpotwin",
                N: "haiduy17",
                M: jackpot,
                G: 1000000
            }
            require("HandleServicePacket").handleService(JSON.stringify(message));
            this.agJackpot = jackpot;
        } else this.agJackpot = 0;
        cc.log("Ag jackpot==" + this.agJackpot);
        return this.viewSlot;
    },

    getCreditWin() {
        var win = this.linesWin(this.viewSlot) + this.scatterWin(this.viewSlot);
        this.creditWin += win;
    },

    wildLineWin(line) {
        var values = [11, 0, 0];

        if (line[0] !== values[0])
            return (values);

        for (let i = 0; i < line.length; i++) {
            if (line[i] !== values[0])
                break;

            values[1]++;
        }

        values[2] = this.payTable[values[1]][values[0]];

        return values;
    },

    lineWin(line) {
        var wildWin = this.wildLineWin(line);
        var wildInLineMultiplier = 1;
        var symbol = line[0];

        for (let i = 0; i < line.length; i++) {
            if (line[i] !== 11) {
                if (line[i] !== 12) {
                    symbol = line[i];
                }
                break;
            }

            if (line[i] === 12)
                break;

            if (i < line.length - 1)
                wildInLineMultiplier = 2;
            else if (i === line.length - 1)
                wildInLineMultiplier = 1;
        }

        for (let i = 0; i < line.length; i++) {
            if (line[i] === 11) {
                line[i] = symbol;
                wildInLineMultiplier = 2;
            }
        }

        var number = 0;
        for (let i = 0; i < line.length; i++) {
            if (line[i] === symbol)
                number++;
            else
                break;
        }

        for (let i = number; i < line.length; i++)
            line[i] = -1;

        var win = this.payTable[number][symbol] * wildInLineMultiplier;
        if (win < wildWin[2]) {
            symbol = wildWin[0];
            number = wildWin[1];
            win = wildWin[2];
        }

        return win;
    },

    linesWin() {
        var win = 0;

        for (let l = 0; l < this.payLine.length; l++) {
            let line = [-1, -1, -1, -1, -1];

            for (let i = 0; i < line.length; i++) {
                let index = this.payLine[l][i];
                line[i] = this.viewSlot[i][index];
            }

            let result = this.lineWin(line);

            if (result > 0) {
                let data = {
                    lineId: l,
                    win: 0
                }
                this.winningLine.push(data);
            }
            win += result;
        }

        return win;
    },

    scatterWin() {
        var numberOfScatters = 0;

        for (let i = 0; i < this.viewSlot.length; i++) {
            for (let j = 0; j < this.viewSlot[i].length; j++) {
                if (this.viewSlot[i][j] === 12) {
                    numberOfScatters++;
                }
            }
        }

        var win = this.payTable[numberOfScatters][12] * 20;

        // if(numberOfScatters >= 3) 
        //     this.winType += 100;

        return win;
    },

});

module.export = DataForGameSlotMaChine;