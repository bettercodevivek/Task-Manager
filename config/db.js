const mongoose = require('mongoose');

const ConnectDB = async() => {
    
  const MONGO_URI = process.env.MONGO_URI;

  if(!MONGO_URI){
    console.error('MONGO URI NOT FOUND !');
    process.exit(1);
  }

  const options = {
    serverSelectionTimeoutMS:10000, // mongodb driver ko agar itne time mein server nahi mila on connection, it will give error
    socketSelectionTimeoutMS:45000, // this is basically the connection between app and driver, ab initial connection ke baad, kisi query pe itne time mein if no activity from mongo side, error
    maxPoolSize:10 // Number of connections that stay open for queries, once a query uses a connection its dumped back into pool for reuse
  }

  const connectWithRetry = async (retries = 5) => {
     
    try{
      const conn = await mongoose.connect(MONGO_URI,options);
      console.log(`mongoDB Connected : ${conn.connection.host}`)
    }
    catch(error){
      console.error(`error connecting to mongoDB`,error);
      if(retries === 0){
        console.log('Error, cannot connect with DB on multiple retries')
        process.exit(1);
      }
      else{
        console.log(`Retrying connection in 5 seconds... (${retries} retries left)`);
        await new Promise((res)=>setTimeout(res,5000));
        await connectWithRetry(retries-1);
      }
    }
  };

  await connectWithRetry();


  // Shutdown Handling

  const handleExit = async(signal) => {
    try{
        await mongoose.connection.close();
        console.log(`MongoDB connection closed due to ${signal}`);
        setTimeout(()=>process.exit(0),100);
    }
    catch(error){
      console.error("Error during MongoDB disconnect:", err);
      process.exit(1);
    }
  }

  process.on('SIGINT',()=>handleExit('SIGINT'));
  process.on('SIGTERM',()=>handleExit('SIGTERM'));
   process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    handleExit("uncaughtException");
  });
  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    handleExit("unhandledRejection");
  });
}

module.exports = {ConnectDB};