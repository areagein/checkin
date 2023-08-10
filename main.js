# -*- coding: utf-8 -*-
import json
import os
import hashlib

import requests

from dailycheckin import CheckIn


class EverPhoto(CheckIn):
    name = "时光相册"

    def __init__(self, check_item):
        self.check_item = check_item

    @staticmethod
    def sign(mobile, password):
        salt = "tc.everphoto."
        pwd = salt + password
        password = hashlib.md5(pwd.encode()).hexdigest()
        data = {"mobile": mobile, "password": password}
        headers = {
            "user-agent": "EverPhoto/4.5.0 (Android;4050002;MuMu;23;dev)",
            "application": "tc.everphoto",
        }
        try:
            response = requests.post(
                url="https://web.everphoto.cn/api/auth", headers=headers, data=data).json()
            if response.get("code") == 0:
                data = response.get("data")
                token = data.get("token")
                mobile = data.get("user_profile", {}).get("mobile")
                return token, {"name": "账号信息", "value": mobile}
            else:
                return False, {"name": "账号信息", "value": "登录失败"}
        except Exception as e:
            return False, {"name": "账号信息", "value": "登录失败"}

    @staticmethod
    def checkin(token):
        headers = {
            "user-agent": "EverPhoto/4.5.0 (Android;4050002;MuMu;23;dev)",
            "application": "tc.everphoto",
            "content-type": "application/json",
            "host": "openapi.everphoto.cn",
            "connection": "Keep-Alive",
            "authorization": f"Bearer {token}",
        }
        try:
            response = requests.post(
                url="https://openapi.everphoto.cn/sf/3/v4/PostCheckIn", headers=headers).json()
            if response.get("code") == 0:
                data = response.get("data")
                checkin_result = data.get("checkin_result")
                if checkin_result:
                    return {"name": "签到信息", "value": "签到成功"}
                else:
                    return {"name": "签到信息", "value": "已签到过或签到失败"}
            else:
                return {"name": "签到信息", "value": "签到失败"}
        except Exception as e:
            return {"name": "签到信息", "value": "签到失败"}

    def main(self):
        mobile = self.check_item.get("mobile")
        password = self.check_item.get("password")
        token, sign_msg = self.sign(mobile=mobile, password=password)
        msg = [sign_msg]
        if token:
            checkin_msg = self.checkin(token=token)
            msg.append(checkin_msg)
        msg = "\n".join(
            [f"{one.get('name')}: {one.get('value')}" for one in msg])
        return msg


if __name__ == "__main__":
    with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), "config.json"), "r", encoding="utf-8") as f:
        datas = json.loads(f.read())
    _check_item = datas.get("EVERPHOTO", [])[0]
    print(EverPhoto(check_item=_check_item).main())
