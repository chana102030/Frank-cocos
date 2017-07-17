var AboutLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
        var size = cc.winSize;
        var background = new cc.Sprite(res.Bg_png);
        background.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 1.0,
            rotation: 0
        });
        this.addChild(background);
    }


});

var aboutScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new AboutLayer();
        this.addChild(layer);
    }
});
