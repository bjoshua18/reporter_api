import { Router } from 'express'
import { index, store, show, update, destroy } from '../controllers/department.controller'

const router = Router()

router.route('/')
  .get(index)
  .post(store)

router.route('/:id')
  .get(show)
  .put(update)
  .delete(destroy)

export default router
