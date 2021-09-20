import { Router } from 'express'
import { index, store, show, update, destroy, search } from '../controllers/bike.controller'

const router = Router()

router.route('/')
  .get(index)
  .post(store)

router.route('/search?')
  .get(search)

router.route('/:id')
  .get(show)
  .put(update)
  .delete(destroy)

export default router
