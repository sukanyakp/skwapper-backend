
import { IAdminService } from "../Interfaces/IadminService";
import { UserRepository } from "../../repositories/Implements/userRepository";
import User from "../../models/user/userModel";
import bcrypt from "bcryptjs";
import { Iuser } from "../../models/user/userModel";
import { IuserRepository } from "../../repositories/Interfaces/IuserRepository";
import { IAdminRepository } from "../../repositories/Interfaces/IadminRepository";

export class AdminService implements IAdminService {

    private UserRepository: IAdminRepository;

    constructor(UserRepository: IAdminRepository) {
            this.UserRepository = UserRepository;
          }
    
  
  public async register(name: string, email: string, password: string): Promise<Iuser | null> {
  const existingUser = await this.UserRepository.findByEmail(email);

  if (existingUser) {
    // If already admin, return null 
    if (existingUser.role === "admin") {
      return null;
    }

    // Update role to admin if not already
    existingUser.role = "admin";
    await existingUser.save();
    return existingUser;
  }

  // New admin registration
  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = new User({
    name,
    email,
    password: hashedPassword,
    role: "admin", // explicitly set role to admin
  });

  await newAdmin.save();
  return newAdmin;
}


public async login(email: string, password: string): Promise<Iuser | null> {
  const user = await this.UserRepository.findByEmail(email);

  if (!user || user.role !== 'admin') return null;

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return null;

  return user;
}


}
