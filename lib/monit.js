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
    	.option('-s, --size <int>', 'worker memory size', parseInt, 250);

    commander.action(function(){
        var args = Array.prototype.slice.call(arguments),
        	opType = args[0],
        	memorySize = commander.size;

        switch(opType){
       		case "start":
       			startMonit(memorySize)
       			break;
        }
    });

    function startMonit(memorySize){
		ipm2.on("ready", function(){
		    console.log("connect to pm2");
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
                        process.exit();
				    }
		        });
		});
	}

}