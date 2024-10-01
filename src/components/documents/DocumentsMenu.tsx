import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DocumentProperties } from './types';
import { useAppData } from '../../context/AppContext';

// const options = [
//     'None',
//     'Atria',
//     'Callisto',
//     'Dione',
//     'Ganymede',
//     'Hangouts Call',
//     'Luna',
//     'Oberon',
//     'Phobos',
//     'Pyxis',
//     'Sedna',
//     'Titania',
//     'Triton',
//     'Umbriel',
//   ];
  
const ITEM_HEIGHT = 48;
  
interface DocumentMenuProps {
  documents: DocumentProperties[];
}

const DocumentMenu: React.FC<DocumentMenuProps> = ({ documents }) => {
  console.log('DocumentMenu: documents: ', documents);
  const documentsList = documents.map((doc) => doc.documentName);
  console.log('DocumentMenu: documentsList: ', documentsList);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { setCurrentDocument } = useAppData();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelected = (documentName: string) => {
    const selectedDocument = documents.find((doc) => doc.documentName === documentName);
    if (selectedDocument) {
        console.log('selectedDocument: ', selectedDocument);
        setCurrentDocument(selectedDocument);
    }
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '100ch',
            },
          },
        }}
      >
        {documents.map((document) => (
          <MenuItem 
            key={document.documentName} 
            onClick={() => { handleSelected(document.documentName); handleClose(); }}
            sx={{
                color: 'primary.main', // Change this to your desired color
                '&:hover': {
                  backgroundColor: 'primary.light', // Change this to your desired hover color
                },
              }}
            >
            {document.documentName}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
export default DocumentMenu;
