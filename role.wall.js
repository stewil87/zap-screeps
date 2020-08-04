var percentage = 0;
var roleWall = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
         //State machine concept
        if(creep.carry.energy == 0){
            creep.memory.state="MineResources";
        }

        if(creep.carry.energy == creep.carryCapacity){
            creep.memory.state="Wall";
        }

        if(creep.memory.state == "MineResources") {
            var sources = creep.pos.findClosestByPath(FIND_SOURCES);

            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources);
            } 
        }

        if(creep.memory.state == "Wall"){
            // loop with increasing percentages
            for (let percentage = 0.0001; percentage <= 1; percentage = percentage + 0.0001){

                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_RAMPART ||
                                    s.structureType == STRUCTURE_WALL
                                    ) &&
                                   s.hits / s.hitsMax < percentage
                });

                if (target != undefined) {
                    break;
                }
            }

            if (target != undefined) {
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
};

module.exports = roleWall;