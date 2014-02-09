function openConnection() {
    // uses global 'conn' object
    if (conn.readyState === undefined || conn.readyState > 1) {

        conn = new WebSocket('ws://172.17.6.37:8181');

        conn.onopen = function () {
            conn.send("Connection Established Confirmation");
            console.log("Hello!");
        };


        conn.onmessage = function (event) {
            console.log(event.data);
            var data = JSON.parse(event.data);
            if (data.event === 'accelerate') {
                if (window.view === 'earth') {
                    console.log(speeds);
                    if(speeds.strafeVelocity === 0) {
                        initSpeed();
                    } else {
                        changeSpeed(10 * data.multiplier);
                    }
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
                        turnLeft = true;
                        turnRight = false;
                    } else if (data.direction === 'right') {
                        turnLeft = false;
                        turnRight = true;
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