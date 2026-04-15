
const http = require('http');

const data = JSON.stringify({
  userId: 1,
  pickup: 'Test Pickup',
  dropoff: 'Test Dropoff',
  date: '2026-04-15',
  time: '10:00 AM',
  vehicleType: 'standard',
  tripType: 'one-way'
});

const options = {
  hostname: 'localhost',
  port: 4200,
  path: '/api/transportation',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
