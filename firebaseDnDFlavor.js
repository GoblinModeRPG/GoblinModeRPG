import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, set, get, remove} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getCampaignName} from "./firebaseManager.js";

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

export async function addToSpells(userID, groupID, spellID, spellName, castTime, range, components, duration, description, prepared){
  return new Promise(async (resolve, reject) => {

    
    set(ref(database,'users/' + userID + '/groups/' + groupID + '/spells/' + spellID), {

      castTime: castTime,
      components: components,
      description: description,
      duration: duration,
      prepared: prepared,
      range: range,
      spellName: spellName
    })
    .then(() => {
      //console.log("added new spell item ")
      resolve();
    })
    .catch((error) => {
      console.error(error);
      reject();
    });
  })  
}

export async function deleteSpellDB(userID, groupID, spellID){
  return new Promise((resolve, reject) => {
    
    remove(ref(database,'users/' + userID + '/groups/' + groupID +"/spells/" + spellID))

    .then(() => {

      //console.log("Supposedly removed spell" + spellID + "from user " + userID);
      resolve();
    })
    
    .catch((error) => {
      console.log("ERROR");
      console.error(error);
      reject();
    });
  })
}
export async function getSpells(userID, groupID){
  return new Promise((resolve, reject) => {
    const LEN = 40;
    const spells = new Array(LEN).fill(0);
    var counter = 0;
    
    
    get(ref(database, 'users/' + userID + '/groups/' + groupID + '/spells'))
    .then((snapshot) => {
      snapshot.forEach( data => {
        var dataKey = data.key;
        spells[counter] = dataKey;
        
        //console.log(" l83 spell id " + dataKey);
        //console.log(" l84 spells[counter] is " + spells[counter].title);
        counter++;
        
      });
      resolve(spells);
    },
    ).catch((error) => {
      console.log("ERROR");
      console.error(error);
      reject();
    });
  })
}

export async function getSpellInfo(userID, groupID, id){
  return new Promise((resolve, reject) => {
    const LEN = 7;
    const info = new Array(LEN).fill(0);
    var counter = 0;
    //console.log("spell info called on id " + id);
    get(ref(database, 'users/' + userID + '/groups/' + groupID + '/spells/' + id))
    .then((snapshot) => {
      snapshot.forEach((data) => {
        //console.log("data key is " + data.key + " and data value is " + data.val());
        const dataVal = data.val();
        info[counter] = dataVal;
        //console.log("l109 data val: " + info[counter]);
        counter++;
        
      });
      //console.log("info 5 is " + info[5] + "and id is " + id);
      resolve({ "id": id,"castTime": info[0], "components": info[1], "description": info[2], "duration": info[3], "prepared": info[4], "range": info[5], "title": info[6]});
    })
    
    .catch((error) => {
      console.log("ERROR");
      console.error(error);
      reject();
    });
  })
}
export async function updatePrep(userID, groupID, id, prep){
  return new Promise(async (resolve, reject) => {    
    set(ref(database,'users/' + userID + '/groups/' + groupID + '/spells/' + id), {
      prepared:prep
    })
    .then(() => {
      console.log("updated prepared")
      resolve();
    })
    .catch((error) => {
      console.error(error);
      reject();
    });
  }) 
}

export async function addToInventory(userID, groupID, id, name, quantity){
  return new Promise(async (resolve, reject) => {

    
    set(ref(database,'users/' + userID + '/groups/' + groupID + '/inventory/' + id), {

      name: name,
      quantity: quantity
    })
    .then(() => {
      console.log("added new inventory item ")
      resolve();
    })
    .catch((error) => {
      console.error(error);
      reject();
    });
  }) 
}

export async function deleteInvDB(userID, groupID, id){
  return new Promise((resolve, reject) => {
    
    remove(ref(database,'users/' + userID + '/groups/' + groupID +"/inventory/" + id))

    .then(() => {

      console.log("Supposedly removed inv" + id + "from user " + userID);
      resolve();
    })
    
    .catch((error) => {
      console.log("ERROR");
      console.error(error);
      reject();
    });
  })
}
export async function getInventory(userID, groupID){
  return new Promise((resolve, reject) => {
    const LEN = 40;
    const inventory = new Array(LEN).fill(0);
    var counter = 0;
    
    
    get(ref(database, 'users/' + userID + '/groups/' + groupID + '/inventory'))
    .then((snapshot) => {
      snapshot.forEach( data => {
        var dataKey = data.key;
        inventory[counter] = dataKey;
        
        console.log(" l180 inventory id " + dataKey);
        console.log(" l181 inventory[counter] is " + inventory[counter].title);
        counter++;
        
      });
      console.log("resolving");
      resolve(inventory);
    },
    ).catch((error) => {
      console.log("ERROR");
      console.error(error);
      reject();
    });
  })
}
export async function getInvInfo(userID, groupID, id){
  return new Promise((resolve, reject) => {
    const LEN = 2;
    const info = new Array(LEN).fill(0);
    var counter = 0;
    console.log("inv info called on id " + id);
    get(ref(database, 'users/' + userID + '/groups/' + groupID + '/inventory/' + id))
    .then((snapshot) => {
      snapshot.forEach((data) => {
        console.log("data key is " + data.key + " and data value is " + data.val());
        const dataVal = data.val();
        info[counter] = dataVal;
        console.log("l161 data val: " + info[counter]);
        counter++;
        
      });
      console.log("info 0 is " + info[0] + "and id is " + id);
      resolve({ "id": id,"name": info[0], "quantity": info[1]});
    })
    
    .catch((error) => {
      console.log("ERROR");
      console.error(error);
      reject();
    });
  })
}

  
  export async function setNotesPath(userID, groupID, notesPath){
    var cpname = await getCampaignName(groupID);
    return new Promise(async (resolve, reject) => {

      set(ref(database,'users/' + userID + '/groups/' + groupID + "/" + cpname), {
        notesPath: notesPath
      })
      .then(() => {
        console.log("added notes path")
        resolve();
      })
      .catch((error) => {
        console.error(error);
        reject();
      });
    })  
  }

  export async function getNotesPath(userID, groupID){
    var cpname = await getCampaignName(groupID);
    return new Promise((resolve, reject) => {
    
      //get the snapshot of the userID
      get(ref(database,'users/' + userID +"/groups/" + groupID +"/" + cpname + "/notesPath"))
  
      .then((snapshot) => {
        console.log("notesPath " + snapshot.val());
        resolve(snapshot.val());
      })
      
      .catch((error) => {
        console.log("ERROR");
        console.error(error);
        reject();
      });
    })
  }

  export async function setMoney(userID,groupID,gold,silver,copper){
    return new Promise(async (resolve, reject) => {
      
      set(ref(database,'users/' + userID + '/groups/' + groupID + '/money'), {
        1: gold,
        2: silver,
        3: copper
      })
      .then(() => {
        console.log("added new inventory item ")
        resolve();
      })
      .catch((error) => {
        console.error(error);
        reject();
      });
    })  
  }

  export async function getMoney(userID,groupID){
    return new Promise((resolve, reject) => {
      const LEN = 3;
      const money = new Array(LEN).fill(0);
      var counter = 0;
      get(ref(database, 'users/' + userID + '/groups/' + groupID + '/money'))
      .then((snapshot) => {
        snapshot.forEach((data) => {
          const dataKey = data.val();
          money[counter] = dataKey;
          counter++;
          console.log("money " + dataKey);
          
        });
        console.log("resolving");
        resolve(money);
      },{
        onlyOnce: true
      }).catch((error) => {
        console.log("ERROR");
        console.error(error);
        reject();
      });
    })
  }