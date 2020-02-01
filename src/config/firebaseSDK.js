/* eslint-disable no-trailing-spaces */
import uuid from 'uuid';
import firebase from 'react-native-firebase';

class FirebaseService {
  async login(user, success_callback, failed_callback) {
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback);
  }

  async createAccount(user) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(
        function() {
          console.log(
            'created user successfully. User email:' +
              user.email +
              ' name:' +
              user.name,
          );
          var userf = firebase.auth().currentUser;
          console.log(userf.uid)
          const uid = userf.uid
          firebase
            .database()
            .ref('user')
            .child(uid)
            .set({name: user.name, email: user.email, token: uid});

          userf.updateProfile({displayName: user.name}).then(
            function() {
              console.log(
                'Updated displayName successfully. name:' + user.name,
              );
              alert(
                'User ' +
                  user.name +
                  ' was created successfully. Please login.',
              );
            },
            function(error) {
              console.warn('Error update displayName.');
            },
          );
        },
        function(error) {
          // console.error(
          //   'got error:' + typeof error + ' string:' + error.message,
          // );
          alert('Create account failed. Error: ' + error.message);
        },
      );
  }

  async uploadImage(uri) {
    console.log('got image to upload. uri:' + uri);
    try {
      console.log(`image =  ${uri}`);
      const ref = await firebase
        .storage()
        .ref('image').child('avatar')
        .child(uuid.v4());
      const task = await ref.put(uri);
      console.log('hasil ' + task);
      return task.downloadURL;
    } catch (err) {
      console.log('uploadImage try/catch error: ' + err.message);
    }
  }

  updateAvatar(url) {
    var userf = firebase.auth().currentUser;
    if (userf != null) {
      firebase
        .database()
        .ref().child('user/' + userf.uid)
        .child('avatar').set(url);
      userf.updateProfile({photoURL: url}).then(
        function() {
          console.log('Updated avatar successfully. url:' + url);
          alert('Avatar image is saved successfully.');
        },
        function(error) {
          console.warn('Error update avatar.');
          alert('Error update avatar. Error:' + error.message);
        },
        console.log(userf),
      );
    } else {
      console.log("can't update avatar, user is not login.");
      alert('Unable to update avatar. You must login first.');
    }
  }

  userList(setData){
    const uid = firebase.auth().currentUser.uid;
    firebase.database().ref().child('user').once('value' , snapshot=>{
        setData(Object.values(snapshot.val()).filter(v => v.token !== uid));
    })
  }
}

const firebaseSDK = new FirebaseService();
export default firebaseSDK;
