
exports.name = 'startOrReload';
exports.usage = [
    '',
    '',
    '    fis-pm startOrReload <configFile> '
].join('\n');

exports.desc = 'start or Reload pm2 service';

var exec = require("child_process").exec;

exports.registry = function(commander){

    commander.action(function(){
        var args = Array.prototype.slice.call(arguments),
            configFile = args[0];
        startOrReload(configFile);
    });

    function execCommand(command){
        var child = exec(command, function(error, stdout, stderr){
            if(error !== null){
                console.log("exec error : " + error);
            }
            if(stdout !== null){
                console.log("exec result : " + stdout);
            }

            process.exit();
        });
        child.on("exit", function(num, signal){
            process.exit();
        });
        child.on("close", function(num, signal){
            process.exit();
            //console.log("close child process");
        });
        child.on("disconnect", function(num, signal){
            process.exit();
            //console.log("disconnect child process");
        });
        child.on("error", function(num, signal){
            console.log("error child process");
            process.exit();
        });
    }

    function startOrReload(configFile){

        var commander = null;

        if(fispm.util.exists(configFile)){
            var config = fispm.util.readJSON(configFile),
                pm2Bin = config[0]["pm2_bin"] ? config[0]["pm2_bin"] + "/pm2" : "pm2",
                nodeBin = config[0]["node_bin"] ? config[0]["node_bin"] + "/node" : "node";
            fispm.pm2.daemonLive(function(result, reason){
console.log("result is " + result);
                if(config[0]){
                    if(result){
                        var name = config[0]["name"];
                        fispm.pm2.appLive(name, function(result, reason){
                            if(result){
                                commander = nodeBin + " " + pm2Bin + " reload " + name;
                            }else{
                                //需要先kill，否则如果上次启动error会导致这次也无法启动
                                commander = nodeBin + " " + pm2Bin + " kill && " +   nodeBin + " " + pm2Bin + " start " + configFile;
                            }
                            execCommand(commander);
                        });
                    }else{
                        commander = nodeBin + " " + pm2Bin + " start " + configFile;
                        execCommand(commander);
                    }
                }else{

                }

            });
        }else{
            console.log("config file not exist!");
            process.exit();
        }
    }

}
