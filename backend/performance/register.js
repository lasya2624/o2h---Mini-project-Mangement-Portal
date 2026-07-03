import http from 'k6';

export default function(){

    const random=Math.random();

    http.post(
        "http://localhost:5000/api/auth/register",
        JSON.stringify({
            username:"user"+random,
            password:"123456"
        }),
        {
            headers:{
                "Content-Type":"application/json"
            }
        }
    );
}