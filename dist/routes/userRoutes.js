"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const userService_1 = require("../services/Implements/userService");
const UserRepositories_1 = require("../repositories/Implements/UserRepositories");
const UserRepository = new UserRepositories_1.UserRepositories();
const userServices = new userService_1.UserService(UserRepository);
const userControllers = new userController_1.userController(userServices);
const userRoutes = express_1.default.Router();
userRoutes.post('/signup', userControllers.register);
exports.default = userRoutes;
