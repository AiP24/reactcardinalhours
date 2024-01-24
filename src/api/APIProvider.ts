// API calling class that allows for emulation b/c backend isn't finished

export namespace APIProvider {
  export async function isPasswordCorrect(password: string): Promise<boolean> {
    return password == "yessir";
  }

  export const DOMAIN = "https://hours.team4159.org";
}
