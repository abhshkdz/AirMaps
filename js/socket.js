function openConnection() {
    // uses global 'conn' object
    if (conn.readyState === undefined || conn.readyState > 1) {

        conn = new WebSocket('ws://172.17.6.95:8181');

        conn.onopen = function () {
            conn.send("Connection Established Confirmation");
            console.log("Hello!");
        };


        conn.onmessage = function (event) {
            var data = JSON.parse(event.data);
            if (data.event === 'accelerate') {
                if (window.view === 'earth') {
                    changeSpeed(data.multiplier);
                }
            }
            else if (data.event === 'decelerate') {
                if (window.view === 'earth') {
                    changeSpeed(data.multiplier);
                }
            }
            else if (data.event === 'turn') {
                if (window.view === 'earth') {
                    if (data.direction === 'left') {
                        turnLeft = false;
                    } else if (data.direction === 'right') {
                        turnRight = false;
                    }
                } else {
                    if (data.direction === 'left') {
                        window.imgheading = fixangle(window.imgheading - 3); 
                        window.streetimg.src = 'http://maps.googleapis.com/maps/api/streetview?size=400x400&location=' + window.lat + ',' + window.lng + '-73.988354&fov=90&heading=' + window.imgheading + '&pitch=10&sensor=false';
                    } else if (data.direction === 'right') {
                        window.imgheading = fixangle(window.imgheading + 3);
                        window.streetimg.src = 'http://maps.googleapis.com/maps/api/streetview?size=400x400&location=' + window.lat + ',' + window.lng + '-73.988354&fov=90&heading=' + window.imgheading + '&pitch=10&sensor=false';
                    }
                }
            }
            else if (data.event === 'altitude') {
                if (window.view === 'earth') {
                    if (data.direction === 'up') {
                        altitudeUp = false;
                    } else if (data.direction === 'down') {
                        altitudeDown = false;
                    }
                }
            }
            else if (data.event === 'location') {
                if (window.view === 'earth') {
                    window.adr = data.location;
                    reset();
                }
            }
            else if (data.event === 'switch') {
                window.location.href ='streetview.php?lat=' + window.lat + '&lng=' + window.lng;
            }
        };

        conn.onerror = function (event) {
            alert("Web Socket Error");
        };


        conn.onclose = function (event) {
            alert("Web Socket Closed");



        };
    }
}