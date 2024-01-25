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

  export type PublicAPIUser = Pick<APIUser, "first_name" | "last_name" | "total_time"> & { id: string };

  export type AmendSessionBody = {
    start_time: number;
    end_time: number;
  };

  export type ModifyExistingSessionBody = {
    session_pk: string;
    start_time: number;
    end_time: number;
  };

  export type DeleteExistingSessionBody = {
    session_pk: string;
  };

  export type GetAllUsersResponse = PublicAPIUser[];
}
