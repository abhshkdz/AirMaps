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
                changeSpeed(data.multiplier);
            }
            else if (data.event === 'decelerate') {
                changeSpeed(data.multiplier);
            }
            else if (data.event === 'turn') {
                if (data.direction === 'left') {
                    turnLeft = false;
                } else if (data.direction === 'right') {
                    turnRight = false;
                }
            }
            else if (data.event === 'altitude') {
                if (data.direction === 'up') {
                    altitudeUp = false;
                } else if (data.direction === 'down') {
                    altitudeDown = false;
                }
            }
            else if (data.event === 'location') {
                window.adr = data.location;
                reset();
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