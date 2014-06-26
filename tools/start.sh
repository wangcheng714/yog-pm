#!/bin/env bash
# set path
export PATH=/home/users/wangcheng/wenku-node/base/node_modules/.bin:$PATH
#set app conf
conf_file="pm2-pro.json"
# set app name
app_name="yd-node"
count=`ps ux | grep -c -w "pm2: Daemon"`
if [ $count -gt 1 ]; then
#echo $app_name
	app_count=`ps ux | grep -c -w "pm2: $app_name"`
#echo $app_count
	if [ $app_count -gt 1 ]; then
		pm2 reload $app_name			
	else
		pm2 kill
		pm2 start $conf_file
	fi
else
	pm2 kill
	pm2 start $conf_file
fi
