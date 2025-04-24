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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Paper,
  Tab,
  Tabs,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const BusinessDashboard = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Mock data for business dashboard
  const mockBusinessData = {
    name: 'Green Café',
    type: 'Café',
    packagingCredits: 350,
    rewardsIssued: 1850,
    registeredCustomers: 127,
    returningCustomers: 85,
    recentCustomers: [
      { id: 1, name: 'John Doe', date: '22 Apr 2025', amount: '$18.45', points: 185 },
      { id: 2, name: 'Mary Smith', date: '21 Apr 2025', amount: '$24.99', points: 250 },
      { id: 3, name: 'Robert Johnson', date: '20 Apr 2025', amount: '$12.50', points: 125 },
    ],
    packagingOrders: [
      { id: 101, type: 'Cups (12oz)', quantity: 500, status: 'Delivered', date: '15 Apr 2025' },
      { id: 102, type: 'Food Containers', quantity: 200, status: 'Processing', date: '18 Apr 2025' },
      { id: 103, type: 'Paper Bags', quantity: 300, status: 'Pending Approval', date: '22 Apr 2025' },
    ],
    customRewards: [
      { id: 201, title: 'Free coffee with any sandwich', points: 300, claimed: 12, active: true },
      { id: 202, title: '20% off breakfast items', points: 500, claimed: 8, active: true },
      { id: 203, title: 'Buy one get one free pastry', points: 400, claimed: 15, active: false },
    ]
  };

  // Tab panels
  const renderOverviewPanel = () => (
    <Grid container spacing={4}>
      {/* Stats Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Packaging Credits
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalShippingIcon sx={{ color: 'primary.main', mr: 1, fontSize: 32 }} />
              <Typography variant="h4" component="div">
                {mockBusinessData.packagingCredits}
              </Typography>
            </Box>
            <Button 
              variant="text" 
              color="primary" 
              size="small" 
              sx={{ mt: 1 }}
              startIcon={<AddCircleIcon />}
            >
              Request More
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Rewards Points Issued
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CardGiftcardIcon sx={{ color: 'secondary.main', mr: 1, fontSize: 32 }} />
              <Typography variant="h4" component="div">
                {mockBusinessData.rewardsIssued}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This month
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Registered Customers
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ color: 'primary.dark', mr: 1, fontSize: 32 }} />
              <Typography variant="h4" component="div">
                {mockBusinessData.registeredCustomers}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {mockBusinessData.returningCustomers} returning
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Customer Retention
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BarChartIcon sx={{ color: 'success.main', mr: 1, fontSize: 32 }} />
              <Typography variant="h4" component="div">
                {Math.round((mockBusinessData.returningCustomers / mockBusinessData.registeredCustomers) * 100)}%
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Return rate
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Customers */}
      <Grid item xs={12} md={8}>
        <Card sx={{ height: '100%', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Customers
            </Typography>
            <List>
              {mockBusinessData.recentCustomers.map((customer) => (
                <Box key={customer.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>{customer.name.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={customer.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {customer.date}
                          </Typography>
                          {` — ${customer.amount}`}
                        </>
                      }
                    />
                    <Chip 
                      label={`+${customer.points} pts issued`} 
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
              View All Customers
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Custom Rewards */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Your Custom Rewards
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                size="small"
                startIcon={<AddCircleIcon />}
                sx={{ color: 'white' }}
              >
                Add New
              </Button>
            </Box>
            
            {mockBusinessData.customRewards.map((reward) => (
              <Paper 
                key={reward.id}
                elevation={1} 
                sx={{ 
                  p: 1.5, 
                  mb: 2, 
                  borderRadius: 2,
                  borderLeft: reward.active ? '4px solid #4CAF50' : '4px solid #9E9E9E'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    {reward.title}
                  </Typography>
                  <Chip 
                    label={reward.active ? 'Active' : 'Inactive'} 
                    color={reward.active ? 'success' : 'default'} 
                    size="small" 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {reward.points} points required • {reward.claimed} customers claimed
                </Typography>
              </Paper>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderPackagingPanel = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Packaging Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Request eco-friendly packaging funded by local advertisements. Track your orders and inventory.
          </Typography>
        </Box>
      </Grid>
      
      {/* Packaging Credits */}
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Available Credits
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalShippingIcon sx={{ color: 'primary.main', mr: 1, fontSize: 40 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {mockBusinessData.packagingCredits}
              </Typography>
            </Box>
            <Typography variant="body2" paragraph>
              Credits can be used to order sustainable packaging with advertisements.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              startIcon={<AddCircleIcon />}
            >
              Request More Credits
            </Button>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Order New Packaging */}
      <Grid item xs={12} md={8}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Order New Packaging
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="packaging-type-label">Packaging Type</InputLabel>
                  <Select
                    labelId="packaging-type-label"
                    id="packaging-type"
                    label="Packaging Type"
                    defaultValue=""
                  >
                    <MenuItem value="cups">Coffee Cups</MenuItem>
                    <MenuItem value="containers">Food Containers</MenuItem>
                    <MenuItem value="bags">Paper Bags</MenuItem>
                    <MenuItem value="utensils">Eco-Friendly Utensils</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity"
                  InputProps={{ inputProps: { min: 100, step: 100 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Special Instructions (Optional)"
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary">
                Place Order
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Order History */}
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Order History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Packaging Type</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Order Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockBusinessData.packagingOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.type}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <Chip 
                          label={order.status} 
                          color={
                            order.status === 'Delivered' ? 'success' : 
                            order.status === 'Processing' ? 'primary' : 
                            'secondary'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="text">Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderRewardsPanel = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Rewards Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage custom rewards for your customers. Increase loyalty and repeat business.
          </Typography>
        </Box>
      </Grid>
      
      {/* Create New Reward */}
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Create New Reward
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reward Title"
                  placeholder="e.g., Free Coffee with Purchase"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Points Required"
                  InputProps={{ inputProps: { min: 100, step: 50 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Expiration Date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Reward Description"
                  placeholder="Enter details about the reward and any terms & conditions"
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="secondary" sx={{ color: 'white' }}>
                Create Reward
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Active Rewards */}
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 2, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Active Rewards
            </Typography>
            <List>
              {mockBusinessData.customRewards.filter(r => r.active).map((reward) => (
                <Paper 
                  key={reward.id}
                  elevation={1} 
                  sx={{ p: 2, mb: 2, borderRadius: 2 }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        {reward.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {reward.points} points required
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          Redemption Rate:
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={reward.claimed * 5} // Example calculation
                          sx={{ 
                            width: 100, 
                            height: 8, 
                            borderRadius: 5, 
                            bgcolor: 'rgba(0,0,0,0.1)' 
                          }} 
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {reward.claimed} claimed
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="error" 
                        size="small"
                      >
                        Deactivate
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Business Dashboard: {mockBusinessData.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {mockBusinessData.type} • {mockBusinessData.registeredCustomers} registered customers
        </Typography>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="business dashboard tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" id="tab-0" />
          <Tab label="Packaging" id="tab-1" />
          <Tab label="Rewards" id="tab-2" />
        </Tabs>
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 0}>
        {tabValue === 0 && renderOverviewPanel()}
      </Box>
      <Box role="tabpanel" hidden={tabValue !== 1}>
        {tabValue === 1 && renderPackagingPanel()}
      </Box>
      <Box role="tabpanel" hidden={tabValue !== 2}>
        {tabValue === 2 && renderRewardsPanel()}
      </Box>
    </Container>
  );
};

export default BusinessDashboard;