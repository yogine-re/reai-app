import React, { useState, useEffect } from 'react';
import { getDocument, GlobalWorkerOptions, version as pdfjsVersion } from 'pdfjs-dist';
import axios from 'axios';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAppData } from '../../context/AppContext';

// Set workerSrc for pdfjs
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.js`;

const PdfSummarizer = () => {
const { currentDocument } = useAppData();
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [lastDocumentURL, setLastDocumentURL] = useState<string | null>(null);
  
  const extractTextFromPDF = async (documentURL: string) => {
    console.log('Extracting text from PDF:', documentURL);
    try {
      // Fetch the PDF document from the URL
      const response = await axios.get(documentURL, { responseType: 'arraybuffer' });
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

  const summarizeText = async (text: string) => {
    try {
      setLoading(true);
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        { inputs: text },
        {
          headers: {
            Authorization: `Bearer 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`,
          },
        }
      );
      setSummary(response.data[0].summary_text);
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
    </div>
  );
};

export default PdfSummarizer;
