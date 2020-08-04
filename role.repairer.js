var roleUpgrader = require('role.upgrader');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {


        if(!creep.memory.useSource){
            creep.memory.useSource = 0;
        }
        
         //State machine concept
        if(creep.carry.energy == 0){
            creep.memory.state="MineResources";
        }

        if(creep.carry.energy == creep.carryCapacity){
            creep.memory.state="Repair";
        }

        if(creep.memory.state == "MineResources") {
            //var sources = creep.room.find(FIND_SOURCES);
            var sources = creep.pos.findClosestByPath(FIND_SOURCES);

            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources);
            } 
        }

        if(creep.memory.state == "Repair"){
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES,{
                filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
            });
            if(structure){
                if(creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                } 
            } else{
                roleUpgrader.run(creep);
            }
        }
    }
};

module.exports = roleRepairer;