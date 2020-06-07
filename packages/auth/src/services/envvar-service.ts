export class EnvvarService {
  static validateEnvvars(envvars: string[]) {
    const undefinedEnvvars = envvars.filter((key) => !process.env[key])

    if (undefinedEnvvars.length) {
      throw new Error(`ENVVARS ${undefinedEnvvars.join(', ')} must be defined.`)
    }
  }
}