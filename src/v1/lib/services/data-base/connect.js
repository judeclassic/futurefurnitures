export default (mongoose, config)=>{
    
    try{
        mongoose.connect(process.env.MONGO_URL,
            {
                useUnifiedTopology: true,
                useNewUrlParser: true
            });
        mongoose.connection.once('open', (err)=>{
            if (err) throw err;
            console.log(`${config.name} database connected successfully`);
        })
    }catch(err){
        console.log(`Error: ${err}`);
    }
}