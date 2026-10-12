
import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuração do cenário de carga e dos critérios de aceitação
export const options = {
    stages: [
        // Aumenta gradualmente a carga até atingir 10 usuários virtuais
        // durante o período de 10 segundos.
        { duration: '10s', target: 10 }
    ],

    thresholds: {
        // Exige que mais de 95% das verificações sejam aprovadas.
        checks: ['rate > 0.95'],

        // Define que a taxa de requisições com falha deve ser inferior a 1%.
        http_req_failed: ['rate<0.01'],

        // Exige que o percentil 95 do tempo de resposta seja inferior a 500 ms.
        http_req_duration: ['p(95)<500']
    },
};

// Função executada por cada usuário virtual durante o teste.
export default function () {

    // Define a URL base da API utilizada no teste.
    const BASE_URL = 'https://serverest.dev';

    // Gera um e-mail com valor aleatório para cada execução da iteração.
    const USER = `${Math.random()}@email.com`;

    // Define a senha utilizada no cadastro do usuário.
    const PASS = "teste";
    console.log(USER + " - " + PASS);

    // Envia uma requisição HTTP POST para cadastrar um novo usuário.
    const res = http.post(`${BASE_URL}/usuarios`, {
        "nome": USER,
        "email": USER,
        "password": PASS,
        "administrador": "true"
    });

    // Valida se a API retornou HTTP 201 (usuário criado com sucesso).
    check(res, {
        'Sucesso ao cadastrar usuário': (r) => r.status === 201,
    });

    // Aguarda 1 segundo antes de iniciar a próxima iteração.
    sleep(1);
}