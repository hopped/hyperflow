var request = require('request'); // http client


var EmergLevel = {
    NONE: "none",
    HIGHTENED: "hightened",
    SEVERE: "severe"
};

var ThreatLevel = {
    NONE: "none",
    HIGHTENED: "hightened",
    SEVERE: "severe"
};

// Step 1: periodically reads the Levee state from DAP.
// The main parameter of interest is `emergencyLevel':
// - If 'none', no action taken
// - If 'hightened', triggers computation of the current threat level
// - If 'severe', triggers appropriate actions
function getLeveeState(ins, outs, config, cb) {
    // var leveeURI = config.leveeUri;  // URI could be passed through config
    // TODO: invoke DAP's REST API to retrieve levee state

    request(
        {
            "timeout": 1000,
            "url": config.url
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                var emergencyLevel = EmergLevel[result.emergencyLevel.toUpperCase()];
                var threatLevel = EmergLevel[result.emergencyLevel.toUpperCase()];

                //TODO; check for emergencyLevel == undefined, if so fail
                console.log("emergencyLevel=" + emergencyLevel);

                if (emergencyLevel == EmergLevel.HIGHTENED && threatLevel == ThreatLevel.NONE) {
                    console.log("Setting hightened emergency level");
                    outs[0].condition = "true"; // emit "ELHightened" signal
                    outs[0].data = [
                        { }
                    ];
                }

                if (emergencyLevel == EmergLevel.SEVERE) {
                    console.log("Setting severe emergency level");
                    outs[1].condition = "true"; // emit "ELSevere" signal
                    outs[1].data = [
                        { }
                    ];
                }

                cb(null, outs);
            } else {
                cb("Error reading response!", outs);
            }
        });
}

// Step 2a: run estimation of the threat level (here will be the Map/Reduce jobs!)
function computeThreatLevel(ins, outs, config, cb) {
    var threatLevel;

    var rand = Math.random(); 
    if (rand > 0.95) {
        threatLevel = ThreatLevel.SEVERE; 
    } else if (rand > 0.7) {
        threatLevel = ThreatLevel.HIGHTENED;
    } else {
        threatLevel = ThreatLevel.NONE;
    }

    request.post(
        {
            "timeout": 1000,
            "url": config.url,
            "form": {"threatLevel": threatLevel}
        },
        function(error, response, body) {
            if(!error && response.statusCode == 201) {
                parsedResponse = JSON.parse(body);
                if (parsedResponse.result == "ok") {
                    cb(null, outs);
                } else {
                    cb("Invalid response!", outs);
                }
            } else {
                cb("Error reading response!", outs);
            }
        }
    );
}

// Step 2b: perform actions in the severe emergency level
function severeEmergencyActions(ins, outs, config, cb) {
    console.log("Severe Emergency Actions!");
    cb(null, outs);
}

exports.getLeveeState = getLeveeState;
exports.computeThreatLevel = computeThreatLevel;
exports.severeEmergencyActions = severeEmergencyActions;
