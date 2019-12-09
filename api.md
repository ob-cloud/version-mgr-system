# VMS 版本管理系统 API

> `http://localhost:8201/common`

## 登录

```js
method: post
url: /oauth/token
```

## 登出

```js
method: delete
url: /oauth/token/{access_token}
```

## 获取列表

```js
method: get
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
url:/consumer/image/getFirmWare
{
  ...firmware
}
```

## 删除记录

```js
method: post
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
url: /consumer/image/deleteFirmWare
{
  id: id
}
```

## 上传

```js
method: post
access_token:ffda5a42-3d8a-4af4-9349-d0e40d6d6f74
url: /consumer/image/uploadFirmware
{
materialNo: ,
log: ,
file:
}

```
