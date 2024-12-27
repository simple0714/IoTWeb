import React from "react";
import { OutlinedInput, Typography } from '@mui/material';

function Input({label, placeholder, value}) {

    return(
      <>
        <Typography variant="h6" align="left"> {label} </Typography>
        <OutlinedInput placeholder={placeholder} defaultValue=""/>
      </>
    )
}

export default Input;