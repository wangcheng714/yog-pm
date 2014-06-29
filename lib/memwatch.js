exports.name = 'memwatch';
exports.usage = [
    '',
    '',
    '    fis-pm memwatch '
].join('\n');
exports.desc = 'watch pm2 workers memory usage, restart mem leak workers';

exports.registry = function(commander){

    commander
    	.option('-s, --size <int>', 'worker memory size', parseInt, 250);

    commander.action(function(){
        var args = Array.prototype.slice.call(arguments),
        	memorySize = commander.size;

       		startMonit(memorySize);

    });

    function startMonit(memorySize){
        fispm.pm2.daemonLive(function(result, reason){
            if(result){
                var ipm2 = require("pm2-interface")(),
                    exitTimer = setTimeout(function(){
                        process.exit();
                    }, 3000);
                ipm2.on("ready", function(){
console.log("connect to pm2");
                    clearTimeout(exitTimer);
                    ipm2.rpc.getMonitorData({}, function(err, dt){
                        if(err){
                            console.log(err);
                        }else{
                            var total = 0;
                            for(var i=0; i<dt.length; i++){
                                var memory = dt[i]["monit"]["memory"] / (1024 * 1024);
                                total += memory;
                                if(memory > memorySize){
                                    ipm2.rpc.restartProcessId(dt[i]["pm_id"], function(err, dt){
                                        if(err){
                                            console.log(err);
                                        }
                                    });
                                }
                                console.log(memory);
                            }
                            console.log("total memory is = " + total);
                            process.exit();
                        }
                    });
                });
            }else{
                console.log("pm2 daemon not run!");
            }
        });

	}

}