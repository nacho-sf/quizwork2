//Obtenemos la Fecha y la hora, y la guardamos en un JSON para meterlas en localStorage.
let date = new Date();
let formatDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()+" ("+date.getHours() + "h:" + date.getMinutes()+"m)";

let localSdata = JSON.parse(localStorage.getItem("user"));



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





// Pantalla inicial

document.getElementById("form-log").style.display = "none";
document.getElementById("form-reg").style.display = "none";
document.getElementById("loggedUsers").style.display = "none";
document.getElementById("unlog").style.display = "none";
document.getElementById("startQuiz").style.display = "none";
document.getElementById("chartScore").style.display = "none";


document.getElementById("dropdown-log").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("form-log").style.display = "flex";
    document.getElementById("form-reg").style.display = "none";
})


document.getElementById("dropdown-reg").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("form-log").style.display = "none";
    document.getElementById("form-reg").style.display = "flex";
})

document.getElementById("figure-index").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("form-log").style.display = "none";
    document.getElementById("form-reg").style.display = "none";
})






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

            document.getElementById("dropdown-reg").style.display = "none";
            document.getElementById("form-reg").style.display = "none";
            document.getElementById("dropdown-log").style.display = "none";
            document.getElementById("form-log").style.display = "none";
            document.getElementById("bar").style.display = "none";
            wellcomeContent.innerHTML = `<h3>Sesión iniciada: ${user.email}</h3>`
            document.getElementById("loggedUsers").style.display = "none";
            document.getElementById("unlog").style.display = "flex";
            document.getElementById("startQuiz").style.display = "flex";
            document.getElementById("chartScore").style.display = "none";
            

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
    // Declaración que obliga a coincidir los campos de "pass" y "pass2"
    pass === pass2 ? signUpUser(email, pass) : alert("error password");

    // Hacer más validaciones...
    let user =[
        {
          "email": document.getElementById("mailreg").value,
          "fechalog": formatDate,
        }
      ];

      localStorage.setItem("user", JSON.stringify(user));
})


document.getElementById("startQuiz").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "./pages/quiz.html";
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

            document.getElementById("dropdown-reg").style.display = "none";
            document.getElementById("form-reg").style.display = "none";
            document.getElementById("dropdown-log").style.display = "none";
            document.getElementById("form-log").style.display = "none";
            document.getElementById("bar").style.display = "none";
            wellcomeContent.innerHTML = `<h3>Sesión iniciada: ${user.email}</h3>`
            document.getElementById("loggedUsers").style.display = "none";
            document.getElementById("unlog").style.display = "flex";
            document.getElementById("startQuiz").style.display = "flex";
            document.getElementById("chartScore").style.display = "flex";

// Gráfica de puntuaciones

            let puntuaciones = [];
            let fechas = [];
            async function getDataFire() {
                await db.collection("score")
                    .where("email", "==", localSdata[0].email)
                    .limit(5)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            puntuaciones.push(doc.data().puntuacion);
                            fechas.push(doc.data().fechascore);
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });
            }
            getDataFire().then(() => {
                createChart (puntuaciones, fechas)
            });

            function createChart (puntuaciones, fechas) {
                new Chartist.Bar(
                    ".ct-chart",
                    {
                        labels: fechas,
                        series: [puntuaciones],
                    },
                    {
                        seriesBarDistance: 10,
                        low: 0,
                        high: 10,
                    }
                );
            }

            document.getElementById("chartScore").style.display="block";



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
    let user =[
        {
          "email": document.getElementById("maillog").value,
          "fechalog": formatDate,
        }
      ];
    
      localStorage.setItem("user", JSON.stringify(user));
      
})



document.getElementById("startQuiz").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "./pages/quiz.html";
})





// Unlogin mail + pass

const signOut = () => {
    let user = firebase.auth().currentUser;

    firebase.auth().signOut().then(() => {
        console.log("Sale del sistema: " + user.email)

        document.getElementById("dropdown-reg").style.display = "flex";
        document.getElementById("dropdown-reg").style.justifyContent = "center";
        document.getElementById("form-reg").style.display = "none";
        document.getElementById("dropdown-log").style.display = "flex";
        document.getElementById("dropdown-log").style.justifyContent = "center";
        document.getElementById("form-log").style.display = "none";
        document.getElementById("bar").style.display = "flex";
        wellcomeContent.innerHTML = ``
        document.getElementById("loggedUsers").style.display = "none";
        document.getElementById("unlog").style.display = "none";
        document.getElementById("startQuiz").style.display = "none";

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


