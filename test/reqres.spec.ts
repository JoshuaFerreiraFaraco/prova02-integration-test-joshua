//https://reqres.in/api-docs/#/default/post_register
//https://www.postman.com/irynavkm/reqres-in/request/fc0aoi7/register-successful?tab=body

import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

describe('Reqres Rest API', () => {
  const email = "eve.holt@reqres.in"
  const password = "pistol";
  const page = 1;
  const delay = 0;
  const i_usuario = 1;
  let id = 0;
  
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://reqres.in/api';

  p.request.setDefaultTimeout(90000);
  p.reporter.add(rep);

  it('Registro Reqres', async () => {
    await p
      .spec()
      .post(`${baseUrl}/register`)
      .withHeaders('x-api-key', 'reqres-free-v1')
      .withJson({
        email: email,
        password: password
      })
      .expectStatus(StatusCodes.OK)
      .expectJsonSchema({
        type: 'object'
      })
      .returns('token');
  });

  it('Apenas Usuarios Definidos podem registrar Reqres', async () => {
    await p
      .spec()
      .post(`${baseUrl}/register`)
      .withHeaders('x-api-key', 'reqres-free-v1')
      .withJson({
        email: 'joshua@gmail.com',
        password: password
      })
      .expectStatus(StatusCodes.BAD_REQUEST)
      .expectJsonSchema({
        type: 'object'
      })
      .expectBodyContains('Note: Only defined users succeed registration');
  });

  it('Login Reqres', async () => {
    await p
      .spec()
      .post(`${baseUrl}/login`)
      .withHeaders('x-api-key', 'reqres-free-v1')
      .withJson({
        email: email,
        password: password
      })
      .expectStatus(StatusCodes.OK)
      .expectJsonSchema({
        type: 'object'
      });
  });

  it('Usuario nao encontrado Login Reqres', async () => {
    await p
      .spec()
      .post(`${baseUrl}/login`)
      .withHeaders('x-api-key', 'reqres-free-v1')
      .withJson({
        email: 'joshua@gmail.com',
        password: password
      })
      .expectStatus(StatusCodes.BAD_REQUEST)
      .expectJsonSchema({
        type: 'object'
      })
      .expectBodyContains('user not found');
  });

  it('Logout Reqres', async () => {
    await p
      .spec()
      .post(`${baseUrl}/Logout`)
      .withHeaders('x-api-key', 'reqres-free-v1')
      .expectStatus(StatusCodes.OK);
  });

  it('Listar Usuarios Reqres', async () => {
    await p
      .spec()
      .get(`${baseUrl}/users?page=${page}&delay=${delay}`)
      .withHeaders('x-api-key', 'reqres-free-v1')
      .expectStatus(StatusCodes.OK)
      .expectJsonSchema({
        type: 'object'
      });
  });

  it('Listar Usuario Unico Reqres', async () => {
    await p
      .spec()
      .get(`${baseUrl}/users/${i_usuario}`)
      .withHeaders('x-api-key', 'reqres-free-v1')
      .expectStatus(StatusCodes.OK)
      .expectJsonSchema({
        type: 'object'
      });
  });

  it('Listar Usuario Inexistente Reqres', async () => {
    await p
      .spec()
      .get(`${baseUrl}/users/100`)
      .withHeaders('x-api-key', 'reqres-free-v1')
      .expectStatus(StatusCodes.NOT_FOUND)
      .expectJsonSchema({
        type: 'object'
      });
  });

  it('Criar Usuario Reqres', async () => {
    id = await p
      .spec()
      .post(`${baseUrl}/users`)
      .withHeaders('x-api-key', 'reqres-free-v1')
      .withJson({
        name: faker.internet.displayName,
        job: faker.person.jobArea
      })
      .expectStatus(StatusCodes.CREATED)
      .expectJsonSchema({
        type: 'object'
      })
      .returns('id');
  });

  it('Atualizar Usuario Reqres', async () => {
    await p
      .spec()
      .put(`${baseUrl}/users/${id}`)
      .withHeaders('x-api-key', 'reqres-free-v1')
      .withJson({
        name: faker.internet.displayName,
        job: faker.person.jobArea
      })
      .expectStatus(StatusCodes.OK)
      .expectJsonSchema({
        type: 'object'
      }).inspect();
  });

  afterAll(() => p.reporter.end());
});
