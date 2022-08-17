import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: process.env.APIKEY_FIREBASE,
  authDomain: "alarmbot-867dc.firebaseapp.com",
  databaseURL: process.env.DATABASE_URL_FIREBASE,
  projectId: process.env.PROJECT_ID_FIREBASE,
  storageBucket: process.env.STORAGE_BUCKET_FIREBASE,
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
