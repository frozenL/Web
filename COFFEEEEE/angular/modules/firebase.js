function firebase_add_element(dir, key, data){
        var node = firebase.database().ref().child(dir);
        node.child(key).set(data);
}
