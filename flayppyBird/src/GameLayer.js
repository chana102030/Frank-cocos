var GameLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
        var size = cc.winSize;

        background = new cc.Sprite(res.Bg_png);
        background.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 1.0,
            rotation: 0
        });
        this.addChild(background);

        sfCache = cc.spriteFrameCache;
        sfCache.addSpriteFrames(res.flappy_packer_plist, res.flappy_packer_png);

        var getready = new cc.Sprite("#getready.png");
        getready.attr({
            x: size.width / 2,
            y: size.height * (4 / 5),
            scale: 1.0,
            rotation: 0
        });
        this.addChild(getready);

        var click = new cc.Sprite("#click.png");
        click.attr({
            x: size.width / 2,
            y: size.height * ( 1 / 2),
            scale: 1.0,
            rotation: 0
        });
        this.addChild(click);

        //////////////添加小鸟
        // bird = new cc.Sprite("#bird1.png");
        // bird.attr({
        //     x: size.width / 2 -200,
        //     y: size.height/2 +200,
        //     scale: 1.0,
        //     rotation: 0
        // });
        // this.addChild(bird);

        // this.initbrid();
        this.initground();

        // 注册 触摸事件监听器
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchEnded: this.onTouchEnded
        }, this);


        // this.schedule(this.updatescore);

        /////////////////////////添加物理引擎

        this.initPhysics();
        this.scheduleUpdate();

        bird = this.createPhysicsSprite( cc.p(size.width/2 -200, size.height/2 +200),"#bird1.png", 1);
        // pipeup = this.createPhysicsSprite( cc.p(size.width/2+100, 50), "#holdback1.png", 2);
        this.addChild(bird);
        // this.addChild(pipeup);
        this.initbridAnimation();


        this.initpipe();
        this.initpipe1();
        this.schedule(this.updatepipe);

        // this.initpipeupdown();  //一次创建四个水管
        //////////////////////添加碰撞检测
        // this.space.addCollisionHandler( 1, 2,
        //     this.collisionBegin.bind(this),
        //     this.collisionPre.bind(this),
        //     this.collisionPost.bind(this),
        //     this.collisionSeparate.bind(this)
        // );


    },

    initground : function(){
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
    },
    initbridAnimation : function(){
        //////////////挥翅动画
        var frameship01 = cc.spriteFrameCache.getSpriteFrame("bird1.png");
        var frameship02 = cc.spriteFrameCache.getSpriteFrame("bird2.png");
        var frameship03 = cc.spriteFrameCache.getSpriteFrame("bird3.png");
        this._bird = [frameship01,frameship02,frameship03];
        var animation = new cc.Animation(this._bird,0.1);
        bird.runAction(cc.animate(animation).repeatForever());
        //////////////上下动画
        // var up = cc.moveBy(0.5,0,30);
        // var down = cc.moveBy(0.5,0,-30);
        // var updown = new cc.Sequence(up,down);
        // bird.runAction(updown.repeatForever());
    },

    onTouchBegan:function (touch, event) {
        cc.log("touch");
        bird.rotation = -20;
        //////////////向上飞
        // var up = cc.moveBy(0.1,0,250);
        // bird.runAction(up); //这样写就会随着高度而变化移动距离，也就是物理时间move距离不固定

        // bird.setVel(cp.v(0, 100));   // 不能这样写
        body.setVel( cp.v(0, 150));  //设置固定向上的速度

        return false;
    },
    //////////////添加水管
    initpipe : function() {


        var size = cc.winSize;
        var i = Math.random();
        var pipedgap = 200;
        var pipedownheight = 830 * i + 150;
        var pipeupheight = size.height - pipedownheight - pipedgap;

        var batchNode_pipedown = new cc.SpriteBatchNode(res.flappy_packer_png);
        pipedown = new cc.Scale9Sprite();
        pipedown.updateWithBatchNode(batchNode_pipedown, cc.rect(1, 459, 148, 830), false, cc.rect(0, 80, 148, 670));
        //var pipedown = new cc.Scale9Sprite(res.flappy_packer_png,cc.rect(1,459,148,830),cc.rect(1,519,148,670));
        this.addChild(pipedown);
        pipedown.width = 148;
        pipedown.height = pipedownheight;
        //pipedown.runAction(cc.scaleTo(1,1,0.5));
        //pipedown.setScaleY (0.3);
        //pipedown.scaleY = 0.5;  //即使定义为九宫精灵，进行scale还是会变形

        pipeup = new cc.Scale9Sprite(res.flappy_packer_png, cc.rect(150, 459, 148, 830), cc.rect(0, 80, 148, 670));
        this.addChild(pipeup);
        //pipeup.width = 448;
        //pipeup.height = 883;
        pipeup.setContentSize(148, pipeupheight);

        pipecont = 0;  //用来判断是否第一次创建pipe
        if (pipecont > 0) {
            pipedown.attr({
                x: size.width - 74,
                y: -50,
                // scaleY: 10,
                anchorX: 0,
                anchorY: 0
            });
            pipeup.attr({
                x: size.width - 74,
                y: size.height + 50,
                anchorX: 0,
                anchorY: 1
            })
        }
        else {
            pipedown.attr({
                x: size.width - 74,
                y: -50,
                anchorX: 0,
                anchorY: 0
            });
            pipeup.attr({
                x: size.width - 74,
                y: size.height + 50,
                anchorX: 0,
                anchorY: 1
            });
        }
        var left = cc.moveBy(0.1,-25, 0);
        pipeup.runAction(left.repeatForever());
        pipedown.runAction(cc.moveBy(0.1,-25,0).repeatForever()); //pipedown.runAction(left);就只有一个会运动，估计是一次只能一个精灵调用action

        ///////////////绑定刚体

        var width = pipedown.width;
        var height = pipedown.height;
        var mass = width * height /1000;
        var rockbody = new cp.Body(mass, cp.momentForBox(mass, width, height));
        this.space.addBody(rockbody);
        rockbody.setPos(cp.v(pipedown.x, pipedown.y));   //给刚体设置重心位置
        // rockbody.setAngle(1);
        shape = this.space.addShape(new cp.BoxShape(rockbody, width, height));
        shape.setFriction(0);
        shape.setElasticity(0);
        rockbody.setVel( cp.v(-100, 0));  //设置固定向上的速度

        // pipedown.setBody( rockbody );
        var sprite1 = new cc.PhysicsSprite();
        // sprite1 .addChild ( pipedown );
        this.addChild(sprite1);
        sprite1.setBody( rockbody );

        sprite1.setPosition(pipedown.getPositionX(), pipedown.getPositionY()+100);
        // sprite1.setGravity(false);  //不能用
        // sprite1.gravity = cp.v(0, 0);
        cc.log("pipedown.y="+ pipedown.getPositionY());
      



    },
        //////////////////////第二个水管
    initpipe1 : function(){
        var size = cc.winSize;
        var n = Math.random();
        var pipedown1height = 830 * n + 150;
        var pipedgap = 200;
        var pipeup1height = size.height - pipedown1height - pipedgap;

        var batchNode_pipedown1 = new cc.SpriteBatchNode(res.flappy_packer_png);
        pipedown1 = new cc.Scale9Sprite();
        pipedown1.updateWithBatchNode(batchNode_pipedown1, cc.rect(1,459,148,830), false, cc.rect(0,80,148,670));
        this.addChild(pipedown1);
        pipedown1.width = 148;
        pipedown1.height = pipedown1height;

        pipeup1 = new cc.Scale9Sprite(res.flappy_packer_png,cc.rect(150,459,148,830),cc.rect(0,80,148,670));
        this.addChild(pipeup1);
        pipeup1.setContentSize(148, pipeup1height);

        pipedown1.attr({
                x: pipedown.getPositionX()+ 320,
                y: -50,
                anchorX :   0,
                anchorY :   0
        });
        pipeup1.attr({
                x:pipedown.getPositionX()+ 320,
                y: size.height+50,
                anchorX :   0,
                anchorY :   1
        });
        pipeup1.runAction(cc.moveBy(0.1,-25,0).repeatForever());
        pipedown1.runAction(cc.moveBy(0.1,-25,0).repeatForever());

    },

    updatepipe: function(){
        var pipeposition = pipedown.getPositionX();
        var pipeposition1 = pipedown1.getPositionX();
        var pipewidth = pipedown.getContentSize().width;
        if(pipeposition< -pipewidth){
            this.removeChild(pipedown);
            this.removeChild(pipeup);
            cc.log("pipeup");
            this.initpipe();
        }
        if(pipeposition1< -pipewidth){
            this.removeChild(pipedown1);
            this.removeChild(pipeup1);
            this.initpipe1();
        }
    },

    updatescore: function(){
        var birdposition = bird.getPosition();
        cc.log("birdposition= "+birdposition.x);
        var birdsize = bird.getContentSize();
        var backgroundsize = background.getPosition();

        var pipedownposition = pipedown.getPosition();
        var pipeupposition = pipeup.getPosition();

        var pipedown1position = pipedown1.getPosition();
        var pipeup1position = pipeup1.getPosition();
        var pipedownsize = pipedown.getContentSize();
        var pipeupsize = pipeup.getContentSize();
        var pipedown1size = pipedown1.getContentSize();
        var pipeup1size = pipeup1.getContentSize();

        if(birdposition.x> pipedownposition.x){
            //count ++ ;
            ///////分数显示 及音乐添加

            cc.log("通过了第一个柱子");

        }
        if(birdposition.x> pipedown1position.x){
            //count ++ ;
            ///////分数显示 及音乐添加

            cc.log("通过了第2二个柱子");

        }
    },

    /////////////////////以下写法上下管子写在一起，每次出现四个管子
    initpipeupdown : function(){
        var size = cc.winSize;
        for (var i = 0; i< 2 ; i++){
            pipeup = new cc.Sprite("#holdback2.png");
            pipedown = new cc.Sprite("#holdback1.png");

            singlePipe = new cc.Node();
            singlePipe.addChild(pipeup);
            singlePipe.addChild(pipedown);  //pipeDown默认加到（0,0），上下合并，此时singlePipe以下面的管子中心为锚点
            this .addChild(singlePipe);   //把两个管子都加入到层

            var PIPE_HEIGHT = 840;
            var PIPE_SPACE = 300; //该值决定了游戏难易度
            var PIPE_INTERVAL = 360; //
            var WAIT_DISTANCE = 360; //size.width / 2= 360
            var getRandomHeight = 650 * Math.random() -240 ; //随机高度，经过验证高度最小最大为-250～400
            pipeup.setPosition(0, PIPE_HEIGHT + PIPE_SPACE); //这行要注意，如果写在addChild(pipeup);之后，那就变成固定位置了
            singlePipe.setPosition(i*PIPE_INTERVAL + WAIT_DISTANCE, getRandomHeight ); //设置初始高度 i*PIPE_INTERVAL + WAIT_DISTANCE


        }
    },

    ////////////////////////////添加物理引擎

    setupDebugNode : function()
    {
        // debug only
        this._debugNode = new cc.PhysicsDebugNode(this.space );
        this._debugNode.visible = true ;
        this.addChild( this._debugNode );
    },
    initPhysics : function() {
        var winSize = cc.director.getWinSize();
        this.space = new cp.Space();
        this.setupDebugNode();
        // 设置重力
        this.space.gravity = cp.v(0, 0);
        var staticBody = this.space.staticBody;

        // Walls
        var walls = [ new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(winSize.width,0), 0 ),               // bottom
            // new cp.SegmentShape( staticBody, cp.v(0,winSize.height), cp.v(winSize.width,winSize.height), 0),    // top
            // new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(0,winSize.height), 0),             // left
            // new cp.SegmentShape( staticBody, cp.v(winSize.width,0), cp.v(winSize.width,winSize.height), 0)  // right
        ];
        for( var i=0; i < walls.length; i++ ) {
            var wall = walls[i];
            wall.setElasticity(1);
            wall.setFriction(1);
            this.space.addStaticShape( wall );
        }

        // Gravity:
        // testing properties
        this.space.iterations = 15;
    },

    createPhysicsSprite : function( pos, file, collision_type ) {
        body = new cp.Body(1, cp.momentForBox(1, 48, 108) );
        body.setPos(pos);
        this.space.addBody(body);

        var shape = new cp.BoxShape( body, 68, 58);
        shape.setElasticity( 0.5 );
        shape.setFriction( 0.5 );
        // shape.setCollisionType( collision_type );
        this.space.addShape( shape );

        var sprite = new cc.PhysicsSprite(file);
        sprite.setBody( body );
        return sprite;

    },
    update : function( delta ) {
        this.space.step( delta );
    },

    collisionBegin : function ( arbiter, space ) {

        cc.log('collision begin');
        var shapes = arbiter.getShapes();
        var collTypeA = shapes[0].collision_type;
        var collTypeB = shapes[1].collision_type;
        cc.log( 'Collision Type A:' + collTypeA );
        cc.log( 'Collision Type B:' + collTypeB );

        //test addPostStepCallback
        // space.addPostStepCallback(function(){
        //     cc.log("post step callback 1");
        // });
        // space.addPostStepCallback(function(){
        //     cc.log("post step callback 2");
        // });
        return true;
    },

    collisionPre : function ( arbiter, space ) {
        cc.log('collision pre');
        return true;
    },

    collisionPost : function ( arbiter, space ) {
        cc.log('collision post');
    },

    collisionSeparate : function ( arbiter, space ) {
        cc.log('collision separate');
    },

    // onExit : function() {
    //     this.space.removeCollisionHandler( 1, 2 );
    //     ChipmunkBaseLayer.prototype.onExit.call(this);
    // },

});

var gameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});
