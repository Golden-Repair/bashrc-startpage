<template>
  <div class="weather-wrapper">
  <span class='d-block'>{{this.city}}</span>
  <span class='d-block' v-if="this.weatherData.main === 'Rain'"><i  class="fas fa-cloud-showers-heavy"></i>rainy af</span>
  <span class='d-block' v-if="this.weatherData.main === 'Fog'"><i  class="fas fa-smog"></i>foggy af</span>
  <span class='d-block' v-if="this.weatherData.main === 'Snow'"><i  class="fas fa-snowflake"></i>snowy af</span>
  <span class='d-block' v-if="this.weatherData.main === 'Drizzle'"><i  class="fas fa-umbrella"></i>drizzly af</span>
  <span class='d-block' v-if="this.weatherData.main === 'Thunderstorm'"><i  class="far fa-bolt"></i>THUNDERSTORM</span>
  <span class='d-block' v-if="this.weatherData.main === 'Clouds'"><i  class="far fa-cloud"></i>cloudy af</span>
  <span class='d-block' v-if="this.weatherData.main === 'Clear'"><i  class="far fa-sun"></i>sunny af</span>
  <span class='d-block' v-if="this.weatherData.temp <= 10"><i  class="fas fa-temperature-low"></i>{{this.weatherData.temp}}</span>
  <span class='d-block' v-if="this.weatherData.temp > 10 && this.weatherData.temp <= 20"><i  class="fas fa-temperature-half"></i>{{this.weatherData.temp}}</span>
  <span class='d-block' v-if="this.weatherData.temp > 20 "><i  class="fas fa-thermometer-high"></i>{{this.weatherData.temp}}</span>
  <span class='d-block'>Feels like {{this.weatherData.tempFeelsLike}} though..</span>
  </div>
</template>

<script>

import { log } from "../logger";


export default {
  name: "weather",
  data: function() {
    return {
      weatherData: {
        weather: ''
      },
      city: 'Zurich',
    };
  },
  props: {
  },
  watch: {},
  methods: {
    getWeatherData: function(city) {

        this.callAPI(city, this.parseData)
    },
    callAPI: function(city, callback) {
      $.getJSON(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=12689f13c28873a6559ba14ec01f3392`,function(json){
            console.log(JSON.stringify(json))
            callback(json);
        });
    },
    parseData: function(json) {
      var temp = {};
      temp.main =json.weather[0].main; 
      temp.weather = json.weather[0].description;
      temp.icon = json.weather[0].icon;
      temp.temp = parseFloat(json.main.temp);
      temp.tempFeelsLike = json.main.feels_like;
      this.weatherData = temp;
    },
  },
  computed: {},
  mounted: function(){
    this.getWeatherData(this.city);
    log('weather',this.weatherData.weather, 'red')
    
  },
}
</script>

<style>
.weather-wrapper {
  padding: 5rem;
  background-color: var(--dark);
  opacity: 0.95;
}

.weather-wrapper span {
  margin-bottom: 1rem;
}

.weather-wrapper span i {
  margin-right: 1rem;
}

.d-block {
  display: block;
}

</style>
