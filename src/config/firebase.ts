import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Initialize Google Sign In
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID', // Get this from your Google Cloud Console
});

export {
  auth,
  database,
  GoogleSignin
};
