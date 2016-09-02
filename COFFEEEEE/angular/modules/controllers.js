var controllers = angular.module('COFFEEEEE.controllers', []);
//status
controllers.controller('StatusController', ['$scope', '$http', '$interval', '$timeout', function($scope, $http, $interval, $timeout){
        var light_sensor_data = {}, temperature;
        function get_light_sensor_data(){
                var light_sensors_data;
                var url = "https://api.mediatek.com/mcs/v2/devices/DgY1TFpC/datachannels/lights/datapoints";
                $http.get(url)
        .success(function(data){
                $timeout(function(){
                        light_sensors_data = data.dataChannels[0].dataPoints[0].values.value.split("*");
                        for(var i = 1; i <= 3; i ++){
                                var light_sensor = "light_sensor_" + i;
                                light_sensor_data[light_sensor] = light_sensors_data[i - 1];
                        }
                        temperature = light_sensors_data[3];
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

var jugNotSet = '-1000', jugLevel0 = '1', jugLevel1 = '15', jugLevel2 = '50', jugLevel3 = '75';
var temperatureThreashold = '20';
function compute_level(){
        var light_sensor_id = [];
        for(var i = 1; i <= 3; i ++){
                var light_sensor_id_i = "light_sensor_" + i;
                light_sensor_id[i] = light_sensor_id_i;
        }
        var len_data = Object.keys(light_sensor_data).length;
        /*
        if(len_data < 3 || temperature == null || parseFloat(temperature) < parseFloat(temperatureThreashold))
                return jugNotSet;
                */
        //have light --> empty
        if(parseInt(light_sensor_data["light_sensor_1"]) > parseInt('400'))
                return jugLevel0;//1
        //10% - 25%: 20%
        if(parseInt(light_sensor_data["light_sensor_2"]) > parseInt('320'))
                return jugLevel1;//15
        //25% - 50%: 40%
//        if(parseInt(light_sensor_data["light_sensor_3"]) > parseInt('190'))
//                return jugLevel2;//50
        return jugLevel3;//75
}

//retrieve light sensors from sandbox
$http.defaults.headers.common['deviceKey'] = "rT0kFk5LqO0oAUmB";
setInterval(function(){
        get_light_sensor_data();
        $timeout(function(){
                $scope.light_sensor_data = light_sensor_data;
                var level = compute_level();
                $scope.coffeeeee_level = level;
                $scope.temperature = temperature;
                if(level != jugNotSet){
                        send_level();
                        firebase_add_element('/', 'coffeeeee_level', level);
                        if(level == jugLevel0){
                                $scope.imageSrc = "/images/jug/level0.png";
                        }
                        if(level == jugLevel1){
                                $scope.imageSrc = "/images/jug/level1.png";
                        }
                        if(level == jugLevel2){
                                $scope.imageSrc = "/images/jug/level2.png";
                        }
                        if(level == jugLevel3){
                                $scope.imageSrc = "/images/jug/level3.png";
                        }
                }
                else{
                  $scope.imageSrc = "/images/jug/jugNotSet.jpg";
                }
        }, 0);
}, 300);
}]);

//leaderboard
controllers.controller('LeaderboardController', ['$scope', '$timeout', function($scope, $timeout){
        // render the image in our view
        function renderImage(file) {

                // generate a new FileReader object
                var reader = new FileReader();

                // inject an image with the src url
                reader.onload = function(event) {
                        the_url = event.target.result;
                        $('#div-show-img').html("<img src='" + the_url + "' />");
                }

                // when the file is read it triggers the onload event above.
                reader.readAsDataURL(file);
        }
        var users = firebase.database().ref().child('users');
        users.once('value', function(snapshot){
                var vals = snapshot.val();
                var users = [];
                for(var p in vals){
                        var values = vals[p];
                        //TODO
                        users.push({"name": p, "score": values.score, "imgSrc": values.picture});
                }
                $timeout(function(){
                        $scope.users = users;
                });
        });
        $('#img-upload').change(function(){
                var file = this.files[0];
                renderImage(file);
                firebase_upload_image(file);
        });
}]);

