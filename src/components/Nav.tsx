import * as React from 'react';
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
import { Lock } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Login from './user/Login';
import Profile from './user/Profile';
import AccountSettings from './user/settings/AccountSettings';
import { getErrorMessage } from '../utils';

const Nav: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { currentUser, setModal, logout, setAlert } = useAuth();

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
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        {!currentUser ? (
          <Button startIcon={<Lock />} onClick={openLogin}>
            Login
          </Button>
        ) : (
          <Tooltip title="Account settings">
            <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
              <Avatar
                sx={{ width: 32, height: 32 }}
                src={currentUser?.photoURL ?? ''}
              >
                {currentUser?.displayName?.charAt(0)?.toUpperCase() ||
                  currentUser?.email?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
        )}
      </Box>
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
          <Avatar src={currentUser?.photoURL ?? ''} /> Profile
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
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
export default Nav;
