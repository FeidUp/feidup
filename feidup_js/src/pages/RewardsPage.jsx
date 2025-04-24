import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Chip,
  Paper,
  LinearProgress,
  Tab,
  Tabs
} from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HistoryIcon from '@mui/icons-material/History';
import StorefrontIcon from '@mui/icons-material/Storefront';

const RewardsPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Mock data for rewards
  const mockRewardsData = {
    totalPoints: 2450,
    pointsWorth: '$24.50',
    lastMonthEarned: 750,
    availableRewards: [
      { id: 201, title: '$5 off your next purchase', points: 500, expires: 'May 15, 2025', vendor: 'FeidUp', category: 'Discount' },
      { id: 202, title: 'Free coffee at Green Café', points: 300, expires: 'May 30, 2025', vendor: 'Green Café', category: 'Food & Drink' },
      { id: 203, title: '20% discount at Pizza Palace', points: 1000, expires: 'June 10, 2025', vendor: 'Pizza Palace', category: 'Discount' },
      { id: 204, title: 'Free dessert with any meal', points: 750, expires: 'June 30, 2025', vendor: 'Sunny Restaurant', category: 'Food & Drink' },
      { id: 205, title: '$10 gift card', points: 1000, expires: 'July 15, 2025', vendor: 'FeidUp', category: 'Gift Card' },
      { id: 206, title: 'Free reusable shopping bag', points: 200, expires: 'May 25, 2025', vendor: 'Fresh Grocery', category: 'Merchandise' }
    ],
    redeemedRewards: [
      { id: 301, title: 'Free coffee at Green Café', points: 300, redeemedDate: 'April 10, 2025', vendor: 'Green Café', status: 'Used' },
      { id: 302, title: '$5 off your purchase', points: 500, redeemedDate: 'March 25, 2025', vendor: 'Pizza Palace', status: 'Used' },
      { id: 303, title: 'Buy one get one free pastry', points: 400, redeemedDate: 'March 15, 2025', vendor: 'Sunny Bakery', status: 'Expired' }
    ],
    pointsHistory: [
      { id: 1, transaction: 'Purchase at Green Café', date: 'April 22, 2025', points: 185, type: 'Earned' },
      { id: 2, transaction: 'Purchase at Pizza Palace', date: 'April 18, 2025', points: 250, type: 'Earned' },
      { id: 3, transaction: 'Redeemed for Free Coffee', date: 'April 10, 2025', points: 300, type: 'Spent' },
      { id: 4, transaction: 'Purchase at Sunny Bakery', date: 'April 5, 2025', points: 125, type: 'Earned' },
      { id: 5, transaction: 'Bonus points for 10th visit', date: 'April 1, 2025', points: 500, type: 'Earned' }
    ]
  };

  // Tab panels
  const renderAvailableRewardsPanel = () => (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Your Points Balance
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CardGiftcardIcon sx={{ color: 'secondary.main', mr: 2, fontSize: 48 }} />
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  {mockRewardsData.totalPoints}
                </Typography>
              </Box>
              <Typography variant="body1">
                Worth approximately {mockRewardsData.pointsWorth}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Last month you earned {mockRewardsData.lastMonthEarned} points
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(mockRewardsData.lastMonthEarned / 1000) * 100} 
                  color="secondary"
                  sx={{ mt: 1, height: 8, borderRadius: 5 }}
                />
              </Box>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button size="small" color="primary">
                View Points History
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                How to Earn More Points
              </Typography>
              <Typography variant="body2" paragraph>
                Earn points with every purchase at participating restaurants and businesses. Here's how:
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    Earn <b>1 point</b> for every $0.10 spent at participating locations
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    Get <b>bonus points</b> for referring friends and family
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    Receive <b>loyalty bonuses</b> after multiple visits
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    Earn <b>sustainability points</b> by using your own containers
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button size="small" color="primary">
                Find Participating Locations
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>
        Available Rewards
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Redeem your points for these rewards from our partners
      </Typography>

      <Grid container spacing={3}>
        {mockRewardsData.availableRewards.map((reward) => (
          <Grid item xs={12} sm={6} md={4} key={reward.id}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                borderRadius: 2, 
                display: 'flex', 
                flexDirection: 'column',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bgcolor: 
                    reward.category === 'Food & Drink' ? 'primary.light' : 
                    reward.category === 'Discount' ? 'secondary.main' : 
                    reward.category === 'Gift Card' ? '#FF9800' : '#4CAF50',
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderBottomLeftRadius: 8
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                  {reward.category}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 3, mb: 2 }}>
                <Chip 
                  label={`${reward.points} pts`} 
                  color="secondary" 
                  size="small" 
                  sx={{ fontWeight: 'bold', color: 'white' }}
                />
              </Box>
              
              <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 1 }}>
                {reward.title}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                From: {reward.vendor}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Expires: {reward.expires}
              </Typography>
              
              <Box sx={{ mt: 'auto', pt: 2 }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  fullWidth
                  sx={{ 
                    color: 'white',
                    '&.Mui-disabled': {
                      bgcolor: 'action.disabledBackground',
                      color: 'text.disabled'
                    }
                  }}
                  disabled={mockRewardsData.totalPoints < reward.points}
                >
                  {mockRewardsData.totalPoints >= reward.points ? 'Redeem' : 'Not enough points'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderRedeemedRewardsPanel = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Your Redeemed Rewards
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        View and manage rewards you've already redeemed
      </Typography>

      <Grid container spacing={3}>
        {mockRewardsData.redeemedRewards.map((reward) => (
          <Grid item xs={12} sm={6} md={4} key={reward.id}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                borderRadius: 2, 
                display: 'flex', 
                flexDirection: 'column',
                height: '100%',
                opacity: reward.status === 'Expired' ? 0.7 : 1,
                position: 'relative'
              }}
            >
              <Chip 
                label={reward.status} 
                color={reward.status === 'Used' ? 'success' : 'error'} 
                size="small" 
                sx={{ 
                  position: 'absolute', 
                  top: 12, 
                  right: 12,
                }}
              />
              
              <Box sx={{ mt: 3, mb: 2, display: 'flex', alignItems: 'center' }}>
                <LocalOfferIcon sx={{ color: 'secondary.main', mr: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {reward.points} points
                </Typography>
              </Box>
              
              <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 1 }}>
                {reward.title}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                From: {reward.vendor}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Redeemed on: {reward.redeemedDate}
              </Typography>
              
              {reward.status !== 'Expired' && (
                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    fullWidth
                  >
                    View Details
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderPointsHistoryPanel = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Points History
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Track your points from purchases and redemptions
      </Typography>

      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6">
                Current Balance: {mockRewardsData.totalPoints} points
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Worth approximately {mockRewardsData.pointsWorth}
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="secondary" 
              sx={{ color: 'white' }}
            >
              Redeem Points
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {mockRewardsData.pointsHistory.map((item) => (
            <Box key={item.id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {item.type === 'Earned' ? (
                    <StorefrontIcon sx={{ color: 'success.main', mr: 2 }} />
                  ) : (
                    <CardGiftcardIcon sx={{ color: 'secondary.main', mr: 2 }} />
                  )}
                  <Box>
                    <Typography variant="subtitle1">{item.transaction}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.date}</Typography>
                  </Box>
                </Box>
                <Chip 
                  label={item.type === 'Earned' ? `+${item.points}` : `-${item.points}`} 
                  color={item.type === 'Earned' ? 'success' : 'secondary'} 
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Rewards Program
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Earn and redeem points for rewards at participating restaurants and businesses
        </Typography>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="rewards tabs"
          variant="fullWidth"
        >
          <Tab icon={<CardGiftcardIcon />} label="Available Rewards" id="tab-0" />
          <Tab icon={<LocalOfferIcon />} label="Redeemed Rewards" id="tab-1" />
          <Tab icon={<HistoryIcon />} label="Points History" id="tab-2" />
        </Tabs>
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 0}>
        {tabValue === 0 && renderAvailableRewardsPanel()}
      </Box>
      <Box role="tabpanel" hidden={tabValue !== 1}>
        {tabValue === 1 && renderRedeemedRewardsPanel()}
      </Box>
      <Box role="tabpanel" hidden={tabValue !== 2}>
        {tabValue === 2 && renderPointsHistoryPanel()}
      </Box>
    </Container>
  );
};

export default RewardsPage;