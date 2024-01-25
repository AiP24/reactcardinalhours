// API calling class that allows for emulation b/c backend isn't finished

import { APITypes } from "./APITypes";
import AuthProvider, { AuthError } from "./AuthProvider";
import { Routes } from "./Routes";
import { AuthRequired } from "./annotations";

export class APIProvider {
  private authProvider?: AuthProvider = undefined;
  private static instance?: APIProvider = undefined;

  public static getInstance(): APIProvider {
    return this.instance ? this.instance : (this.instance = new APIProvider());
  }

  private constructor() {}

  public setAuthProvider(auth: AuthProvider) {
    this.authProvider = auth;
  }

  public attachJWT(options?: RequestInit): RequestInit {
    options = options ?? {
      headers: {
        Authorization: this.authProvider!.getToken(),
      },
    };
    if (options.headers == null) options.headers = { Authorization: this.authProvider!.getToken() };
    else HeaderAccessorClass.set("Authorization", this.authProvider!.getToken(), options.headers);
    return options;
  }

  private _assertIsAuth(): void | never {
    if (!this.authProvider || this.authProvider!.isAuthenticated() == false) throw new AuthError("Authentication assertion failure!");
  }

  async authenticate(password: string): Promise<APITypes.AuthResponse | never> {
    const response = await fetch(Routes.auth(), {
      method: "POST",
      body: JSON.stringify({
        password,
      }),
    });
    if (response.status == 200) {
      const data: APITypes.OKAuthResponse = await response.json(),
        auth = response.headers.get("Authorization");
      return {
        expires: data.exp,
        token: auth!,
      };
    } else throw new AuthError("Bad password!");
  }

  @AuthRequired
  public async syncData(): Promise<void | never> {
    this._assertIsAuth();
    const response = await fetch(
      Routes.sync(),
      this.attachJWT({
        method: "POST",
      })
    );
    if (!response.ok) throw new RestException(`${Routes.sync()} failed with ${response.status}`);
  }

  @AuthRequired
  public async getConfig(): Promise<APITypes.APIConfig> {
    this._assertIsAuth();
    const response = await fetch(
      Routes.getConfig(),
      this.attachJWT({
        method: "GET",
      })
    );

    if (!response.ok) throw new RestException(`${Routes.getConfig()} failed with ${response.status}`);
    else {
      return await response.json();
    }
  }

  @AuthRequired
  public async updateConfig(updates: Partial<APITypes.APIConfig>): Promise<void | never> {
    this._assertIsAuth();
    const response = await fetch(
      Routes.updateConfig(),
      this.attachJWT({
        method: "PATCH",
        body: JSON.stringify(updates),
      })
    );
    if (!response.ok) throw new RestException(`${Routes.updateConfig()} failed with ${response.status}`);
  }

  @AuthRequired
  public async createUser(user: APITypes.APIUser): Promise<void | never> {
    this._assertIsAuth();
    const response = await fetch(
      Routes.createUser(),
      this.attachJWT({
        method: "PATCH",
        body: JSON.stringify(user),
      })
    );
    if (!response.ok) throw new RestException(`${Routes.createUser()} failed with ${response.status}`);
  }

  @AuthRequired
  public async createUserBulk(...users: APITypes.APIUser[]): Promise<void | never> {
    this._assertIsAuth();
    const response = await fetch(
      Routes.createUserBulk(),
      this.attachJWT({
        method: "PATCH",
        body: JSON.stringify(users),
      })
    );
    if (!response.ok) throw new RestException(`${Routes.createUserBulk()} failed with ${response.status}`);
  }

  @AuthRequired
  public async deleteUser(user: APITypes.APIUser): Promise<void | never> {
    this._assertIsAuth();
    const response = await fetch(
      Routes.deleteUser(),
      this.attachJWT({
        method: "DELETE",
        body: JSON.stringify(user),
      })
    );
    if (!response.ok) throw new RestException(`${Routes.deleteUser()} failed with ${response.status}`);
  }

  @AuthRequired
  public async deleteUserBulk(...users: APITypes.APIUser[]): Promise<void | never> {
    this._assertIsAuth();
    const response = await fetch(
      Routes.deleteUserBulk(),
      this.attachJWT({
        method: "DELETE",
        body: JSON.stringify(users),
      })
    );
    if (!response.ok) throw new RestException(`${Routes.deleteUserBulk()} failed with ${response.status}`);
  }

  // impl all report methods, public & login/out methods
}

export class HeaderAccessorClass {
  public static get(key: string, object: HeadersInit): string | null {
    if (Array.isArray(object)) {
      for (const [k, v] of object) {
        if (k === key) return v;
      }
    } else {
      if (object instanceof Headers) {
        return object.get(key);
      } else {
        return object[key] ?? null;
      }
    }
    return null;
  }

  public static set(key: string, value: any, object: HeadersInit) {
    if (Array.isArray(object)) {
      object.push([key, value]);
    } else {
      if (object instanceof Headers) {
        object.set(key, value);
      } else {
        object[key] = value;
      }
    }
  }

  public static remove(key: string, object: HeadersInit) {
    if (Array.isArray(object)) {
      let found = null;
      for (const ent of object) {
        if (ent[0] === key) {
          found = ent;
          break;
        }
      }

      if (found != null) {
        object.splice(object.indexOf(found!), 1);
      }
    } else {
      if (object instanceof Headers) {
        object.delete(key);
      } else {
        delete object[key];
      }
    }
  }
}

export class RestException extends Error {
  constructor(msg: string) {
    super(`[RestException] : ${msg}`);
    this.name = "RestException";
  }
}
