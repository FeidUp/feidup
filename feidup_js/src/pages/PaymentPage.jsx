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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Paper,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCodeIcon from '@mui/icons-material/QrCode';
import HistoryIcon from '@mui/icons-material/History';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const PaymentPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openAddPaymentDialog, setOpenAddPaymentDialog] = useState(false);
  const [openQRCodeDialog, setOpenQRCodeDialog] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenAddPaymentDialog = () => {
    setOpenAddPaymentDialog(true);
  };

  const handleCloseAddPaymentDialog = () => {
    setOpenAddPaymentDialog(false);
  };

  const handleOpenQRCodeDialog = () => {
    setOpenQRCodeDialog(true);
  };

  const handleCloseQRCodeDialog = () => {
    setOpenQRCodeDialog(false);
  };

  // Mock data for payment methods and transactions
  const mockPaymentData = {
    paymentMethods: [
      { id: 1, name: 'Visa ending in 4242', type: 'credit', expiryDate: '04/2027', isDefault: true },
      { id: 2, name: 'Mastercard ending in 5678', type: 'credit', expiryDate: '11/2026', isDefault: false },
      { id: 3, name: 'Bank account ending in 9012', type: 'bank', expiryDate: null, isDefault: false }
    ],
    recentTransactions: [
      { id: 101, place: 'Green Café', date: '22 Apr 2025', amount: '$18.45', status: 'Completed', points: 185 },
      { id: 102, place: 'Pizza Palace', date: '18 Apr 2025', amount: '$24.99', status: 'Completed', points: 250 },
      { id: 103, place: 'Sunny Bakery', date: '15 Apr 2025', amount: '$12.50', status: 'Completed', points: 125 },
      { id: 104, place: 'Fresh Grocery', date: '10 Apr 2025', amount: '$35.67', status: 'Completed', points: 357 },
      { id: 105, place: 'Local Restaurant', date: '05 Apr 2025', amount: '$42.80', status: 'Completed', points: 428 }
    ],
    upcomingPayments: [
      { id: 201, place: 'Coffee Subscription', date: '28 Apr 2025', amount: '$15.99', frequency: 'Monthly' },
      { id: 202, place: 'Meal Plan', date: '01 May 2025', amount: '$89.99', frequency: 'Monthly' }
    ]
  };

  // Tab panels
  const renderPaymentMethodsPanel = () => (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">
                  Your Payment Methods
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddCircleIcon />}
                  onClick={handleOpenAddPaymentDialog}
                >
                  Add Method
                </Button>
              </Box>
              
              <List>
                {mockPaymentData.paymentMethods.map((method) => (
                  <Paper 
                    key={method.id} 
                    elevation={1} 
                    sx={{ 
                      mb: 2, 
                      borderRadius: 2,
                      borderLeft: method.isDefault ? '4px solid #4CAF50' : 'none'
                    }}
                  >
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: method.type === 'credit' ? 'primary.main' : 'secondary.main' }}>
                          <PaymentIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={method.name} 
                        secondary={method.expiryDate ? `Expires ${method.expiryDate}` : 'No expiration'} 
                      />
                      {method.isDefault && (
                        <Box sx={{ mr: 2 }}>
                          <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                            DEFAULT
                          </Typography>
                        </Box>
                      )}
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" disabled={method.isDefault}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Paper>
                ))}
              </List>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Your payment information is securely stored and processed following industry standards.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Quick Pay
              </Typography>
              <Typography variant="body2" paragraph>
                Pay instantly at any participating restaurant by showing this QR code to the cashier.
              </Typography>
              
              <Box 
                sx={{ 
                  mt: 2,
                  mb: 3,
                  p: 3, 
                  bgcolor: 'grey.100', 
                  borderRadius: 2, 
                  height: 200, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <QrCodeIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Tap to expand QR code
                </Typography>
              </Box>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                startIcon={<QrCodeIcon />}
                onClick={handleOpenQRCodeDialog}
              >
                Show QR Code
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Upcoming Payments Section */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Upcoming Payments
              </Typography>
              {mockPaymentData.upcomingPayments.length > 0 ? (
                <List>
                  {mockPaymentData.upcomingPayments.map((payment) => (
                    <Paper 
                      key={payment.id} 
                      elevation={1} 
                      sx={{ mb: 2, borderRadius: 2 }}
                    >
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.light' }}>
                            <PaymentIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={payment.place} 
                          secondary={`Due on ${payment.date} • ${payment.frequency}`} 
                        />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mr: 2 }}>
                          {payment.amount}
                        </Typography>
                        <Button size="small" variant="outlined" color="primary">
                          Manage
                        </Button>
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  You have no upcoming scheduled payments.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Add Payment Method Dialog */}
      <Dialog open={openAddPaymentDialog} onClose={handleCloseAddPaymentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Payment Method</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please enter your payment details. Your information will be securely stored.
          </DialogContentText>
          
          <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
            <RadioGroup row defaultValue="creditCard">
              <FormControlLabel value="creditCard" control={<Radio />} label="Credit/Debit Card" />
              <FormControlLabel value="bankAccount" control={<Radio />} label="Bank Account" />
            </RadioGroup>
          </FormControl>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Cardholder Name"
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Card Number"
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Expiration Date"
                placeholder="MM/YY"
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="CVC"
                fullWidth
                margin="dense"
                type="password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel 
                control={<Radio />} 
                label="Set as default payment method" 
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddPaymentDialog}>Cancel</Button>
          <Button onClick={handleCloseAddPaymentDialog} variant="contained" color="primary">
            Add Payment Method
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* QR Code Dialog */}
      <Dialog open={openQRCodeDialog} onClose={handleCloseQRCodeDialog}>
        <DialogTitle>Quick Pay QR Code</DialogTitle>
        <DialogContent>
          <Box 
            sx={{ 
              p: 4, 
              bgcolor: 'grey.100', 
              borderRadius: 2, 
              height: 280, 
              width: 280, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <QrCodeIcon sx={{ fontSize: 120, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              QR Code Placeholder
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            Show this code to the cashier to make a payment. This code refreshes every 2 minutes for security.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQRCodeDialog}>Close</Button>
          <Button variant="contained" color="primary">
            Refresh Code
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderTransactionHistoryPanel = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Transaction History
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        View your recent purchases and payments
      </Typography>
      
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="time-period-label">Time Period</InputLabel>
                <Select
                  labelId="time-period-label"
                  id="time-period"
                  label="Time Period"
                  defaultValue="last30"
                >
                  <MenuItem value="last7">Last 7 days</MenuItem>
                  <MenuItem value="last30">Last 30 days</MenuItem>
                  <MenuItem value="last90">Last 90 days</MenuItem>
                  <MenuItem value="custom">Custom range</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="transaction-type-label">Transaction Type</InputLabel>
                <Select
                  labelId="transaction-type-label"
                  id="transaction-type"
                  label="Transaction Type"
                  defaultValue="all"
                >
                  <MenuItem value="all">All Transactions</MenuItem>
                  <MenuItem value="purchases">Purchases</MenuItem>
                  <MenuItem value="rewards">Reward Redemptions</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button variant="outlined" sx={{ mr: 1 }}>
                Export
              </Button>
              <Button variant="contained" color="primary">
                Filter
              </Button>
            </Grid>
          </Grid>
          
          <Divider sx={{ mb: 2 }} />
          
          <List>
            {mockPaymentData.recentTransactions.map((transaction) => (
              <Box key={transaction.id}>
                <ListItem sx={{ px: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PaymentIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={transaction.place}
                    secondary={transaction.date}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mr: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {transaction.amount}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'secondary.main' }}>
                      +{transaction.points} points
                    </Typography>
                  </Box>
                  <Button size="small" variant="text">
                    Details
                  </Button>
                </ListItem>
                <Divider component="li" />
              </Box>
            ))}
          </List>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button color="primary">
              Load More Transactions
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Payments
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your payment methods and view transaction history
        </Typography>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="payment tabs"
          variant="fullWidth"
        >
          <Tab icon={<CreditCardIcon />} label="Payment Methods" id="tab-0" />
          <Tab icon={<HistoryIcon />} label="Transaction History" id="tab-1" />
        </Tabs>
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 0}>
        {tabValue === 0 && renderPaymentMethodsPanel()}
      </Box>
      <Box role="tabpanel" hidden={tabValue !== 1}>
        {tabValue === 1 && renderTransactionHistoryPanel()}
      </Box>
    </Container>
  );
};

export default PaymentPage;