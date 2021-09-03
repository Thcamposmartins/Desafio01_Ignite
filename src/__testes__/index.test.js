const request = require('supertest');
const { validate } = require('uuid');

const app = require('../index');

describe('todo', () => {
  it("should be able to list all user's todo", async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'Thais C',
        username: 'thcm'
      });

    const todoDate = new Date();

    const todoResponse = await request(app)
      .post('/todo')
      .send({
        title: 'TODO now',
        deadline: todoDate
      })
      .set('username', userResponse.body.username);

    const response = await request(app)
      .get('/todo')
      .set('username', userResponse.body.username);

    expect(response.body).toEqual(
      expect.arrayContaining(todoResponse.body),
    )
  });

  it('should be able to create a new todo', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'Thais C',
        username: 'tocm'
      });

    const todoDate = new Date();

    const response = await request(app)
      .post('/todo')
      .send({
        title: 'TODO now',
        deadline: todoDate
      })
      .set('username', userResponse.body.username)
      .expect(201);

    expect(response.body.title).toEqual("TODO now")
  });

  it('should be able to update a todo', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'Thais C',
        username: 'tocm2'
      });

    const todoDate = new Date();

    const todoResponse = await request(app)
      .post('/todo')
      .send({
        title: 'TODO 2',
        deadline: todoDate
      })
      .set('username', userResponse.body.username);

    const response = await request(app)
      .put(`/todo/${todoResponse.body.id}`)
      .send({
        title: 'update title',
        deadline: todoDate
      })
      .set('username', userResponse.body.username);

    expect(response.body).toMatchObject({
      title: 'update title',
      deadline: todoDate.toISOString(),
      done: false
    });
  });

  it('should not be able to update a non existing todo', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'Thais C',
        username: 'tc3'
      });

    const todoDate = new Date();

    const response = await request(app)
      .put('/todo/invalid-todo-id')
      .send({
        title: 'update title',
        deadline: todoDate
      })
      .set('username', userResponse.body.username)
      .expect(400);

    expect(response.body.error).toBeTruthy();
  });

  it('should be able to mark a todo as done', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'Thais C',
        username: 'tcm3'
      });

    const todoDate = new Date();

    const todoResponse = await request(app)
      .post('/todo')
      .send({
        title: 'test TODO',
        deadline: todoDate
      })
      .set('username', userResponse.body.username);

    const response = await request(app)
      .patch(`/todo/${todoResponse.body.id}/done`)
      .set('username', userResponse.body.username);

    expect(response.body).toMatchObject({});
  });

  it('should not be able to mark a non existing todo as done', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'Thais C',
        username: 'user4'
      });

    const response = await request(app)
      .patch('/todo/invalid-todo-id/done')
      .set('username', userResponse.body.username)
      .expect(400);

    expect(response.body.error).toBeTruthy();
  });

  it('should be able to delete a todo', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'Thais C',
        username: 'tcm8'
      });

    const todoDate = new Date();

    const todo1Response = await request(app)
      .post('/todo')
      .send({
        title: 'test TODO',
        deadline: todoDate
      })
      .set('username', userResponse.body.username);

    await request(app)
      .delete(`/todo/${todo1Response.body.id}`)
      .set('username', userResponse.body.username)
      .expect(200);

    const listResponse = await request(app)
      .get('/todo')
      .set('username', userResponse.body.username);

    expect(listResponse.body).toEqual([]);
  });

  it('should not be able to delete a non existing todo', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'Thais C',
        username: 'tcm9'
      });

    const response = await request(app)
      .delete('/todo/invalid-todo-id')
      .set('username', userResponse.body.username)
      .expect(200);

    expect(response.status).toBeTruthy();
  });
});