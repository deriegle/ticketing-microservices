import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class PasswordService {
  static async hash(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const hashedPassword = await PasswordService.hashString(password, salt);
    return `${hashedPassword}.${salt}`
  }

  static async compare(storedPassword: string, suppliedPassword: string): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buffer = await PasswordService.hashString(suppliedPassword, salt);
    return buffer === hashedPassword;
  }

  private static async hashString(pass: string, salt: string): Promise<string> {
    const buffer = (await scryptAsync(pass, salt, 64)) as Buffer;
    return buffer.toString('hex');
  }
}