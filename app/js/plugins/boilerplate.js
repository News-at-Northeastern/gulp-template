var a = moment('2020-01-22');
var b = moment().subtract(1, 'days');
var global_data = [];
var us_data = [];
var omitkeys = ["Province/State", "Country/Region", "Lat", "Long"]


d3.queue()
// .defer(d3.json, "/interactive/2020/03/covid_totals/data/global_coronavirus.json")
// .defer(d3.json, "/interactive/2020/03/covid_totals/data/us_coronavirus.json")
   .defer(d3.csv, "//raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv")
   .defer(d3.csv, "//raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv")
   .await(function(error, datac, datad) {
      var datasets = [datac, datad];

      var totalkeys = ["total_confirmed","total_death"];

      for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
         var global_newobj = {}
         global_newobj.date = m.format('YYYY-MM-DD');
         var us_newobj = {}
         us_newobj.date = m.format('YYYY-MM-DD');

         for (var h=0; h<datasets.length; h++) {
            var accessor = totalkeys[h];
            global_newobj[accessor] = datasets[h].reduce(function (acc, obj) { return acc + parseInt(obj[m.format('M/D/YY')])}, 0);
            us_newobj[accessor] = datasets[h].filter(function(d) {return d["Country/Region"] === "US"; }).reduce(function (acc, obj) { return acc + parseInt(obj[m.format('M/D/YY')])}, 0);
         }
         global_data.push(global_newobj);
         us_data.push(us_newobj);
      }

      console.log(global_data);
      console.log(us_data);

      globalCoronavirus(global_data, "#global-multi-line", "#globalSlider", "#global-play-button");
       globalCoronavirus(us_data, "#us-multi-line", "#usSlider", "#us-play-button");

       document.getElementById("virus_us").style.display="none";

});
document.getElementById("us").addEventListener("click", function menButton(){
   console.log("press us")
    document.getElementById("us").classList.add("currentchart");
    document.getElementById("global").classList.remove("currentchart");

document.getElementById("virus_us").style.display="block";


document.getElementById("virus_global").style.display="none";

});

document.getElementById("global").addEventListener("click", function menButton(){
   console.log("press global")
   document.getElementById("global").classList.add("currentchart");
   document.getElementById("us").classList.remove("currentchart");

   document.getElementById("virus_global").style.display="block";



document.getElementById("virus_us").style.display="none";


});
