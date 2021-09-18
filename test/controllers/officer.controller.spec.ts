require('../config')
import request from 'supertest'
import assert from 'assert'
import app from '../../src/app'
import { Department, Officer } from '../../src/models'

describe('Officers', async () => {
  beforeEach(done => {
    Department.deleteMany({})
      .then(() => Officer.deleteMany({}, done))
  })

  const dep_data = {
    code: 'D9427381',
    name: 'Department of Test',
    address: 'Test City'
  }

  const officer_data = {
    plate_number: 'P9427381',
    name: 'Dexter Morgan'
  }

  describe('GET /officers', () => {
    it('should GET all officers', done => {
      request(app)
        .get('/api/officers')
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

  describe('GET /officers/:id', () => {
    it('should GET a specific officer', done => {
      const department = new Department(dep_data)
      department.save((err, department) => {
        const officer = new Officer({...officer_data, department: department._id})
        officer.save((err, officer) => {
          request(app)
            .get(`/api/officers/${officer.id}`)
            .expect(200)
            .expect(res => {
              assert.ok(res.body.data)
              assert.equal(res.body.data.plate_number, officer.plate_number)
            })
            .end(done)
        })
      })
    })

    context('given a fake id', () => {
      it('should GET a 404 error', done => {
        request(app)
          .get('/api/officers/6144c984ab0101a701ade319')
          .expect(404)
          .expect(res => {
            assert.ok(res.body.error)
            assert.equal(res.body.status, 'not-found')
          })
          .end(done)
      })
    })
  })

  describe('POST /officers', () => {
    it('should save a officer', done => {
      const department = new Department(dep_data)
      department.save((err, department) => {
        request(app)
          .post('/api/officers')
          .send({...officer_data, department: department._id})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(201)
          .expect(res => {
            assert.ok(res.body.data)
            assert.ok(res.body.data._id)
            assert.equal(res.body.status, 'created')
            assert.equal(res.body.data.plate_number, officer_data.plate_number)
          })
          .end(done)
      })
    })

    context('given incomplete data', () => {
      it('should throw a error', done => {
        request(app)
          .post('/api/officers')
          .send(officer_data)
          .set('Accept', 'application/json')
          .expect(500)
          .expect(res => {
            assert.ok(res.body.error)
          })
          .end(done)
      })
    })
  })

  describe('PUT /officers/:id', () => {
    it('should update fields', done => {
      const department = new Department(dep_data)
      department.save((err, department) => {
        const officer = new Officer({...officer_data, department: department._id})
        officer.save((err, officer) => {
          request(app)
            .put(`/api/officers/${officer.id}`)
            .send({ name: 'Other name' })
            .expect(200)
            .expect(res => {
              assert.ok(res.body.data)
              assert.equal(res.body.data.name, 'Other name')
              assert.equal(res.body.data.plate_number, officer.plate_number)
            })
            .end(done)
        })
      })
    })

    context('given a fake id', () => {
      it('should get a 404 error', done => {
        request(app)
          .put('/api/officers/6144c984ab0101a701ade319')
          .send({ name: 'Other name' })
          .expect(404)
          .expect(res => {
            assert.ok(res.body.error)
            assert.equal(res.body.status, 'not-found')
          })
          .end(done)
      })
    })
  })

  describe('DELETE /officers/:id', () => {
    it('should DELETE a specific officer', done => {
      const department = new Department(dep_data)
      department.save((err, department) => {
        const officer = new Officer({...officer_data, department: department._id})
        officer.save((err, officer) => {
          request(app)
            .delete(`/api/officers/${officer.id}`)
            .expect(200)
            .expect(res => {
              assert.ok(res.body.data)
              assert.equal(res.body.data.plate_number, officer.plate_number)
            })
            .end(done)
        })
      })
    })

    context('given a fake id', () => {
      it('should get a 404 error', done => {
        request(app)
          .delete('/api/officers/6144c984ab0101a701ade319')
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
