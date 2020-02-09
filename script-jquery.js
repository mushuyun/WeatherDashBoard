//need to show cities, uvindex;

  var url;
  var city;
  var key;

  //get today's date
  $("#date").html(new Date());
  
  
  $("#search-btn").on("click", function(){
      
      event.preventDefault();
      var city = $("#city-search").val();
      if (city === "") {
        return;
        } else  { 
            getWeather();
            
            localStorage.setItem("city", JSON.stringify(city));
            }

           console.log(localStorage.getItem("city"))
    
    var pastCities =  $("<p>").text(JSON.parse(localStorage.getItem("city")));
    $("#past-cities").append(pastCities);
            
  });
   

//get weather information
  function getWeather(){
    var city = $("#city-search").val();
    
    if(city != ''){
    
      $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather?q=' + city + "&APPID=80dbdb1e6f8e0d8a44b9a417a96e7403",
        method: "GET"
      })
        
          .then(function(res){
   
                var weatherDetail = {
                city: res.name,
                temperature: Math.floor(res.main.temp - 273),
                humidity: res.main.humidity,
                windSpeed: res.wind.speed,
                lon: res.coord.lon,
                lat: res.coord.lat
                };
                
                var iconcode = res.weather[0].icon;
                var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                $("#wicon").attr('src', iconurl);
               
                var result1 = $("<h6>").text("City: " + weatherDetail.city);
                var result2 = $("<h6>").text("Temperature: " + weatherDetail.temperature + " °C");
                var result3 = $("<h6>").text("Humidity: " + weatherDetail.humidity + "%");
                var result4 = $("<h6>").text("Wind: " + weatherDetail.windSpeed);
                
                $("#weather-detail").empty();
                
                 
                $("#weather-detail").append(result1, result2, result3, result4); 

         //use latitude and logitude got from above to make uvIndex call
                var lon = res.coord.lon;
                var lat = res.coord.lat;
                $.ajax({
                  url: "https://api.openweathermap.org/data/2.5/uvi?APPID=80dbdb1e6f8e0d8a44b9a417a96e7403&lat=" + lat + "&lon=" + lon,

                    method: "GET"
                })
                   .then(function(data){
                     var uvIndex = data.value;
                     var result5 = $("<h6>").text("UV Index: " + uvIndex);
                     $("#weather-detail").append(result5);
                   })
          //use latitude and logitude got from above to make 5day forcast call
                   
                  $.ajax({
                  
                    url: "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&APPID=80dbdb1e6f8e0d8a44b9a417a96e7403",
                    method: "GET"
                  })
                  .then (function(forcast){
                    for(var i = 0; i < 5; i++){
                      var temp = Math.floor((forcast.list[i].main.temp - 273));
                      
                      var humi = forcast.list[i].main.humidity;
                      var icon = forcast.list[i].weather[0].icon;
                      
                        var iconLink ='http://openweathermap.org/img/w/'+ icon + ".png";
                        $("#wicon" + i).attr("src", iconLink);
                        
                        var res1 =  $("<p>").text("Tempreture: " + temp +" °C");
                        var res2 = $("<p>").text("Humidity: "+ humi + "%");

                        

                        $("#temp" + i).append(res1);
                        $("#humi" + i).append(res2);
          
                    }    
                            
                  })    
         
          });    
    }
  }
