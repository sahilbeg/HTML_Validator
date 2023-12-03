import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    Grid,
    Paper,
    createTheme,
    ThemeProvider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});



function LinkCheckPage() {
    const navigate = useNavigate();
    const [csvContent, setCsvContent] = useState('');
    const [isContentPasted, setIsContentPasted] = useState(false);
    const location = useLocation();
    const [htmlCode, setHtmlCode] = useState('');
    const [linkCheckResults, setLinkCheckResults] = useState([]);

    useEffect(() => {
        const receivedHtmlCode = location.state?.htmlCode || '';
        setHtmlCode(receivedHtmlCode);
    }, [location.state?.htmlCode]);

    const handleGoBack = () => {
        navigate(-1);
    };



    const handleLinkCheck = () => {
        const userAliasesAndLinks = extractAliasesAndLinksFromCSV(csvContent);

        // Log user-provided aliases and links as an object
        console.log('User Provided Aliases and Links:', userAliasesAndLinks);

        // Extract aliases and links from the HTML code (DOM)
        const domAliasesAndLinks = {};
        const regex = /<a[^>]*?\salias=["']([^"']*)["'][^>]*?\shref=["']([^"']*)["'][^>]*?>/g;
        let matches;

        while ((matches = regex.exec(htmlCode)) !== null) {
            const alias = matches[1].toLowerCase();
            const link = matches[2];
            domAliasesAndLinks[alias] = link;
        }

        // Log DOM aliases and links as an object with hierarchy
        console.log('DOM Aliases and Links:', domAliasesAndLinks);


        // Convert user aliases and links to an array
        const userSequence = Object.entries(userAliasesAndLinks).map(([userAlias, userLink]) => ({ alias: userAlias, link: userLink }));

        // Compare each CSV entry to the DOM anchors
        const results = userSequence.map(({ alias: userAlias, link: userLink }, index) => {
            const lowercaseUserAlias = userAlias.toLowerCase();
            const isAliasMatching = lowercaseUserAlias in domAliasesAndLinks;
            const domLink = isAliasMatching ? domAliasesAndLinks[lowercaseUserAlias] : null;
            const isLinkMatching = isAliasMatching ? userLink === domLink : userLink in domAliasesAndLinks || Object.values(domAliasesAndLinks).includes(userLink);

            // Log intermediate results for each entry
            console.log(`Checking Alias: ${userAlias}, Link: ${userLink}`);
            console.log(`Alias Matching: ${isAliasMatching}, DOM Link: ${domLink}, Link Matching: ${isLinkMatching}`);

            return {
                alias: userAlias,
                link: userLink,
                isAliasMatching,
                isLinkMatching,
            };
        });

        // Check if the entire sequences match
        const isSequenceMatching = JSON.stringify(userSequence) === JSON.stringify(linkCheckResults);

        // Log the sequence matching result
        console.log('Sequence Matching:', isSequenceMatching);

        setLinkCheckResults(results);
    };




    const extractAliasesAndLinksFromCSV = (csvContent) => {
        const csvLines = csvContent.split('\n');
        const aliasesAndLinks = {};

        csvLines.forEach((line) => {
            const [alias, link] = line.split('\t');
            if (alias && link) {
                aliasesAndLinks[alias.trim()] = link.trim();
            }
        });

        return aliasesAndLinks;
    };



    useEffect(() => {
        setIsContentPasted(!!csvContent.trim());
    }, [csvContent]);



    const formatCSVForTextarea = (csvContent) => {
        const lines = csvContent.split('\n');
    
        // Find the maximum width for each column
        const columnWidths = lines.reduce((widths, line) => {
            line.split('\t').forEach((cell, index) => {
                widths[index] = Math.max(widths[index] || 0, cell.length);
            });
            return widths;
        }, []);
    
        // Format each line with aligned columns
        const formattedCSV = lines
            .map((line) =>
                line
                    .split('\t')
                    .map((cell, index) => cell.padEnd(columnWidths[index], ' '))
                    .join('    ') // Adjust the number of spaces based on your preference
            )
            .join('\n');
    
        return formattedCSV;
    };
    

    return (
        <ThemeProvider theme={darkTheme}>
            <Grid container direction="column" justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
                <Typography variant="h4" gutterBottom style={{ color: 'white', marginBottom: '20px' }}>
                    Links Check
                </Typography>

                <Paper style={{ padding: '20px 30px 0px', textAlign: 'center', width: '80%', maxWidth: '80%', height: '60vh', overflowY: 'auto', margin: 0, backgroundColor: '#242424', borderRadius: '20px' }}>
                    <div style={{ textAlign: 'left', padding: '20px', width: '50%', float: 'left', height: '90%', boxSizing: 'border-box' }}>
                        <Typography variant="h6" gutterBottom style={{ color: 'white', marginBottom: '10px' }}>
                            Paste Alias and Link from CRF
                        </Typography>
                        <textarea
                            rows={10}
                            style={{
                                width: '100%',
                                height: 'calc(100% - 30px)',
                                marginBottom: '20px',
                                padding: '10px',
                                boxSizing: 'border-box',
                                overflowY: 'auto',
                                whiteSpace: 'pre-line', // Preserve line breaks
                                fontFamily: 'monospace', // Use a monospaced font for better alignment
                            }}
                            placeholder="Paste CSV content here"
                            value={formatCSVForTextarea(csvContent)}
                            onChange={(e) => setCsvContent(e.target.value)}
                        />

                    </div>

                    <div style={{ width: '50%', float: 'right', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography variant="h5" style={{ color: 'white', marginBottom: '20px' }}>
                            Alias & Link Check Results
                        </Typography>
                        <TableContainer component={Paper} style={{ width: '100%' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Alias</TableCell>
                                        <TableCell>Link</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {linkCheckResults.map((result, index) => (
                                        <TableRow key={index}>
                                            <TableCell style={{ color: result.isAliasMatching ? '#1bfd9c' : 'red' }}>{result.alias}</TableCell>
                                            <TableCell style={{ color: result.isLinkMatching ? '#1bfd9c' : 'red' }}>{result.link}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleLinkCheck}
                            disabled={!isContentPasted}
                            style={{
                                width: '30%',
                                marginTop: '20px',
                                marginBottom: '20px',
                                backgroundColor: isContentPasted ? '#1976D2' : '#484848',
                                color: isContentPasted ? '#FFFFFF' : '7f7f7f',
                            }}
                        >
                            Check Links
                        </Button>
                    </div>

                    <div style={{ clear: 'both' }}></div>
                </Paper>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGoBack}
                    style={{ marginTop: '20px', backgroundColor: '#1976D2', color: '#FFFFFF' }}
                >
                    Go Back
                </Button>
            </Grid>
        </ThemeProvider>
    );
}

export default LinkCheckPage;
