import { APIProvider } from "./APIProvider";

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
    const response = await fetch(APIProvider.DOMAIN + "/admin/auth", {
      method: "POST",
      body: JSON.stringify({
        password,
      }),
    });
    if (response.status == 200) {
      const data: OKAuthResponse = await response.json(),
        auth = response.headers.get("Authorization");
      this.token = auth!;
      this.expires = data.exp;
      return this;
    } else throw new AuthError("Bad password!");
  }
}

export class AuthError extends Error {
  constructor(msg: string) {
    super(`[AuthError] : ${msg}`);
    this.name = "AuthError";
  }
}

type OKAuthResponse = {
  iss: string;
  sub: string;
  exp: number; // in UNIX secs?
};
