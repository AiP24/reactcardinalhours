export namespace Routes {
  export const DOMAIN = "https://hours.team4159.org" as const;

  export function auth(): string {
    return DOMAIN + "/admin/auth";
  }

  export function sync(): string {
    return DOMAIN + "/admin/sync";
  }

  export function getConfig(): string {
    return DOMAIN + "/admin/config";
  }

  export function updateConfig(): string {
    return DOMAIN + "/admin/config";
  }

  export function createUser(): string {
    return DOMAIN + "/admin/user";
  }

  export function createUserBulk(): string {
    return DOMAIN + "/admin/users";
  }

  export function deleteUser(): string {
    return DOMAIN + "/admin/user";
  }

  export function deleteUserBulk(): string {
    return DOMAIN + "/admin/users";
  }

  export function getUserReport(userId: string): string {
    return DOMAIN + "/admin/report/user/" + userId;
  }

  export function getSessionReport(sessionId: string): string {
    return DOMAIN + "/admin/report/session/" + sessionId;
  }

  export function getDailyReport(dayId: string): string {
    return DOMAIN + "/admin/report/daily/" + dayId;
  }

  export function signInUser(): string {
    return DOMAIN + "/users/sign-in";
  }

  export function signOutUser(): string {
    return DOMAIN + "/users/sign-out";
  }

  export function amendUserSession(): string {
    return DOMAIN + "/users/session";
  }

  export function updateUserSession(): string {
    return DOMAIN + "/users/session";
  }

  export function deleteUserSession(): string {
    return DOMAIN + "/users/session";
  }

  export function getAllUsers(): string {
    return DOMAIN + "/users";
  }

  export function getUser(userId: string): string {
    return DOMAIN + "/users/" + userId;
  }
}
