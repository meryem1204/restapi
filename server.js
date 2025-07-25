const http = require('http');
const app = require('./src/app');
const PORT = process.env.port || 3000;
//const server = http.createServer();
app.listen(PORT, () =>{
    console.log("heyy")
});



