"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositories = void 0;
const User_1 = __importDefault(require("../../models/user/User"));
const baseRepositories_1 = require("./baseRepositories");
class UserRepositories extends baseRepositories_1.BaseRepository {
    constructor() {
        super(User_1.default);
    }
}
exports.UserRepositories = UserRepositories;
