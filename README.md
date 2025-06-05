
# TruemoneyWallet Webhook


#### วิธีใช้ Api ตัวนี้ก่อนอื่นต้องตรวจ POST ที่เข้ามาว่าเป็น Base64 รึยังหากยังจะคืนค่ากลับไปแต่หากเป็น Base64 จะทำการแสดงผลข้อมูลออกมาในรูปแบบ JSON โดยไม่ผ่าตัว Secret Key ของ JWT ใช้เป็นกรณีศึกษาควรใช้ JWT Secret Key เพื่อความปลอดภัยด้วย!

---



```
Decoded Header: Array
(
    [alg] => HS256
    [typ] => JWT
)
```

```
Decoded Payload: trueArray
(
    [event_type] => P2P
    [received_time] => 2022-01-31T13:02:23+0700
    [amount] => 1000
    [sender_mobile] => 0123456789
    [message] => ค่าไอเทม
    [iat] => 1653538793
)
```

## Installation


```bash
  clone this repository
  npm install
  cd my-project
```
    