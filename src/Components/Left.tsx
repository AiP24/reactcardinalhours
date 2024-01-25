import { Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useContext, useEffect, useState } from "react"
import { UsersContext } from "./DesktopComponent"
import Searchbar from "./Searchbar"
import UserCard from "./UserCard"

type User = { 
    name: string; 
    signedIn: number; 
    timeIn: number; 
    totalTime: number;
}

const styles = {
    left:{
        backgroundColor:"#0f0c08",
        flex:1,
        height:"100vh",
        overflowY:"scroll"
    },
    title:{
        color:"whitesmoke",
        textAlign:"center",
        fontWeight:"bold",
        fontSize:"24px",
        padding:"1rem 0 1rem 0"
    }
} 

const Left = ():JSX.Element => {
    const getDate = ():string => {
        const date:Date = new Date()
        return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
    }
    
    const [date, setDate] = useState<string>();
    const [users, ] = useContext(UsersContext)
    const [searchBarInput, setSearchBarInput] = useState<string>("")

    useEffect(():void => {
        setDate(getDate())
    }, [])

    return (
        <Box sx={styles.left}>
            <Typography sx={styles.title}>Users {date}</Typography>
            <Searchbar searchBarInput={searchBarInput} setSearchBarInput={setSearchBarInput}/>
            <div>
                {/*signedIn 0 means signed out, and 1 means signed in; u also stands for user */}
                {users
                .filter((userA:User)=> userA.name.toLowerCase().includes(searchBarInput.toLowerCase()))
                .sort((user1:User, user2:User) => {return user2.timeIn-user1.timeIn})
                .sort((user:User) => {return user.signedIn===1 ? -1:1})
                .map((u:User) => <UserCard name={u.name} signedIn={u.signedIn} timeIn={u.timeIn} totalTime={u.totalTime}/>)}
            </div>
        </Box>
    )
}

export default Left;