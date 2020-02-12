/* eslint-disable no-trailing-spaces */
import uuid from 'uuid';
import firebase from 'react-native-firebase';
import {ToastAndroid} from 'react-native';

class FirebaseService {
  async login(user, success_callback, failed_callback) {
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback);
  }

  onLogout(goback) {
    firebase
      .auth()
      .signOut()
      .then(function() {
        console.log('Sign-out successful.');
        goback('Login');
      })
      .catch(function(error) {
        alert('An error happened when signing out');
      });
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
          console.log(userf.uid);
          const uid = userf.uid;
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
        .ref('image')
        .child('avatar')
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
        .ref()
        .child('user/' + userf.uid)
        .update({avatar: url});
      userf.updateProfile({photoURL: url}).then(
        function() {
          console.log('Updated avatar successfully. url:' + url);
          ToastAndroid.show(
            'Avatar image is saved successfully',
            ToastAndroid.SHORT,
          );
        },
        function(error) {
          console.warn('Error update avatar.');
          ToastAndroid.show(
            'Error update avatar. Error:' + error.message,
            ToastAndroid.SHORT,
          );
        },
        console.log(userf),
      );
    } else {
      console.log("can't update avatar, user is not login.");
      alert('Unable to update avatar. You must login first.');
    }
  }

  userList(setData) {
    firebase
      .database()
      .ref()
      .child('user')
      .once('value', snapshot => {
        setData(
          Object.values(snapshot.val()).filter(v => v.token !== this.uid),
        );
      });
  }

  // ------DI BAWAH INI BUAT CHAT AJA -----
  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  get currentUser() {
    return firebase.auth().currentUser || {};
  }
  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }
  get ref() {
    return firebase.database().ref('messages');
  }

  delete(message, uidreceive) {
    this.ref
      .child(this.uid)
      .child(uidreceive)
      .child(message._id)
      .remove();
    this.ref
      .child(uidreceive)
      .child(this.uid)
      .child(message._id)
      .remove();
  }

  async send(messages, uidreceive) {
    console.log(uidreceive);
    for (let i = 0; i < messages.length; i++) {
      const {text, user} = messages[i];
      const message = {
        text,
        user,
        createdAt: this.timestamp,
      };
      const key = await this.ref
        .child(this.uid)
        .child(uidreceive)
        .push(message).key;
      this.ref
        .child(uidreceive)
        .child(this.uid)
        .child(key)
        .set(message);
    }
  }

  parse(snapshot) {
    const {createdAt, text, user} = snapshot.val();
    const {key: _id} = snapshot;
    // const timestamp = new Date(numberStamp);
    const message = {
      _id,
      createdAt,
      text,
      user,
    };
    return message;
  }

  on(receiveuid, callback) {
    return this.ref
      .child(this.uid)
      .child(receiveuid)
      .limitToLast(20)
      .on('child_added', snapshot => {
        callback(this.parse(snapshot));
      });
  }

  off() {
    this.ref.child(this.uid).off();
  }
}

const firebaseSDK = new FirebaseService();
export default firebaseSDK;
