import { Button, Checkbox, FormControlLabel, FormGroup, Paper, Typography } from '@mui/material'
import React, { ChangeEvent, FocusEvent, useContext, useState } from 'react'
import AdminDialog from './AdminDialog'
import CustomTextField from './CustomTextField'
import { AdminDialogContext } from './Right'
import DataAccess from "../utils/DataAccess"

const styles = {
    container: {
        display:"flex",
        flexDirection:"column",
        backgroundColor:"whitesmoke",
        padding:"3em 4em 3em 4em",
        transform:"translate(0,20%)",
        borderRadius:"10px",
        boxShadow: "0 0 5px 5px #0f0c08"
    },
    button: {
        '&:hover': {
            background: 'rgba(255,7,58,0.9)',
        },
        color:"whitesmoke",
        backgroundColor:"#ff073a"
    },
    checkBox: {
        padding:".5em 0 .5em 0",
        color:"#595959"
    },
    enterSettingsText: {
        textAlign:"center",
        padding:"0 0 1em 0",
        color:"#595959",
        fontWeight:"bold",
        fontSize:"18px"
    },
    textField: {
        marginBottom:"1em"
    },
}
type SettingsBoxProps = {
    handleSnackbarOpen: (msg:string) => void;
}
const SettingsBox = (props:SettingsBoxProps):JSX.Element => {
    const [isShowAdminPass, setIsShowAdminPass] = useState<boolean>(true)
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [currentKey, setCurrentKey] = useState<string>("Enter")
    const [dialogIsOpen, setDialogIsOpen] = useContext(AdminDialogContext)
    const [adminPasswordText, setAdminPasswordText] = useState<string>("berdies")

    const checkBox:JSX.Element = <Checkbox style={{color:"#ff073a"}} onChange={(event:ChangeEvent<HTMLInputElement>, checked:boolean):void => (setIsShowAdminPass(checked))}/>
    const handleOnFocus = (event:FocusEvent<HTMLInputElement>):void => setIsFocused(true)
    const handleKeyDown = (event:React.KeyboardEvent<HTMLDivElement>) => {if(isFocused) setCurrentKey(event.key)}
    const handleOnBlur = (event:FocusEvent<HTMLInputElement>):void => setIsFocused(false)
    
    const closeDialog = (password:string):void => {
        if(/*password !== localStorage.getItem("adminPassword") ||*/ password !== "Berdies") return props.handleSnackbarOpen("Invalid password")
        setDialogIsOpen(false)
    }
 
    const handleChangeSettings = ():void => {
        if(dialogIsOpen) return props.handleSnackbarOpen("Please enter the admin password")
        if(!adminPasswordText.trim() || adminPasswordText !==localStorage.getItem("adminPassword")) localStorage.set("adminPassword", localStorage.getItem("adminPassword"))
        localStorage.setItem("submitKey", currentKey)
        localStorage.setItem("adminPassword", adminPasswordText)
        props.handleSnackbarOpen("Settings have been changed")
    }

    const syncUsers = async (): Promise<void> => {
        if(dialogIsOpen) return props.handleSnackbarOpen("Please enter the admin password")
        
        const res = await DataAccess.getInstance().syncUsers();

        if (res === 202) {
            props.handleSnackbarOpen("Syncing users");
        } else {
            props.handleSnackbarOpen(`HTTP ${res}`);
        }
    }

    return (
        <Paper sx={styles.container}>
                <Typography sx={styles.enterSettingsText}>Configure Controls</Typography>
                <CustomTextField 
                    label="Press a Key" 
                    value={currentKey} 
                    onKeyDown={(e:React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(e)} 
                    onBlur={(e:FocusEvent<HTMLInputElement>) => handleOnBlur(e)} 
                    onFocus={(e:FocusEvent<HTMLInputElement>) => handleOnFocus(e)} 
                    sx={styles.textField} 
                    InputProps={{readOnly:true}}
                />
                <CustomTextField 
                    onChange={(event:ChangeEvent<HTMLInputElement>) => setAdminPasswordText(event.currentTarget.value)} 
                    sx={styles.textField} type={isShowAdminPass ? "password":"text"} 
                    label="Change Admin Password WIP"
                />
                <FormGroup sx={styles.checkBox}>
                    <FormControlLabel label="Show Password" control={checkBox}/>
                </FormGroup>
                <Button onClick={handleChangeSettings} sx={styles.button} variant="contained" size="large">
                    <Typography>Submit</Typography>
                </Button>
                <br></br>
                <Button onClick={syncUsers} sx={styles.button} variant="contained" size="large">
                    <Typography>Sync Users</Typography>
                </Button>
            <AdminDialog closeDialog={closeDialog} isOpen={dialogIsOpen}/>
        </Paper>
    )
}

export default SettingsBox
