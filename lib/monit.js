exports.name = 'monit';
exports.usage = [
    '',
    '',
    '    fis-pm monit start ',
    '    fis-pm monit stop',
    '    fis-pm monit restart'
].join('\n');
exports.desc = 'monit pm2 workers';

var ipm2 = require("pm2-interface")(),
	serverInfoFile = __dirname + "/../logs/process.conf";

exports.registry = function(commander){

    commander
    	.option('-s, --size <int>', 'worker memory size', parseInt, 250)
    	.option('-t, --time', 'interval time', parseFloat, 60);

    commander.action(function(){
        var args = Array.prototype.slice.call(arguments),
        	opType = args[0],
        	memorySize = commander.size,
        	intervalTime = commander.time;

        switch(opType){
       		case "start":
       			startMonit(memorySize, intervalTime)
       			break;
       		case "stop":
       			stopMonit()
       			break;
       		case "restart":
       			restartMonit();
       			break;
        }
    });

    function writeProcessInfo(){
	    var serverInfo = {
	        pid : process.pid
	    }
	    fispm.util.write(serverInfoFile, JSON.stringify(serverInfo));
	}

    function startMonit(memorySize, intervalTime){
		ipm2.on("ready", function(){
			writeProcessInfo();
		    console.log("connect to pm2");	
		    setInterval(function(){
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
						    console.log(memory)
						}
						console.log("total memory is = " + total);
				    }
		        });
		    }, intervalTime * 60 * 1000);
		});
	}

	function stopMonit(){
		var serverInfo = fispm.util.readJSON(serverInfoFile);

	    if(serverInfo.pid){
	        process.kill(serverInfo.pid, 'SIGINT'); //windows do not support SIGIUP
	    }else{
	        console.log("do not find the server pid");
	    }
	}

	function restartMonit(){
		stopMonit();
		startMonit();
	}
}