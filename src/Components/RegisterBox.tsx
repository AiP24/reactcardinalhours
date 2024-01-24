import { LoadingButton } from "@mui/lab";
import { Paper, TextField, Typography } from "@mui/material";
import React, { ChangeEvent, useContext, useState } from "react";
import DataAccess from "../api/DataAccess";
import CustomTextField from "./CustomTextField";
import { UsersContext } from "./DesktopComponent";
import AdminDialog from "./Notifications/AdminDialog";
import { AdminDialogContext } from "./Right";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "whitesmoke",
    padding: "3em 4em 3em 4em",
    transform: "translate(0,20%)",
    borderRadius: "10px",
    boxShadow: "0 0 5px 5px #0f0c08",
  },
  enterFieldsText: {
    textAlign: "center",
    padding: "0 0 1em 0",
    color: "#595959",
    fontWeight: "bold",
    fontSize: "18px",
  },
  textField: {
    margin: "0 0 1em 0",
  },
  button: {
    backgroundColor: "#ff073a",
    color: "whitesmoke",
    "&:hover": {
      background: "rgba(255,7,58,0.9)",
    },
  },
};
type RegisterBoxProps = {
  handleSnackbarOpen: (msg: string) => void;
};
const RegisterBox = (props: RegisterBoxProps): JSX.Element => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [dialogIsOpen, setDialogIsOpen] = useContext(AdminDialogContext);
  const [user, setUsers] = useContext(UsersContext);

  const closeDialog = (password: string): void => {
    if (
      password !==
      "Berdies" /*|| password !==localStorage.getItem("adminPassword")*/
    ) {
      console.log(password);
      return props.handleSnackbarOpen("Invalid Password");
    }
    setDialogIsOpen(false);
  };

  const handleRegisterUser = (
    firstName: string,
    lastName: string,
    password: string
  ): void => {
    if (dialogIsOpen)
      return props.handleSnackbarOpen("Please enter the admin password");
    if (!firstName.trim() || !lastName.trim() || !password.trim())
      props.handleSnackbarOpen("No empty fields");
    DataAccess.getInstance()
      .save(firstName, lastName, password, props.handleSnackbarOpen)
      .then((_) =>
        DataAccess.getInstance()
          .getAll()
          .then((users) => setUsers(users))
      );
  };

  return (
    <Paper sx={styles.container}>
      <Typography sx={styles.enterFieldsText}>Enter User Info</Typography>
      <CustomTextField
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setFirstName(event.currentTarget.value)
        }
        label="First Name"
        sx={styles.textField}
      />
      <CustomTextField
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setLastName(event.currentTarget.value)
        }
        label="Last Name"
        sx={styles.textField}
      />
      <CustomTextField
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setPassword(event.currentTarget.value)
        }
        label="Password"
        sx={styles.textField}
      />
      <LoadingButton
        onClick={() => handleRegisterUser(firstName, lastName, password)}
        size="large"
        variant="contained"
        sx={styles.button}
      >
        <Typography>Submit</Typography>
      </LoadingButton>
      <AdminDialog isOpen={dialogIsOpen} closeDialog={closeDialog} />
    </Paper>
  );
};

export default RegisterBox;
