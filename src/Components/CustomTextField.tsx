import { styled, TextField } from "@mui/material";

const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: '#ff073a',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#ff073a',
      },
    },
});

export default CustomTextField