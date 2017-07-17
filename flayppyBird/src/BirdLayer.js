var BirdLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
/*        var size = cc.winSize;
        var colorlayer = new cc.LayerColor(cc.color(125, 125, 125, 125));
        colorlayer.setContentSize(size.width, size.height);
        colorlayer.ignoreAnchor = false;
        colorlayer.attr({
            x   :   size.width/2,
            y   :   size.height/2,
            anchorX :   0.5,
            anchorY :   0.5
        });
        this.addChild(colorlayer);*/
        this.initbrid();
        cc.log("BirdLayer");
    },

    initbrid : function(){
        var size = cc.winSize;
        //////////////添加小鸟
        this.bird = new cc.Sprite("#bird1.png");
        this.bird.attr({
            x: size.width ,
            y: size.height/2 -200,
            scale: 1.0,
            rotation: 0
        });
        this.addChild(this.bird);
        //////////////挥翅动画
        var frameship01 = cc.spriteFrameCache.getSpriteFrame("bird1.png");
        var frameship02 = cc.spriteFrameCache.getSpriteFrame("bird2.png");
        var frameship03 = cc.spriteFrameCache.getSpriteFrame("bird3.png");
        this._bird = [frameship01,frameship02,frameship03];
        var animation = new cc.Animation(this._bird,0.1);
        this.bird.runAction(cc.animate(animation).repeatForever());
        //////////////上下动画
        var up = cc.moveBy(0.5,0,30);
        var down = cc.moveBy(0.5,0,-30);
        var updown = new cc.Sequence(up,down);
        this.bird.runAction(updown.repeatForever());



    },

    updatebrid: function(){
        this.bird.setPositionX(0.1,-25);
        this.passTime += dt;
        cc.log("this.bird.y="+ this.bird.getPositionX());
        if(this.bird.x < 0){
            this.bird.setPositionX(720);
        }
    },
/*    onEnter: function () {
        this._super();
        cc.log("HelloWorld onEnter");
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
    },*/
    onTouchBegan: function (touch, event) {
        var self = event._currentTarget;
        if (self._start) {

            self.startX();

            //self.schedule(self.onUpdatelength(),0.02);
            node.runAction(cc.blink(2,10));
            //node.runAction(cc.rotateTo(1,180));


            return true;
        }
        return false;
    },
    onTouchEnded:function(touch,event){
        var self = event._currentTarget;
        cc.log("touch End!!");
        self.stopX();
        //stickSprite.runAction(cc.rotateTo(0.5,90));

        return true;
    },




});

var birdScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new BirdLayer();
        this.addChild(layer);
        cc.log("birdScene");
    }
});

