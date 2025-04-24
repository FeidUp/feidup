import { useState } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StoreIcon from '@mui/icons-material/Store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const MainLayout = ({ isLoggedIn, userType, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenAccountMenu = (event) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleCloseAccountMenu = () => {
    setAccountMenuAnchor(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    handleCloseAccountMenu();
    if (onLogout) onLogout();
  };

  // Navigation links
  const navLinks = [
    { text: 'Home', path: '/', icon: <HomeIcon />, showWhen: 'always' },
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, showWhen: 'customer' },
    { text: 'Business Dashboard', path: '/business', icon: <StoreIcon />, showWhen: 'business' },
    { text: 'Rewards', path: '/rewards', icon: <CardGiftcardIcon />, showWhen: 'customer' },
    { text: 'Payments', path: '/payments', icon: <PaymentIcon />, showWhen: 'customer' },
    { text: 'Sustainable Packaging', path: '/packaging', icon: <LocalShippingIcon />, showWhen: 'always' },
  ];

  // Filter navigation links based on user type
  const filteredNavLinks = navLinks.filter(link => 
    link.showWhen === 'always' || 
    (isLoggedIn && link.showWhen === userType)
  );

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          FeidUp
        </Typography>
        {isLoggedIn && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ mb: 1, bgcolor: userType === 'business' ? 'secondary.main' : 'primary.main' }}>
              {userType === 'business' ? 'B' : 'U'}
            </Avatar>
            <Typography variant="body2">
              {userType === 'business' ? 'Business Account' : 'Customer Account'}
            </Typography>
          </Box>
        )}
      </Box>
      <Divider />
      <List>
        {filteredNavLinks.map((link) => (
          <ListItem key={link.text} disablePadding>
            <ListItemButton 
              component={RouterLink} 
              to={link.path}
              selected={location.pathname === link.path}
            >
              <ListItemIcon>
                {link.icon}
              </ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {isLoggedIn ? (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/login">
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/register">
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            FeidUp
          </Typography>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
            {filteredNavLinks.map((link) => (
              <Button
                key={link.text}
                component={RouterLink}
                to={link.path}
                sx={{ 
                  color: 'white', 
                  mx: 1,
                  fontWeight: location.pathname === link.path ? 'bold' : 'normal',
                  borderBottom: location.pathname === link.path ? '2px solid white' : 'none',
                  borderRadius: 0,
                  pb: 0.5
                }}
              >
                {link.text}
              </Button>
            ))}
          </Box>

          {isLoggedIn ? (
            <Box>
              <Button
                onClick={handleOpenAccountMenu}
                color="inherit"
                endIcon={<KeyboardArrowDownIcon />}
                startIcon={
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      bgcolor: userType === 'business' ? 'secondary.main' : 'primary.main'
                    }}
                  >
                    {userType === 'business' ? 'B' : 'U'}
                  </Avatar>
                }
              >
                {!isMobile && (userType === 'business' ? 'Business' : 'Account')}
              </Button>
              <Menu
                anchorEl={accountMenuAnchor}
                open={Boolean(accountMenuAnchor)}
                onClose={handleCloseAccountMenu}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem 
                  component={RouterLink} 
                  to={userType === 'business' ? '/business' : '/dashboard'}
                  onClick={handleCloseAccountMenu}
                >
                  <ListItemIcon>
                    {userType === 'business' ? <StoreIcon /> : <DashboardIcon />}
                  </ListItemIcon>
                  <ListItemText>
                    {userType === 'business' ? 'Business Dashboard' : 'Dashboard'}
                  </ListItemText>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                sx={{ mr: 1 }}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                component={RouterLink} 
                to="/register"
                sx={{ color: 'white' }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[100],
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'center', md: 'flex-start' },
            }}
          >
            <Box sx={{ mb: { xs: 3, md: 0 }, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" gutterBottom>
                FeidUp
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Universal Payment & Rewards for Family-Owned Restaurants
              </Typography>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} FeidUp Inc. All rights reserved.
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'center',
                gap: { xs: 2, sm: 4 },
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Company
                </Typography>
                <Link component={RouterLink} to="/about" color="inherit" display="block" sx={{ mb: 1 }}>
                  About Us
                </Link>
                <Link component={RouterLink} to="/contact" color="inherit" display="block" sx={{ mb: 1 }}>
                  Contact
                </Link>
                <Link component={RouterLink} to="/careers" color="inherit" display="block">
                  Careers
                </Link>
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Resources
                </Typography>
                <Link component={RouterLink} to="/faq" color="inherit" display="block" sx={{ mb: 1 }}>
                  FAQ
                </Link>
                <Link component={RouterLink} to="/support" color="inherit" display="block" sx={{ mb: 1 }}>
                  Support
                </Link>
                <Link component={RouterLink} to="/blog" color="inherit" display="block">
                  Blog
                </Link>
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Legal
                </Typography>
                <Link component={RouterLink} to="/terms" color="inherit" display="block" sx={{ mb: 1 }}>
                  Terms of Service
                </Link>
                <Link component={RouterLink} to="/privacy" color="inherit" display="block">
                  Privacy Policy
                </Link>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;