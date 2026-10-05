const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

const port = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes')
const vehicleRoutes = require('./routes/vehicleRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const serviceCenterRoutes = require('./routes/serviceCenterRoutes');
const timeSlotRoutes = require('./routes/timeSlotRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const serviceHistory = require('./routes/serviceHistoryRoutes')
const db = require('./config/db');
db();
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

app.use('/users',userRoutes)
app.use('/vehicles', vehicleRoutes);
app.use('/services', serviceRoutes);
app.use('/service-centers',serviceCenterRoutes);
app.use('/time-slots', timeSlotRoutes);
app.use('/booking',bookingRoutes);
app.use('/review',reviewRoutes)
app.use('/service-history',serviceHistory)

app.listen(port,() =>{
    console.log(`server is running on http://localhost:${port}`);
})