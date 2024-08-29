
import * as React from 'react';
import { useState } from 'react';
// import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
// import { styled } from '@mui/material/styles';
import useFirestore from '../../firebase/useFirestore';
// import { Document } from 'react-pdf'
import { Box, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
//   ...theme.applyStyles('dark', {
//     backgroundColor: '#1A2027',
//   }),
// }));




export default function Documents() {
  const { documents } = useFirestore('gallery');
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  const blobToURL = (blob: Blob): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };

  const handleClick = async (documentData: any) => {
    console.log(`Clicked on document: ${documentData.documentName}`);
    console.log(`document url: ${documentData.documentURL}`);
    const arrayBuffer = await fetch(documentData.documentURL);
    const blob = await arrayBuffer.blob();
    blobToURL(blob).then((url) => {
      console.log(`url: ${url}`);
      setDocumentUrl(documentData.documentURL);
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
        <Grid size={6}>
            {documents.map((item) => (
              <ListItem disablePadding key={item?.id}>
                <ListItemButton onClick={() => handleClick(item?.data)}>
                  <ListItemText primary={item?.data.documentName} />
                </ListItemButton>
              </ListItem>
            ))}
          </Grid>
          <Grid size='grow'>
            {documentUrl && (
              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                <Viewer fileUrl={documentUrl} />
              </Worker>
            )}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>

  );
}


// import ImageList from '@mui/material/ImageList';
// import ImageListItem from '@mui/material/ImageListItem';

// import { Avatar, Tooltip, Typography } from '@mui/material';
// import moment from 'moment';
// import Options from './Options';
// import useFirestore from '../../firebase/useFirestore';
// import Lightbox from 'react-18-image-lightbox';
// import 'react-18-image-lightbox/style.css';
// import { useState } from 'react';

// function srcset(image: string, size: number, rows = 1, cols = 1) {
//   return {
//     src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
//     srcSet: `${image}?w=${size * cols}&h=${
//       size * rows
//     }&fit=crop&auto=format&dpr=2 2x`,
//   };
// }

// export default function Documents() {
//   const { documents } = useFirestore('gallery');
//   const [isOpen, setIsOpen] = useState(false);
//   const [photoIndex, setPhotoIndex] = useState(0);
  
//   return (
//     <>
//       <ImageList variant='quilted' cols={4} rowHeight={200}>
//         {documents.map((item, index) => (
//           <ImageListItem
//             key={item?.id}
//             cols={
//               pattern[
//                 index - Math.floor(index / pattern.length) * pattern.length
//               ].cols
//             }
//             rows={
//               pattern[
//                 index - Math.floor(index / pattern.length) * pattern.length
//               ].rows
//             }
//             sx={{
//               opacity: '.7',
//               transition: 'opacity .3s linear',
//               cursor: 'pointer',
//               '&:hover': { opacity: 1 },
//             }}
//           >
//             <Options
//               imageId={item?.id}
//               uid={(item as { data: { uid: string } })?.data?.uid}
//               imageURL={item?.data?.imageURL}
//             />

//             <img
//               {...srcset(
//                 item?.data?.imageURL,
//                 200,
//                 pattern[
//                   index - Math.floor(index / pattern.length) * pattern.length
//                 ].rows,
//                 pattern[
//                   index - Math.floor(index / pattern.length) * pattern.length
//                 ].cols
//               )}
//               alt={item?.data?.uName || item?.data?.uEmail?.split('@')[0]}
//               loading='lazy'
//               onClick={() => {
//                 setPhotoIndex(index);
//                 setIsOpen(true);
//               }}
//             />
//             <Typography
//               variant='body2'
//               component='span'
//               sx={{
//                 position: 'absolute',
//                 bottom: 0,
//                 left: 0,
//                 color: 'white',
//                 background: 'rgba(0,0,0, .3)',
//                 p: '5px',
//                 borderTopRightRadius: 8,
//               }}
//             >
//               {moment(item?.data?.timestamp?.toDate()).fromNow()}
//             </Typography>
//             <Tooltip
//               title={item?.data?.uName || item?.data?.uEmail?.split('@')[0]}
//               sx={{
//                 position: 'absolute',
//                 bottom: '3px',
//                 right: '3px',
//               }}
//             >
//               <Avatar
//                 src={item?.data?.uPhoto}
//                 imgProps={{ 'aria-hidden': true }}
//               />
//             </Tooltip>
//           </ImageListItem>
//         ))}
//       </ImageList>
//       {isOpen && (
//         <Lightbox
//           mainSrc={documents[photoIndex]?.data?.imageURL}
//           nextSrc={
//             documents[(photoIndex + 1) % documents.length]?.data?.imageURL
//           }
//           prevSrc={
//             documents[(photoIndex + documents.length - 1) % documents.length]
//               ?.data?.imageURL
//           }
//           onCloseRequest={() => setIsOpen(false)}
//           onMoveNextRequest={() =>
//             setPhotoIndex((photoIndex + 1) % documents.length)
//           }
//           onMovePrevRequest={() =>
//             setPhotoIndex(
//               (photoIndex + documents.length - 1) % documents.length
//             )
//           }
//           imageTitle={documents[photoIndex]?.data?.uName}
//           imageCaption={documents[photoIndex]?.data?.uEmail}
//         />
//       )}
//     </>
//   );
// }

// const pattern = [
//   {
//     rows: 2,
//     cols: 2,
//   },
//   {
//     rows: 1,
//     cols: 1,
//   },
//   {
//     rows: 1,
//     cols: 1,
//   },
//   {
//     rows: 1,
//     cols: 2,
//   },
//   {
//     rows: 1,
//     cols: 2,
//   },
//   {
//     rows: 2,
//     cols: 2,
//   },
//   {
//     rows: 1,
//     cols: 1,
//   },
//   {
//     rows: 1,
//     cols: 1,
//   },
// ];
