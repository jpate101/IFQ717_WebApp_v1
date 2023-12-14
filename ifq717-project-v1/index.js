require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
const port = 5000;

app.use(cors({
  origin: '*'
}));

const client = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(function(err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('Connected to Google Sheets API!');
  }
});

app.get('/data', async (req, res) => {
  const gsapi = google.sheets({ version: 'v4', auth: client });
  const opt = {
    spreadsheetId: '1NhEK3fpZoFgq2x8mR1EfhGauVRZd_hZsIFx5cGPwNY8',
    range: 'Sheet1!Q1:Q5000'
  };

  let data = await gsapi.spreadsheets.values.get(opt);
  let dataArray = data.data.values;
  res.send(dataArray);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
