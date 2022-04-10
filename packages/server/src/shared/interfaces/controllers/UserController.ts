export default interface UserController {
  createAdmin(email: string): Promise<void>;
}
