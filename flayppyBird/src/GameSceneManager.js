var GameSceneManger = cc.Layer.extend({

    ctor: function () {
        this._super();
        var size = cc.winSize;
        var colorlayer = new cc.LayerColor(cc.color(125, 125, 125, 125));
        colorlayer.setContentSize(size.width, size.height);
        colorlayer.ignoreAnchor = false;
        colorlayer.attr({
            x   :   size.width/2,
            y   :   size.height/2,
            anchorX :   0.5,
            anchorY :   0.5
        });
        this.addChild(colorlayer);


        
    },


});

