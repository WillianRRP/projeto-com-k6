/*
conmando para executar o teste:
k6 run ./mao-na-massa/consulta-crocodilos-ID.js -e URL=https://test-api.k6.io/public
*/
import http from 'k6/http';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
    scenarios: {
        listar: {
            executor: 'constant-arrival-rate',
            exec: 'listar',
            duration: '30s',
            rate: 200,
            timeUnit: '1s',
            preAllocatedVUs: 150,
            gracefulStop: '10s',
            tags: {
                test_type: 'listagem_de_crocodilos_id',
            },
        },

        buscar: {
            executor: 'per-vu-iterations',
            exec: 'buscar',
            vus: 50,
            iterations: 20,
            maxDuration: '1m',
            gracefulStop: '10s',
            tags: {
                test_type: 'busca_de_crocodilos_id',
            },
        },
    },
};

export function listar() {
    http.get(__ENV.URL+'crocodiles');
}

export function buscar() {
    if (__VU % 2 === 0) {
        http.get(__ENV.URL+'crocodiles/2');
    } else {
        http.get(__ENV.URL+'crocodiles/1');
    }
}


export function handleSummary(data) {
    return {
        'summary.html': htmlReport(data),
    };
}
