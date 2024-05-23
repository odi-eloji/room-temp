Module.register ("room-temp", {
    defaults: {
        URL: 'https://api.thingspeak.com/channels/2530434/feeds.json?api_key=OPGAHJRK8K54RW0P&results=1' // url that gets temperature from pi
    },

    getStyles: function() {
        return [
            'font-awesome.css'
        ]
    },

    start: function() {
        var self = this; // self is this module 
        setInterval(function() {
            var xmlhttp = new XMLHttpRequest(); //create http request
            xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readyState == 4 && xmlhttp.status == 200) { // when state changes && succesful response
                var results = JSON.parse(xmlhttp.responseText);// parse response text
                    self.temperature=results.feeds[0].field1; // get temperature from field1 in the feeds array
                console.log(self.temperature);
                self.updateDom(); //update display
            }
            };
            xmlhttp.open("GET", self.config.URL, true); //http get request with url
            xmlhttp.send();
            }, 5000); // perform every 5 secs
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        if (!this.temperature) {
            wrapper.innerHTML = "No data";
            wrapper.className = "dimmed light small";
            return wrapper;
        }
        if(this.temperature <= 17){ // if temperature is below 17 icecube
            wrapper.innerHTML = '<i class ="fas fa-door-open"></i> '+this.temperature +'&deg;'+ '<i class = "fas fa-snowflake"></i>';
        }
        else if(this.temperature >17 && this.temperature <=23) { // if above 17 but beloew 23 smiley face
            wrapper.innerHTML = '<i class ="fas fa-door-open"></i> '+this.temperature +'&deg;'+ '<i class = "fas fa-face-smile"></i>';
        }
        else { //else render with flames
            wrapper.innerHTML = '<i class ="fas fa-door-open"></i> '+this.temperature +'&deg;'+ '<i class= "fas fa-fire"></i>';
        }
        return wrapper;
    }


}); 
