import { User } from "../users/users.entity";

export interface IAuthService {
  validate(email: string, password: string): Promise<User>;
  login(user: any): any;
  validateToken(token: string): Promise<any>
}
