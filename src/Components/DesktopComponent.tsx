import { Box } from "@mui/system";
import { Component, Context, createContext } from "react";
import DataAccess from "../utils/DataAccess";
import Left from "./Left";
import Right from "./Right";
import '../css/App.css'

const styles = {
    container: {
        display:"flex",
        flexDirection:"row",
    }
}

export const UsersContext:Context<any[]> = createContext<any[]>([])

type DesktopComponentProps = {}
type DesktopComponentState = {
    users: any[] | Promise<any[]>;
    socket?: WebSocket
}

class DesktopComponent extends Component<DesktopComponentProps, DesktopComponentState> {
    constructor(props:DesktopComponentProps){
        super(props)
        this.state = {
            users:[],
            socket: new WebSocket("wss://hours.team4159.org/websocket")
        }
    }

    setUsers = (users:any[]):void => this.setState({users:users})

    componentDidMount():void {
        DataAccess.getInstance().getAll().then(usersPromise => this.setUsers(usersPromise))
    }

    componentWillUnmount():void {
        this.state.socket?.removeEventListener('open', (event:Event):void => {
            console.log("Opened connection ")
        })
        this.state.socket?.addEventListener('message', (event:MessageEvent):void => {
            if(event.data === "Sign in update" || event.data === "Sign out update") DataAccess.getInstance().getAll().then(users => this.setUsers(users))
        })
    }

    render() {
        return (
            <Box sx={styles.container}>
                <UsersContext.Provider value={[this.state.users, this.setUsers, this.state.socket]}>
                    <Left/>
                    <Right/>
                </UsersContext.Provider>
            </Box>
        )
    }
}

export default DesktopComponent