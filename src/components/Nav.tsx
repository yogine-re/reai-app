import * as React from 'react';
import AppBar from '@mui/material/AppBar';
// import Badge from '@mui/material';
import { styled } from '@mui/system';
import { InputBase, Typography } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { Button } from '@mui/material';
import { Lock, Pets } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Login from './user/Login';
import Profile from './user/Profile';
import AccountSettings from './user/settings/AccountSettings';
import { getErrorMessage } from '../utils';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between'
});
const Search = styled('div')(({ theme }) => ({
  backgroundColor: 'white',
  padding: '0 10px',
  borderRadius: theme.shape.borderRadius,
  width: '40%'
}));
// const Icons = styled(Box)(({ theme }) => ({
//   display: 'none',
//   alignItems: 'center',
//   gap: '20px',
//   [theme.breakpoints.up('sm')]: {
//     display: 'flex'
//   }
// }));

const Nav: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { currentFirebaseUser, setModal, logout, setAlert } = useAuth();

  const openLogin = () => {
    setModal({ isOpen: true, title: 'Login', content: <Login /> });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: unknown) {
      setAlert({
        isAlert: true,
        severity: 'error',
        message: getErrorMessage(error),
        timeout: 8000,
        location: 'main',
      });
      console.log(error as Error);
    }
  };
  return (
    <AppBar position='sticky'>
      <StyledToolbar>
        <Typography variant='h6' sx={{ display: { xs: 'none', sm: 'block' } }}>
          REAI
        </Typography>
        <Pets sx={{ display: { xs: 'block', sm: 'none' } }} />
        <Search>
          <InputBase placeholder='search...' />
        </Search>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        {!currentFirebaseUser ? (
          <Button startIcon={<Lock />} onClick={openLogin}>
            Login
          </Button>
        ) : (
          <Tooltip title='Account settings'>
            <IconButton onClick={handleClick} size='small' sx={{ ml: 2 }}>
              <Avatar
                sx={{ width: 32, height: 32 }}
                src={currentFirebaseUser?.photoURL ?? ''}
              >
                {currentFirebaseUser?.displayName?.charAt(0)?.toUpperCase() ||
                  currentFirebaseUser?.email?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
        )}
      </Box>
      </StyledToolbar>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() =>
            setModal({
              isOpen: true,
              title: 'Update Profile',
              content: <Profile />,
            })
          }
        >
          <Avatar src={currentFirebaseUser?.photoURL ?? ''} /> Profile
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() =>
            setModal({
              isOpen: true,
              title: 'Account Settings',
              content: <AccountSettings />,
            })
          }
        >
          <ListItemIcon>
            <Settings fontSize='small' />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
export default Nav;
