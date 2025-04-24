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
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RecyclingIcon from '@mui/icons-material/Recycling';
import NatureIcon from '@mui/icons-material/Nature';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ForestIcon from '@mui/icons-material/Forest';

const PackagingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // Mock packaging options data
  const packagingOptions = [
    {
      title: 'Eco-Friendly Food Containers',
      description: 'Compostable containers made from plant fibers, perfect for hot and cold foods.',
      sizes: ['Small (8oz)', 'Medium (16oz)', 'Large (24oz)'],
      materials: 'Bagasse (sugarcane fiber)',
      adPlacement: 'Lid and sides',
      image: '/path/to/containers.jpg' // Placeholder path
    },
    {
      title: 'Sustainable Coffee Cups',
      description: 'Double-walled paper cups with plant-based lining instead of plastic.',
      sizes: ['Small (8oz)', 'Medium (12oz)', 'Large (16oz)'],
      materials: 'Recycled paper with PLA lining',
      adPlacement: 'Cup sleeve and sides',
      image: '/path/to/cups.jpg' // Placeholder path
    },
    {
      title: 'Paper Bags & Packaging',
      description: 'Sturdy paper bags and wraps made from recycled materials.',
      sizes: ['Small', 'Medium', 'Large'],
      materials: 'Recycled kraft paper',
      adPlacement: 'Exterior sides',
      image: '/path/to/bags.jpg' // Placeholder path
    },
    {
      title: 'Eco-Friendly Utensils',
      description: 'Biodegradable utensils that decompose naturally after use.',
      sizes: ['Standard size'],
      materials: 'PLA (plant-based plastic) or bamboo',
      adPlacement: 'Utensil wrapper',
      image: '/path/to/utensils.jpg' // Placeholder path
    }
  ];

  // Steps for the process stepper
  const steps = [
    {
      label: 'Register Your Business',
      description: 'Sign up as a restaurant or food business on the FeidUp platform.',
      icon: <BusinessIcon color="primary" />
    },
    {
      label: 'Select Packaging Options',
      description: 'Choose from our range of sustainable packaging options that best fit your business needs.',
      icon: <ShoppingBagIcon color="primary" />
    },
    {
      label: 'Get Matched with Advertisers',
      description: 'Our system pairs your business with local advertisers based on your location and customer demographics.',
      icon: <BusinessIcon color="secondary" />
    },
    {
      label: 'Receive Free Packaging',
      description: 'Once approved, receive your free sustainable packaging with tasteful advertisements from local businesses.',
      icon: <LocalShippingIcon color="primary" />
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: 'How much does the sustainable packaging cost?',
      answer: 'The packaging is provided free of charge to qualifying restaurants through our advertisement program. Local businesses pay for ad space on the packaging, which covers the cost of manufacturing and distribution.'
    },
    {
      question: 'What types of advertisements will appear on the packaging?',
      answer: 'We carefully curate advertisements from local businesses that align with your restaurant\'s values and customer base. All advertisements are tasteful and appropriate for food packaging.'
    },
    {
      question: 'How eco-friendly is the packaging really?',
      answer: 'All our packaging options are made from sustainable materials like bagasse (sugarcane fiber), recycled paper, bamboo, or PLA (plant-based plastic). They are either compostable, biodegradable, or easily recyclable, significantly reducing environmental impact compared to traditional packaging.'
    },
    {
      question: 'How much packaging can I order?',
      answer: 'The amount of free packaging available depends on your business size, customer volume, and the specific arrangements with advertisers. Typically, restaurants can order enough for their regular operations, with the option to purchase additional items at discounted rates.'
    },
    {
      question: 'Can I customize the packaging with my restaurant logo?',
      answer: 'Yes! While the packaging includes advertisements, we ensure there\'s space for your restaurant\'s branding. We can include your logo and basic information on all packaging items.'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
          Sustainable Packaging Program
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
          Reducing environmental impact while supporting local businesses through advertisement-funded packaging solutions.
        </Typography>
      </Box>

      {/* Hero Banner */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, sm: 4 }, 
          mb: { xs: 4, md: 6 },
          borderRadius: 2,
          bgcolor: 'primary.light',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' } }}>
            Free Sustainable Packaging for Your Restaurant
          </Typography>
          <Typography variant="body1" paragraph sx={{ maxWidth: { xs: '100%', md: '60%' }, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            FeidUp offers eco-friendly, high-quality packaging at no cost to family-owned restaurants through our innovative advertising program.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size={isSmallScreen ? "medium" : "large"}
            sx={{ color: 'white', mt: 2 }}
          >
            Apply Now
          </Button>
        </Box>
        <Box 
          sx={{ 
            position: 'absolute',
            top: '50%',
            right: '5%',
            transform: 'translateY(-50%)',
            display: { xs: 'none', md: 'block' }
          }}
        >
          <NatureIcon sx={{ fontSize: { md: 120, lg: 180 }, opacity: 0.2 }} />
        </Box>
      </Paper>

      {/* Benefits Section */}
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' } }}>
        Why Choose Our Sustainable Packaging?
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RecyclingIcon sx={{ color: 'primary.main', mr: 1, fontSize: 40 }} />
                <Typography variant="h5">Eco-Friendly</Typography>
              </Box>
              <Typography variant="body1">
                All our packaging options are made from sustainable materials like plant fibers, recycled paper, or biodegradable alternatives to plastic.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShippingIcon sx={{ color: 'primary.main', mr: 1, fontSize: 40 }} />
                <Typography variant="h5">Zero Cost</Typography>
              </Box>
              <Typography variant="body1">
                Through our advertising program, local businesses fund the cost of your packaging, making it completely free for qualifying restaurants.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ForestIcon sx={{ color: 'primary.main', mr: 1, fontSize: 40 }} />
                <Typography variant="h5">Community Impact</Typography>
              </Box>
              <Typography variant="body1">
                By using our sustainable packaging, you're supporting local businesses while showing customers your commitment to environmental responsibility.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Packaging Options */}
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' } }}>
        Available Packaging Options
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
        Choose from our selection of high-quality, sustainable packaging solutions:
      </Typography>
      
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 4, md: 6 } }}>
        {packagingOptions.map((option, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <Box 
                sx={{ 
                  height: { xs: 100, sm: 120, md: 140 }, 
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <NatureIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 }, color: 'white' }} />
              </Box>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' } }}>
                  {option.title}
                </Typography>
                <Typography variant="body2" paragraph sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' } }}>
                  {option.description}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' } }}>
                      Available Sizes:
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' } }}>
                      {option.sizes.join(', ')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' } }}>
                      Material:
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' } }}>
                      {option.materials}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' } }}>
                      Ad Placement:
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' } }}>
                      {option.adPlacement}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* How It Works - Stepper */}
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' } }}>
        How It Works
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
        Follow these simple steps to get started with our sustainable packaging program:
      </Typography>
      
      <Box sx={{ maxWidth: 800, mx: 'auto', mb: { xs: 4, md: 6 } }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel 
                StepIconComponent={() => step.icon}
              >
                <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' } }}>
                  {step.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    size={isSmallScreen ? "small" : "medium"}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                    size={isSmallScreen ? "small" : "medium"}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
              All steps completed!
            </Typography>
            <Typography paragraph sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' } }}>
              You're now ready to apply for our sustainable packaging program. Click below to start the application process.
            </Typography>
            <Button 
              onClick={handleReset} 
              sx={{ mt: 1, mr: 1 }}
              size={isSmallScreen ? "small" : "medium"}
            >
              Review Steps Again
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 1, mr: 1 }}
              size={isSmallScreen ? "small" : "medium"}
            >
              Apply Now
            </Button>
          </Paper>
        )}
      </Box>

      {/* FAQs */}
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' } }}>
        Frequently Asked Questions
      </Typography>
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        {faqs.map((faq, index) => (
          <Accordion key={index} sx={{ mb: 1, borderRadius: 2, overflow: 'hidden' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' } }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' } }}>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* CTA Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, sm: 4 }, 
          mb: { xs: 4, md: 6 }, 
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' } }}>
          Ready to Get Started?
        </Typography>
        <Typography variant="body1" paragraph sx={{ 
          maxWidth: 700, 
          mx: 'auto',
          fontSize: { xs: '0.9rem', sm: '1rem' }
        }}>
          Join FeidUp's sustainable packaging program today and take a step towards environmental responsibility while reducing your costs.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: { xs: 2, sm: 1 } }}>
          <Button 
            variant="contained" 
            color="primary" 
            size={isSmallScreen ? "medium" : "large"}
            sx={{ mr: { sm: 2 } }}
            fullWidth={isSmallScreen}
          >
            Apply for Free Packaging
          </Button>
          <Button 
            variant="outlined" 
            color="secondary"
            size={isSmallScreen ? "medium" : "large"}
            fullWidth={isSmallScreen}
          >
            Contact Us
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PackagingPage;