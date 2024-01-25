import React, { ChangeEvent, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DateTimePicker from 'react-datetime-picker'
import { Box, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CustomTextField from './CustomTextField';

//This one is just a test on my part, pay no attention to it
const mStyles = {
    container: {
        display:"flex",
        flexDirection:"column",
        backgroundColor:"whitesmoke",
        padding:"3em 4em 3em 4em",
        transform:"translate(0,20%)",
        borderRadius:"10px",
       boxShadow: "0 0 5px 5px #0f0c08",
    },
    button: {
        backgroundColor:"#ff073a",
        color:"whitesmoke",
        '&:hover': {
            background: 'rgba(255,7,58,0.9)',
        },
        marginTop:"2em"
    },
    text: {
        color:"#595959",
        fontWeight:"bold",
        textAlign:"center"
    }

}
toast.configure()
function AddSessionBox() {
    const [startTime, setStartTime] = useState<any>(new Date());
    const [endTime, setEndTime] = useState<any>(new Date());
    const [passwordValue, setPasswordValue] = useState<string>("");

    const sucess = ():void => {
        toast.success("Successfully added session!", {
            position: toast.POSITION.TOP_CENTER
          });
    }

    const generalError = ():void => {
        toast.error("Error occurred, please check inputs.", {
            position: toast.POSITION.TOP_CENTER
        })
    }

    const timeError = ():void => {
        toast.error("Please make sure that start and end time are valid. End time must come after start time.", {
            position: toast.POSITION.TOP_CENTER
        })
    }

    const passwordError = ():void => {
        toast.error("Password input cannot be empty. Please try again.", {
            position: toast.POSITION.TOP_CENTER
        })
    }

    async function handleAddSession(userPassword:string, startTime:Date, endTime:Date):Promise<void> {
        if (startTime >= endTime || !startTime || !endTime) {
            timeError();
            return;
        }
        if (!userPassword.length) {
            passwordError();
            return;
        }

        let utcStartTime = startTime.toUTCString();
        let utcEndTime = endTime.toUTCString();
        fetch('https://hours.team4159.org/users/addsession', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password: userPassword, startTime: startTime.getTime(), endTime: endTime.getTime()})
        }).then((response) => {
            if (response.ok) {
                sucess();
                clearInput();
            } else {
                generalError();
            }
        }).catch(err => {
            console.log(err);
            generalError();
        })
    }
    
    let handleUserInput = (event:ChangeEvent<HTMLInputElement>) => {
        setPasswordValue(event.currentTarget.value);
    }
    function clearInput():void {
        setPasswordValue("");
        setEndTime(new Date());
        setStartTime(new Date());
    }

    let handleUserKeypress = (event:React.KeyboardEvent<HTMLDivElement>):void  => {
        if (event.key === 'Enter') {
            handleAddSession(passwordValue, startTime, endTime);
        }
    }

    return (
        <Box sx={mStyles.container}>
            <div className={"add-session-container"}>
            <Typography sx={mStyles.text}>Add Session:</Typography>
            <CustomTextField label="Password" type={"password"} className={"input"} value={passwordValue} onChange={handleUserInput} onKeyPress={handleUserKeypress} />
            <div className={"time-text"}>Start Time: </div>
            <DateTimePicker
                className={"date-time-picker"}
                onChange={setStartTime}
                value={startTime}          />
            <div className={"time-text"}>End Time: </div>
            <Box sx={{display:"flex", flexDirection:"column"}}>
                <DateTimePicker
                    className={"date-time-picker"}
                    onChange={setEndTime}
                    value={endTime}
                />
                <LoadingButton sx={mStyles.button} className={"buttons"} onClick={() => { handleAddSession(passwordValue, startTime, endTime) }}>Add Session</LoadingButton>
            </Box>
            </div>
        </Box>
    )

} 

//This HOC breaks the app for some reason
export default /*withStyles(styles)*/(AddSessionBox)