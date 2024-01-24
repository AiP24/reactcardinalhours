import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import DataAccess from "../api/DataAccess";
import { UsersContext } from "./DesktopComponent";

type UserCardProps = {
  name: string;
  timeIn: number;
  totalTime: number;
  signedIn: number;
};
const styles = {
  container: {
    display: "flex",
    backgroundColor: "#212121",
    flexDirection: "column",
    padding: "1em",
    margin: "1.5em",
    borderRadius: "10px",
  },
  name: {
    color: "whitesmoke",
    fontWeight: "bold",
  },
  signedInText: {
    padding: ".5em 0 .5em 0",
  },
  timeText: {
    color: "#7f7f7f",
    margin: "0 2em 0 0",
  },
  actualTimeText: {
    fontFamily: "monospace",
    padding: "5px",
  },
  timeContainer: {
    display: "flex",
    flexDirection: "row",
  },
};
const UserCard = (props: UserCardProps): JSX.Element => {
  const [displayedTime, setDisplayedTime]: [
    number,
    Dispatch<SetStateAction<number>>
  ] = useState(0);
  const { name, timeIn, totalTime, signedIn } = props;

  const [users, setUsers, socket] = useContext(UsersContext);

  //
  useEffect((): any => {
    //console.log(displayedTime)
    socket?.addEventListener("message", (event: MessageEvent): void => {
      if (event.data === "Sign in update" || event.data === "Sign out update") {
        DataAccess.getInstance()
          .getAll()
          .then((users) => setUsers(users));
        setDisplayedTime(0);
      }
    });
    return () => {
      socket?.removeEventListener("message", (event: MessageEvent): void => {
        if (
          event.data === "Sign in update" ||
          event.data === "Sign out update"
        ) {
          DataAccess.getInstance()
            .getAll()
            .then((users) => setUsers(users));
          setDisplayedTime(0);
        }
      });
    };
  }, []);

  useEffect((): void => {
    if (signedIn === 0) setDisplayedTime(0);
    //Without this line, the total time only updates on sign in
    if (signedIn === 0)
      DataAccess.getInstance()
        .getAll()
        .then((users) => setUsers(users));
  }, [signedIn]);

  //It might be better to do this in the parent node with foreach, but I am lazy
  useEffect(() => {
    //TODO: Implement time correction and remove reloads
    const interval: NodeJS.Timer = setInterval(() => {
      if (!signedIn) return;
      setDisplayedTime(displayedTime + 1);
    }, 1000);
    return (): void => clearInterval(interval);
  }, [displayedTime, signedIn]);

  const formatTime = (timeInSec: number): string => {
    let secondsLeft = (timeInSec % 3600) % 60;
    let mins = Math.floor((timeInSec % 3600) / 60);
    let hrs = Math.floor(timeInSec / 3600);
    let HH = (hrs < 10 ? "0" : "") + hrs;
    let MM = (mins < 10 ? "0" : "") + mins;
    let SS = (secondsLeft < 10 ? "0" : "") + Math.floor(secondsLeft);
    return HH + ":" + MM + ":" + SS;
  };

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.name}>{name}</Typography>
      <Typography
        sx={styles.signedInText}
        color={signedIn === 1 ? "lime" : "#ff073a"}
      >
        {signedIn ? "SIGNED IN" : "SIGNED OUT"}
      </Typography>
      <Box sx={styles.timeContainer}>
        <Typography sx={styles.timeText}>
          Time In: {formatTime(timeIn / 1000 + displayedTime)}{" "}
        </Typography>
        <Typography sx={styles.timeText}>
          Total Time: {formatTime(totalTime / 1000)}
        </Typography>
      </Box>
    </Box>
  );
};
export default UserCard;
