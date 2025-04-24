import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Link,
  Paper,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Alert,
  Checkbox
} from '@mui/material';

const Register = ({ onRegister }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [accountType, setAccountType] = useState('customer');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    businessName: '',
    businessType: '',
    businessAddress: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'agreeToTerms' ? checked : value
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle radio button change for account type
  const handleAccountTypeChange = (e) => {
    setAccountType(e.target.value);
  };

  // Validate form data for current step
  const validateStep = () => {
    const newErrors = {};
    
    if (activeStep === 0) {
      if (!accountType) {
        newErrors.accountType = 'Please select an account type';
      }
    } else if (activeStep === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (accountType === 'business') {
        if (!formData.businessName.trim()) {
          newErrors.businessName = 'Business name is required';
        }
        
        if (!formData.businessType.trim()) {
          newErrors.businessType = 'Business type is required';
        }
      }
    } else if (activeStep === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next button click
  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === 2) {
        handleSubmit();
      } else {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  };

  // Handle back button click
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Handle form submission
  const handleSubmit = () => {
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Call the onRegister function with the account type
      onRegister(accountType);
      setLoading(false);
    }, 1500);
  };

  // Define steps for the registration process
  const steps = [
    'Account Type',
    'Personal Information',
    'Create Password'
  ];

  return (
    <Container component="main" maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: 3,
            textAlign: 'center' 
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Create Your FeidUp Account
          </Typography>
          <Typography variant="body1">
            Join our platform to discover local restaurants, earn rewards, and more
          </Typography>
        </Box>
        
        <Box sx={{ p: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select Account Type
              </Typography>
              <FormControl component="fieldset" sx={{ width: '100%' }} error={!!errors.accountType}>
                <RadioGroup 
                  aria-label="account-type" 
                  name="accountType"
                  value={accountType}
                  onChange={handleAccountTypeChange}
                >
                  <Paper 
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      border: accountType === 'customer' ? '2px solid' : '1px solid',
                      borderColor: accountType === 'customer' ? 'primary.main' : 'divider',
                      borderRadius: 2
                    }}
                  >
                    <FormControlLabel 
                      value="customer" 
                      control={<Radio />} 
                      label={
                        <Box>
                          <Typography variant="subtitle1" fontWeight={500}>Customer Account</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Pay at participating restaurants, earn and redeem rewards, and discover new dining options
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>
                  
                  <Paper 
                    sx={{ 
                      p: 2, 
                      border: accountType === 'business' ? '2px solid' : '1px solid',
                      borderColor: accountType === 'business' ? 'primary.main' : 'divider',
                      borderRadius: 2
                    }}
                  >
                    <FormControlLabel 
                      value="business" 
                      control={<Radio />} 
                      label={
                        <Box>
                          <Typography variant="subtitle1" fontWeight={500}>Business Account</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Register your restaurant, manage payments, and participate in the rewards program
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </RadioGroup>
                {errors.accountType && (
                  <Typography color="error" variant="caption">
                    {errors.accountType}
                  </Typography>
                )}
              </FormControl>
            </Box>
          )}
          
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {accountType === 'customer' ? 'Personal Information' : 'Business Information'}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    fullWidth
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="email"
                    label="Email Address"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="phoneNumber"
                    label="Phone Number"
                    fullWidth
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                  />
                </Grid>
                
                {accountType === 'business' && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" gutterBottom>
                        Business Details
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="businessName"
                        label="Business Name"
                        fullWidth
                        value={formData.businessName}
                        onChange={handleChange}
                        error={!!errors.businessName}
                        helperText={errors.businessName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="businessType"
                        label="Business Type"
                        fullWidth
                        placeholder="e.g., Restaurant, Café, Bakery"
                        value={formData.businessType}
                        onChange={handleChange}
                        error={!!errors.businessType}
                        helperText={errors.businessType}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="businessAddress"
                        label="Business Address"
                        fullWidth
                        value={formData.businessAddress}
                        onChange={handleChange}
                        error={!!errors.businessAddress}
                        helperText={errors.businessAddress}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          )}
          
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Create Password
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password || "Password must be at least 8 characters"}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the{' '}
                        <Link component={RouterLink} to="/terms">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link component={RouterLink} to="/privacy">
                          Privacy Policy
                        </Link>
                      </Typography>
                    }
                  />
                  {errors.agreeToTerms && (
                    <Typography color="error" variant="caption" display="block">
                      {errors.agreeToTerms}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={loading}
            >
              {activeStep === steps.length - 1 ? (loading ? 'Creating Account...' : 'Create Account') : 'Continue'}
            </Button>
          </Box>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login">
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;