var roleHarvester   = require('role.harvester');
var roleUpgrader    = require('role.upgrader');
var roleBuilder     = require('role.builder');
var roleRepairer    = require('role.repairer');
var roleWall        = require('role.wall');
var roleGuard       = require('role.guard');
var roleRampart     = require('role.rampart');
//var roleExtension   = require('role.extension');
var creepState = 0;

//DEFCON 5 (grün) – Friedenszeit
//DEFCON 4 (blau) – Friedenszeit, erhöhte Aufklärung und erhöhte Sicherheitsmaßnahmen
//DEFCON 3 (gelb) – Erhöhte Einsatzbereitschaft, Standard-Funkrufzeichen der US-Truppen werden durch geheime Rufzeichen ersetzt
//DEFCON 2 (rot) – Erhöhte Einsatzbereitschaft, Mobilisierung der Reserve
//DEFCON 1 (weiß) – Maximale Einsatzbereitschaft, alle verfügbaren Truppen werden eingesetzt.

module.exports.loop = function () {

    if(!Memory.defcon){
        Memory.defcon = 5;
    }

    var minHarvester    = 2;
    var minUpgrader     = 2;
    var minBuilder      = 1;
    var minRepairer     = 1;
    var minWall         = 1;
    var minRampart      = 0;
    var minGuard        = 0;
    var minAll          = 0;
    var targets         = [];

    if(Game.time % 20 == 0){
        console.log('check hostile');

        var targets = Game.rooms["E74S39"].find(FIND_HOSTILE_CREEPS);

        //DEFCON System
        if(targets.length == 0){
            Memory.defcon = 5;
        } else if(targets.length == 1 || targets.length == 2){
            Memory.defcon = 4;
        } else if(targets.length == 3){
            Memory.defcon = 3;
        } else if(targets.length == 4){
            Memory.defcon = 2;
        } else if(targets.length <= 5){
            Memory.defcon = 1;
        }

        console.log('DEFCON '+Memory.defcon+' is active.');
    } 

    if(Memory.defcon <= 4){

        var towers = Game.rooms.E74S39.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
        });

        if(towers){
            for(let tower of towers){
                var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(target){
                    tower.attack(target);
                }
            }
        }
    } 
    if(Memory.defcon <= 3){
        minBuilder      = 1;
        minUpgrader     = 2;
        minGuard        = 1;
        minRampart      = 0;
    }
    if(Memory.defcon <= 2){
        minHarvester    = 1;
        minUpgrader     = 2;
        minBuilder      = 1;
        minRepairer     = 1;
        minWall         = 1;
        minGuard        = 2;
    }
    if(Memory.defcon == 1){
        minHarvester    = 1;
        minUpgrader     = 1;
        minBuilder      = 0;
        minRepairer     = 0;
        minWall         = 0;
        minGuard        = 6;
    }

	/*AutoBuild*/
    var minimumNumberOfHarvesters = minHarvester;
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');

    var minimumNumberOfUpgrader = minUpgrader;
    var numberOfUpgrader = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');

    var minimumNumberOfBuilder = minBuilder;
    var numberOfBuilder = _.sum(Game.creeps, (c) => c.memory.role == 'builder');

    var minimumNumberOfRepairer = minRepairer;
    var numberOfRepairer = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');

    var minimumNumberOfWall = minWall;
    var numberOfWall = _.sum(Game.creeps, (c) => c.memory.role == 'wall');

    var minimumNumberOfGuard = minGuard;
    var numberOfGuard = _.sum(Game.creeps, (c) => c.memory.role == 'guard');

    var minimumNumberOfRampart = minRampart;
    var numberOfRampart= _.sum(Game.creeps, (c) => c.memory.role == 'rampart');    

    //carbagecollector for creeps
    for(var i in Memory.creeps) {

        if(numberOfHarvesters > minimumNumberOfHarvesters){
           if(Game.creeps[i].memory.role == 'harvester'){
                Game.creeps[i].suicide();
           }
        }

        if(numberOfUpgrader > minimumNumberOfUpgrader){
           if(Game.creeps[i].memory.role == 'upgrader'){
                Game.creeps[i].suicide();
           }
        }

        if(numberOfBuilder > minimumNumberOfBuilder){
           if(Game.creeps[i].memory.role == 'builder'){
                Game.creeps[i].suicide();
           }
        }

        if(numberOfRepairer > minimumNumberOfRepairer){
           if(Game.creeps[i].memory.role == 'repairer'){
                Game.creeps[i].suicide();
           }
        }

        if(numberOfWall > minimumNumberOfWall){
           if(Game.creeps[i].memory.role == 'wall'){
                Game.creeps[i].suicide();
           }
        }

        if(numberOfGuard > minimumNumberOfGuard){
           if(Game.creeps[i].memory.role == 'guard'){
                Game.creeps[i].suicide();
           }
        }

        if(numberOfRampart > minimumNumberOfRampart){
           if(Game.creeps[i].memory.role == 'rampart'){
                Game.creeps[i].suicide();
           }
        }

        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }


    //not enough guard
    if (minimumNumberOfGuard == 1) {
        newNameg = Game.spawns['HomeSweetHome'].createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,MOVE], undefined,
            { role: 'guard' });
    }
    else if(minimumNumberOfGuard > 1){
        newNameg = Game.spawns['HomeSweetHome'].createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,MOVE], undefined,
            { role: 'guard' });
    }
    //not enough harvesters
    else if (numberOfHarvesters < minimumNumberOfHarvesters) {
 
        newNameh = Game.spawns['HomeSweetHome'].createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE], undefined,
            { role: 'harvester', useSource: 1});
    }
    //not enough upgrader
    else if (numberOfUpgrader < minimumNumberOfUpgrader) {
        newNameu = Game.spawns['HomeSweetHome'].createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE], undefined,
            { role: 'upgrader', useSource: 0});
    }
    //not enough repairer
    else if(numberOfRepairer < minimumNumberOfRepairer){
        newNameb = Game.spawns['HomeSweetHome'].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], undefined,
            { role: 'repairer', useSource: 1});
    }
    //not enough builder
    else if(numberOfBuilder < minimumNumberOfBuilder){
    	newNameb = Game.spawns['HomeSweetHome'].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE], undefined,
            { role: 'builder', useSource: 0});
    }
    //not enough wall
    else if(numberOfWall < minimumNumberOfWall){
        newNameb = Game.spawns['HomeSweetHome'].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined,
            { role: 'wall', useSource: 0});
    }
    //not enough rampart
    else if(numberOfRampart < minimumNumberOfRampart){
        newNamer = Game.spawns['HomeSweetHome'].createCreep([WORK,CARRY,MOVE], undefined,
            { role: 'rampart' });
    }
    /*AutoBuild end*/

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'wall') {
            roleWall.run(creep);
        }
        if(creep.memory.role == 'guard') {
            roleGuard.run(creep);
        }
        if(creep.memory.role == 'rampart') {
            roleRampart.run(creep);
        }
    }
}