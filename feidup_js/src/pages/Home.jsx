import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Paper,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PaymentsIcon from '@mui/icons-material/Payments';
import RedeemIcon from '@mui/icons-material/Redeem';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VerifiedIcon from '@mui/icons-material/Verified';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import StoreIcon from '@mui/icons-material/Store';
import SecurityIcon from '@mui/icons-material/Security';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <PaymentsIcon fontSize="large" color="primary" />,
      title: 'Universal Payment',
      description: 'Pay at any participating restaurant with a single app, no need for multiple loyalty cards'
    },
    {
      icon: <RedeemIcon fontSize="large" color="primary" />,
      title: 'Cross-Platform Rewards',
      description: 'Earn points at one restaurant, redeem them at another - all within the FeidUp ecosystem'
    },
    {
      icon: <LocalOfferIcon fontSize="large" color="primary" />,
      title: 'Personalized Offers',
      description: 'Receive tailored promotions based on your dining preferences and habits'
    },
    {
      icon: <RestaurantIcon fontSize="large" color="primary" />,
      title: 'Restaurant Discovery',
      description: 'Find new dining spots based on your taste preferences and reward availability'
    }
  ];

  const businessBenefits = [
    {
      icon: <StoreIcon />,
      text: 'Attract new customers by participating in a universal rewards program'
    },
    {
      icon: <VerifiedIcon />,
      text: 'Increase customer loyalty with a modern digital reward solution'
    },
    {
      icon: <PriceCheckIcon />,
      text: 'Simplify payment processing with our integrated system'
    },
    {
      icon: <SecurityIcon />,
      text: 'Secure transactions with advanced encryption and fraud protection'
    }
  ];

  const testimonials = [
    {
      name: 'Emma Johnson',
      role: 'Food Enthusiast',
      content: 'FeidUp has completely changed how I dine out. I love earning points at my favorite cafe and using them at the Italian restaurant next door!',
      avatar: 'E'
    },
    {
      name: 'Michael Chen',
      role: 'Restaurant Owner',
      content: 'Since joining FeidUp, we\'ve seen a 30% increase in repeat customers. The platform makes it easy to offer rewards without the hassle of managing our own program.',
      avatar: 'M'
    },
    {
      name: 'Sarah Williams',
      role: 'Regular User',
      content: 'I used to have a wallet full of different loyalty cards. Now I just use FeidUp wherever I go. It\'s so convenient!',
      avatar: 'S'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 16 },
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                fontWeight="bold"
                gutterBottom
                sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
              >
                One App, All Your 
                <Box component="span" sx={{ color: theme.palette.secondary.light }}> Rewards</Box>
              </Typography>
              <Typography 
                variant="h5" 
                component="p" 
                sx={{ mb: 4, maxWidth: '90%', opacity: 0.9 }}
              >
                FeidUp unifies restaurant rewards and payments in one seamless app. Earn points anywhere, use them everywhere.
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
              >
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    py: 1.5, 
                    px: 4,
                    fontSize: '1.1rem'
                  }}
                >
                  Sign Up Free
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    py: 1.5, 
                    px: 4,
                    fontSize: '1.1rem',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Log In
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                component="img"
                src="/src/assets/hero-mockup.png" 
                alt="FeidUp App Mockup"
                sx={{ 
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                  filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.2))'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container>
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            mt: -8,
            mb: 8,
            position: 'relative',
            zIndex: 1
          }}
        >
          {['Restaurants', 'Happy Users', 'Points Awarded', 'Rewards Redeemed'].map((item, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card 
                elevation={4}
                sx={{ 
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {index === 0 ? '50+' : index === 1 ? '10K+' : index === 2 ? '1M+' : '300K+'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {item}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            How FeidUp Works
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 700, mx: 'auto', color: 'text.secondary' }}>
            Our platform simplifies restaurant rewards with universal points and seamless payments
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* For Businesses Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
                For Restaurant Owners
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
                Boost your business by joining the FeidUp platform and tap into our growing user base
              </Typography>
              
              <List>
                {businessBenefits.map((benefit, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon sx={{ color: 'primary.main' }}>
                      {benefit.icon}
                    </ListItemIcon>
                    <ListItemText primary={benefit.text} />
                  </ListItem>
                ))}
              </List>
              
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                onClick={() => navigate('/register')} 
                sx={{ mt: 2 }}
              >
                Register Your Business
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/src/assets/business-dashboard.png"
                alt="Business Dashboard"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom textAlign="center">
          What Our Users Say
        </Typography>
        <Typography variant="h6" sx={{ mb: 6, maxWidth: 700, mx: 'auto', textAlign: 'center', color: 'text.secondary' }}>
          Join thousands of satisfied users and businesses on the FeidUp platform
        </Typography>
        
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 3
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" paragraph sx={{ mb: 3, fontStyle: 'italic' }}>
                    "{testimonial.content}"
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: index === 0 ? 'primary.main' : index === 1 ? 'secondary.main' : 'success.main',
                        mr: 2
                      }}
                    >
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            Ready to Simplify Your Rewards?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join FeidUp today and experience a new way to earn and use restaurant rewards
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2}
            justifyContent="center"
          >
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              onClick={() => navigate('/register')}
              sx={{ 
                py: 1.5, 
                px: 4,
                fontSize: '1.1rem'
              }}
            >
              Sign Up Now
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large"
              onClick={() => navigate('/login')}
              sx={{ 
                py: 1.5, 
                px: 4,
                fontSize: '1.1rem',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Log In
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;