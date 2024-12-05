import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, set, get, remove} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import {getAuth, createUserWithEmailAndPassword,  signInWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyD1mECAeCz0i9KHF8KUUJMrWB6E731BqzU",
  authDomain: "goblin-mode.firebaseapp.com",
  databaseURL: "https://goblin-mode-default-rtdb.firebaseio.com",
  projectId: "goblin-mode",
  storageBucket: "goblin-mode.appspot.com",
  messagingSenderId: "240929045058",
  appId: "1:240929045058:web:f860510ee0b46f9e584bdb",
  measurementId: "G-1WNW33MNYP"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);


// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

//Initialize constants to create a user
const auth = getAuth();
export const user = auth.currentUser;


//Function to create a user account in our database
export async function createUserAuth(email, password) {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      resolve(true);
    })
    .catch((error) => {
      console.error(error);
      reject();
    });
  })    
}
export async function createUserData(userID){
  return new Promise(async (resolve, reject) => {
    set(ref(database,'users/' + userID), {
      email: "butts"
    })
    .then(() => {
      resolve(true);
    })
    .catch((error) => {
      console.error(error);
      reject();
    });

  })  
}

export async function addGroupToUser(userID, groupID,campaignName){
  return new Promise(async (resolve, reject) => {
    /*set(ref(database,'groups/' + groupID + '/members/' + userID), {
      email: userEmail,
    })*/
    
    
    set(ref(database,'users/' + userID + '/groups/' + groupID), {
      campaignname: campaignName,
      inventory: "0",
      spells: "0",
      money: "0"
    })
    .then(() => {
      resolve();
    })
    .catch((error) => {
      console.error(error);
      reject();
    });
  })  
}
export async function addNotesPath(userID, groupID, campaignName){
  return new Promise((resolve, reject) => {
    
    set(ref(database,'users/' + userID + '/groups/' + groupID + "/" + campaignName), {
      notesPath: "0"
    })
    .then(() => {
      console.log("added notespath");
      resolve();
    })
    .catch((error) => {
      console.error(error);
      reject();
    });
  })  
}
export async function updateCharacterSheet(userID, groupID, characterSheet){
  return new Promise(async (resolve, reject) => {
   
    set(ref(database,'users/' + userID + '/groups/' + groupID), {
      characterSheet: characterSheet
    })
    .then(() => {
      console.log("added updated Character Sheet")
      resolve();
    })
    .catch((error) => {
      console.error(error);
      reject();
    });
  })  
}

export async function getCharacterLink(userID, groupID){
  return new Promise((resolve, reject) => {
    
    //get the snapshot of the userID
    get(ref(database,'users/' + userID +"/groups/" + groupID +"/characterSheet"))

    .then((snapshot) => {

      console.log("character sheet url " + snapshot.val());
      resolve(snapshot.val());
    })
    
    .catch((error) => {
      console.log("ERROR");
      console.error(error);
      reject();
    });
  })
}

export async function setDisplayName(userID, displayName){
  return new Promise(async (resolve, reject) => {
    //var displayName = localStorage.getItem("displayName");
    
    set(ref(database,'users/' + userID), {
      displayName: displayName
    })
    .then(() => {
      console.log("added new group to member")
      resolve();
    })
    .catch((error) => {
      console.error(error);
      reject();
    });
  })
}

export async function getListOfGroups(){
  return new Promise((resolve, reject) => {

    var uid = localStorage.getItem("currentUid");
    //get the snapshot of the userID

    //initialize empty array for groups to be placed in
    var groupsArray = [0,0,0,0,0,0];
    var counter = 0;
    
    get(ref(database, 'users/' + uid + '/groups'))
    .then((snapshot) => {
      snapshot.forEach((data) => {
        const dataKey = data.key;
        groupsArray[counter] = dataKey;
        counter++;
        console.log("group: " + dataKey);
        
      });
      console.log("resolving");
      resolve(groupsArray);
    },{
      onlyOnce: true
    }).catch((error) => {
      console.log("ERROR");
      console.error(error);
      reject();
    });
  })
}

