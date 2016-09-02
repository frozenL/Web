var usersImagesRef = firebase.storage().ref();
function firebase_add_element(dir, key, data){
        var node = firebase.database().ref().child(dir);
        node.child(key).set(data);
}

function firebase_upload_image(file){
        console.log(usersImagesRef);
        usersImagesRef.child('sisi.jpg').put(file).then(function(snapshot){
                firebase_retrieve_image('sisi.jpg');
        });
}

function firebase_retrieve_image(imgSrc){
        usersImagesRef.child(imgSrc).getDownloadURL().then(function(url){
          $('#div-retrieve').html("<img src='" + url + "' />");
        });
}

