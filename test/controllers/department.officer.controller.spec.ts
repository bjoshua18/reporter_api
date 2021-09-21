import '../config'
import request from 'supertest'
import assert from 'assert'
import app from '../../src/app'
import { factory } from '../factories'
import { Department, Officer } from '../../src/models'

describe('Officers', () => {
  describe('GET /officers', () => {
    it('should GET all officers of a specific department', async () => {
      const department = await factory.create<Department>('department')
      await factory.create('officer', { department: department.id })
      request(app)
        .get(`/api/departments/${department.id}/officers`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          assert.equal(res.body.status, 'OK')
          assert.ok(res.body.data)
          assert.ok(Array.isArray(res.body.data))
          assert.equal(res.body.data.length, 1)
        })
    })

    context('given another department id', () => {
      it('should GET a empty officers array', async () => {
        const [dep1, dep2] = await factory.createMany<Department>('department', 2)
        await factory.create<Officer>('officer', { department: dep2._id })

        request(app)
          .get(`/api/departments/${dep1.id}/officers`)
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(res => {
            assert.equal(res.body.status, 'OK')
            assert.ok(res.body.data)
            assert.equal(res.body.data.length, 0)
          })
      })
    })
  })

  describe('GET /officers/:id', () => {
    it('should GET a specific officer', async () => {
      const officer = await factory.create<Officer>('officer')
      request(app)
        .get(`/api/departments/${officer.department}/officers/${officer.id}`)
        .expect(200)
        .expect(res => {
          assert.ok(res.body.data)
          assert.equal(res.body.data.plate_number, officer.plate_number)
        })
    })

    context('given a fake id', () => {
      it('should GET a 404 error', done => {
        request(app)
          .get('/api/departments/6144c984ab0101a701ade319/officers/6144c984ab0101a701ade319')
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
    it('should save a officer', async () => {
      const officer_attrs = await factory.attrs<Officer>('officer')

      request(app)
        .post(`/api/department/${officer_attrs.department}/officers`)
        .send(officer_attrs)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .expect(res => {
          assert.ok(res.body.data)
          assert.ok(res.body.data._id)
          assert.equal(res.body.status, 'created')
          assert.equal(res.body.data.plate_number, officer_attrs.plate_number)
        })
    })

    context('given incomplete data', () => {
      it('should throw a error', async () => {
        const officer_attrs = await factory.attrs<Officer>('officer', { department: null })
        request(app)
          .post(`/api/departments/${officer_attrs.department}/officers`)
          .send(officer_attrs)
          .set('Accept', 'application/json')
          .expect(500)
          .expect(res => {
            assert.ok(res.body.error)
          })
      })
    })
  })

  describe('PUT /officers/:id', () => {
    it('should update fields', async () => {
      const officer = await factory.create<Officer>('officer')
      request(app)
        .put(`/api/departments/${officer.department}/officers/${officer.id}`)
        .send({ name: 'Other name' })
        .expect(200)
        .expect(res => {
          assert.ok(res.body.data)
          assert.equal(res.body.data.name, 'Other name')
          assert.equal(res.body.data.plate_number, officer.plate_number)
        })
    })

    context('given a fake id', () => {
      it('should get a 404 error', done => {
        request(app)
          .put('/api/departments/6144c984ab0101a701ade319/officers/6144c984ab0101a701ade319')
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
    it('should DELETE a specific officer', async () => {
      const officer = await factory.create<Officer>('officer')
      request(app)
        .delete(`/api/departments/${officer.department}/officers/${officer.id}`)
        .expect(200)
        .expect(res => {
          assert.ok(res.body.data)
          assert.equal(res.body.data.plate_number, officer.plate_number)
        })
    })

    context('given a fake id', () => {
      it('should get a 404 error', done => {
        request(app)
          .delete('/api/departments/6144c984ab0101a701ade319/officers/6144c984ab0101a701ade319')
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
