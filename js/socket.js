function openConnection() {
    // uses global 'conn' object
    if (conn.readyState === undefined || conn.readyState > 1) {

        conn = new WebSocket('ws://172.17.6.68:8181');

        conn.onopen = function () {
            conn.send("Connection Established Confirmation");
            console.log("Hello!");
        };


        conn.onmessage = function (event) {
            console.log(event.data);
            var data = JSON.parse(event.data);
            if (data.event === 'accelerate') {
                turnLeft = false;
                turnRight = false;
                                        altitudeUp = false;
                        altitudeDown = false;
                if (window.view === 'earth') {
                    if(window.speeds.strafeVelocity === 0) {
                        initSpeed();
                    } else {
                        changeSpeed(10 * data.multiplier);
                    }
                    if(window.speeds.forwardVelocity > 500) {
                        window.speeds.forwardVelocity = 500.0;
                    }
                }
            }
            else if (data.event === 'decelerate') {
                turnLeft = false;
                turnRight = false;
                                        altitudeUp = false;
                        altitudeDown = false;
                if (window.view === 'earth') {
                    changeSpeed(data.multiplier);
                }
                if (window.speeds.forwardVelocity < 15) {
                    initSpeed();
                }
            }
            else if (data.event === 'turn') {
                altitudeUp = false;
                altitudeDown = false;
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
                turnLeft = false;
                turnRight = false;
                if (window.view === 'earth') {
                    if (data.direction === 'up') {
                        altitudeUp = true;
                        altitudeDown = false;
                    } else if (data.direction === 'down') {
                        altitudeUp = false;
                        altitudeDown = true;
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