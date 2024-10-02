import React, { useState, useEffect } from 'react';
import { getDocument, GlobalWorkerOptions, version as pdfjsVersion } from 'pdfjs-dist';
import axios from 'axios';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useAppData } from '../../context/AppContext';
import { getErrorMessage } from '@/utils';

// Set workerSrc for pdfjs
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.js`;

const PdfSummarizer = () => {
const { currentDocument } = useAppData();
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [lastDocumentURL, setLastDocumentURL] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setWarning(null);
  };

  const extractTextFromPDF = async (documentURL: string) => {
    console.log('Extracting text from PDF:', documentURL);
    try {
      // Fetch the PDF document from the URL
      const response = await axios.get(documentURL, {
        responseType: 'arraybuffer',
      });
      const pdfBuffer = response.data;

      // Extract text from the PDF document
      const pdf = await getDocument({ data: pdfBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');
        text += `${pageText} `;
      }
      return text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      return '';
    }
  };

  const CHUNK_SIZE = 1000; // Adjust the chunk size as needed
  const MAX_RETRIES = 5; // Maximum number of retries
  const INITIAL_DELAY = 1000; // Initial delay in milliseconds

  const splitTextIntoChunks = (text: string, chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const summarizeChunk = async (
    chunk: string,
    retries = 0
  ): Promise<string> => {
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        { inputs: chunk },
        {
          headers: {
            Authorization: `Bearer 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`,
          },
        }
      );
      return response.data[0].summary_text;
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 429 &&
        retries < MAX_RETRIES
      ) {
        const delayTime = INITIAL_DELAY * Math.pow(2, retries);
        const warningMessage = `Rate limit hit. Retrying in ${delayTime} ms...`;
        console.warn(warningMessage);
        setWarning(warningMessage);
        setIsDialogOpen(true);
        await delay(delayTime);
        return summarizeChunk(chunk, retries + 1);
      } else {
        const message = getErrorMessage(error);
        console.error(message);
        console.error('Chunk:', chunk);
        return '';
      }
    }
  };
  
  const summarizeText = async (text: string) => {
    try {
      setLoading(true);
      const chunks = splitTextIntoChunks(text, CHUNK_SIZE);
      const summaries = await Promise.all(chunks.map(chunk => summarizeChunk(chunk)));
      const finalSummary = summaries.join(' ');
      setSummary(finalSummary);
    } catch (error) {
      console.error('Error summarizing text', error);
      setSummary('Unable to summarize document');
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async (documentURL: string) => { 
    const text = await extractTextFromPDF(documentURL);
    await summarizeText(text);
  };

  useEffect(() => {
    if (currentDocument) {
      console.log('PdfSummarizer useEffect, currentDocument has changed:', currentDocument);
      const currentDocumentURL = currentDocument?.documentURL;
      if (currentDocumentURL && currentDocumentURL !== lastDocumentURL) {
        setSummary(''); // Clear the old summary
        generateSummary(currentDocumentURL);
        setLastDocumentURL(currentDocumentURL);
      }
    }
  }, [currentDocument, lastDocumentURL]);


  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        summary && (
          <Box
            sx={{
              width: '400px',
              padding: '16px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              marginTop: '16px',
            }}
          >
            <Typography variant='h6'>Summary</Typography>
            <Typography variant='body2'>{summary}</Typography>
          </Box>
        )
      )}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <Typography>{warning}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='primary'>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PdfSummarizer;
