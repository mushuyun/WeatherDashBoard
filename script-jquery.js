
   var url;
   var city;
   var key;
   var lat;
   var lon;

   //when loading use last entered city to load weather info
   
    var storage = window.localStorage;
    city = JSON.parse(storage.city);
    url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=bfc1b977d5f0ad912b3dc6c21e34e887";
    apiCall(); 
  
  
  // loading wether by enter city
 $("#search-btn").on("click", function(event){
     
     event.preventDefault();
     
     //var city = $("#city-search").val();
     if (city === "") {
       return;
       } else  { 
        $("#city-search").val = "";
        city = $("#city-search").val();
        url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=bfc1b977d5f0ad912b3dc6c21e34e887";
        apiCall();     
        
        localStorage.setItem("city", JSON.stringify(city));
        var newCity = $("<a>").text(JSON.parse(localStorage.getItem("city")));
        newCity.css({
          float:"left",
          width: "200px",
          padding: "5px",
          color: "darkblue"
        });
        $("#past-cities").append(newCity, "<br>");

      }              
        
    }) 
  
  //click a past city to get weather info

  $(document).on("mousedown touchstart", "a", function (event) {   
    event.preventDefault();
    city = $(this).text();
    $(this).remove(); 
    url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=bfc1b977d5f0ad912b3dc6c21e34e887";
    apiCall();
  })
 
 //get weather information 

     function apiCall(){
 
       $.ajax({
         url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + "&APPID=80dbdb1e6f8e0d8a44b9a417a96e7403",
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
                 var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
                 $("#wicon").attr('src', iconurl);
                
                 var result1 = $("<h6>").text("City: " + weatherDetail.city);
                 var result2 = $("<h6>").text("Temperature: " + weatherDetail.temperature + " °C");
                 var result3 = $("<h6>").text("Humidity: " + weatherDetail.humidity + "%");
                 var result4 = $("<h6>").text("Wind Speed: " + weatherDetail.windSpeed);
                 
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
                    });
           //use latitude and logitude got from above to make 5day forcast call
                    
                   $.ajax({
                   
                     url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&APPID=80dbdb1e6f8e0d8a44b9a417a96e7403",
                     method: "GET"
                   })
                   
                   .then (function(forcast){
                     for(var i = 0; i < 5; i++){
                       var temp = Math.floor((forcast.list[i].main.temp - 273));
                       
                       var humi = forcast.list[i].main.humidity;
                       var icon = forcast.list[i].weather[0].icon;
                       
                       var iconLink ='https://openweathermap.org/img/w/'+ icon + ".png";
                       $("#wicon" + i).attr("src", iconLink);
                       
                       var res1 =  $("<p>").text("Tempreture: " + temp +" °C");
                       var res2 = $("<p>").text("Humidity: "+ humi + "%");
 
                       $("#temp" + i).empty();
                       $("#humi" + i).empty();
                       $("#temp" + i).append(res1);
                       $("#humi" + i).append(res2);
                       
                     }    
                             
                   });           
           });    
     }
   
 
 //set date 
 
 var day = moment().date();
 var mon = moment().month();  // jan=0, dec=11
 var year = moment().year();
 var date = (parseInt(mon)+1) + "/" + day + "/" + year;
 $("#date").html(date);
 
 for (i=0; i<5; i++){
   var dayFuture = $("<h6>").text(parseInt(mon+1) + "/" + parseInt(day+1+i));
   $("#day" + i).prepend(dayFuture);
 }

 