var roleGuard = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var target = creep.pos.findNearest(Game.HOSTILE_CREEPS);

        if(target && creep.hits > creep.hitsMax - 500 /* no more attack */) {
            creep.moveTo(target);
            creep.attack(target);
        } else {
            creep.moveTo(Game.spawns.HomeSweetHome);
        }
    }
};

module.exports = roleGuard;