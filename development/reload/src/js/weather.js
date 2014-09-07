function populateWeatherConditions (weather) {
	var tmpl, output;

	emptyContent(); 

	forge.logging.log("[populateWeatherConditions] beginning populating weather conditions");

	tmpl = $("#forecast_information_tmpl").html();
	output = Mustache.to_html(tmpl, weather.current_observation);
	$("#forecast_information").append(output);
	forge.logging.log("[populateWeatherConditions] finished populating forecast information");

	tmpl = $("#current_conditions_tmpl").html();
	output = Mustache.to_html(tmpl, weather.current_observation);
	$("#current_conditions").append(output);
	forge.logging.log("[populateWeatherConditions] finished populating current conditions");

	tmpl = $("#forecast_conditions_tmpl").html();
	output = Mustache.to_html(tmpl, weather.forecast.simpleforecast);
	$("#forecast_conditions table tr").append(output);
	forge.logging.log("[populateWeatherConditions] finished populating forecast conditions");

	forge.logging.log("[populateWeatherConditions] finished populating weather conditions");
};


function getWeatherInfo(location, callback) {
    var api_key = "4fdc78d891cba4a6";
	forge.logging.info("[getWeatherInfo] getting weather for for " + location);
	forge.request.ajax({
		url: "http://api.wunderground.com/api/" + api_key +
				"/conditions/forecast/q/" +	location + ".json",
		dataType: "json",
		success: function (data) {
			forge.logging.info("[getWeatherInfo] success");
			callback(data);
		},
		error: function (error) {
			forge.logging.error("[getWeatherInfo] " + JSON.stringify(error));
		}
	});
};


function emptyContent() {
	forge.logging.log("[emptyContent] removing old data");
	$("#forecast_information").empty();
	$("#current_conditions").empty();
	$("#forecast_conditions table tr").empty();
	
	forge.logging.log("[emptyContent] finished emptying content");
};


$(function () {
	var cities = [ 
		{ name: "London", code: "UK/London" },
		{ name: "San Francisco", code: "CA/San_Francisco" },
		{ name: "Cape Town", code: "ZA/Cape_Town" },
		{ name: "Barcelona", code: "ES/Barcelona" },
		{ name: "Boston", code: "NY/Boston" },
		{ name: "New York", code: "NY/New_York" },
		{ name: "Washington DC", code: "DC/Washington" },
		{ name: "Tampa", code: "FL/Tampa" },
		{ name: "Houston", code: "AL/Houston" },
		{ name: "Montreal", code: "CYUL" },
		{ name: "Los Angeles", code: "CA/Los_Angeles" },
		{ name: "Miami", code: "FL/Miami" },
		{ name: "West Palm Beach", code: "FL/West_Palm_Beach" } 
	];
	cities.forEach(function(city) {	
		$("#city_menu").append("<option value='" + city.code + "'>" + city.name + "</option>");
	});
	$("#city_menu").change(function() {
		var city = $("#city_menu option:selected").val();
		forge.prefs.set("city", city);
		getWeatherInfo(city, populateWeatherConditions);
	});
	forge.prefs.get("city", function(resource) {
		if (resource) { // user has previously selected a city
			var city = resource;
		} else { // no previous selection
			var city = "CA/San_Francisco";
		}
		$("#city_menu").val(city);
		$("#city_menu").change();
	}, function (error) {
		forge.logging.error("failed when retrieving city preferences");
		$("#city_menu").val("CA/San_Francisco"); // default;
	});
});


