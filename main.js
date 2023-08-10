import requests

import json

result = ''

send_headers = {

​    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",

​    'Content-Type': 'application/json'

}

send_url = 'https://www.pushplus.plus/send'

\# 减少接口访问 直接定死了

account = ['xxxxx']

\# 需要再往下加 cookies是账号的主要参数

cookies = [

​    {

​        'koa:sess': 'xxxx',

​        'koa:sess.sig': 'xxxxx',

​    }

]

for (index, cookie) in enumerate(cookies):

​    headers = {

​        'authority': 'glados.network',

​        'accept': 'application/json, text/plain, */*',

​        'accept-language': 'zh',

​        \# 'authorization': '', //如果不成功 找这个请求头

​        'content-type': 'application/json;charset=UTF-8',

​        'origin': 'https://glados.network',

​        'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',

​        'sec-ch-ua-mobile': '?0',

​        'sec-ch-ua-platform': '"macOS"',

​        'sec-fetch-dest': 'empty',

​        'sec-fetch-mode': 'cors',

​        'sec-fetch-site': 'same-origin',

​        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',

​    }

​    json_data = {

​        'token': 'glados.network',

​    }

​    response = requests.post('https://glados.network/api/user/checkin',

​                             *cookies*=cookie, *headers*=headers, *json*=json_data, *timeout*=10)

​    r = response.json()

​    result = result + account[index] + ':' + \

​        r['message'] + '剩余' + str(int(float(r['list'][0]['balance']))) + '\n'

send_data = {

​    "token": "你的plusplus token",

​    "title": "签到",

​    "content": result

}

res = requests.post(*headers*=send_headers, *url*=send_url,

​                    *data*=json.dumps(send_data), *timeout*=10)
