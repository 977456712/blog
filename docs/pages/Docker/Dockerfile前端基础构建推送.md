# 前言
> 在几何汽车的前端项目上，对方是镜像部署，需要我们这边将前端项目打包成镜像并推送到相关的镜像仓库上去，因此我们需要自己构建一个镜像包，并推送过去对应的镜像仓库，并运行部署；


# 目录结构

```
根目录
├── dist    
├── nginx  
│    └──default.conf 
└──Dockerfile 
```
> - dist 为Vue编译出来的项目文件夹
> - nginx下的default.conf ，为项目的nginx配置文件
> - Dockerfile 为一个用来构建镜像的文本文件，文本内容包含了一条条构建镜像所需的指令和说明

### 1.安装docker 环境
window 下载 ,打开安装包 一路next即可，安装后会自动运行，正常是状态栏有鲸鱼小图标![image.png](https://cdn.nlark.com/yuque/0/2022/png/26201795/1656437104583-65d877ea-b8b2-4e92-8a76-9071be6e227c.png#clientId=u3845673f-c737-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=35&id=u86dd0c4b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=35&originWidth=33&originalType=binary&ratio=1&rotation=0&showTitle=false&size=595&status=done&style=none&taskId=u31b872d3-6ebd-4de9-80c7-384c1c93dda&title=&width=33)

### 2.npm run build 打包出来的文件目录放到根目录下
> 视具体打包出来的文件夹而定，这里以dist举例

### 3.编写Dockerfile文件
```dockerfile
FROM nginx:1.20
COPY dist/ /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
```

> - FROM nginx:1.20 指要构建的镜像基于 nginx:1.20镜像而构建，指定版本为：1.20 ,不指定版本默认为： nginx:latest （本地无需要有这个包，会自动从官方远程仓库拉取）
> - COPY dist/ /usr/share/nginx/html 指的是 将更目录下的 dist/ 文件夹 复制到镜像中 /usr/share/nginx/html 目录下
> - COPY nginx/default.conf /etc/nginx/conf.d/default.conf 即将nginx/default.conf 配置文件替换 nginx镜像里面的默认配置文件

### 4. 编写default.conf 配置文件

注：（非必要 如若不要可以去掉 ,NG有个默认的配置文件指向的是 localhost）

```nginx
# 可能需要了解NG的基本配置信息
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;
  
    location / {
        alias   /usr/share/nginx/html;
        index  index.html index.htm;
    }
  
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }   
}
```

### 5.构建镜像
```bash
docekr build -t demo-name .
```
> - 通过docker build 构建
> - -t demo-name 为要打包出来的镜像名称这里名称为 demo-name，也可以添加版本号 如 demo-name:v1，后面的v1 即为版本号;
> - . 代表基础当前目录的Dockerfile来构建镜像


通过 docker images 即可查看刚才构建的镜像包
```shell
$ docker images
REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
demo-name    latest    6d2e85d3488c   17 seconds ago   152MB
```
### 6.运行镜像

```shell
doceker run -d -p 8080:80  --name con-name demo-name
```
> - 通过docker run 来运行镜像
> - -d  为后台运行 ,否则会直接进入容器
> -  -p 8080:80 为端口映射 使得可以访问通过宿主机可以访问容器 
> - demo-name 为要运行的镜像名称
> - --name con-name 设置运行起来的容器名称为 con-name


>   宿主机可通过 http://localhost:8080; 即可成功访问打包出来的项目（自行修改NG配置文件修改访问路径）

### 7.推送（以提供阿里云镜像仓库为例）

通过链接创建个人实例可以获取相对应的账号密码以及推送仓库地址
登录推送流程如下 ，仓库不同，得到的地址也不同
[https://cr.console.aliyun.com/cn-hangzhou/instance/credentials](https://cr.console.aliyun.com/cn-hangzhou/instance/credentials)

```shell
$ sudo docker login --username=用户名 registry.cn-hangzhou.aliyuncs.com
$ docker tag 6d2e85d3488c registry.cn-hangzhou.aliyuncs.com/test_jd_share/test-jd-share:v1
$ docker push registry.cn-hangzhou.aliyuncs.com/test_jd_share/test-jd-share:v1
```
> - docker login 为 登录阿里云Docker Registry
> - docker tag 镜像ID（ IMAGE ID ）为6d2e85d3488c 的镜像包标记为:registry.cn-hangzhou.aliyuncs.com/test_jd_share/test-jd-share:v1
> - docker push 将包进行推送