export async function removeGroupFromUser(gid){
  return new Promise((resolve, reject) => {
    
    var uid = localStorage.getItem('currentUid');
    remove(ref(database,'users/' + uid + '/groups/' + gid))

    .then(() => {

      console.log("Supposedly removed group" + gid + "from user " + uid);
      resolve();
    })
    
    .catch((error) => {
      console.log("ERROR");
      console.error(error);
      reject();
    });
  })
}
export async function removeUserFromGroup(gid){
  return new Promise((resolve, reject) => {
    
    var uid = localStorage.getItem('currentUid');
    remove(ref(database,'groups/' + gid + '/members/' + uid))

    .then(async () => {

      console.log("Supposedly removed user" + uid + "from group " + gid);
      //check if the group is now empty
      var groupIsEmpty = await checkIfGroupEmpty(gid);
      if(groupIsEmpty){
        //remove whole group from firebase
        await removeGroup(gid);

      }
      resolve();
    })
    
    .catch((error) => {
      console.log("ERROR");
      console.error(error);
      reject();
    });
  })
}

export async function checkIfGroupEmpty(gid){
  return new Promise((resolve, reject) => {
    
    //get the snapshot of the groups
    get(ref(database,'groups/' + gid +"/members"))

    .then((snapshot) => {

      if(snapshot.val() == null){
        console.log("checking if group is empty, snapshot is " + snapshot.val());
        resolve(true);
      }
      else{
        resolve(false);
      }
    })
    
    .catch((error) => {
      console.log("ERROR");
      console.error(error);
      reject();
    });
  })
}

async function removeGroup(gid){
  return new Promise((resolve, reject) => {
    
  
    remove(ref(database,'groups/' + gid))

    .then(async () => {

      console.log("Supposedly removed group " + gid);
      var curGroupCount = await getLastGroupID();
      await setLastGroupID(curGroupCount - 1);

      resolve();
    })
    
    .catch((error) => {
      console.log("ERROR");
      console.error(error);
      reject();
    });
  })
}

export async function getCampaignName(groupID){
  return new Promise((resolve, reject) => {
    
    //get the snapshot of the userID
    get(ref(database,'groups/' + groupID +"/campaignname"))

    .then((snapshot) => {

      console.log("campaign name " + snapshot.val());
      resolve(snapshot.val());
    })
    
    .catch((error) => {
      console.log("ERROR");
      console.error(error);
      reject();
    });
  })
}

onAuthStateChanged(auth, (user) => {
  if (user) {
   
    console.log("uid : " + user.uid);
    console.log("email : " + user.email);
    localStorage.setItem('currentEmail', user.email);
    localStorage.setItem('currentUid', user.uid);
            
    
  } else {
    console.log("no uid");
  }
});
//Function to log in a user
export async function tryLogIn(userID, password){
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, userID, password)
    .then(() => {
      resolve(true);
    })
    .catch((error) => {
      console.error(error);
      reject();
    });
  })
}

//Function to create a group in our database
export async function createNewGroup(campaignName){
  return new Promise(async (resolve, reject) => {
    //get unique id for group
    console.log("prev groupID "+ getLastGroupID());
    var groupID = await getLastGroupID() + 1;
    
    
    console.log("updated group ID " + groupID);
    await setLastGroupID(groupID);

    //add group to database
    set(ref(database,'groups/' + groupID), {
      campaignname: campaignName,
      members: null
    })
    .then(() => {
      resolve();
    })
    .catch((error) => {
      console.error(error);
      reject();
    });

  })  
}


export async function getLastGroupID(){
  return new Promise((resolve, reject) => {
    
    //get the snapshot of the userID
    get(ref(database,'groups/0/count'))

    .then((snapshot) => {

      console.log("num groups " + snapshot.val());
      resolve(snapshot.val());
    })
    
    .catch((error) => {
      console.log("ERROR");
      console.error(error);
      reject();
    });
  })
}
async function setLastGroupID(newNum){
  return new Promise((resolve, reject) => {
    set(ref(database,'groups/0'), {
        count: newNum
    })
    .then(() => {
      resolve();
    })
    
    .catch((error) => {
      console.error(error);
      reject();
    });
  })
}
//Function to add a user to a group
export async function addUserGroup(userID, groupID, userEmail){
  return new Promise(async (resolve, reject) => {
    console.log("group ID " + groupID);
    //add group to database
    console.log("trying to add: " + userID);
    

    set(ref(database,'groups/' + groupID + '/members/' + userID), {
      email: userEmail,
    })
    .then(() => {
      console.log("added new group member to database successfully")
      resolve();
    })
    .catch((error) => {
      console.error(error);
      reject();
    });


})  
}

export async function logUserOut(){
  return new Promise((resolve, reject) => {
    signOut(auth)
    .then(() => {
      resolve(true);
    })
    .catch((error) => {
      console.error(error);
      reject();
    });
  })
}

