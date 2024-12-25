var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

//tower thing
    var tower = Game.getObjectById('5b47a5a0ea7393225d6e5ef5');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
//clear mem
for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
    }
}
    
//autospawn to start

var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
console.log('Harvesters: ' + harvesters.length);
var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
console.log('Upgraders: ' + upgraders.length);
var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
console.log('Builders: ' + builders.length);

if(harvesters.length < 1) {
    var newName = 'Harvester' + Game.time;
    console.log('Spawning new harvester: ' + newName);
    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
        {memory: {role: 'harvester'}});
}

if(upgraders.length < 1) {
    var newName = 'Upgrader' + Game.time;
    console.log('Spawning new Upgrader: ' + newName);
    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
        {memory: {role: 'upgrader'}});
}

if(builders.length < 2) {
    var newName = 'builder' + Game.time;
    console.log('Spawning new harvester: ' + newName);
    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
        {memory: {role: 'builder'}});
}


//run screeps
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
    }
}