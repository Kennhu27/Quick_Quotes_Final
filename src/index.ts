import express, { Express } from 'express';
import './config.js'; // do not remove this line
import { sessionMiddleware } from './sessionConfig.js';
import { 
  createQuote,
  updateQuoteFeet_width,
  updateQuoteFeet_length,
  updateQuoteSqr_feet,
  updateQuoteDemolition, 
  updateQuoteGrout, 
  updateQuotePickup, 
  updateQuoteThinSet,
  submitAndCalculateQuote,
} from './controllers/QuoteController.js';
import { 
  createUser,
  getUser,
  adminLogin, 
  adminLogout, 
  getCurrentAdmin,
  createFirstAdmin,
  createAdmin,
  getAllAdmins,
  updateAdminStatus,
  deleteAdmin
} from './controllers/SecureController.js';

const app: Express = express();

app.use(sessionMiddleware); // Setup session management middleware
app.use(express.json()); // Setup JSON body parsing middleware
app.use(express.urlencoded({ extended: false })); // Setup urlencoded (HTML Forms) body parsing middleware

// Setup static resource file middleware
app.use(express.static('public', { extensions: ['html'] }));

// Serve the built Svelte frontend
app.use(express.static('frontend/build'));

// ==========================================
// QUOTE ROUTES
// ==========================================
app.post('/api/quotes', createQuote);
app.patch('/api/quotes/:quoteId/width', updateQuoteFeet_width);
app.patch('/api/quotes/:quoteId/length', updateQuoteFeet_length);
app.patch('/api/quotes/:quoteId/sqfeet', updateQuoteSqr_feet);
app.patch('/api/quotes/:quoteId/demolition', updateQuoteDemolition);
app.patch('/api/quotes/:quoteId/grout', updateQuoteGrout);
app.patch('/api/quotes/:quoteId/pickup', updateQuotePickup);
app.patch('/api/quotes/:quoteId/thinset', updateQuoteThinSet);
app.post('/api/quotes/:quoteId/calculate', submitAndCalculateQuote);

// ==========================================
// USER ROUTES
// ==========================================
app.post('/api/users', createUser);
app.get('/api/users/:userId', getUser);

// ==========================================
// ADMIN AUTH ROUTES
// ==========================================
app.post('/api/admin/setup', createFirstAdmin);
app.post('/api/admin/login', adminLogin);
app.post('/api/admin/logout', adminLogout);
app.get('/api/admin/me', getCurrentAdmin);

// ==========================================
// ADMIN MANAGEMENT ROUTES
// ==========================================
app.post('/api/admin/admins', createAdmin);
app.get('/api/admin/admins', getAllAdmins);
app.patch('/api/admin/admins/:adminId/toggle-status', updateAdminStatus);
app.delete('/api/admin/admins/:adminId', deleteAdmin);

// ==========================================
// AUTH ROUTE (returns current user - for frontend)
// ==========================================
app.get('/api/me', (req, res) => {
  // Check for admin session first
  if (req.session.isAdminLoggedIn && req.session.authenticatedAdmin) {
    const { adminId, email, fullName } = req.session.authenticatedAdmin;
    res.json({ id: adminId, email, displayName: fullName, role: 'admin' });
    return;
  }
  
  // Check for regular user session
  if (req.session.isLoggedIn && req.session.authenticatedUser) {
    const { userId, email, displayName } = req.session.authenticatedUser;
    res.json({ id: userId, email, displayName, role: 'user' });
    return;
  }
  
  // Not authenticated
  res.sendStatus(401);
});

// -- SPA fallback --------------------------------------------
app.use('/api', (req, res) => {
  res.sendStatus(404);
});

app.use((req, res) => {
  res.sendFile('index.html', { root: 'frontend/build' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});
