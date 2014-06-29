fis-pm
================

## 安装

* npm install -g fis-pm

## 使用

```bash
$ fis-pm monit start #检查pm2的子进程内存状况，防止内存泄漏
$ fis-pm monit start -s 250 #超过250M的子进程，进行热重启
$ fis-pm startOrReload pm2-pro.json #利用pm2-pro.json文件启动引用

pm2配置文件

    pm2-pro.json 设置pm2的bin位置
    [{
        "name" : "pm_app",
        "pm_bin" : "/home/users/***/pm2/bin" //设置pm2的bin目录
    }]

