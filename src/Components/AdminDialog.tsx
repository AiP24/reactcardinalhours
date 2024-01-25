import { Button, Dialog, DialogActions, DialogTitle, Typography } from "@mui/material"
import { ChangeEvent, Fragment, useState } from "react"
import CustomTextField from "./CustomTextField"

const styles = {
    dialog: {
       position:"fixed",
       transform:"translate(25%,5%)"
    },
    actionsContainer: {
        display:"flex",
        flexDirection:"column"
    }, 
    title: {
        textAlign:"center",
        padding:"0 0 1em 0",
        color:"#595959",
        fontWeight:"bold",
        fontSize:"18px",
        paddingTop:"1.5em"
    },
    button: {
        '&:hover': {
            background: 'rgba(255,7,58,0.9)',
        },
        color:"whitesmoke",
        backgroundColor:"#ff073a",
        margin:"2em 4em 3em 4em",
    },
    textField: {
        padding:".5em 0 1em 0"
    }
}

type AdminDialogProps = {
    isOpen:boolean;
    closeDialog:(password:string) => void
}

const AdminDialog = (props:AdminDialogProps):JSX.Element => {
    const [passwordText, setPasswordText] = useState<string>("")
    return (
        <Fragment>
            <Dialog 
                sx={styles.dialog}
                disableEnforceFocus
                style={{ pointerEvents: 'none' }}
                PaperProps={{ style: { pointerEvents: 'auto' } }} 
                hideBackdrop
                open={props.isOpen}
            >
                <DialogTitle sx={styles.title}>Enter Admin Password</DialogTitle>
                <DialogActions sx={styles.actionsContainer}>
                    <CustomTextField 
                        onChange={(event:ChangeEvent<HTMLInputElement>) => {setPasswordText(event.currentTarget.value)}} 
                        sx={styles.textField} label="Password"
                    />
                    <Button sx={styles.button} onClick={() => props.closeDialog(passwordText)}>
                        <Typography>Submit</Typography>
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}

export default AdminDialog