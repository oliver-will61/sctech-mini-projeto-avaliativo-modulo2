import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../utils/AppError";

export class UserService {
  private userRepository = new UserRepository();

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(data: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email!);
    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }
    return this.userRepository.create(data);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.findById(id);
    const user = await this.userRepository.update(id, data);
    return user!;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.userRepository.delete(id);
  }
}
