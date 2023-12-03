import React, { useEffect, useState } from 'react';
import { useLocation, } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';

import {
  Card,
  CardContent,
  Typography,
  createTheme,
  ThemeProvider,
  Tooltip,
} from '@mui/material';

const customTheme = createTheme({
  palette: {
    mode: 'dark',
    text: {
      primary: '#ffffff', // Set the font color to light
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

const AnalyzeHtmlPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const htmlCode = location.state?.htmlCode || '';



  const handleBackToChooseFilePage = () => {
    // Use the navigate function to go to the analysis page and pass the HTML code as state
    navigate('/choose-file', { state: { htmlCode } });
  };



  const OpenCheckLinkPage = () => {
    // Use the navigate function to go to the link check page and pass the HTML code as a prop
    navigate('/linkcheck', { state: { htmlCode } });
  };




  // State to store the pass/fail status for the first analysis
  const [firstAnalysisStatus, setFirstAnalysisStatus] = useState(''); // 'Pass', 'Fail', or ''

  const [firstBoxLangDetails, setFirstBoxLangDetails] = useState([]);

  // State to store the pass/fail status for the second analysis
  const [secondAnalysisStatus, setSecondAnalysisStatus] = useState(''); // 'Pass', 'Fail', or ''

  // State to store the pass/fail status for the third analysis
  const [thirdAnalysisStatus, setThirdAnalysisStatus] = useState(''); // 'Pass', 'Fail', or ''

  // State to store the pass/fail status for the fourth analysis
  const [fourthAnalysisStatus, setFourthAnalysisStatus] = useState(''); // 'Pass', 'Fail', or ''

  // State to store details about anchors without an associated alias tag
  const [anchorsWithoutAliasDetails, setAnchorsWithoutAliasDetails] = useState([]); // Array to store details about invalid anchors

  // State to store details about invalid anchors
  const [invalidAnchorsDetails, setInvalidAnchorsDetails] = useState([]); // Array to store details about invalid anchors


  // State to store the pass/fail status for the fifth analysis
  const [fifthAnalysisStatus, setFifthAnalysisStatus] = useState(''); // 'Pass', 'Fail', or ''

  // State to store details about images without alt text
  const [imagesWithoutAltDetails, setImagesWithoutAltDetails] = useState([]); // Array to store details about images without alt text


  // State to store the pass/fail status for the sixth analysis
  const [sixthAnalysisStatus, setSixthAnalysisStatus] = useState(''); // 'Pass', 'Fail', or ''

  // State to store details about images without title text
  const [imagesWithoutTitleDetails, setImagesWithoutTitleDetails] = useState([]); // Array to store details about images without title text


  // State to store the pass/fail status for the seventh analysis
  const [seventhAnalysisStatus, setSeventhAnalysisStatus] = useState(''); // 'Pass', 'Fail', or ''

  // State to store details about tables with invalid attributes
  const [tablesWithInvalidAttributesDetails, setTablesWithInvalidAttributesDetails] = useState([]); // Array to store details about tables with invalid attributes



  

  // Log the HTML code to the console and perform analysis
  useEffect(() => {
    // Perform first analysis
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlCode, 'text/html');

    // Check if the opening HTML tag has Lang="en"
    const htmlLangAttribute = doc.documentElement.getAttribute('lang');
    const isHtmlLangEn = htmlLangAttribute && htmlLangAttribute.toLowerCase() === 'en';

    // Check if the opening Body tag has Lang="en"
    const bodyLangAttribute = doc.body.getAttribute('lang');
    const isBodyLangEn = bodyLangAttribute && bodyLangAttribute.toLowerCase() === 'en';

    // Check if the first opening Div tag has Lang="en"
    const firstDiv = doc.querySelector('div');
    const divLangAttribute = firstDiv?.getAttribute('lang');
    const isFirstDivLangEn = divLangAttribute && divLangAttribute.toLowerCase() === 'en';

    // Set the status for the first analysis
    if (isHtmlLangEn && isBodyLangEn && isFirstDivLangEn) {
      setFirstAnalysisStatus('Pass');
    } else {
      setFirstAnalysisStatus('Fail');

      // Collect details about where lang="en" is missing
      const langDetails = [];
      if (!isHtmlLangEn) {
        langDetails.push('HTML tag is missing lang="en"');
      }
      if (!isBodyLangEn) {
        langDetails.push('Body tag is missing lang="en"');
      }
      if (!isFirstDivLangEn) {
        langDetails.push('First DIV tag is missing lang="en"');
      }

      // Set langDetails in the state
      setFirstBoxLangDetails(langDetails);
    }



    // Perform second analysis
    const tables = doc.querySelectorAll('table');
    let isAllTablesRolePresentation = true;

    const missingRoleDetails = [];

    tables.forEach((table) => {
      const tableRoleAttribute = table.getAttribute('role');
      if (!tableRoleAttribute || tableRoleAttribute.toLowerCase() !== 'presentation') {
        isAllTablesRolePresentation = false;

        // Add details about the missing role to the temporary array
        missingRoleDetails.push({
          table: table.outerHTML,
        });
      }
    });

    // Update the state for the secondBox
    setSecondBox({
      ...secondBox,
      status: isAllTablesRolePresentation ? 'Pass' : 'Fail',
      missingRoleDetails: missingRoleDetails,
    });

    // Set the missingRoleDetails in the secondBox object
    secondBox.missingRoleDetails = missingRoleDetails;

    // Set the status for the second analysis
    if (isAllTablesRolePresentation) {
      setSecondAnalysisStatus('Pass');
    } else {
      setSecondAnalysisStatus('Fail');
    }



    // Perform third analysis for anchor tags
    const anchorTags = doc.body.querySelectorAll('a');
    let areAllAnchorsValid = true;
    const invalidAnchors = [];

    anchorTags.forEach((anchor) => {
      const hrefAttribute = anchor.getAttribute('href');
      const targetAttribute = anchor.getAttribute('target');

      if (!hrefAttribute || hrefAttribute.trim() === '' || !targetAttribute || targetAttribute.toLowerCase() !== '_blank') {
        areAllAnchorsValid = false;
        invalidAnchors.push({
          anchor: anchor.outerHTML,
          details: 'Invalid href or target="_blank" attributes',
        });
      }
    });


    // Set the status for the third analysis
    if (areAllAnchorsValid) {
      setThirdAnalysisStatus('Pass');
    } else {
      setThirdAnalysisStatus('Fail');
    }

    // Set the invalidAnchorsDetails in the state
    setInvalidAnchorsDetails(invalidAnchors);





    // Perform fourth analysis for anchor tags
    let areAllAnchorsWithAlias = true;
    const anchorsWithoutAlias = [];

    anchorTags.forEach((anchor) => {
      const aliasAttribute = anchor.getAttribute('alias');

      if (!aliasAttribute || aliasAttribute.trim() === '') {
        areAllAnchorsWithAlias = false;
        anchorsWithoutAlias.push({
          anchor: anchor.outerHTML,
          details: 'Missing alias attribute',
        });
      }
    });


    // Set the status for the fourth analysis
    if (areAllAnchorsWithAlias) {
      setFourthAnalysisStatus('Pass');
    } else {
      setFourthAnalysisStatus('Fail');
    }

    // Set the anchorsWithoutAliasDetails in the state
    setAnchorsWithoutAliasDetails(anchorsWithoutAlias);




    // Perform fifth analysis for img tags
    const imgTags = doc.body.querySelectorAll('img');
    let areAllImagesWithAlt = true;
    const imagesWithoutAlt = [];

    imgTags.forEach((img) => {
      const altAttribute = img.getAttribute('alt');

      if (!altAttribute || altAttribute.trim() === '') {
        areAllImagesWithAlt = false;
        imagesWithoutAlt.push({
          img: img.outerHTML,
          details: 'Missing alt attribute',
        });
      }
    });

    // Set the status for the fifth analysis
    if (areAllImagesWithAlt) {
      setFifthAnalysisStatus('Pass');
    } else {
      setFifthAnalysisStatus('Fail');
    }

    // Set the imagesWithoutAltDetails in the state
    setImagesWithoutAltDetails(imagesWithoutAlt);




    // Perform sixth analysis for img tags
    const imgElements = Array.from(doc.body.getElementsByTagName('img'));
    let areAllImagesWithTitle = true;
    const imagesWithoutTitle = [];

    imgElements.forEach((img) => {
      const hasTitleAttribute = Array.from(img.attributes).some(attr => attr.name.toLowerCase() === 'title');

      if (!hasTitleAttribute) {
        areAllImagesWithTitle = false;
        imagesWithoutTitle.push({
          img: img.outerHTML,
          details: 'Missing title attribute',
        });
      }
    });

    // Set the status for the sixth analysis
    if (areAllImagesWithTitle) {
      setSixthAnalysisStatus('Pass');
    } else {
      setSixthAnalysisStatus('Fail');
    }

    // Set the imagesWithoutTitleDetails in the state
    setImagesWithoutTitleDetails(imagesWithoutTitle);




    // Perform seventh analysis for table tags
    const tablesWithInvalidAttributes = [];
    tables.forEach((table) => {
      const cellpaddingAttribute = table.getAttribute('cellpadding');
      const cellspacingAttribute = table.getAttribute('cellspacing');
      const borderAttribute = table.getAttribute('border');

      if (
        cellpaddingAttribute !== '0' ||
        cellspacingAttribute !== '0' ||
        borderAttribute !== '0'
      ) {
        tablesWithInvalidAttributes.push({
          table: table.outerHTML,
          details: 'Invalid attributes: cellpadding, cellspacing, or border',
        });
      }
    });

    // Set the status for the seventh analysis
    if (tablesWithInvalidAttributes.length === 0) {
      setSeventhAnalysisStatus('Pass');
    } else {
      setSeventhAnalysisStatus('Fail');
    }

    // Set the tablesWithInvalidAttributesDetails in the state
    setTablesWithInvalidAttributesDetails(tablesWithInvalidAttributes);

    // ...



    console.log('isAllTestsPassed:', isAllTestsPassed());


    // Add your additional analysis logic here...

  }, [htmlCode]);



  // Helper function to check if all tests passed
  const isAllTestsPassed = () => (
    firstAnalysisStatus === 'Pass' &&
    secondAnalysisStatus === 'Pass' &&
    thirdAnalysisStatus === 'Pass' &&
    fourthAnalysisStatus === 'Pass' &&
    fifthAnalysisStatus === 'Pass' &&
    sixthAnalysisStatus === 'Pass' &&
    seventhAnalysisStatus === 'Pass'
  );

  // console.log('isAllTestsPassed:', isAllTestsPassed());


  console.log('First Analysis Status:', firstAnalysisStatus);
  console.log('Second Analysis Status:', secondAnalysisStatus);
  console.log('Third Analysis Status:', thirdAnalysisStatus);
  console.log('Fourth Analysis Status:', fourthAnalysisStatus);
  console.log('Fifth Analysis Status:', fifthAnalysisStatus);
  console.log('Sixth Analysis Status:', sixthAnalysisStatus);
  console.log('Seventh Analysis Status:', seventhAnalysisStatus);



  // Sample data for the first box
  const firstBox = {
    id: 1,
    description: 'Check for Lang="en" in HTML, BODY and First DIV tag',
    status: firstAnalysisStatus, // Use the status for the first analysis here
    langDetails: firstBoxLangDetails, // Array to store details about Lang attribute failures
  };

  // Sample data for the second box
  const [secondBox, setSecondBox] = useState({
    id: 2,
    description: 'Check for role="presentation" in all table tags',
    status: '', // Initialize status to empty
    missingRoleDetails: [], // Initialize missingRoleDetails to an empty array
  });


  // Sample data for the fourth box
  const fourthBox = {
    id: 4,
    description: 'Check if all anchor tags have an associated alias tag',
    status: fourthAnalysisStatus, // Use the status for the fourth analysis here
    anchorsWithoutAliasDetails: anchorsWithoutAliasDetails, // Array to store details about anchors without an associated alias tag
  };


  // Sample data for the fifth box
  const fifthBox = {
    id: 5,
    description: 'Check if all img tags have an associated alt attribute',
    status: fifthAnalysisStatus, // Use the status for the fifth analysis here
    imagesWithoutAltDetails: imagesWithoutAltDetails, // Array to store details about images without alt text
  };


  // Sample data for the sixth box
  const sixthBox = {
    id: 6,
    description: 'Check if all img tags have an associated title attribute',
    status: sixthAnalysisStatus, // Use the status for the sixth analysis here
    imagesWithoutTitleDetails: imagesWithoutTitleDetails, // Array to store details about images without title text
  };


  // Sample data for the seventh box
  const seventhBox = {
    id: 7,
    description: 'Check if all table tags have associated attributes (cellpadding="0", cellspacing="0", border="0")',
    status: seventhAnalysisStatus, // Use the status for the seventh analysis here
    tablesWithInvalidAttributesDetails: tablesWithInvalidAttributesDetails, // Array to store details about tables with invalid attributes
  };


  


  return (
    <ThemeProvider theme={customTheme}>
      <div style={{ marginTop: '80px', width: '100%' }}>
        <Typography variant="h4" gutterBottom style={{ textAlign: 'center', marginBottom: '50px', color: 'white' }}>
          File Validation Results
        </Typography>

        {/* First Box with 10px gap */}
        <Card
          sx={{
            width: '80%',
            maxWidth: '80%',
            margin: 'auto',
            borderRadius: '5px',
            marginBottom: '5px',
            display: 'flex',
            height: '60px',
            flexDirection: 'column',
            padding: '0px 20px',
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" style={{ marginBottom: '10px' }}>{firstBox.description}</Typography>
              <Tooltip
                title={
                  <div>
                    <Typography variant="body2">Missing Lang="en" Details:</Typography>
                    {firstBox.langDetails.map((detail, index) => (
                      <div key={index}>
                        <Typography variant="body2">{detail}</Typography>
                      </div>
                    ))}
                  </div>
                }
                arrow
              >
                <Typography variant="body2" style={{ color: firstBox.status === 'Pass' ? '#1bfd9c' : 'red', cursor: 'pointer' }}>
                  {firstBox.status}
                </Typography>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>


        {/* Second Box with 10px gap */}
        <Card
          sx={{
            width: '80%',
            maxWidth: '80%',
            margin: 'auto',
            borderRadius: '5px',
            marginBottom: '5px',
            display: 'flex',
            height: '60px',
            flexDirection: 'column',
            padding: '0px 20px',
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" style={{ marginBottom: '10px' }}>{secondBox.description}</Typography>
              <Tooltip
                title={
                  <div>
                    <Typography variant="body2">{secondBox.description} Details:</Typography>
                    {secondBox.missingRoleDetails.map((detail, index) => (
                      <div key={index}>
                        <Typography variant="body2">Table {index + 1}:</Typography>
                        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', padding: '5px', backgroundColor: '#f0f0f0', color: '#262626' }}>
                          {detail.table.split('>')[0] + '>'}
                        </pre>
                      </div>
                    ))}
                  </div>
                }
                arrow
              >
                <Typography variant="body2" style={{ color: secondBox.status === 'Pass' ? '#1bfd9c' : 'red', cursor: 'pointer' }}>
                  {secondBox.status}
                </Typography>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>




        {/* Fourth Box with 10px gap */}
        <Card
          sx={{
            width: '80%',
            maxWidth: '80%',
            margin: 'auto',
            borderRadius: '5px',
            marginBottom: '5px',
            display: 'flex',
            height: '60px',
            flexDirection: 'column',
            padding: '0px 20px',
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" style={{ marginBottom: '10px' }}>{fourthBox.description}</Typography>
              <Tooltip
                title={
                  <div>
                    <Typography variant="body2">Anchors Without Alias Details:</Typography>
                    {fourthBox.anchorsWithoutAliasDetails.map((detail, index) => (
                      <div key={index}>
                        <Typography variant="body2">Anchor {index + 1}:</Typography>
                        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', padding: '5px', backgroundColor: '#f0f0f0', color: '#262626' }}>
                          {detail.anchor.split('>')[0] + '>'}
                        </pre>
                        <Typography variant="body2">Details:</Typography>
                        <Typography variant="body2">{detail.details}</Typography>
                      </div>
                    ))}
                  </div>
                }
                arrow
              >
                <Typography variant="body2" style={{ color: fourthBox.status === 'Pass' ? '#1bfd9c' : 'red', cursor: 'pointer' }}>
                  {fourthBox.status}
                </Typography>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>


        {/* Fifth Box with 10px gap */}
        <Card
          sx={{
            width: '80%',
            maxWidth: '80%',
            margin: 'auto',
            borderRadius: '5px',
            marginBottom: '5px',
            display: 'flex',
            height: '60px',
            flexDirection: 'column',
            padding: '0px 20px',
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" style={{ marginBottom: '10px' }}>{fifthBox.description}</Typography>
              <Tooltip
                title={
                  <div>
                    <Typography variant="body2">Images Without Alt Details:</Typography>
                    {fifthBox.imagesWithoutAltDetails.map((detail, index) => (
                      <div key={index}>
                        <Typography variant="body2">Image {index + 1}:</Typography>
                        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', padding: '5px', backgroundColor: '#f0f0f0', color: '#262626' }}>
                          {detail.img}
                        </pre>
                        <Typography variant="body2">Details:</Typography>
                        <Typography variant="body2">{detail.details}</Typography>
                      </div>
                    ))}
                  </div>
                }
                arrow
              >
                <Typography variant="body2" style={{ color: fifthBox.status === 'Pass' ? '#1bfd9c' : 'red', cursor: 'pointer' }}>
                  {fifthBox.status}
                </Typography>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>


        {/* Sixth Box with 10px gap */}
        <Card
          sx={{
            width: '80%',
            maxWidth: '80%',
            margin: 'auto',
            borderRadius: '5px',
            marginBottom: '5px',
            display: 'flex',
            height: '60px',
            flexDirection: 'column',
            padding: '0px 20px',
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" style={{ marginBottom: '10px' }}>{sixthBox.description}</Typography>
              <Tooltip
                title={
                  <div>
                    <Typography variant="body2">Images Without Title Details:</Typography>
                    {sixthBox.imagesWithoutTitleDetails.map((detail, index) => (
                      <div key={index}>
                        <Typography variant="body2">Image {index + 1}:</Typography>
                        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', padding: '5px', backgroundColor: '#f0f0f0', color: '#262626' }}>
                          {detail.img}
                        </pre>
                        <Typography variant="body2">Details:</Typography>
                        <Typography variant="body2">{detail.details}</Typography>
                      </div>
                    ))}
                  </div>
                }
                arrow
              >
                <Typography variant="body2" style={{ color: sixthBox.status === 'Pass' ? '#1bfd9c' : 'red', cursor: 'pointer' }}>
                  {sixthBox.status}
                </Typography>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>


        {/* Seventh Box with 10px gap */}
        <Card
          sx={{
            width: '80%',
            maxWidth: '80%',
            margin: 'auto',
            borderRadius: '5px',
            marginBottom: '5px',
            display: 'flex',
            height: '80px', // Fixed height
            flexDirection: 'column',
            padding: '0px 20px',
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" style={{ marginBottom: '10px' }}>{seventhBox.description}</Typography>
              <Tooltip
                title={
                  <div>
                    <Typography variant="body2">Tables With Invalid Attributes Details:</Typography>
                    {seventhBox.tablesWithInvalidAttributesDetails.map((detail, index) => (
                      <div key={index}>
                        <Typography variant="body2">Table {index + 1}:</Typography>
                        <div
                          style={{
                            maxHeight: '40px', // Adjust the maximum height as needed
                            overflowY: 'auto', // Enable vertical scrolling if content exceeds the maximum height
                          }}
                        >
                          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', padding: '5px', backgroundColor: '#f0f0f0', color: '#262626' }}>
                            {detail.table.split('>')[0] + '>'}
                          </pre>
                        </div>
                        <Typography variant="body2">Details:</Typography>
                        <Typography variant="body2">{detail.details}</Typography>
                      </div>
                    ))}
                  </div>
                }
                arrow
              >
                <Typography variant="body2" style={{ color: seventhBox.status === 'Pass' ? '#1bfd9c' : 'red', cursor: 'pointer' }}>
                  {seventhBox.status}
                </Typography>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>


        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop="20px" // Adjust the vertical position as needed
        >
          <Box marginRight="30px">
            <Button
              variant="contained"
              color="primary"
              onClick={handleBackToChooseFilePage}
              style={{ marginTop: 20 }}
            >
              UPLOAD HTML
            </Button>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={OpenCheckLinkPage}
              style={{ marginTop: 20 }}
              disabled={!isAllTestsPassed()}
            >
              CHECK LINKS
            </Button>
          </Box>
        </Box>


      </div>


    </ThemeProvider>

  );
};

export default AnalyzeHtmlPage;
