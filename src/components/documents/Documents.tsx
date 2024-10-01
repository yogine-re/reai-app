
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
import '@react-pdf-viewer/core/lib/styles/index.css';
import Grid from '@mui/material/Grid2';
import { Box, IconButton, Typography } from '@mui/material';
import styles from './Documents.module.css';
import { CustomNode } from '../tree/CustomNode';
import { CustomDragPreview } from '../tree/CustomDragPreview';
import { DocumentProperties } from './types';
import { useAppData } from '../../context/AppContext';
import { MoreVertRounded } from '@mui/icons-material';
import DocumentMenu from './DocumentsMenu';

export default function Documents() {
  const { project, currentDocument } = useAppData();
  const [documents, setDocuments] = useState<DocumentProperties[]>([]);
  const [documentURL, setDocumentURL] = useState<string | null>(null);

  const db = getFirestore(app);
  const [treeData, setTreeData] = useState<NodeModel<DocumentProperties>[]>([]);
  const [isTreeVisible, setIsTreeVisible] = useState<boolean>(false); 
  const [selectedDocument, setSelectedDocument] = useState<DocumentProperties | null>(null);
  const [selectedNode, setSelectedNode] =
    useState<NodeModel<DocumentProperties> | null>(null);
  const handleDrop = (newTree: any) => setTreeData(newTree);
  const handleSelect = (node: NodeModel<DocumentProperties>) => {
    setSelectedNode(node);
    if(node.data) setSelectedDocument(node.data);
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
          text: value,
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
    const unsubscribe = onSnapshot(collection(db, 'documents'), (snapshot) => {
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

      const documentNodes = Array.from(uniqueDocsMap.values());
      setDocuments(Array.from(uniqueDocsMap.values()).map((doc) => doc.data));
      documentNodes.unshift({
        id: 1,
        parent: 0,
        droppable: true,
        text: project,
        data: {},
      });

      setTreeData(documentNodes);
      console.log('documentNodes: ', documentNodes);
      console.log('documentURL: ', documentURL);
      if (documents.length <= 1) {
        setDocumentURL(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentDocument) {
      // Perform any actions needed when currentDocument changes
      console.log('Current document has changed:', currentDocument);
      setSelectedDocument(currentDocument);
      setDocumentURL(currentDocument.documentURL);
    }
  }, [currentDocument]);

  return (
    <Grid container>
      <IconButton
        size='small'
        onClick={() => setIsTreeVisible(!isTreeVisible)}
        sx={{
          width: '24px',
          height: '24px',
          padding: '4px',
          '& .MuiSvgIcon-root': {
            fontSize: '16px',
          },
        }}
      >
        <MoreVertRounded />
      </IconButton>
      {isTreeVisible ? (
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
                  dropTarget: styles.dropTarget,
                }}
                initialOpen={true}
                sort={false}
              />
            </div>
          </DndProvider>
        </Grid>
      ) : (
        <Grid size={6}></Grid>
      )}
      <Grid size={5} container justifyContent='left'>
        <DocumentMenu documents={documents} />
        <Box>
          {selectedDocument && (
            <Typography
              variant='subtitle1'
              sx={{
                marginBottom: 2,
                fontWeight: 'bold',
                color: 'primary.main',
                letterSpacing: 1.2,
              }}
            >
              {selectedDocument.documentName}
            </Typography>
          )}
        </Box>
        {documentURL && (
            
              <iframe
                src={documentURL}
                style={{ width: '100%', height: '80vh', border: 'none' }}
                title="Document Viewer"
              />
            
          )}
      </Grid>
    </Grid>
  );
}