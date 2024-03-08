/* === Imports === */
import { initializeApp } from "firebase/app"
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from "firebase/auth";

/* === Firebase Setup === */
const firebaseConfig = {
    apiKey: "AIzaSyCasOJtV22hm9xLayOLobTWU-mxCu-foQs",
    authDomain: "mood-65b0c.firebaseapp.com",
    projectId: "mood-65b0c",
    storageBucket: "mood-65b0c.appspot.com"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* === UI === */

/* == UI - Elements == */

const viewLoggedOut = document.getElementById("logged-out-view")
const viewLoggedIn = document.getElementById("logged-in-view")

const signInWithGoogleButtonEl = document.getElementById("sign-in-with-google-btn")

const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")

const signInButtonEl = document.getElementById("sign-in-btn")
const createAccountButtonEl = document.getElementById("create-account-btn")

const signOutButtonEl = document.getElementById("sign-out-btn")

const userProfilePictureEl = document.getElementById("user-profile-picture")
const userGreetingEl = document.getElementById("user-greeting")

const displayNameInputEl = document.getElementById("display-name-input")
const photoURLInputEl = document.getElementById("photo-url-input")
const updateProfileButtonEl = document.getElementById("update-profile-btn")

/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

signOutButtonEl.addEventListener("click", authSignOut)

// updateProfileButtonEl.addEventListener("click", authUpdateProfile)

/* === Main Code === */

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        
        showLoggedInView()
        showProfilePicture(userProfilePictureEl, user)
        showUserGreeting(userGreetingEl, user)

    } else {
        // User is signed out
        showLoggedOutView()
    }
});

/* === Functions === */

/* = Functions - Firebase - Authentication = */

function authSignInWithGoogle() {
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        console.log("Signed in with Google")
        // console.log(credential)
        // console.log(user)
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(errorMessage)
    });
}

function authSignInWithEmail() {
    const email = emailInputEl.value
    const password = passwordInputEl.value

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            clearAuthFields()
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage)
        });

}

function authCreateAccountWithEmail() {
    const email = emailInputEl.value
    const password = passwordInputEl.value

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            clearAuthFields()
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(error.message)

            // ..
        });
    
}

function authSignOut() {
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("user sign-out successful")
    }).catch((error) => {
        // An error happened.
        console.error(error.message)
    });
}

// function authUpdateProfile() {
//     const newDisplayName = displayNameInputEl.value
//     const newPhotoUrl = photoURLInputEl.value

//     updateProfile(auth.currentUser, {
//         displayName: newDisplayName,
//         photoURL: newPhotoUrl
//     }).then(() => {
//         console.log('Profile updated!')
//     }).catch((error) => {
//         // An error occurred
//         console.error(error.message)
//     });
// }

/* == Functions - UI Functions == */

function showLoggedOutView() {
    hideView(viewLoggedIn)
    showView(viewLoggedOut)
}

function showLoggedInView() {
    hideView(viewLoggedOut)
    showView(viewLoggedIn)
}

function showView(view) {
    view.style.display = "flex"
}

function hideView(view) {
    view.style.display = "none"
}

function clearInputField(field) {
    field.value = ''
}

function clearAuthFields() {
    clearInputField(emailInputEl)
    clearInputField(passwordInputEl)
}

async function showProfilePicture(imgElement, user) {
    const photoURL = await user.photoURL;
    if (photoURL) {
        imgElement.src = user.photoURL
        imgElement.alt = "Profile pictue"
    } else {
        imgElement.src = "assets/images/default-profile-picture2.png"
        imgElement.alt = "default user icon by Bombasticon Studio"
    }
}

function showUserGreeting(element, user) {
    const displayName = user.displayName;

    if (displayName) {
        const userFirstName = displayName.split(' ')[0]
        userGreetingEl.textContent = `Hey ${userFirstName}, how are you?`
    } else {
        userGreetingEl.textContent = "Hey friend, how are you?"
    }
}