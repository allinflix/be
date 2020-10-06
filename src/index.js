const express = require('express');
const cors = require('cors');

// Routes
const moviesRoute = require('./routes/movies');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors());

// Middleware
app.use(
  express.json({
    extended: false,
  })
);
app.set('trust proxy', true);

app.use('/movies', moviesRoute);
// Custom Routes
app.get('/', (req, res) => {
  res.send('<h1>AllInFlix</h1>');
});

// Listen
app.listen(PORT, () => {
  console.log('Poslusam na PORT ' + PORT);
});
