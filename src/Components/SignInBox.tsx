import { LoadingButton } from '@mui/lab'
import { Checkbox, FormControlLabel, FormGroup, Paper, Typography } from '@mui/material'
import React, { ChangeEvent, useContext, useState } from 'react'
import DataAccess from '../utils/DataAccess'
import CustomTextField from './CustomTextField'
import { UsersContext } from './DesktopComponent'

const styles = {
    container: {
        display:"flex",
        flexDirection:"column",
        backgroundColor:"whitesmoke",
        padding:"6em 4em 6em 4em",
        transform:"translate(0,20%)",
        borderRadius:"10px",
        boxShadow: "0 0 5px 5px #0f0c08"
    },
    button: {
       backgroundColor:"#ff073a",
       '&:hover': {
            background: 'rgba(255,7,58,0.9)',
        },
    },
    enterPassText: {
        textAlign:"center",
        padding:"0 0 1em 0",
        color:"#595959",
        fontWeight:"bold",
        fontSize:"18px"
    },
    checkBox: {
        padding:".5em 0 .5em 0",
        color:"#595959",

    },

}

// User type is different depending on whether getuserdata or getusers is called
type User = {
    name: string;
    signedIn: number;
    totalTime: number;
    meetings: number;
}

type SignInBoxProps = {
    handleSnackbarOpen: (msg:string) => void;
}

const SignInBox = (props:SignInBoxProps):JSX.Element => {
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
    const [passwordText, setPasswordText] = useState<string>("")
    const [, setUsers] = useContext(UsersContext)

    const checkBox:JSX.Element = <Checkbox checked={isShowPassword} style={{color:"#ff073a"}} onChange={(event:ChangeEvent<HTMLInputElement>, checked:boolean):void => (setIsShowPassword(checked))}/>

    const handleSignIn = async (password:string):Promise<void> => {
        if(!passwordText.trim()) return props.handleSnackbarOpen("Please enter a non-empty password")
        const user:User = await DataAccess.getInstance().get(password, props.handleSnackbarOpen)
        if(user.signedIn === 0){
            DataAccess.getInstance().signIn(password, user.name, props.handleSnackbarOpen)
            .then(_ => DataAccess.getInstance().getAll()
            .then(users => setUsers(users)))
            //props.handleSnackbarOpen(`Signed in as ${user.name}`)
        } else if(user.signedIn === 1) {
            DataAccess.getInstance().signOut(password, user.name, props.handleSnackbarOpen)
            .then(_ => DataAccess.getInstance().getAll()
            .then(users => setUsers(users)))
            //props.handleSnackbarOpen(`Signed out as ${user.name}`)
        } 
        setPasswordText("")
    }
    
    return (
        <Paper sx={styles.container}>
            <Typography sx={styles.enterPassText}>Enter Your Password</Typography>
            <CustomTextField 
                label="Password" 
                type={isShowPassword ? "text":"password"} 
                onChange={(e:ChangeEvent<HTMLInputElement>) => setPasswordText(e.currentTarget.value)}
                value={passwordText}
                onKeyDown={(e:React.KeyboardEvent<HTMLDivElement>) => {
                    if(e.key === localStorage.getItem("submitKey") || e.key==="Enter") handleSignIn(passwordText)
                }}
            />
            <FormGroup sx={styles.checkBox}>
                <FormControlLabel label="Show Password" control={checkBox}/>
            </FormGroup>
            {/*Need to use arrow func this time b/c of the enter key?*/}
            <LoadingButton onClick={() => handleSignIn(passwordText)} size="large" sx={styles.button} variant="contained">
                <Typography>Sign In</Typography>
            </LoadingButton>
        </Paper>
    )
}
export default SignInBox

