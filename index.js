const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post('/decode-jwt', (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    
    if (!req.body.msg) {
        const arr_msg = {
            "status": "false",
            "code": "400",
            "msg": "Input is empty",
            "error": "empty",
            "data": "none"
        };
        return res.json(arr_msg);
    }
    
    const jwtToken = req.body.msg;
    const jwtParts = jwtToken.split('.');
    
    try {
        if (jwtParts.length === 3) {
            const [headerBase64, payloadBase64, signature] = jwtParts;
            
            const headerStr = Buffer.from(headerBase64, 'base64').toString();
            const payloadStr = Buffer.from(payloadBase64, 'base64').toString();
            
            const header = JSON.parse(headerStr);
            const payload = JSON.parse(payloadStr);
            
            const isoDate = payload.received_time;
            const dateTime = new Date(isoDate);
            
            const options = { 
                timeZone: 'Asia/Bangkok', 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            };
            
            const convertedDateTime = dateTime.toLocaleString('en-US', options)
                .replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$3-$1-$2 $4:$5:$6');
            
            return res.send(`Decoded Header: ${JSON.stringify(header)}\nDecoded Payload: ${JSON.stringify(payload)}`);
            
        } else {
            return res.send("Invalid JWT format.");
        }
    } catch (e) {
        const arr_msg = {
            "status": "false",
            "code": "401",
            "msg": "Invalid Token",
            "error": e.message,
            "data": "none"
        };
        return res.json(arr_msg);
    }
});

function decodeJWT() {
    const jwtToken = document.getElementById('jwtInput').value;
    
    if (!jwtToken) {
        const arr_msg = {
            "status": "false",
            "code": "400",
            "msg": "Input is empty",
            "error": "empty",
            "data": "none"
        };
        document.getElementById('result').textContent = JSON.stringify(arr_msg, null, 2);
        return;
    }
    
    const jwtParts = jwtToken.split('.');
    
    try {
        if (jwtParts.length === 3) {
            const [headerBase64, payloadBase64, signature] = jwtParts;
            
            function base64UrlDecode(input) {
                input = input.replace(/-/g, '+').replace(/_/g, '/');
                const pad = input.length % 4;
                if (pad) {
                    if (pad === 1) {
                        throw new Error('Invalid base64 string');
                    }
                    input += new Array(5-pad).join('=');
                }
                
                return decodeURIComponent(atob(input).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
            }
            
            const header = JSON.parse(base64UrlDecode(headerBase64));
            const payload = JSON.parse(base64UrlDecode(payloadBase64));
            
            if (payload.received_time) {
                const isoDate = payload.received_time;
                const dateTime = new Date(isoDate);
                
                dateTime.setHours(dateTime.getHours() + 7);
                const convertedDateTime = dateTime.toISOString().replace('T', ' ').substring(0, 19);
                
                payload.thailand_time = convertedDateTime;
            }
            
            const result = 
                "Decoded Header: " + JSON.stringify(header, null, 2) +
                "\n\nDecoded Payload: " + JSON.stringify(payload, null, 2);
                
            document.getElementById('result').textContent = result;
            
        } else {
            document.getElementById('result').textContent = "Invalid JWT format.";
        }
    } catch (e) {
        const arr_msg = {
            "status": "false",
            "code": "401",
            "msg": "Invalid Token",
            "error": e.message,
            "data": "none"
        };
        document.getElementById('result').textContent = JSON.stringify(arr_msg, null, 2);
    }
}