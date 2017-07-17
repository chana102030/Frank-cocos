var HelpLayer = cc.Layer.extend({

    ctor : function () {
        this._super();
        // cc.base(this);

        this._title = 'Chipmunk Collision test';
        this._subtitle = 'Using Object Oriented API. ** Use this API **';
    },

    // init physics
    initPhysics : function() {
        var staticBody = this.space.staticBody;

        // Walls
        var walls = [ new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(winSize.width,0), 0 ),               // bottom
            new cp.SegmentShape( staticBody, cp.v(0,winSize.height), cp.v(winSize.width,winSize.height), 0),    // top
            new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(0,winSize.height), 0),             // left
            new cp.SegmentShape( staticBody, cp.v(winSize.width,0), cp.v(winSize.width,winSize.height), 0)  // right
        ];
        for( var i=0; i < walls.length; i++ ) {
            var wall = walls[i];
            wall.setElasticity(1);
            wall.setFriction(1);
            this.space.addStaticShape( wall );
        }
        // Gravity:
        // testing properties
        this.space.gravity = cp.v(0,-100);
        this.space.iterations = 15;
    },

    createPhysicsSprite : function( pos, file, collision_type ) {
        var body = new cp.Body(1, cp.momentForBox(1, 48, 108) );
        body.setPos(pos);
        this.space.addBody(body);
        var shape = new cp.BoxShape( body, 48, 108);
        shape.setElasticity( 0.5 );
        shape.setFriction( 0.5 );
        shape.setCollisionType( collision_type );
        this.space.addShape( shape );

        var sprite = new cc.PhysicsSprite(file);
        sprite.setBody( body );
        return sprite;
    },

    onEnter : function () {
        ChipmunkBaseLayer.prototype.onEnter.call(this);
        // cc.base(this, 'onEnter');

        this.initPhysics();
        this.scheduleUpdate();

        var sprite1 = this.createPhysicsSprite( cc.p(winSize.width/2, winSize.height-20), s_pathGrossini, 1);
        var sprite2 = this.createPhysicsSprite( cc.p(winSize.width/2, 50), s_pathSister1, 2);

        this.addChild( sprite1 );
        this.addChild( sprite2 );

        this.space.addCollisionHandler( 1, 2,
            this.collisionBegin.bind(this),
            this.collisionPre.bind(this),
            this.collisionPost.bind(this),
            this.collisionSeparate.bind(this)
        );
    },

    onExit : function() {
        this.space.removeCollisionHandler( 1, 2 );
        ChipmunkBaseLayer.prototype.onExit.call(this);
    },

    update : function( delta ) {
        this.space.step( delta );
    },

    collisionBegin : function ( arbiter, space ) {

        if( ! this.messageDisplayed ) {
            var label = new cc.LabelBMFont("Collision Detected", s_bitmapFontTest5_fnt);
            this.addChild( label );
            label.x = winSize.width/2;
            label.y = winSize.height/2 ;
            this.messageDisplayed = true;
        }
        cc.log('collision begin');
        var shapes = arbiter.getShapes();
        var collTypeA = shapes[0].collision_type;
        var collTypeB = shapes[1].collision_type;
        cc.log( 'Collision Type A:' + collTypeA );
        cc.log( 'Collision Type B:' + collTypeB );
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

    title : function(){
        return 'Chipmunk Collision test';
    }
});



var helpScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelpLayer();
        this.addChild(layer);
    }
});


