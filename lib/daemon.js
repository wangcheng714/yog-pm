exports.name = 'daemon';
exports.usage = [
    '',
    '',
    '    fis-pm daemon <configFile>'
].join('\n');

exports.desc = 'watch pm2 daemon process, make sure pm2 work fine';

var exec = require("child_process").exec;

exports.registry = function(commander){

    commander
    	.option('-s, --size <int>', 'worker memory size', parseInt, 250);

    commander.action(function(){
        var args = Array.prototype.slice.call(arguments),
            configFile = args[0];

        startDaemon(configFile);
    });

    function execCommand(commander){
        console.log("start exec command " + command);
        var child = exec(commander, function(error, stdout, stderr){
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

    function startDaemon(configFile){
        if(fispm.util.exists(configFile)){
            var config = fispm.util.readJSON(configFile),
                pm2Bin = config[0]["pm2_bin"] ? config[0]["pm2_bin"] + "/pm2" : "pm2",
                nodeBin = config[0]["node_bin"] ? config[0]["node_bin"] + "/node" : "node";
            var commander = null;
            fispm.pm2.daemonLive(function(result, reason){
                if(config[0]){
                    if(result){
                        console.log("pm2 daemon live!");
                        var name = config[0]["name"];
                        fispm.pm2.appLive(name, function(result, reason){
                            if(!result){
                                console.log("app : " + name + " not live!");
                                commander = nodeBin + " " + pm2Bin + " kill && " +   nodeBin + " " + pm2Bin + " start " + configFile;
                                execCommand(commander);
                            }else{
                                console.log("everything is ok");
                            }
                        });
                    }else{
                        console.log("pm2 daemon not run!");
                        commander = nodeBin + " " + pm2Bin + " start " + configFile;
                        execCommand(commander);
                    }

                }else{

                }
            });
        }
	}

}