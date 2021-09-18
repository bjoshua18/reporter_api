require('../config')
import request from 'supertest'
import assert from 'assert'
import app from '../../src/app'
import { Department } from '../../src/models'

describe('Departments', () => {
  beforeEach(done => {
    Department.deleteMany({}, done)
  })

  const data = {
    code: 'D9427381',
    name: 'Department of Test',
    address: 'Test City'
  }

  describe('GET /departments', () => {
    it('should GET all departments', done => {
      request(app)
        .get('/api/departments')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          assert.equal(res.body.status, 'OK')
          assert.ok(res.body.data)
          assert.ok(Array.isArray(res.body.data))
        })
        .end(done)
    })
  })

  describe('GET /departments/:id', () => {
    it('should GET a specific department', done => {
      const department = new Department(data)
      department.save((err, department) => {
        request(app)
          .get(`/api/departments/${department.id}`)
          .expect(200)
          .expect(res => {
            assert.ok(res.body.data)
            assert.equal(res.body.data.code, department.code)
          })
          .end(done)
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
    it('should save a department', done => {
      request(app)
        .post('/api/departments')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .expect(res => {
          assert.ok(res.body.data)
          assert.ok(res.body.data._id)
          assert.equal(res.body.status, 'created')
          assert.equal(res.body.data.code, data.code)
        })
        .end(done)
    })

    context('given incomplete data', () => {
      it('should throw a error', done => {
        request(app)
          .post('/api/departments')
          .send({...data, code: null})
          .set('Accept', 'application/json')
          .expect(500)
          .expect(res => {
            assert.ok(res.body.error)
          })
          .end(done)
      })
    })
  })

  describe('PUT /departments/:id', () => {
    it('should update fields', done => {
      const department = new Department(data)
      department.save((err, department) => {
        request(app)
          .put(`/api/departments/${department.id}`)
          .send({ name: 'Other name', address: 'Other address' })
          .expect(200)
          .expect(res => {
            assert.ok(res.body.data)
            assert.equal(res.body.data.name, 'Other name')
            assert.equal(res.body.data.address, 'Other address')
            assert.equal(res.body.data.code, department.code)
          })
          .end(done)
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
    it('should DELETE a specific department', done => {
      const department = new Department(data)
      department.save((err, department) => {
        request(app)
          .delete(`/api/departments/${department.id}`)
          .expect(200)
          .expect(res => {
            assert.ok(res.body.data)
            assert.equal(res.body.data.code, department.code)
          })
          .end(done)
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
