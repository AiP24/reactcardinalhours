class DataAccess {
    private users: any[]
    private static dataAccess:DataAccess
    //Yeah ik ill put stuff in .env later
    constructor(){
        this.users = []
    }

    public static getInstance():DataAccess{
        if(!this.dataAccess) this.dataAccess = new DataAccess()
        return this.dataAccess;
    }

    public async getAll(openSnackbar: (msg:string) => void = () =>{}):Promise<any[]>{
        try {
            const res = await fetch("https://hours.team4159.org/users/getusers")
            const users = await res.json();
            if(res.ok) return users as any[];
            else{
                openSnackbar("Could not retrieve users")
                return []
            }
        } catch {
            console.log("Could not get users")
            return []
        }
    }

    public async get(password:string, openSnackbar: (msg:string) => void = () =>{}):Promise<any>{
        try {
            const res = await fetch(`https://hours.team4159.org/users/getuserdata?password=${password}`)
            const userData = await res.json();
            if(res.ok) return userData;
            else console.log("Could not retrieve user data")
        } catch(e:unknown) {
            openSnackbar("Invalid password")
            console.log(e)
            return console.log("Could not get user data")
        }
    }

    public async save(firstName:string, lastName:string, password:string, openSnackbar: (msg:string) => void = () =>{}):Promise<number | void>{
        type User = {
            firstName:string;
            lastName:string;
            password:string;
        }
        const user:User = {
            firstName: firstName,
            lastName: lastName,
            password: password
        }
        try {
            const res = await fetch(
                "https://hours.team4159.org/users/adduser",
                {
                    method:"POST",
                    headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    },
                    body: JSON.stringify(user)
                }
            )
            if(res.ok){
                openSnackbar(`Created new user ${firstName} ${lastName}`)
                return res.status
            } else {
                openSnackbar(`Unable to register ${firstName} ${lastName}`)
            }
        } catch(e:unknown) {
            openSnackbar(`Unable to register ${firstName} ${lastName}`)
            console.log(e)
        }

    }

    public async signIn(password:string, name:string, openSnackbar: (msg:string) => void = () =>{}):Promise<number | void> {
        try {
            const res = await fetch(
                "https://hours.team4159.org/users/signin",
                {
                    method:"POST",
                    headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    },
                    body: JSON.stringify({password:password})
                }
            )
            if(res.ok){
                openSnackbar(`Signed in as ${name}`)
                return res.status
            } else {
                openSnackbar(`Unable to sign in as ${name}`)
            }
        } catch(e:unknown){
            openSnackbar(`Unable to sign in as ${name}`)
            console.log("Could not sign in")
            console.log(e)
        }
    }

    public async signOut(password:string, name:string, openSnackbar: (msg:string) => void = () =>{}):Promise<number | void> {
        try {
            const res = await fetch(
                "https://hours.team4159.org/users/signout",
                {
                    method:"POST",
                    headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    },
                    body: JSON.stringify({password:password})
                }
            )
            if(res.ok){
                openSnackbar(`Signed out as ${name}`)
                return res.status
            } else {
                openSnackbar(`Unable to sign out as ${name}`)
            }
        } catch(e:unknown){
            openSnackbar(`Unable to sign out as ${name}`)
            console.log("Could not sign out")
            console.log(e)
        }
    }

    public async syncUsers(openSnackbar: (msg:string) => void = () =>{}):Promise<number | void> {
        try {
            const res = await fetch(
                "https://hours.team4159.org/users/syncusers",
                {
                    method:"POST",
                    headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    },
                }
            )
            if(res.ok){
                openSnackbar("Syncing users")
                return res.status
            } else {
                openSnackbar("Unable to sync users")
            }
        } catch (e: unknown) {
            openSnackbar("Unable to sync users");
            console.log("Could not sync users")
            console.log(e)
        }
    }
}
export default DataAccess