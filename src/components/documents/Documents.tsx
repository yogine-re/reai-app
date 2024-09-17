
// see https://www.npmjs.com/package/@minoru/react-dnd-treeview?activeTab=readme#usage
// see https://minop1205.github.io/react-dnd-treeview/?path=/docs/basic-examples-select-node--select-node-story
import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import {
  Tree,
  getBackendOptions,
  MultiBackend,
} from '@minoru/react-dnd-treeview';
import { DndProvider } from 'react-dnd';
import useFirestore from '../../firebase/useFirestore';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import Grid from '@mui/material/Grid2';
import { Box } from '@mui/material';
import styles from './Documents.module.css';
import { CustomNode } from '../tree/CustomNode';
import { CustomDragPreview } from '../tree/CustomDragPreview';
import { DocumentProperties } from './types';
// import theDocuments from '../tree/sample_data.json';

export default function Documents() {
  const { documents} = useFirestore('gallery');
  const [documentURL, setDocumentURL] = useState<string | null>(null);
  const [updated, setUpdated] = useState(false);
  const uniqueDocuments = Array.from(
    new Map(documents.map((item) => [item.data?.documentName, item])).values()
  );
  let counter = 1;
  const createDocumentData = (documentName: string, item: DocumentProperties|null, parent: number, droppable: boolean) => {
    console.log('createDocument: documentName:', documentName);
    console.log('createDocument: counter:', counter);
    return {
      id: counter++,
      parent,
      droppable,
      text: documentName,
      data: item,
    }
  };
  
  const parentDocumentData = createDocumentData('documents', null, 0, true);
  const theDocuments = uniqueDocuments.map((item) => createDocumentData(item.data.documentName, item.data, parentDocumentData.id, false));
  theDocuments.unshift(parentDocumentData);
  console.log('theDocuments: ', theDocuments);
  
  const [treeData, setTreeData] = useState([theDocuments]);
  const [selectedNode, setSelectedNode] = useState(null);
  const handleDrop = (newTree: any) => setTreeData(newTree);
  const handleSelect = (node: any) => {
    setSelectedNode(node);  
    if (node.data?.documentURL) {
      setDocumentURL(node.data.documentURL);
    }
  };
  const handleTextChange = (id: any, value: any) => {
    const newTree = treeData.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          text: value
        };
      }
      return node;
    });
    setTreeData(newTree);
  };

  console.log('treeData: ', treeData);
  theDocuments.forEach((item) => {
    console.log('item: ', item);
    if (treeData.find((doc) => doc.id === item.id) === undefined) {
      treeData.push(item);
    }
  });

  useEffect(() => {
    console.log('useEffect: updated: ', updated);
    setUpdated(true);
  },[])
  
  return (
    <Box sx={{ flexGrow: 1 }}>
    <Grid container>
    <Grid size={6}>
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <div className={styles.app}>
          <Tree
            tree={treeData}
            rootId={0}
            render={(node, { depth, isOpen, onToggle }) => (
              <CustomNode
                node={node}
                depth={depth}
                isOpen={isOpen}
                isSelected={node.id === selectedNode?.id}
                onToggle={onToggle}
                onSelect={handleSelect}
                onTextChange={handleTextChange}
              />
            )}
            dragPreviewRender={(monitorProps) => (
              <CustomDragPreview monitorProps={monitorProps} />
            )}
            onDrop={handleDrop}
            classes={{
              draggingSource: styles.draggingSource,
              dropTarget: styles.dropTarget
            }}
            initialOpen={true}
            sort={false}
          />
        </div>
      </DndProvider>
      </Grid>
      <Grid size='grow'>
      {documentURL && (
        <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
        >
        <Viewer fileUrl={documentURL} />
        </Worker>
      )}
      </Grid>
      </Grid>
      </Box>
    );
  }