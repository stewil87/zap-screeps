var roleLogistic = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //State machine concept
        if(creep.carry.energy == 0){
            creep.memory.state="MineResources";
        }

        if(creep.carry.energy == creep.carryCapacity){
            creep.memory.state="Carry";
        }

        if(creep.memory.state == "MineResources") {
            var sources = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources);
            } 
        }

        if(creep.memory.state == "Carry"){
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleLogistic;