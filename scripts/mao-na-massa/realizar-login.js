import http from 'k6/http';
import {check, sleep} from 'k6';
import {SharedArray} from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

export const options = {
    stages: [
        { duration: '5', target: 5 },
        { duration: '5s', target: 10 },
        { duration: '2', target: 50 },
        { duration: '2', target: 50 },
        { duration: '0s', target: 0 },
    ],
    thresholds: {
        http_req_failed: ['rate< 0.01']
    },
}

const csvData = new SharedArray('ler dados', function () {
    return papaparse.parse(open('./usuarios.csv'), { header: true }).data;
});


export default function () {
    const BASE_URL = 'https://serverest.dev';
    const USER = csvData[Math.floor(Math.random() * csvData.length)].email;
    const PASS = "teste";
    console.log(USER + PASS);

    const res = http.post(`${BASE_URL}/login`, {
        "email": USER,
        "password": PASS,
    });
    console.log(`Status: ${res.status}`),
    console.log(`Resposta: ${res.body}`);


    check(res, {
        'sucesso ao logar': (r) => r.status === 200,
        'token recebido': (r) => r.json('acess') !== '',
    });
    sleep(1);

}






