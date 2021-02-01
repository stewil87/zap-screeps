var roleUpgrader = require('role.upgrader');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var structure;

        if(!creep.memory.useSource){
            creep.memory.useSource = 0;
        }
        
         //State machine concept
        if(creep.store[RESOURCE_ENERGY] === 0){
            creep.memory.state="MineResources";
        }

        if(creep.store[RESOURCE_ENERGY] === creep.store.getCapacity()){
            creep.memory.state="Unload";
        }

        if(creep.memory.state === "MineResources") {
            
            var sources = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(sources) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources);
            }

        } else if(creep.memory.state === "Unload") {
            structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) =>
                       (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_TOWER ) && s.energy < s.energyCapacity

            });

            if(structure){
                if(creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
        } else{
            roleUpgrader.run(creep);
        }
    }
};

module.exports = roleHarvester;