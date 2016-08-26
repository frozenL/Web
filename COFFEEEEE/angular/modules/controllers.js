var controllers = angular.module('COFFEEEEE.controllers', []);
//status
controllers.controller('StatusController', ['$scope', '$http', '$interval', '$timeout', function($scope, $http, $interval, $timeout){
        var light_sensor_data = {};
        function get_light_sensor_data(light_sensor_id){
                        var url = "https://api.mediatek.com/mcs/v2/devices/DgY1TFpC/datachannels/" + light_sensor_id + "/datapoints";
                        $http.get(url)
        .success(function(data){
                $timeout(function(){
                        light_sensor_data[light_sensor_id] = {'name': light_sensor_id, 'value': data.dataChannels[0].dataPoints[0].values.value};
                });
        })
.error(function(data){
});
}

//status -- send_level 
function send_level(){
        var data = {
                datapoints:
        [{dataChnId: "coffee_level", values: {value: $scope.coffeeeee_level}}]
        };
        $http.defaults.headers.common['deviceKey'] = "rT0kFk5LqO0oAUmB";
        $http.post("https://api.mediatek.com/mcs/v2/devices/DgY1TFpC/datapoints", data)
                .success(function(data){
                        // your content ...
                })
        .error(function(data){
                // your content ...
        });
}

//status--video stream
function get_video_stream(video_stream_id, width, height){
        var url = "http://stream-mcs.mediatek.com/DgY1TFpC/rT0kFk5LqO0oAUmB/" + video_stream_id + "/" + width + "/" + height;
        $timeout(function(){
                $scope.video_link = url;
        }, 0);
}

//get_video_stream('video', 320, 240);
//$scope.img_src = "images/jug/full.png";

function compute_level(){
        var light_sensor_id = [];
        for(var i = 1; i <= 4; i ++){
                var light_sensor_id_i = "light_sensor_" + i;
                light_sensor_id[i] = light_sensor_id_i;
        }
        var len_data = Object.keys(light_sensor_data).length;
        if(len_data < 4)
                return '-1';
        //less than 10%: 5%
        if(light_sensor_data["light_sensor_1"] > '600')
                return '10';
        //10% - 25%: 20%
        if(light_sensor_data["light_sensor_2"] > '600')
                return '20';
        //25% - 50%: 40%
        if(light_sensor_data["light_sensor_3"] > '600')
                return '40';
        //50% up:  75%
        if(light_sensor_data["light_sensor_4"] > '600')
                return '75';
}

//retrieve light sensors from sandbox
$http.defaults.headers.common['deviceKey'] = "rT0kFk5LqO0oAUmB";
setInterval(function(){
        for(var i = 1; i <= 4; i ++){
                var light_sensor_id = "light_sensor_" + i;
                get_light_sensor_data(light_sensor_id);
        }
        $timeout(function(){
                $scope.light_sensor_data = light_sensor_data;
                var level = compute_level();
                $scope.coffeeeee_level = compute_level();
                if($scope.coffeeeee_level != '-1'){
                        send_level();
                        firebase_add_element('/', 'coffeeeee_level', level);
                }
        }, 0);
}, 300);
}]);

//leaderboard
controllers.controller('LeaderboardController', ['$scope', '$timeout', function($scope, $timeout){
        var users = firebase.database().ref().child('users');
        firebase_add_element('users', 'aaa', "bbb");
        users.once('value', function(snapshot){
                var vals = snapshot.val();
                var users = [];
                console.log(vals);
                for(var p in vals){
                        console.log(vals[p]);
                        users.push(vals[p]);
                }
                $timeout(function(){
                        $scope.users = users;
                        console.log($scope.users);
                });
        });
        /*
           users.child('cd').once('value', 
           function(snapshot){
           if(snapshot.val() == null){
           console.log("empty");
           }
           else{
           console.log(snapshot.val());
           }
           });
           */
}]);

