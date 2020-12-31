const mongoose = require("mongoose");
const axios = require("axios").default;
const Namad = require("./app/models/Namad");
const newData = require("./newData.json");

mongoose
  .connect(
    "mongodb+srv://erfanpoorsina:@Iminmongodb85@erfanpoorsinacluster.uyukb.mongodb.net/namadScraper?retryWrites=true&w=majority"
    ,{ 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log(`Connected ...`));
  
(async() => {
    let name = 'رنیک';

    const namad = newData.filter(item => item[1] === name);
	return console.log(namad);
	
    const data = await axios.post('https://name-scraper.herokuapp.com/getData', { id: namad[0][0] })
    console.log(data);
})();