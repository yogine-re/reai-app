import React from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import ImageIcon from '@mui/icons-material/Image';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export const TypeIcon = (props: any) => {
  if (props.droppable) {
    return <FolderIcon />;
  }

  switch (props.fileType) {
    case 'image':
      return <ImageIcon />;
    case 'csv':
      return <ListAltIcon />;
    case 'text':
      return <DescriptionIcon />;
    case 'application/pdf':
      return <PictureAsPdfIcon />;
    default:
      return null;
  }
};
