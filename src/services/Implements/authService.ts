import { Iuser } from "../../models/user/userModel";
import { IuserRepository } from "../../repositories/Interfaces/IuserRepository";
import { comparePassword } from "../../utils/bcrypt.util"; 
import { generateAccessToken, generateRefreshToken }  from "../../utils/jwt.util"

export class AuthService {
  private userRepository: IuserRepository;

  constructor(userRepository: IuserRepository) {
    this.userRepository = userRepository;
  }

  async login(email: string, password: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Iuser;
  }> {
    console.log("Service: Login initiated");

    // 1. Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // 2. Validate password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // 3. Generate tokens
    const accessToken = generateAccessToken({ id: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user._id });

    // 4. Optional: Store refreshToken in DB or cache (if revocation logic is needed)

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
