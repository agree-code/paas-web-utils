# PAAS-WEB-UTILS

- PaaS Cloud 规则库

## 使用

```js
import { ListView } from "paas-web-utils/rules";

new ListView();
```

## 初始化环境

```bash
cnpm install -g gulp
cnpm install
```

## 编译

规则库需要编译后，才能上传提交

代码：`gulp build`

## 从命令行创建一个新的仓库

```bash
touch README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin git@192.168.180.10:PRO-PAAS-HTML/paas-web-utils.git
git push -u origin master
```

## 从命令行推送已经创建的仓库

```bash
git remote add origin git@192.168.180.10:PRO-PAAS-HTML/paas-web-utils.git
git push -u origin master
```
