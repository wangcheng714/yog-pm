
exports.name = 'startOrReload';
exports.usage = [
    '',
    '',
    '    fis-pm startOrReload <configFile> '
].join('\n');

exports.desc = 'start or Reload pm2 service';

var ipm2 = require("pm2-interface")();
var exec = require("child_process").exec;

exports.registry = function(commander){

    commander.action(function(){
        var args = Array.prototype.slice.call(arguments),
            configFile = args[0];

        startOrReload(configFile);
    });

    function startOrReload(configFile){
        exec("ps aux | grep 'pm2: Daemon'", function(error, stdout, stderr){
            console.log(stdout);
            if(error !== null){
                console.log("exec error : " + error);
            }
            if(stdout !== null){
                var results = stdout.split("Daemon");
                if(results.length > 3){
                    if(fispm.util.exists(configFile)){
                        var config = fispm.util.readJSON(configFile);
                        if(config[0] && config[0]["bin"]){
                            var name = config[0]["name"],
                                command = config[0]["bin"] + "/pm2 reload " + name;
                            exec(command, function(error, stdout, stderr){
                                if(error !== null){
                                    console.log("exec error : " + error);
                                }
                                if(stdout !== null){
                                    console.log("exec result : " + stdout);
                                }
                                process.exit();
                            });
                        }
                    }else{
                        console.log("config file not exist!");
                        process.exit();
                    }
                }else{
                    if(fispm.util.exists(configFile)){
                        var config = fispm.util.readJSON(configFile);
                        if(config[0] && config[0]["bin"]){
                            var command = config[0]["bin"] + "/pm2 start " + configFile;
                            exec(command, function(error, stdout, stderr){
                                if(error !== null){
                                    console.log("exec error : " + error);
                                }
                                if(stdout !== null){
                                    console.log("exec result : " + stdout);
                                }
                                process.exit();
                            });
                        }
                    }else{
                        console.log("config file not exist!");
                        process.exit();
                    }
                }
            }
        });
    }

}