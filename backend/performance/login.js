import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 50,
    duration: '30s',
};

export default function () {

    const payload = JSON.stringify({
        username: "lasya24",
        password: "lasya"
    });

    const res = http.post(
        "http://localhost:5000/api/auth/login",
        payload,
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    // console.log("Status:", res.status);
    // console.log("Body:", res.body);

    check(res, {
        "Login Successful": (r) => r.status === 200,
    });
}