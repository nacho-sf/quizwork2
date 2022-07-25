// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyCzZ7cOiBFSKZ21yBwNg3mps1764mSJOpo",
    authDomain: "quiz2-f87e2.firebaseapp.com",
    projectId: "quiz2-f87e2",
    storageBucket: "quiz2-f87e2.appspot.com",
    messagingSenderId: "346823333135",
    appId: "1:346823333135:web:0db11aaaca9f09df5e5a7a"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);


//para llamar a la bbdd
const db = firebase.firestore();


// Creación de la colección "users"

const createUser = (user) => {
    db.collection("users")
        .add(user)
        .then((docRef) => console.log("Document written with ID: ", docRef.id))
        .catch((error) => console.error("Error adding document: ", error));
};







// Auth Firebase con mail + pass (Sigh up -> registrarse)

const signUpUser = (email, password) => {
    console.log(email, password);
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Inicio sesión (Sigh in -> iniciar sesión):
            let user = userCredential.user;
            console.log(`se ha registrado ${user.email} ID:${user.uid}`)
            alert(`se ha registrado ${user.email} ID:${user.uid}`)
            // ...

            // Creación del usuario en Firestore a la misma vez que se hace el registro (no sería necesario para el registro en sí)
            createUser({
                id: user.uid,
                email: user.email,
            });

        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log("Error en el sistema: " + errorMessage);
        });
};

//Credenciales creadas para demostración:
//monica@mail.com (123456)
//nacho@mail.com (1234567)




// Uso del DOM para recoger los valores introducidos en los inputs de "mailreg", "passreg" y "passregrep" y guardarlos en sus respectivas variables al pulsar "submit"
document.getElementById("form-reg").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.mailreg.value;
    let pass = event.target.elements.passreg.value;
    let pass2 = event.target.elements.passregrep.value;
    window.location.href = "./pages/home.html";
    // Declaración que obliga a coincidir los campos de "pass" y "pass2"
    pass === pass2 ? signUpUser(email, pass) : alert("error password");

    // Hacer más validaciones...
    let correo =[
        {
          "email": document.getElementById("mailreg").value,
          "Fecha": "",
        }
      ];

      localStorage.setItem("email", JSON.stringify(correo));
})











// Login con mail + pass

const signInUser = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            console.log(`se ha logado ${user.email} ID:${user.uid}`)
            alert(`se ha logado ${user.email} ID:${user.uid}`)
            console.log(user);



        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        });
}

document.getElementById("form-log").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.maillog.value;
    let pass = event.target.elements.passlog.value;
    signInUser(email, pass)
    let correo =[
        {
          "email": document.getElementById("maillog").value,
          "Fecha": "",
        }
      ];
    
      localStorage.setItem("email", JSON.stringify(correo));
      window.location.href = "./pages/home.html";
})









// Unlogin mail + pass

const signOut = () => {
    let user = firebase.auth().currentUser;

    firebase.auth().signOut().then(() => {
        console.log("Sale del sistema: " + user.email)
    }).catch((error) => {
        console.log("hubo un error: " + error);
    });
}

document.getElementById("unlog").addEventListener("click", signOut);










// Listener de usuario en el sistema

document.getElementById("loggedUsers").addEventListener("click", function () {

    // Controlar usuario logado
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log(`Está en el sistema:${user.email} ${user.uid}`);
        } else {
            console.log("no hay usuarios en el sistema");
        }
    });
})