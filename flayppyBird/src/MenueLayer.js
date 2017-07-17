
var mainLayer = cc.Layer.extend({
    sprite:null,
    _bird:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        cc.spriteFrameCache.addSpriteFrames(res.flappy_packer_plist, res.flappy_packer_png);
        //     将plist添加到缓存
        // cc.spriteFrameCache.addSpriteFrames(res.flappy_frame_plist);

        var background = new cc.Sprite(res.Bg_png);
        background.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 1.0,
            rotation: 0
        });
        this.addChild(background);

        var ground = new cc.Sprite(res.Ground_png);
        ground.attr({
            x: 0,
            y: 0,
            anchorX :   0,
            anchorY :   0
        });
        this.addChild(ground);
        //////////地图滚动
        var action0 = new cc.MoveTo(0.5,-120,0);  //为什么是120??
        var action1 = new cc.MoveTo(0,0,0);    //为什么时间是0??
        var action = new cc.Sequence(action0,action1);
        ground.runAction(
            action.repeatForever()//执行移动的动画
        );

        var flappybird = new cc.Sprite("#flappybird.png");
        flappybird.attr({
            x: size.width / 2,
            y: size.height * (4 / 5),
            scale: 1.0,
            rotation: 0
        });
        this.addChild(flappybird);

        this.bird = new cc.Sprite("#bird1.png");
        this.bird.attr({
            x: size.width / 2 ,
            y: flappybird.y-200,
            scale: 1.0,
            rotation: 0
        });
        this.addChild(this.bird);
        ///////////////动画两种方式都可以//////////////////////
        ///////////////方式一//////////////////////
        var frameship01 = cc.spriteFrameCache.getSpriteFrame("bird1.png");
        var frameship02 = cc.spriteFrameCache.getSpriteFrame("bird2.png");
        var frameship03 = cc.spriteFrameCache.getSpriteFrame("bird3.png");
        this._bird = [frameship01,frameship02,frameship03];
        var animation = new cc.Animation(this._bird,0.1);
        this.bird.runAction(cc.animate(animation).repeatForever());
        ///////////////方式二//////////////////////
        // var animation = new cc.Animation();
        //     for (var i = 1; i <= 3; i++) {
        //         var frameName = "bird" + i + ".png";
        //         cc.log("frameName = " + frameName);
        //         var spriteFrame = cc.spriteFrameCache.getSpriteFrame(frameName);
        //         animation.addSpriteFrame(spriteFrame);
        //     }
        // animation.setDelayPerUnit(0.15);           //设置两个帧播放时间
        // animation.setRestoreOriginalFrame(true);    //动画执行后还原初始状态
        // var action_bird = cc.animate(animation);
        //     bird.runAction(cc.repeatForever(action_bird));

        //////////////上下动画
        var up = cc.moveBy(0.5,0,30);
        var down = cc.moveBy(0.5,0,-30);
        var updown = new cc.Sequence(up,down);
        this.bird.runAction(updown.repeatForever());
        
        //////////////各种菜单
        var item_play = new cc.MenuItemSprite(
            new cc.Sprite("#start.png"),
            new cc.Sprite("#start.png"),
            this.gotoGameScene,
            this
        );
        var item_about = new cc.MenuItemSprite(
            new cc.Sprite("#grade.png"),
            new cc.Sprite("#grade.png"),
            this.gotoAboutLayer,
            this
        );
        var item_help = new cc.MenuItemSprite(
            new cc.Sprite("#menu.png"),
            new cc.Sprite("#menu.png"),
            this.gotoHelpLayer,
            this
        );

        item_play.setPosition(cc.p(size.width/2 - 180 , flappybird.y - 420));
        item_about.setPosition(cc.p(size.width/2 + 180, flappybird.y - 420));
        item_help.setPosition(cc.p(size.width/2 , flappybird.y - 580));

        var menu = new cc.Menu(item_play, item_about, item_help);
        menu.attr({
            x   :   0,
            y   :   0
        });
        this.addChild(menu);


        return true;
    },
    gotoGameScene : function () {
        cc.log("gamescene");
        var Scene =new gameScene;
        cc.director.runScene(Scene);

        // var gamelayer = new GameLayer();
        // this.addChild(gamelayer, 2);


    },
    gotoAboutLayer : function () {
        cc.log("aboutscene");
        var Scene =new birdScene;
        var transition=new cc.TransitionCrossFade(1,Scene);
        cc.director.runScene(transition);

    },
    gotoHelpLayer : function () {
        cc.log("helpscene");
        var Scene =new helpScene;
        var transition=new cc.TransitionFade(1,Scene);
        cc.director.runScene(transition);
    },




});

var mainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new mainLayer();
        this.addChild(layer);
    }
});

