game.module('game.main').require('game.assets', 'game.objects').body(function() {

    game.createScene('Main', {
        backgroundColor : 0x000000,

        init : function() {
            this.world = new game.World(0, 0);

            var ship = new game.Ship(300, 200);

        }
    });

});
