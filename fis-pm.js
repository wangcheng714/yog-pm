'use strict';

var fispm = module.exports;

Object.defineProperty(global, 'fispm', {
    enumerable : true,
    writable : false,
    value : fispm
});

fispm.util = require("./lib/util.js");
fispm.pm2 = require("./lib/pm2.js");

fispm.cli = {};
fispm.cli.name = "fis-pm";
fispm.cli.commander = null;
fispm.cli.info = fispm.util.readJSON(__dirname + "/package.json");

fispm.cli.help = function(){
    console.log(fispm.cli.info);
}

fispm.cli.version = function(){
    console.log(fispm.cli.info.version);   
}


//this is a strider auto ci test
fispm.cli.run = function(argv){
    var first = argv[2];

    if(first === '-h' || first === '--help'){
        fispm.cli.help();
    } else if(first === '-v' || first === '--version') {
        fispm.cli.version();
    } else if(first[0] === '-'){
        fispm.cli.help();
    } else {
        var commander = fispm.cli.commander = require('commander');
        var cmd = require('./lib/' + first + '.js');
        cmd.registry(
            commander
                .command(cmd.name || first)
                .usage(cmd.usage)
                .description(cmd.desc)
        );
        commander.parse(argv);
    }
};