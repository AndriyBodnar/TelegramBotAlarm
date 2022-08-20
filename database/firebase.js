import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: `AIzaSyAEdUwDddKv0x5uoaCpesSenZfhPM_vVVA`,
  authDomain: "alarmbot-867dc.firebaseapp.com",
  databaseURL: `https://alarmbot-867dc-default-rtdb.europe-west1.firebasedatabase.app`,
  projectId: `alarmbot-867dc`,
  storageBucket: `alarmbot-867dc.appspot.com`,
  messagingSenderId: "904490606735",
  appId: "1:904490606735:web:e34e9219e2b0f54c3bd0fa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

// useEffect(() => {
//   listAll(imagesListRef).then((response) => {
//     response.items.forEach((item) => {
//       getDownloadURL(item).then((url) => {
//         setImageUrls((prev) => [...prev, url]);
//       });
//     });
//   });
// }, []);
