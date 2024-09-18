
// see https://www.npmjs.com/package/@minoru/react-dnd-treeview?activeTab=readme#usage
// see https://minop1205.github.io/react-dnd-treeview/?path=/docs/basic-examples-select-node--select-node-story
import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import {
  Tree,
  getBackendOptions,
  MultiBackend,
  NodeModel,
} from '@minoru/react-dnd-treeview';
import { DndProvider } from 'react-dnd';
// import useFirestore from '../../firebase/useFirestore';
import { app } from '../../firebase/config';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
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
  const db = getFirestore(app);
  const [documentURL, setDocumentURL] = useState<string | null>(null);
  const [treeData, setTreeData] = useState<NodeModel<DocumentProperties>[]>([]);
  const [selectedNode, setSelectedNode] = useState<NodeModel<DocumentProperties> | null>(null);
  const handleDrop = (newTree: any) => setTreeData(newTree);
  const handleSelect = (node: any) => {
    setSelectedNode(node);  
    if (node.data?.documentURL) {
      setDocumentURL(node.data.documentURL);
    }
  };
  const handleTextChange = (id: any, value: any) => {
    console.log('handleTextChange id: ', id);
    console.log('handleTextChange value: ', value);
    const newTree = treeData.map((node: NodeModel<DocumentProperties>) => {
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

  useEffect(() => {
    console.log('useEffect');
    let counter = 1;
    const unsubscribe = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      console.log('unsubscribe snapshot.docs: ', snapshot.docs);
      const docs = snapshot.docs; // Store snapshot.docs in a variable
      const uniqueDocsMap = new Map();
  
      docs.forEach((doc) => {
        const data = doc.data();
        if (!uniqueDocsMap.has(data.documentName)) {
          uniqueDocsMap.set(data.documentName, {
            id: ++counter,
            parent: 1,
            droppable: false,
            text: data.documentName,
            data: {
              documentName: data.documentName,
              fileType: data.fileType,
              ...data,
            },
          });
        }
      });
  
      const documents = Array.from(uniqueDocsMap.values());
      documents.unshift({
        id: 1,
        parent: 0,
        droppable: true,
        text: 'Documents',
        data: {},
      });
  
      setTreeData(documents);
      console.log('CAROLINA documents: ', documents);
      console.log('documentURL: ', documentURL);
      if(documents.length <= 1) {
        setDocumentURL(null);
      }
      
    });
  
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
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