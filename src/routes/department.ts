import { Router } from 'express'
import { index, store, show, update, destroy } from '../controllers/department.controller'
import * as departmentOfficerController from '../controllers/department.officer.controller'
import { getDepartment } from '../middlewares'

const router = Router()

router.route('/')
  .get(index)
  .post(store)

router.route('/:id')
  .get(show)
  .put(update)
  .delete(destroy)

router.route('/:dep_id/officers')
  .get(getDepartment, departmentOfficerController.index)
  .post(getDepartment, departmentOfficerController.store)

router.route('/:dep_id/officers/:officer_id')
  .get(getDepartment, departmentOfficerController.show)
  .put(getDepartment, departmentOfficerController.update)
  .delete(getDepartment, departmentOfficerController.destroy)

export default router
