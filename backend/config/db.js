const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobconnect', {
      // Modern mongoose options are defaults in Mongoose 6+
    });
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host} / Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log(`ℹ️ Note: If you are using MongoDB Atlas, make sure your IP is whitelisted (0.0.0.0/0) and credentials in .env are correct.`);
    // Do not crash server completely so developer can still check health endpoint
  }
};

module.exports = connectDB;
