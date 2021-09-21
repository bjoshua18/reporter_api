import '../config'
import request from 'supertest'
import assert from 'assert'
import app from '../../src/app'
import { Department } from '../../src/models'
import { factory } from '../factories'

describe('Departments', () => {
  describe('GET /departments', () => {
    it('should GET all departments', async () => {
      await factory.createMany<Department>('department', 3)
      request(app)
        .get('/api/departments')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          assert.equal(res.body.status, 'OK')
          assert.ok(res.body.data)
          assert.ok(Array.isArray(res.body.data))
          assert.equal(res.body.data.length, 3)
        })
    })
  })

  describe('GET /departments/:id', () => {
    it('should GET a specific department', async () => {
      const department = await factory.create<Department>('department')
      request(app)
        .get(`/api/departments/${department.id}`)
        .expect(200)
        .expect(res => {
          assert.ok(res.body.data)
          assert.equal(res.body.data.code, department.code)
        })
    })

    context('given a fake id', () => {
      it('should GET a 404 error', done => {
        request(app)
          .get('/api/departments/6144c984ab0101a701ade319')
          .expect(404)
          .expect(res => {
            assert.ok(res.body.error)
            assert.equal(res.body.status, 'not-found')
          })
          .end(done)
      })
    })
  })

  describe('POST /departments', () => {
    it('should save a department', async () => {
      const dep_attrs = await factory.attrs<Department>('department')
      request(app)
        .post('/api/departments')
        .send(dep_attrs)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .expect(res => {
          assert.ok(res.body.data)
          assert.ok(res.body.data._id)
          assert.equal(res.body.status, 'created')
          assert.equal(res.body.data.code, dep_attrs.code)
        })
    })

    context('given incomplete data', () => {
      it('should throw a error', async () => {
        const dep_attrs = await factory.attrs<Department>('department')
        request(app)
          .post('/api/departments')
          .send({...dep_attrs, code: null})
          .set('Accept', 'application/json')
          .expect(500)
          .expect(res => {
            assert.ok(res.body.error)
          })
      })
    })
  })

  describe('PUT /departments/:id', () => {
    it('should update fields', async () => {
      const department = await factory.create<Department>('department')
      const dep_attrs = await factory.attrs<Department>('department')
      request(app)
        .put(`/api/departments/${department.id}`)
        .send({ name: dep_attrs.name, address: dep_attrs.address })
        .expect(200)
        .expect(res => {
          assert.ok(res.body.data)
          assert.equal(res.body.data.name, dep_attrs.name)
          assert.equal(res.body.data.address, dep_attrs.address)
          assert.equal(res.body.data.code, department.code)
        })
    })

    context('given a fake id', () => {
      it('should get a 404 error', done => {
        request(app)
          .put('/api/departments/6144c984ab0101a701ade319')
          .send({ name: 'Other name', address: 'Other address' })
          .expect(404)
          .expect(res => {
            assert.ok(res.body.error)
            assert.equal(res.body.status, 'not-found')
          })
          .end(done)
      })
    })
  })

  describe('DELETE /departments/:id', () => {
    it('should DELETE a specific department', async () => {
      const department = await factory.create<Department>('department')
      request(app)
        .delete(`/api/departments/${department.id}`)
        .expect(200)
        .expect(res => {
          assert.ok(res.body.data)
          assert.equal(res.body.data.code, department.code)
        })
    })

    context('given a fake id', () => {
      it('should get a 404 error', done => {
        request(app)
          .delete('/api/departments/6144c984ab0101a701ade319')
          .expect(404)
          .expect(res => {
            assert.ok(res.body.error)
            assert.equal(res.body.status, 'not-found')
          })
          .end(done)
      })
    })
  })
})
