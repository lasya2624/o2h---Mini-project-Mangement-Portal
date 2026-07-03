import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 50,
    duration: '30s',
};

const BASE_URL = "http://localhost:5000";
const TOKEN = "YOUR_JWT_TOKEN";

export default function () {

    const res = http.get(
        `${BASE_URL}/api/tasks?search=design`,
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        }
    );

    check(res, {
        "Search Successful": (r) => r.status === 200
    });
}