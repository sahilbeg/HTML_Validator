import React, { useState, useEffect } from 'react';
import { Button, Typography, TextField, Paper, Grid, createTheme, ThemeProvider } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDropzone } from 'react-dropzone';
import HtmlDisplay from './HtmlDisplay';


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const HtmlEditor = () => {
    const [htmlCode, setHtmlCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [proceedClicked, setProceedClicked] = useState(false);

    useEffect(() => {
        // console.log('htmlCode in useEffect:', htmlCode);
        // Retrieve HTML code from local storage on component mount
        const cachedHtmlCode = localStorage.getItem('cachedHtmlCode');
        if (cachedHtmlCode) {
            setHtmlCode(cachedHtmlCode);
            setSelectedOption('drop'); // Assuming it's a drop, adjust as needed
        }
    }, [htmlCode]);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];

        const reader = new FileReader();

        reader.onloadend = () => {
            const code = reader.result;
            setHtmlCode(code);

            // Trigger the change to 'drop'
            setSelectedOption('drop');
        };

        reader.readAsText(file);
    };

    const handleOptionChange = (option, e) => {
        console.log('Handling option change:', option);
        setHtmlCode('');
        setCopied(false);
        setSelectedOption(option);

        // Prevent default behavior
        if (e) {
            e.preventDefault();
        }
    };



    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true,
    });

    // eslint-disable-next-line no-unused-vars
    const { inputProps } = getInputProps();


    return (
        <ThemeProvider theme={darkTheme}>
            {proceedClicked ? (
                <HtmlDisplay /> // Render the new screen component
            ) : (
                <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
                    <Paper style={{ padding: '20px 30px 0px', textAlign: 'center', width: '80%', maxWidth: "80%", height: '70vh', overflowY: 'auto', margin: 0, backgroundColor: '#242424', borderRadius: '20px' }}>
                        <Typography variant="h4" gutterBottom>
                            Provide your HTML Code
                        </Typography>

                        <Grid container justifyContent="center" spacing={2}>
                            <Grid item>
                                <Button
                                    variant={selectedOption === 'paste' ? 'contained' : 'outlined'}
                                    color="primary"
                                    onClick={() => handleOptionChange('paste')}
                                    style={{ marginTop: 20 }}
                                >
                                    Paste HTML Code
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant={selectedOption === 'drop' ? 'contained' : 'outlined'}
                                    color="primary"
                                    onClick={() => handleOptionChange('drop')}
                                    style={{ marginTop: 20 }}
                                >
                                    Drop File
                                </Button>
                            </Grid>
                            <Grid item>
                                <label htmlFor="file-input" style={{ display: 'block' }}>
                                    <Button
                                        variant={selectedOption === 'choose' ? 'contained' : 'outlined'}
                                        color="primary"
                                        onClick={() => handleOptionChange('choose')}
                                        style={{ marginTop: 20 }}
                                    >
                                        Choose File
                                    </Button>
                                </label>
                                <input
                                    id="file-input"
                                    type="file"
                                    accept=".html, .htm"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            setHtmlCode(reader.result);
                                        };
                                        reader.readAsText(file);
                                        setSelectedOption('choose');
                                    }}
                                    style={{ display: 'none' }}
                                />
                            </Grid>
                        </Grid>

                        {selectedOption === 'paste' && (
                            <TextField
                                multiline
                                rows={11}
                                fullWidth
                                placeholder="Paste HTML code here"
                                variant="outlined"
                                value={htmlCode}
                                onChange={(e) => setHtmlCode(e.target.value)}
                                style={{ marginTop: 20 }}
                            />
                        )}

                        {selectedOption === 'drop' && (
                            <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', borderRadius: '4px', marginTop: 20, height: '30vh' }}>
                                {htmlCode ? (
                                    <div style={{ marginTop: 5 }}>
                                        <Typography variant="body1" style={{ color: 'white' }}>
                                            Dropped File Content:
                                        </Typography>
                                        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', marginTop: 10, backgroundColor: '#333', padding: 10, borderRadius: 4, textAlign: 'left', height: '20vh', overflow: 'auto' }}>
                                            {htmlCode}
                                        </pre>
                                    </div>
                                ) : (
                                    <div>
                                        <p>{isDragActive ? 'Drop the files here...' : 'Drag \'n\' drop some files here, or click to select files'}</p>
                                    </div>
                                )}
                            </div>
                        )}



                        {selectedOption === 'choose' && (
                            <input
                                type="file"
                                accept=".html, .htm"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        setHtmlCode(reader.result);
                                    };
                                    reader.readAsText(file);
                                    setSelectedOption('choose');
                                }}
                                style={{ marginTop: 20 }}
                            />
                        )}

                        <CopyToClipboard text={htmlCode} onCopy={() => setCopied(true)}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={(e) => {
                                    handleOptionChange('proceed', e);
                                    return false;
                                }}
                                style={{ marginTop: 20 }}
                                disabled={!htmlCode.trim()} // Disable the button if htmlCode is empty or contains only whitespace
                            >
                                Proceed
                            </Button>
                        </CopyToClipboard>

                        {copied && <Typography style={{ color: 'green', marginTop: 10 }}>Lets validate!!</Typography>}

                        {/* Add this log statement */}
                        {console.log('htmlCode before rendering HtmlDisplay:', htmlCode)}


                        {selectedOption === 'proceed' && <HtmlDisplay>htmlCode</HtmlDisplay>}

                    </Paper>
                </Grid>

            )}

        </ThemeProvider>
    );
};

export default HtmlEditor;
