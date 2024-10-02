import React, { useState } from "react";
import { getDocument, GlobalWorkerOptions, version as pdfjsVersion } from 'pdfjs-dist';
import axios from "axios";
import { Box, Typography } from "@mui/material";

// Set workerSrc for pdfjs
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.js`;

interface PdfSummarizerProps {
  pdfDocument: File;
}

const PdfSummarizer: React.FC<PdfSummarizerProps> = ({ pdfDocument }) => {
  const [pdfText, setPdfText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const extractTextFromPdf = async (file: File) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    
    reader.onloadend = async () => {
      const typedArray = new Uint8Array(reader.result as ArrayBuffer);
      const pdf = await getDocument(typedArray).promise;
      let fullText = "";

      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + " ";
      }

      setPdfText(fullText);
    };
  };

  const summarizeText = async (text: string) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        { inputs: text },
        {
          headers: {
            Authorization: `Bearer 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`,
          },
        }
      );
      setSummary(response.data[0].summary_text);
    } catch (error) {
      console.error("Error summarizing text", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await extractTextFromPdf(file);
    }
  };

  return (
    <div>
      {summary && (
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
          )}
    </div>
  );
};

export default PdfSummarizer;
