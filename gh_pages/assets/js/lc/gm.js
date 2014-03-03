/* Google Map */
// Needs absolute URL for Tumblr
var IMAGE_BASE_URL = "http://little.pfd-dev.com";
var supportTouch;
var map;
var marker = [];
var markers = [];
var isHomepage = document.href===IMAGE_BASE_URL;
var directionsEndPoint;
var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var youDirectionsMarker;
var offsetLatLng;
var infowindow = new google.maps.InfoWindow();
var isPhone = $(window).innerWidth() <= 640;

// Use updated map style
google.maps.visualRefresh = true;
//

var icons = {
    parking: {
        icon: IMAGE_BASE_URL + '/wp-content/uploads/images/parking-marker.png',
        shadow: '/'
    },
	parking_active: {
        icon: IMAGE_BASE_URL + '/wp-content/uploads/images/parking-marker-active.png',
        shadow: '/'
    },
    little: {
        icon: IMAGE_BASE_URL + '/wp-content/uploads/images/little-marker.png',
        shadow: '/'
    },
    you: {
        icon: IMAGE_BASE_URL + '/wp-content/uploads/images/you-marker.png',
        shadow: '/'
    }
};
var littleLatLng = {
    latLng: new google.maps.LatLng(44.973413, -93.271726),
    label: "Little and Co."
}
var parkingData = {
    hilton: {
        latLng: new google.maps.LatLng(44.972489, -93.272209),
        label: "Hilton Hotel - 11th Street and 2nd Ave"
    },
    marten: {
        latLng: new google.maps.LatLng(44.973379, -93.273116),
        label: "Marten Ramp - 10th Street & Marquette Avenue"
    },
    international: {
        latLng: new google.maps.LatLng(44.973869, -93.271072),
        label: "International Centre - 9th Street and 2nd Ave"
    }
}

$(document).ready(function () {
    supportTouch = !! ('ontouchstart' in window) || !! ('msmaxtouchpoints' in window.navigator);
    //console.log('supporttouch: ' + supportTouch); //DEBUG


    if (!$('#Map').hasClass("map-collapsed")) {
        google.maps.event.addDomListener(window, 'load', initializeMaps);
    }
})

function handleDirectionsClick(endPoint) {

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        window.open('https://maps.google.com/maps?daddr=' + endPoint.label.replace(" ", "+") + ',+Minneapolis&ll=' + endPoint.latLng.lat() + ',' + endPoint.latLng.lng() + '&spn=0.023225,0.026393&t=h&z=15');
    } else {
        // Store the endpoint for the directions
        directionsEndPoint = endPoint.latLng;
        // If the directions panel is hidden, show it. Otherwise, recalculate the route using the last startpoint and new endpoint
        if ($("#directions-sidebar").css("display") == "none") {
            $("#directions-sidebar").css("display", "block");
        } else {
            calcRoute();
        }
    }
    map.setCenter(littleLatLng.latLng)
}


function calcRoute() {

    var start = document.getElementById('startInput').value;
    var isLittle = directionsEndPoint === littleLatLng.latLng;
    var end = directionsEndPoint;
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var youLatLng = new google.maps.LatLng(response.routes[0].legs[0].start_location.lat(), response.routes[0].legs[0].start_location.lng());
            if (youDirectionsMarker == null) {
                youDirectionsMarker = new google.maps.Marker({
                    position: youLatLng,
                    icon: icons['you'].icon,
                    map: map
                });
            } else {
                youDirectionsMarker.setPosition(youLatLng);
            }

        }

        if (isLittle) {
            $("#distance").html("<p>Distance to Little" + " - " + response.routes[0].legs[0].distance.text + "</p>")

            $(".adp-placemark").css("background-image", "url(" + IMAGE_BASE_URL + "/wp-content/uploads/images/little-marker.png)")
        } else {
            $("#distance").html("<p>Distance to Parking" + " - " + response.routes[0].legs[0].distance.text + "</p>")
            $(".adp-placemark").css("background-image", "url(" + IMAGE_BASE_URL + "/wp-content/uploads/images/parking-marker.png)")
        }
    });


}


