import { APIProvider, RestException } from "./APIProvider";

export class AuthError extends Error {
  constructor(msg: string) {
    super(`[AuthError] : ${msg}`);
    this.name = "AuthError";
  }
}

export default class AuthProvider {
  private static instance?: AuthProvider = undefined;

  public static getInstance(): AuthProvider {
    return this.instance ? this.instance : (this.instance = new AuthProvider());
  }

  private token?: string;
  private expires?: number;

  private constructor() {
    this.token = undefined;
    this.expires = undefined;
  }

  public isAuthenticated(): boolean {
    if (!this.token) return false;
    if (Date.now() > this.expires!) {
      this.token = undefined;
      this.expires = undefined;
      return false;
    }
    return true;
  }

  public getToken(): string | never {
    if (!this.isAuthenticated()) throw new AuthError("Not authenticated!");
    return this.token!;
  }

  public async authenticate(password: string): Promise<AuthProvider | never> {
    const resp = await APIProvider.getInstance().authenticate(password);
    this.token = resp.token;
    this.expires = resp.expires;
    return this;
  }

  public logout(): void | never {
    if (this.isAuthenticated()) {
      this.token = undefined;
      this.expires = undefined;
    }
  }
}
