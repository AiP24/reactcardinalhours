import { Snackbar, Tab, Typography } from "@mui/material";
import { Box } from "@mui/system"
import { ChangeEvent, Context, createContext, useEffect, useState } from "react";
import SignInBox from "./SignInBox";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import RegisterBox from "./RegisterBox";
import SettingsBox from "./SettingsBox";
import AddSessionBox2 from "./AddSessionBox2";

const styles = {
    container: {
        flex:1,
        backgroundColor:"#212121",
        display:"flex",
        alignItems:"center",
        flexDirection:"column",
    },
    title: {
        color:"whitesmoke",
        textAlign:"center",
        fontWeight:"bold",
        fontSize:"24px",
        padding:"1rem 0 0 0"
    },
    tabIndicator: {
        backgroundColor:'#ff073a',
    },
    tabLabel: {
        color:"white",
        //fontWeight:"bold"
    },
    snackBar: {
       position:"relative",
       transform:"translate(-7.5%,200%)" 
    }
}

//This context is in the parent to prevent tabs 2 and 3's content from functioning as long as the dialog is open.
export const AdminDialogContext:Context<any[]> = createContext<any[]>([])

const Right = ():JSX.Element => {
    const [currentTab, setCurrentTab] = useState<string>("1")
    const [snackbarMsg, setSnackbarMsg] = useState<string>("Placeholder message")
    const [snackBarIsOpen, setSnackbarIsOpen] = useState<boolean>(false)
    const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(true)

    const handleSnackbarOpen = (msg:string = "Unset message"):void => {
        setSnackbarMsg(msg)
        setSnackbarIsOpen(true)
    }
    const handleSnackbarClose = ():void => setSnackbarIsOpen(false)
    

    useEffect(():void => {
        if(!(parseInt(currentTab) === 2 || parseInt(currentTab) === 3 )) return
        setDialogIsOpen(true)
        
    }, [currentTab])
    return (
        <Box sx={styles.container}>
            <Typography sx={styles.title}>Team4159 Sign In</Typography>
            <TabContext value={currentTab}>
                <Box/>
                <TabList textColor="inherit" TabIndicatorProps={{style: styles.tabIndicator}} onChange={(event:ChangeEvent<{}>, value:number):void => setCurrentTab(value.toString())}>
                    <Tab label={<span style={styles.tabLabel}>Sign In</span>} value="1"/>
                    <Tab label={<span style={styles.tabLabel}>Register Users</span>} value="2"/>
                    <Tab label={<span style={styles.tabLabel}>Settings</span>} value="3"/>
                    <Tab label={<span style={styles.tabLabel}>Amend Hours</span>} value="4"/>
                </TabList>
                <TabPanel value="1">
                    <SignInBox handleSnackbarOpen={handleSnackbarOpen}/>
                </TabPanel>
                <AdminDialogContext.Provider value={[dialogIsOpen, setDialogIsOpen]}>
                    <TabPanel value="2">
                        <RegisterBox handleSnackbarOpen={handleSnackbarOpen}/>
                    </TabPanel>
                    <TabPanel value="3">
                        <SettingsBox handleSnackbarOpen={handleSnackbarOpen}/>
                    </TabPanel>
                    <TabPanel value="4">
                        <AddSessionBox2/>
                    </TabPanel>
                </AdminDialogContext.Provider>
            </TabContext>
            <Snackbar 
                sx={styles.snackBar}  
                open={snackBarIsOpen}
                onClose={handleSnackbarClose} 
                autoHideDuration={1000} 
                message={snackbarMsg}
            />
        </Box>
        
    )
}
export default Right;