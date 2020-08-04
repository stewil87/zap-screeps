var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(!creep.memory.useSource){
            creep.memory.useSource = 0;
        }

        //State machine concept
        if(creep.carry.energy < 20){
            creep.memory.state="MineResources";
        }

        if(creep.carry.energy == creep.carryCapacity){
            creep.memory.state="Ugrade";
        }

        if(creep.memory.state == "MineResources") {
            var sources = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources);
            } 
        }

        if(creep.memory.state == "Ugrade"){
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleUpgrader;