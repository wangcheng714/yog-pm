#!/bin/env bash
# set path
export PATH=/home/users/wangcheng/wenku-node/base/node_modules/.bin:$PATH
#set app conf
conf_file="/home/users/wangcheng/wenku-node/base/pm2-pro.json"
# set app name
app_name="yd-node"
count=`ps ux | grep -c -w "pm2: Daemon"`
if [ $count -gt 1 ]; then
	app_count=`ps ux | grep -c -w "pm2: $app_name"`
	if [ $app_count -le 1 ]; then
		/home/users/wangcheng/.jumbo/bin/node /home/users/wangcheng/wenku-node/base/node_modules/.bin/pm2 start $conf_file
	fi
else
	/home/users/wangcheng/.jumbo/bin/node /home/users/wangcheng/wenku-node/base/node_modules/.bin/pm2 start $conf_file
fi