function initializeMaps() {
	// Remove any existing info divs
	$("#directions-blocks").html("")
    var map_canvas = $('#map-canvas')[0];
	var map_options = {
        center: littleLatLng.latLng,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        maxZoom: 20,
        minZoom: 5,
        scrollwheel: false,
        draggable: !supportTouch //turn off draggable when device support touch(such as phone/tablet)
    };
    map = new google.maps.Map(map_canvas, map_options);
	map.redraw = function () {
    	gmOnLoad = true;
		if (gmOnLoad) {
			google.maps.event.trigger(map, "resize");
			gmOnLoad = false;
		}
	}
		
	
    directionsDisplay = new google.maps.DirectionsRenderer({
        suppressMarkers: true
    })
    directionsDisplay.supressMarkers = true;
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));
    //

    addMarker("parking_hilton", {
        position: parkingData.hilton,
        type: "parking",
        zIndex: 0,
        title: "Hilton Hotel - 11th Street and 2nd Ave",
        content: "<p>From hotel garage: <ul><li>Take North Elevator to Level 2 (Skyway)</li><li>Turn right and cross 10th St. via skyway</li><li>Elevator Lobby located behind Caf&eacute; Patteen</li><li>We are located on the 14th floor.</li></ul></p><a class='directions' onclick='handleDirectionsClick(parkingData.hilton)'>DIRECTIONS</a>"
    });
    addMarker("parking_marten", {
        position: parkingData.marten,
        type: "parking",
        zIndex: 0,
        title: "Marten Ramp - 10th Street & Marquette Avenue",
        content: "<p><ul><li>Parking is connected to International Centre, take elevator to Skyway level.</li><li>You will be in the 920 lobby (International Centre II)</li><li>Take a right and walk to elevator lobby</li><li>We are located on the 14th floor.</ul></p><a class='directions' onclick='handleDirectionsClick(parkingData.marten)'>DIRECTIONS</a>"
    });

    addMarker("parking_international", {
        position: parkingData.international,
        zIndex: 0,
        type: "parking",
        title: "International Centre - 9th Street and 2nd Ave",
        content: "<p>Located underneath International Centre<ul><li>Take elevator to Level 2 (Skyway)</li><li>Enter the 920 lobby (International Centre II)</li><li>We are located on the 14th floor.</ul></p><a class='directions' onclick='handleDirectionsClick(parkingData.international)'>DIRECTIONS</a>"
    });

    addMarker("little", {
        position: littleLatLng,
        zIndex: 1000,
        type: "little",
        title: "little",
        content: "<p>920 Second Avenue S.<br /> Suite 1400 (International Centre II) <br />Minneapolis, MN 55402 <br />612-375-0077<p>Elevator Lobby located to the right of Caf&eacute; Patteen, we are on the 14th floor.</p><a class='directions' onclick='handleDirectionsClick(littleLatLng)'>DIRECTIONS</a>"
    });

	if(!isPhone){
    map.controls[google.maps.ControlPosition.TOP_LEFT].push($('#legend')[0]);
	}
	
	
	
	
	

    $("#startInput").keypress(function (e) {
        if (e.which == 13) {
            e.preventDefault()
            calcRoute()
        }
    }).focus(function () {
        if ($(this).val() == "Your Location") {
            $(this).val('');
        }
    }).blur(function () {
        if ($(this).val() == '') {
            $(this).val("Your Location");
        }

    });
}

function addMarker(name, option) {
    marker[name] = new google.maps.Marker({
        position: option.position.latLng,
        icon: icons[option.type].icon,
        shadow: {
            url: icons[option.type].shadow,
            anchor: new google.maps.Point(16, 34)
        },
        map: map,
        title: option.title,
        content: option.content,
        url: option.url
    });

    if (option.nopopup !== true) {
        google.maps.event.addListener(marker[name], 'click', function () {
            //console.log("click"); //DEBUG
			  if(!isPhone){
            var content = '<div class="marker"><h3>' + marker[name].title + '</h3>' + marker[name].content + '</div>';
            infowindow.open(map, marker[name]);
            infowindow.setContent(content);
					  offsetLatLng = new google.maps.LatLng(marker[name].position.lat()+.001, marker[name].position.lng())
			  setTimeout("map.setCenter(offsetLatLng)", 500);
			  }else{
				 $(".direction-block").hide() 
				 $("#directions-"+name).show()
				  // reset existing markers
					 for(var each in marker){
						  if(each!="little"){
					 		 marker[each].setIcon(icons['parking'].icon)
				 			}
					 }
				 if(name!="little"){
					
					 marker[name].setIcon(icons['parking_active'].icon)
				 }
			  }			  $('html, body').animate({ scrollTop: $("#directions-blocks").offset().top}, 200);
	
        });
    }
	$("#directions-blocks").append('<div id="directions-'+name+'" class="direction-block" ><h3>' + marker[name].title + '</h3>' + marker[name].content + '</div>')
	$("#directions-"+name).hide()
	
}


window.onresize = function () {
    if(map !== undefined)
        map.setCenter(littleLatLng.latLng);
};

$('#map-direction').click(function () {
    if (!isHomepage) {
        initializeMaps();
    }
	
	
    $('#Map').removeClass("map-collapsed");
    if(!isPhone){
	google.maps.event.trigger(marker['little'], 'click');
	offsetLatLng = new google.maps.LatLng(marker['little'].position.lat()+.001, marker['little'].position.lng())
	console.log("setting map to little w/offsets")
    setTimeout("map.setCenter(offsetLatLng)", 500);
	}else{
		$("#directions-little").show()
		$('html, body').animate({ scrollTop: $("#directions-blocks").offset().top}, 200);
	}
	

});

$('#parking-options').click(function () {
    if (!isHomepage) {
        initializeMaps();
    }
	  if(!isPhone){
    $('#Map').removeClass("map-collapsed");
    google.maps.event.trigger(marker['parking_marten'], 'click');
	offsetLatLng = new google.maps.LatLng(marker['parking_marten'].position.lat()+.001, marker['parking_marten'].position.lng())
    setTimeout("map.setCenter(offsetLatLng)", 500);
	 }else{
		$("#directions-parking_marten").show()
		 marker['parking_marten'].setIcon(icons['parking_active'].icon)
		 $('html, body').animate({ scrollTop: $("#directions-blocks").offset().top}, 200);
		
	}
});
