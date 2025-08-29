const mongoose =  require(`mongoose`)

const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_LOCAL_URL, {
        useNewUrlParser: true, //parse db url in new safe way
        useUnifiedTopology: true //use new engine for db
    }).then(con =>{
        console.log(`MongoDB is Connected to the host: ${con.connection.host}` )
    }).catch((err)=>{
        console.log(err)
    })

}

module.exports = connectDatabase;