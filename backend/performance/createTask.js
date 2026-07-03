import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 20,
    duration: '30s',
};

const BASE_URL = "http://localhost:5000";
const TOKEN = "YOUR_JWT_TOKEN";

export default function () {

    const payload = JSON.stringify({
        title: "Performance Testing",
        description: "Created by k6",
        status: "Pending"
    });

    const params = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`
        }
    };

    const res = http.post(
        `${BASE_URL}/api/tasks`,
        payload,
        params
    );

    check(res, {
        "Task Created": (r) => r.status === 201
    });
}