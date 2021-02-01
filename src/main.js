var SPAWNNAME = 'Spawn1';
var ROOMNAME = 'W6N1';

var roleHarvester   = require('role.harvester');
var roleUpgrader    = require('role.upgrader');
var roleBuilder     = require('role.builder');
var roleRepairer    = require('role.repairer');

module.exports.loop = function () {

    var minHarvester    = 2;
    var minUpgrader     = 3;
    var minBuilder      = 2;
    var minRepairer     = 0;

    var HarvesterParts    = [WORK,CARRY,MOVE];
    var UpgraderParts     = [WORK,CARRY,MOVE];
    var BuilderParts      = [WORK,CARRY,MOVE];
    var RepairerParts     = [WORK,CARRY,MOVE];

    var RoomLVL         = 1;

    if(Game.time % 20 === 0){
        if(!Memory) {
            Memory = {}; // similar to Memory = JSON.parse(RawMemory.get());
        }
    }

    if(Game.time % (60 * 5) === 0){
        RoomLVL = Game.rooms[ROOMNAME].controller.level
        console.log("Room lvl: " + Game.rooms[ROOMNAME].controller.level);
    }

    /*Level based Building*/
    if(RoomLVL >= 2){
        // PARTS
        HarvesterParts    = [WORK,CARRY,MOVE,MOVE];
        UpgraderParts     = [WORK,CARRY,CARRY,MOVE];
        BuilderParts      = [WORK,CARRY,MOVE,MOVE];
        RepairerParts     = [WORK,CARRY,MOVE,MOVE];

        // NUMBER OF CREEPS
        minRepairer     = 1;
    }

    /*AutoBuild*/
    var minimumNumberOfHarvesters = minHarvester;
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role === 'harvester');

    var minimumNumberOfUpgrader = minUpgrader;
    var numberOfUpgrader = _.sum(Game.creeps, (c) => c.memory.role === 'upgrader');

    var minimumNumberOfBuilder = minBuilder;
    var numberOfBuilder = _.sum(Game.creeps, (c) => c.memory.role === 'builder');

    var minimumNumberOfRepairer = minRepairer;
    var numberOfRepairer = _.sum(Game.creeps, (c) => c.memory.role === 'repairer');

    //carbagecollector for creeps
    for(var i in Memory.creeps) {

        if(numberOfHarvesters > minimumNumberOfHarvesters){
            if(Game.creeps[i].memory.role === 'harvester'){
                Game.creeps[i].suicide();
            }
        } 

        if(numberOfUpgrader > minimumNumberOfUpgrader){
            if(Game.creeps[i].memory.role === 'upgrader'){
                Game.creeps[i].suicide();
            }
        }

        if(numberOfBuilder > minimumNumberOfBuilder){
            if(Game.creeps[i].memory.role === 'builder'){
                Game.creeps[i].suicide();
            }
        }

        if(numberOfRepairer > minimumNumberOfRepairer){
            if(Game.creeps[i].memory.role === 'repairer'){
                Game.creeps[i].suicide();
            }
        }

        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }


    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        newNameh = Game.spawns[SPAWNNAME].createCreep(HarvesterParts, undefined,
            { role: 'harvester', useSource: 1});
    }
    //not enough upgrader
    else if (numberOfUpgrader < minimumNumberOfUpgrader) {
        newNameu = Game.spawns[SPAWNNAME].createCreep(UpgraderParts, undefined,
            { role: 'upgrader', useSource: 0});
    }
    //not enough repairer
    else if(numberOfRepairer < minimumNumberOfRepairer){
        newNameb = Game.spawns[SPAWNNAME].createCreep(RepairerParts , undefined,
            { role: 'repairer', useSource: 1});
    }
    //not enough builder
    else if(numberOfBuilder < minimumNumberOfBuilder){
        newNameb = Game.spawns[SPAWNNAME].createCreep(BuilderParts, undefined,
            { role: 'builder', useSource: 0});
    }
    /*AutoBuild end*/

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];

        if(creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role === 'repairer') {
            roleRepairer.run(creep);
        }
    }
}