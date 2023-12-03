// HtmlDisplay.js
import React from 'react';
import { Typography, Paper, Grid } from '@mui/material';

const HtmlDisplay = ({ htmlCode }) => {
    console.log('htmlCode inside HtmlDisplay:', htmlCode);

    return (
        <Paper style={{ padding: '20px 30px', textAlign: 'center', width: '80%', maxWidth: '80%', height: '70vh', overflowY: 'auto', backgroundColor: '#242424', borderRadius: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Hi
            </Typography>
            {/* Add any additional content for the new screen here */}
        </Paper>
    );
};

export default HtmlDisplay;