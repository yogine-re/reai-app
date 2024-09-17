
import * as React from 'react';
import { useState } from 'react';
import {
  Tree,
  getBackendOptions,
  MultiBackend,
} from '@minoru/react-dnd-treeview';
import { DndProvider } from 'react-dnd';
import useFirestore from '../../firebase/useFirestore';
// import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import Grid from '@mui/material/Grid2';
import { Box } from '@mui/material';
import styles from './Documents.module.css';
import { CustomNode } from '../tree/CustomNode';
import Typography from '@mui/material/Typography';
// import { TypeIcon } from '../tree/TypeIcon';




export default function Documents() {
  const { documents } = useFirestore('gallery');
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  console.log('documentUrl: ', documentUrl);
  
  const handleClick = async (node: any, onToggle: any) => {
    console.log('handleClick node: ', node);
    console.log('handleClick onToggle: ', onToggle);
    onToggle(node);
    if (node.parent !== 0 && node.data) {
      console.log('documentUrl: ', node.data.documentURL);
      setDocumentUrl(node.data.documentURL);
    }
  };
  
  // Remove duplicates based on document id
  const uniqueDocuments = documents.filter(
    (item, index, self) =>
      index ===
    self.findIndex((t) => t.data?.documentName === item.data?.documentName)
  );
  console.log('uniqueDocuments: ', uniqueDocuments);
  // let counter = 1;
  // const project={id: counter++, parent: 0, droppable: true, text: 'Project', data: {documentName: 'Project'}};
  // const theDocuments = [];
  // // theDocuments = uniqueDocuments.map((item) => ({
  // //   ...item,
  // //   id: counter++,
  // //   parent: 1,
  // //   droppable: true,
  // //   text: item.data.documentName,
  // // }));
  // theDocuments.unshift(project);
  // const project2={id: counter++, parent: 1, text: 'Project2', data: {documentName: 'Project2'}};
  // theDocuments.unshift(project2);
  // const project3={id: counter++, parent: 1, text: 'Project3', data: {documentName: 'Project3'}};
  // theDocuments.unshift(project3);
  const theDocuments = [
    {
      id: 1,
      parent: 0,
      droppable: true,
      text: 'Folder 1',
    },
    {
      id: 2,
      parent: 1,
      text: 'File 1-1',
      data: {
        fileType: 'csv',
        fileSize: '0.5MB',
      },
    },
    {
      id: 3,
      parent: 1,
      text: 'File 1-2',
      data: {
        fileType: 'pdf',
        fileSize: '4.8MB',
      },
    },
    {
      id: 4,
      parent: 0,
      droppable: true,
      text: 'Folder 2',
    },
    {
      id: 5,
      parent: 4,
      droppable: true,
      text: 'Folder 2-1',
    },
    {
      id: 6,
      parent: 5,
      text: 'File 2-1-1',
      data: {
        fileType: 'image',
        fileSize: '2.1MB',
      },
    },
  ];
  
  console.log('theDocuments: ', theDocuments);
  
  const [treeData, setTreeData] = useState(theDocuments);
  const handleDrop = (newTreeData: any) => setTreeData(newTreeData);
  console.log('treeData: ', treeData);
  theDocuments.forEach((item) => {
    console.log('item: ', item);
    if (treeData.find((doc) => doc.id === item.id) === undefined) {
      treeData.push(item);
    }
  });
  
  return (
    <Box sx={{ flexGrow: 1 }}>
    <Grid container>
    <Grid size={6}>
    {/* {theDocuments.map((item) => (
      <ListItem disablePadding key={item?.id}>
      <ListItemButton onClick={() => handleClick(item?.data)}>
      <ListItemText primary={item?.data.documentName} />
      </ListItemButton>
      </ListItem>
      ))} */}
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <Tree
      tree={treeData}
      rootId={0}
      onDrop={handleDrop}
      render={(node, { depth, isOpen, onToggle }) => (
        <div
        className={styles.root}
        style={{
          paddingInlineStart: depth * 24,
          listStyleType: 'none',
        }}
        >
        {node.droppable && (
          <span onClick={() => handleClick(node, onToggle)}>
          {isOpen ? '[-]' : '[+]'}
          {node.text}
          </span>
        )}
        {!node.droppable && (
          <span onClick={() => handleClick(node, onToggle)}>
          {
            <div className={styles.label}>
            <Typography variant='body2'>{node.text}</Typography>
            </div>
          }
          </span>
        )}
        </div>
      )}
      />
      <Tree
      tree={treeData}
      rootId={0}
      onDrop={handleDrop}
      render={(node, options) => (
        <CustomNode node={node} {...options} />
      )}
      />
      </DndProvider>
      </Grid>
      <Grid size='grow'>
      {documentUrl && (
        <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
        >
        <Viewer fileUrl={documentUrl} />
        </Worker>
      )}
      </Grid>
      </Grid>
      </Box>
    );
  }