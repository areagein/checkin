import json
import os

import requests

from dailycheckin import CheckIn


class Glados(CheckIn):
    name = "GLADOS"

    def __init__(self, check_item):
        self.check_item = check_item

    @staticmethod
    def sign(cookies):
        checkin_url = "https://glados.rocks/api/user/checkin"
        status_url = "https://glados.rocks/api/user/status"
        payload = {
            'token': 'glados.network'
        }
        headers = {'cookie': cookies,
                   'referer': "https://glados.rocks/console/checkin",
                   'origin': "https://glados.rocks",
                   'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36",
                   'content-type': 'application/json;charset=UTF-8'}
        result = "签到失败"
        email = "无法获取"
        leftDays = "无法获取"
        message = "无法获取"
        try:
            checkin_res = requests.post(
                checkin_url, headers=headers, data=json.dumps(payload)).json()
            status = requests.get(status_url, headers=headers).json()
            message = checkin_res['message']
            if 'list' in checkin_res:
                result = "签到成功"
                email = status['data']['email']
                leftDays = status['data']['leftDays'].split('.')[0]
        except Exception as errorMsg:
            result = "签到异常"
            message = repr(errorMsg)
        return [
            {"name": "帐号信息", "value": email},
            {"name": "签到结果", "value": result},
            {"name": "剩余天数", "value": leftDays},
            {"name": "签到信息", "value": message},
        ]

    def main(self):
        cookie = self.check_item.get("cookie")
        msg = self.sign(cookie)
        msg = "\n".join(
            [f"{one.get('name')}: {one.get('value')}" for one in msg])
        print(msg)
        return msg


if __name__ == "__main__":
    with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), "config.json"), "r", encoding="utf-8") as f:
        datas = json.loads(f.read())
    _check_item = datas.get("GLADOS", [])[0]
    print(Glados(check_item=_check_item).main())
