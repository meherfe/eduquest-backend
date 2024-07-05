// Import necessary modules
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan'; // Logging middleware
import cors from 'cors';
import userRoutes from './Routes/route.js';
import { notfound } from './middlewares/notfound.js'; // Assuming you have a notfound middleware

const app = express();

// Middleware setup
app.use(morgan('dev')); // Use morgan middleware for logging
app.use(cors());
app.use(express.json());

// Database connection
const port = process.env.PORT || 9090;
const databasename = 'eduquest';

mongoose.set('debug', true); // Enable Mongoose debugging
mongoose.promise = global.Promise;

mongoose
  .connect(`mongodb://localhost:27017/${databasename}`)
  .then(() => {
    console.log(`Connected to ${databasename}`);
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err); // Log error message
  });

app.use(userRoutes);

// 404 Not Found middleware
app.use(notfound);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack trace
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});