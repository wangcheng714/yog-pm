fis-pm
================

## 安装

* npm install -g fis-pm

## 使用

```bash
$ fis-pm memwatch #检查pm2的子进程内存状况，防止内存泄漏
$ fis-pm memwatch -s 250 #对于超过250M的子进程，进行热重启
$ fis-pm startOrReload /home/wangcheng/demo/pm2-pro.json #利用pm2-pro.json文件启动引用
$ fis-pm daemon /home/wangcheng/demo/pm2-pro.json #pm2的守护进程，pm2自带的upstart功能需要root权限，通常无法使用

pm2配置文件

    pm2-pro.json 设置pm2的bin位置
    [{
        "name" : "pm_app",
        "pm2_bin" : "/home/users/***/pm2/bin" //设置pm2的bin目录,不设置则采用系统默认的
        "node_bin" : "/home/users/***/node/bin" //设置pm2的bin目录
    }]

