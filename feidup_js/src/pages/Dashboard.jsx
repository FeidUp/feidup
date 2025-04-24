import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Paper,
  Tab,
  Tabs
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PaymentIcon from '@mui/icons-material/Payment';
import StorefrontIcon from '@mui/icons-material/Storefront';

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Mock data for dashboard
  const mockUserData = {
    name: 'John Doe',
    points: 2450,
    pointsWorth: '$24.50',
    level: 'Gold Member',
    recentTransactions: [
      { id: 1, place: 'Green Café', date: '22 Apr 2025', amount: '$18.45', points: 185 },
      { id: 2, place: 'Pizza Palace', date: '18 Apr 2025', amount: '$24.99', points: 250 },
      { id: 3, place: 'Sunny Bakery', date: '15 Apr 2025', amount: '$12.50', points: 125 },
    ],
    nearbyRestaurants: [
      { id: 101, name: 'Green Café', type: 'Café', distance: '0.3 miles', pointsMultiplier: '1.5x' },
      { id: 102, name: 'Pizza Palace', type: 'Restaurant', distance: '0.7 miles', pointsMultiplier: '1x' },
      { id: 103, name: 'Sunny Bakery', type: 'Bakery', distance: '1.2 miles', pointsMultiplier: '1.2x' },
      { id: 104, name: 'Fresh Grocery', type: 'Grocery', distance: '0.5 miles', pointsMultiplier: '1x' },
    ],
    availableRewards: [
      { id: 201, title: '$5 off your next purchase', points: 500, expires: 'May 15, 2025' },
      { id: 202, title: 'Free coffee at Green Café', points: 300, expires: 'May 30, 2025' },
      { id: 203, title: '20% discount at Pizza Palace', points: 1000, expires: 'June 10, 2025' },
    ]
  };

  // Tab panels
  const renderOverviewPanel = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Reward Points
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CardGiftcardIcon sx={{ color: 'secondary.main', mr: 1, fontSize: 40 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                {mockUserData.points}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Worth approximately {mockUserData.pointsWorth}
            </Typography>
            <Button variant="contained" color="secondary" sx={{ mt: 2, color: 'white' }}>
              Redeem Points
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card sx={{ height: '100%', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <List>
              {mockUserData.recentTransactions.map((transaction) => (
                <Box key={transaction.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>
                        <RestaurantIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={transaction.place}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {transaction.date}
                          </Typography>
                          {` — ${transaction.amount}`}
                        </>
                      }
                    />
                    <Chip 
                      label={`+${transaction.points} pts`} 
                      color="secondary" 
                      size="small" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: 'white' 
                      }}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Box>
              ))}
            </List>
            <Button variant="text" color="primary" sx={{ mt: 1 }}>
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Available Rewards
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {mockUserData.availableRewards.map((reward) => (
                <Grid item xs={12} sm={6} md={4} key={reward.id}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      display: 'flex', 
                      flexDirection: 'column',
                      height: '100%'
                    }}
                  >
                    <Box sx={{ mb: 1 }}>
                      <Chip 
                        label={`${reward.points} pts`} 
                        color="secondary" 
                        size="small" 
                        sx={{ fontWeight: 'bold', color: 'white' }}
                      />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                      {reward.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expires: {reward.expires}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      size="small" 
                      sx={{ mt: 'auto', alignSelf: 'flex-start' }}
                    >
                      Redeem
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderNearbyPanel = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Nearby Participating Restaurants & Businesses
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Earn points at these locations near you. Higher point multipliers mean more rewards!
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {mockUserData.nearbyRestaurants.map((place) => (
            <Grid item xs={12} sm={6} md={4} key={place.id}>
              <Card sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: place.type === 'Café' ? 'primary.light' : 
                                place.type === 'Restaurant' ? 'secondary.main' : 
                                place.type === 'Bakery' ? '#F9A825' : '#66BB6A',
                        mr: 2
                      }}
                    >
                      {place.type === 'Café' ? <LocalCafeIcon /> : 
                       place.type === 'Restaurant' ? <RestaurantIcon /> : 
                       place.type === 'Bakery' ? <RestaurantIcon /> : <ShoppingBasketIcon />}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {place.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {place.type} • {place.distance}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={`${place.pointsMultiplier} points`} 
                      color="secondary" 
                      size="small" 
                      sx={{ fontWeight: 'bold', color: 'white' }}
                    />
                    <Button size="small" variant="text">View Details</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );

  const renderPaymentsPanel = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Universal Payments
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Make secure payments at all participating locations and automatically earn rewards.
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={7}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment Methods
            </Typography>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PaymentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Visa ending in 4242" 
                  secondary="Expires 04/2027" 
                />
                <Chip label="Default" size="small" color="primary" />
              </ListItem>
              <Divider variant="inset" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PaymentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Mastercard ending in 5678" 
                  secondary="Expires 11/2026" 
                />
              </ListItem>
            </List>
            <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={5}>
        <Card sx={{ borderRadius: 2, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Pay
            </Typography>
            <Typography variant="body2" paragraph>
              Show this QR code to pay instantly at any participating restaurant.
            </Typography>
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: 'grey.100', 
                borderRadius: 2, 
                height: 200, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Typography variant="h6">QR Code Placeholder</Typography>
            </Box>
            <Button 
              fullWidth 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
            >
              Generate New Code
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {mockUserData.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {mockUserData.level} • {mockUserData.points} points available
        </Typography>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="dashboard tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" id="tab-0" />
          <Tab label="Nearby Places" id="tab-1" />
          <Tab label="Payments" id="tab-2" />
        </Tabs>
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 0}>
        {tabValue === 0 && renderOverviewPanel()}
      </Box>
      <Box role="tabpanel" hidden={tabValue !== 1}>
        {tabValue === 1 && renderNearbyPanel()}
      </Box>
      <Box role="tabpanel" hidden={tabValue !== 2}>
        {tabValue === 2 && renderPaymentsPanel()}
      </Box>
    </Container>
  );
};

export default Dashboard;