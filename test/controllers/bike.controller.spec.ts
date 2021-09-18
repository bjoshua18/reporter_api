require('../config')
import request from 'supertest'
import assert from 'assert'
import app from '../../src/app'
import { Bike } from '../../src/models'

describe('Bikes', () => {
  beforeEach( done => {
    Bike.deleteMany({}, (err) => done())
  })

  const data = {
    license_number: 'A3729104',
    color: 'black',
    type: 'standard',
    owner_name: 'Test Owner',
    theft_description: 'Test description',
    address_theft: 'Test Street'
  }

  describe('GET /bikes', () => {
    it('should GET all bike reports', done => {
      request(app)
        .get('/api/bikes')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          assert.ok(res.body.data)
          assert.ok(Array.isArray(res.body.data))
          assert.equal(res.body.data.length,0)
        })
        .end(done)
    })
  })

  describe('GET /bikes/:id', () => {
    it('should GET a specific bike report', done => {
      const bike = new Bike(data)
      bike.save((err, bike) => {
        request(app)
          .get(`/api/bikes/${bike.id}`)
          .expect(200)
          .expect(res => {
            assert.ok(res.body.data)
            assert.equal(res.body.data.license_number, bike.license_number)
          })
          .end(done)
      })

    })

    context('given a fake id', () => {
      it('should GET a 404 error', done => {
        request(app)
          .get('/api/bikes/6144c984ab0101a701ade319')
          .expect(404)
          .expect(res => {
            assert.ok(res.body.error)
            assert.equal(res.body.status, 'not-found')
          })
          .end(done)
      })
    })
  })

  describe('POST /bikes', () => {
    it('should save a bike report', done => {
      request(app)
        .post('/api/bikes')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .expect(res => {
          assert.ok(res.body.data)
          assert.ok(res.body.data._id)
          assert.equal(res.body.status, 'created')
          assert.equal(res.body.data.license_number, data.license_number)
        })
        .end(done)
    })

    context('given incomplete data', () => {
      it('should throw a error', done => {
        request(app)
          .post('/api/bikes')
          .send({...data, license_number: null})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(500)
          .expect(res => {
            assert.ok(res.body.errors)
          })
          .end(done)
      })
    })
  })

  describe('PUT /bikes/:id', () => {
    it('should update fields', done => {
      const bike = new Bike(data)
      bike.save((err, bike) => {
        request(app)
          .put(`/api/bikes/${bike.id}`)
          .send({ owner_name: 'Anonymous', color: 'white' })
          .expect(200)
          .expect(res => {
            assert.ok(res.body.data)
            assert.equal(res.body.data.owner_name, 'Anonymous')
            assert.equal(res.body.data.color, 'white')
            assert.equal(res.body.data.license_number, bike.license_number)
          })
          .end(done)
      })
    })

    context('given a fake id', () => {
      it('should get a 404 error', done => {
        request(app)
          .put('/api/bikes/6144c984ab0101a701ade319')
          .send({ owner_name: 'Anonymous', color: 'white' })
          .expect(404)
          .expect(res => {
            assert.ok(res.body.error)
            assert.equal(res.body.status, 'not-found')
          })
          .end(done)
      })
    })
  })

  describe('DELETE /bikes/:id', () => {
    it('should DELETE a specific bike report', done => {
      const bike = new Bike(data)
      bike.save((err, bike) => {
        request(app)
          .delete(`/api/bikes/${bike.id}`)
          .expect(200)
          .expect(res => {
            assert.ok(res.body.data)
            assert.equal(res.body.data.license_number, bike.license_number)
          })
          .end(done)
      })
    })

    context('given a fake id', () => {
      it('should get a 404 error', done => {
        request(app)
          .delete('/api/bikes/6144c984ab0101a701ade319')
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
