const request = require('supertest');
const { expect } = require('chai') 
require('dotenv').config() 
const { obterToken } = require('../helpers/autenticacao')
const postTransferencias = require('../fixtures/postTransferencias.json')

describe('Transferencias', () => {
    let token
        
    beforeEach(async () => {
        token = await obterToken('julio.lima', '123456')
    })

    describe('POST /transferencias', () => {
        
        it('Deve retornar sucesso com 201 quando o valor da transferencias for igual ou acima de R$ 10,00', async () => {
            const bodyTransferencias = { ...postTransferencias }
            
            const resposta = await request(process.env.BASE_URL)
              .post('/transferencias')
              .set('Content-Type', 'application/json')
              .set('Authorization', `Bearer ${token}`)
              .send(bodyTransferencias) 

              expect(resposta.status).to.equal(201);
        })

        it('Deve retornar falha com 422 quando o valor da transferencias for abaixo de R$ 10,00', async () => {
            const bodyTransferencias = { ...postTransferencias }
            bodyTransferencias.valor = 7

            const resposta = await request('http://localhost:3000')
              .post('/transferencias')
              .set('Content-Type', 'application/json')
              .set('Authorization', `Bearer ${token}`)
              .send(bodyTransferencias) 

              expect(resposta.status).to.equal(422);
        })
    })

    describe('GET /transferencias/{id}', () => {  
        it('Deve retornar sucesso com 200 quando o ID for válido', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/transferencias/1')
                .set('Authorization', `Bearer ${token}`)
            
            expect(resposta.status).to.equal(200)
            expect(resposta.body).to.be.an('object')
        })
    })

    describe('GET /transferencias', () => {
        it('Deve retornar 10 elementos na paginacao quando informar limite de 10 registros', async () => {
           const resposta  = await request(process.env.BASE_URL)
              .get('/transferencias?page=1&limit=10')
              .set('Authorization', `Bearer ${token}`)

            expect(resposta.status).to.equal(200)
            expect(resposta.body.limit).to.equal(10)
            expect(resposta.body.transferencias).to.have.lengthOf(10)
        })
    })
})