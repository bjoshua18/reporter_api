import '../config'
import request from 'supertest'
import assert from 'assert'
import app from '../../src/app'
import { Bike, Department, Officer } from '../../src/models'
import { factory } from '../factories'

describe('Bikes', () => {
  beforeEach( async () => {
    await Bike.deleteMany({})
    await Officer.deleteMany({})
    await Department.deleteMany({})
  })

  describe('GET /bikes', () => {
    it('should GET all bike reports', async () => {
      await factory.createMany<Bike>('bike', 3)
      request(app)
        .get('/api/bikes')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          assert.ok(res.body.data)
          assert.ok(Array.isArray(res.body.data))
          assert.equal(res.body.data.length,3)
        })
    })
  })

  describe('GET /bikes/:id', () => {
    it('should GET a specific bike report', async () => {
      const bike = await factory.create<Bike>('bike')
      request(app)
        .get(`/api/bikes/${bike.id}`)
        .expect(200)
        .expect(res => {
          assert.ok(res.body.data)
          assert.equal(res.body.data.license_number, bike.license_number)
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
    it('should save a bike report', async () => {
      const data = await factory.attrs<Bike>('bike')
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
    })

    it('should assign a officer to the case', async () => {
      const officer = await factory.create<Officer>('officer')
      const bike_attrs = await factory.attrs<Bike>('bike')

      request(app)
        .post('/api/bikes')
        .send(bike_attrs)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .expect(res => {
          assert.ok(res.body.data)
          assert.equal(res.body.data.officer, officer.id)
        })
    })

    context('given incomplete data', () => {
      it('should throw a error', async () => {
        const data = await factory.attrs<Bike>('bike')
        request(app)
          .post('/api/bikes')
          .send({...data, license_number: null})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(500)
          .expect(res => {
            assert.ok(res.body.error)
          })
      })
    })
  })

  describe('PUT /bikes/:id', () => {
    it('should update fields', async () => {
      const bike = await factory.create<Bike>('bike')
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
    })

    context('updating a report as closed', () => {
      it('should assign a new case to the officer', async () => {
        const officer = await factory.create<Officer>('officer')
        const bike1 = await factory.create<Bike>('bike')
        const bike2 = await factory.create<Bike>('bike')

        request(app)
          .put(`/api/bikes/${bike1.id}`)
          .send({ status_case: 'closed' })
          .expect(200)
          .expect(res => {
            assert.ok(res.body.data)
            assert.equal(res.body.data.status_case, 'closed')
            assert.equal(officer.actual_case, bike2.id)
          })
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
    it('should DELETE a specific bike report', async () => {
      const bike = await factory.create<Bike>('bike')
      request(app)
        .delete(`/api/bikes/${bike.id}`)
        .expect(200)
        .expect(res => {
          assert.ok(res.body.data)
          assert.equal(res.body.data.license_number, bike.license_number)
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

  describe('GET /search?', () => {
    context('given some attributes to filter and search', () => {
      it('should returns correct filtered bike reports', async () => {
        await factory.create<Bike>('bike', { color: 'white', type: 'sport' })
        await factory.create<Bike>('bike', { color: 'white' })
        await factory.create<Bike>('bike')
        const query = 'color=white&type=sport'

        request(app)
          .get(`/search?${query}`)
          .expect(200)
          .expect(res => {
            assert.ok(res.body.data)
            assert.ok(Array.isArray(res.body.data))
            assert.equal(res.body.data.length,1)
            assert.equal(res.body.data[0].color, 'white')
            assert.equal(res.body.data[0].type, 'sport')
          })
      })

      context('searching a bike report with officer assigned', () => {
        it('should returns officer data and department data', async () => {
          const officer = await factory.create<Officer>('officer')
          const bike = await factory.create<Bike>('bike', { officer: officer.id })

          request(app)
            .get(`/search?license_number=${bike.license_number}`)
            .expect(200)
            .expect(res => {
              assert.ok(Array.isArray(res.body.data))
              assert.ok(res.body.data[0].officer._id)
              assert.ok(res.body.data[0].officer.department._id)
            })
        })
      })
    })
  })
})
