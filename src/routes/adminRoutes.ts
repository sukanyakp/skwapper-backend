import express, { Request, Response } from 'express'
import {AdminController} from  '../controllers/implements/adminController'
import { AdminRepository } from '../repositories/Implements/adminRepository'
import { AdminService } from '../services/Implements/adminService'

const adminRepositoryInstance = new AdminRepository()
const adminServices = new AdminService(adminRepositoryInstance)
const adminControllers = new AdminController(adminServices)


const adminRoutes = express.Router()

adminRoutes.post('/register' , adminControllers.register)
adminRoutes.post('/login',adminControllers.login)


export default adminRoutes