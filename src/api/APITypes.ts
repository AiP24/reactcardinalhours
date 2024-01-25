export namespace APITypes {
  export type OKAuthResponse = {
    iss: string;
    sub: string;
    exp: number; // in UNIX secs?
  };

  export type AuthResponse = {
    token: string;
    expires: number; // UNIX secs
  };

  export type APIConfig = {
    [k: string]: string;
  };

  export type APIUser = {
    user_pk: string;
    first_name: string;
    last_name: string;
    password: string;
    signed_in: boolean;
    last_signed_in: number;
    total_time: number;
  };
}
