import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {getStorage, ref, getDownloadURL,uploadBytes } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";

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

//initialize storage or whatever
const storage = getStorage(app);

//Function to download? character file to firebase

export async function downloadFile(url){
   
  return new Promise(async (resolve, reject) => {
    
    // Create a reference to 'images/mountains.jpg'
    const gsReference = ref(storage, url);

    getDownloadURL(ref(storage, gsReference))
  .then((httpsReference) => {
    console.log("httpsReference  " + httpsReference);
    
    // This can be downloaded directly:
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      const blob = xhr.response;
    };
    xhr.open('GET', httpsReference);
    
    console.log("xhr " + xhr);

    resolve(httpsReference);
    
  })
  .catch((error) => {
    reject(error);
  });
  })
}
async function createFile(path, name, type) {
  let response = await fetch(path);
  let data = await response.blob();
  let metadata = {
      type: type
  };
  return new File([data], name, metadata);
}
export async function uploadFileBlob(file, path){
  const storage = getStorage();
  const storageRef = ref(storage, path);

  // 'file' comes from the Blob or File API
  uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
}

//Function to upload character file to Storage
export async function uploadFile(url, name){
  return new Promise(async (resolve, reject) => {
    const storageRef = ref(storage, url);
    var file = await createFile(url, name, 'text/plain');
    await uploadBytes(storageRef, file).then((snapshot) => {
      resolve(true);
    })
    .catch((error) => {
      console.error(error);
      reject();
    });
  }) 
  
}

