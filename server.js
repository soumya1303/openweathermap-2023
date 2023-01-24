const express = require('express');
const app  = express();
const https = require('https');


const PORT = 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/', (req, res)=>{
    res.sendFile('./search.html', {root:__dirname});
});

app.post('/', (req, res)=>{

    const name=req.body.ct_name;
    const apiKey = 'bc88586c307a98c15018638b61752b04';
    const target = 'https://api.openweathermap.org/data/2.5/weather?q=' + name + '&appid='+apiKey + '&units=metric';
    
    https.get(target, (resp)=>{
        
        /*
        try {
            fs.writeFileSync('./weblog.txt', JSON.stringify(resp));
          } catch (err) {
            console.log("Error in writing to file");
            console.error(err);
          }
        */

        if (200===resp.statusCode){
            resp.on('data', (respObj)=>{
            
                const respObjParsed = JSON.parse(respObj);
                
                var weatherDesc = respObjParsed.weather[0].description;
                var weatherDescFormatted = weatherDesc.slice(0,1).toUpperCase() + weatherDesc.slice(1,weatherDesc.length).toLowerCase();
                var iconCode = respObjParsed.weather[0].icon;
                var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";

                res.write('<h1>Current weather of ' + respObjParsed.name + ' is: </h1>');  
                res.write('<img src="'+iconUrl+'"></img>');  
                res.write('<p>' + weatherDescFormatted + '</p>');
                res.write('<p> Current temp.' + respObjParsed.main.temp + ' degree Celcius</p>');
                res.write('<p> Todays max will be ' + respObjParsed.main.temp_max + ' degree celcius and min will be ' + respObjParsed.main.temp_min + ' degree Celcius</p>');
                res.write('<form action="/" method="GET"><input type="submit" value="Home"></form>');
                res.send();
            });
        }else{
            res.write('<p> Error in fetching weather data. Error code: '+ resp.statusCode+'</p>');
            res.write('<form action="/" method="GET"><input type="submit" value="Home"></form>');
            res.send();
        }
    
    });


});


app.listen(PORT, ()=>{
    console.log("Server started in running mode");
});