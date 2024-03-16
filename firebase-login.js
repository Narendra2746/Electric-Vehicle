'use strict';

import{ initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import{ getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyDh4_Exq9tFZOhGDVevQAlw_oe1hvfqPg0",
    authDomain: "electric-vehicles-417323.firebaseapp.com",
    projectId: "electric-vehicles-417323",
    storageBucket: "electric-vehicles-417323.appspot.com",
    messagingSenderId: "473849747734",
    appId: "1:473849747734:web:96a77551eed695b2991837"
};

window.addEventListener("load", function() {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    updateUI(document.cookie);
    console.log("hello world load");
    document.getElementById("sign-up").addEventListener('click', function() {
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            user.getIdToken().then((token) => {
                document.cookie = "token=" + token + ";path=/; SameSite=Strict";
                window.location = "/";
            });
        })
        .catch((error) => {
            console.log(error.code + error.message)
        })
    });
    document.getElementById("login").addEventListener('click', function() {
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) =>{
            const user = userCredential.user;
            console.log("logged in");
            user.getIdToken().then((token)=>{
                document.cookie = "token" + token + ";path=/;Samesite=Strict";
                window.location="/";
            });
        })
        .catch((error) => {
            console.log(error.code + error.message);
        })
    });
    document.getElementById("sign-out").addEventListener('click', function(){
        signOut(auth0)
        .then((output)=>{
            document.cookie = "token=;path=/;SameSite=Strict";
            window.location = "./";
        })
    });
});
function updateUI(cookie){
    var token = parseCookieToken(cookie);
    if(token.lenth > 0) {
        document.getElementById("login-box").hidden = true;
        document.getElementById("sign-out").hidden = false;
    } else {
        document.getElementById("login-box").hidden = false;
        document.getElementById("sign-out").hidden = true;
    }
};
function parseCookieToken(cookie) {
    var strings = cookie.split(';');
    for(let i=0; i < strings.length; i++) {
        var temp = strings[i].split('=');
        if(temp[0]=="token")
           return temp[1];
    }
    return "";
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to parse token from cookie
function parseCookieToken(cookie) {
    var strings = cookie.split(';');
    for(let i=0; i < strings.length; i++) {
        var temp = strings[i].split('=');
        if(temp[0]=="token")
           return temp[1];
    }
    return "";
}

// Function to update UI based on authentication status
function updateUI(cookie) {
    var token = parseCookieToken(cookie);
    const loginBox = document.getElementById("login-box");
    const signOutBtn = document.getElementById("sign-out");

    // Hide/show login box and sign-out button based on token
    if (token.length > 0) {
        loginBox.hidden = true;
        signOutBtn.hidden = false;
    } else {
        loginBox.hidden = false;
        signOutBtn.hidden = true;
    }
}

// Function to parse token from cookie
function parseCookieToken(cookie) {
    var strings = cookie.split(';');
    for(let i=0; i < strings.length; i++) {
        var temp = strings[i].split('=');
        if(temp[0]=="token")
           return temp[1];
    }
    return "";
}
// Function to add an Electric Vehicle (EV)
const addEV = async (name, manufacturer, year, batterySize, WLTPRange, cost, power) => {
    try {
        // Add EV document to the 'electric_vehicles' collection
        await db.collection('electric_vehicles').add({
            name: name,
            manufacturer: manufacturer,
            year: year,
            batterySize: batterySize,
            WLTPRange: WLTPRange,
            cost: cost,
            power: power
        });
        console.log('EV added successfully');
        alert('EV added successfully'); // Show success message
    } catch (error) {
        console.error('Error adding EV: ', error);
        alert('Error adding EV'); // Show error message
    }
};

// Event listener for EV form submission
document.getElementById('addEvForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission

    // Get values from form fields
    const name = document.getElementById('name').value;
    const manufacturer = document.getElementById('manufacturer').value;
    const year = parseInt(document.getElementById('year').value);
    const batterySize = parseFloat(document.getElementById('batterySize').value);
    const WLTPRange = parseFloat(document.getElementById('WLTPRange').value);
    const cost = parseFloat(document.getElementById('cost').value);
    const power = parseFloat(document.getElementById('power').value);

    // Call addEV function with form values
    addEV(name, manufacturer, year, batterySize, WLTPRange, cost, power);
});

// Function to construct and execute the query based on user input
const queryEVs = async (attribute, value) => {
    try {
        let query = db.collection('electric_vehicles');

        // Check if value is empty (return all EVs) or range (for numeric attributes)
        if (value !== '') {
            if (!isNaN(value)) { // Check if value is numeric
                // Split range into upper and lower limits
                const [min, max] = value.split('-').map(Number);
                // Construct query for numeric attributes within the specified range
                query = query.where(attribute, '>=', min).where(attribute, '<=', max);
            } else {
                // Construct query for string attribute matching the value
                query = query.where(attribute, '==', value);
            }
        }

        // Execute the query
        const querySnapshot = await query.get();
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = ''; // Clear previous results

        // Display results as hyperlinks
        querySnapshot.forEach((doc) => {
            const evData = doc.data();
            const evLink = document.createElement('a');
            evLink.href = `ev-details.html?id=${doc.id}`; // Link to details page
            evLink.textContent = evData.name;
            resultsDiv.appendChild(evLink);
            resultsDiv.appendChild(document.createElement('br'));
        });
    } catch (error) {
        console.error('Error querying EVs: ', error);
    }
};

// Event listener for query form submission
document.getElementById('queryForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission
    // Get attribute and value from form fields
    const attribute = document.getElementById('attribute').value;
    const value = document.getElementById('value').value.trim(); // Trim leading/trailing whitespace
    // Call queryEVs function with attribute and value
    queryEVs(attribute, value);
});

// Function to get EV details from Firestore based on ID
const getEVDetails = async (evId) => {
    try {
        const doc = await db.collection('electric_vehicles').doc(evId).get();
        if (doc.exists) {
            return doc.data();
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error getting EV details: ', error);
        return null;
    }
};

// Function to display EV details on the page
const displayEVDetails = (evData, elementId) => {
    // Display EV details in the specified element
};

// Retrieve EV ID from query parameters
const urlParams = new URLSearchParams(window.location.search);
const evId = urlParams.get('id');

// Get and display EV details
if (evId) {
    getEVDetails(evId)
        .then(evData => {
            if (evData) {
                displayEVDetails(evData, 'evDetails');
            } else {
                // Handle error
            }
        })
        .catch(error => {
            console.error('Error getting EV details: ', error);
            // Handle error
        });
}

// Add event listener for edit button
document.getElementById('editBtn').addEventListener('click', () => {
    // Redirect to edit page with EV ID as query parameter
    window.location.href = `edit-ev.html?id=${evId}`;
});

// Add event listener for delete button
document.getElementById('deleteBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this EV?')) {
        // Delete EV document from Firestore
        db.collection('electric_vehicles').doc(evId).delete()
            .then(() => {
                console.log('EV deleted successfully');
                // Redirect to home page or another appropriate page
            })
            .catch(error => {
                console.error('Error deleting EV: ', error);
                // Handle error
            });
    }
});

// Function to get EV details from Firestore based on ID
getEVDetails = async (evId) => {
    try {
        const doc = await db.collection('electric_vehicles').doc(evId).get();
        if (doc.exists) {
            return doc.data();
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error getting EV details: ', error);
        return null;
    }
};

// Function to update EV details in Firestore
const updateEVDetails = async (evId, newData) => {
    try {
        await db.collection('electric_vehicles').doc(evId).update(newData);
        console.log('EV details updated successfully');
        // Redirect to EV details page
        window.location.href = `ev-details.html?id=${evId}`;
    } catch (error) {
        console.error('Error updating EV details: ', error);
        // Handle error
    }
};

// Retrieve EV ID from query parameters
urlParams = new URLSearchParams(window.location.search);
evId = urlParams.get('id');

// Get and display EV details in the form
if (evId) {
    getEVDetails(evId)
        .then(evData => {
            if (evData) {
                // Populate form fields with existing EV details
            } else {
                // Handle error
            }
        })
        .catch(error => {
            console.error('Error getting EV details: ', error);
            // Handle error
        });
}

// Add event listener for save button
document.getElementById('saveBtn').addEventListener('click', () => {
    // Get updated EV details from form fields
    const updatedData = {
        // Retrieve form field values
    };
    // Update EV details in Firestore
    updateEVDetails(evId, updatedData);
});

// Function to populate select options with EV data
const populateSelectOptions = async () => {
    try {
        const evsSnapshot = await db.collection('electric_vehicles').get();
        const ev1Select = document.getElementById('ev1');
        const ev2Select = document.getElementById('ev2');

        evsSnapshot.forEach(doc => {
            const evData = doc.data();
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = `${evData.name} (${evData.manufacturer})`;
            ev1Select.appendChild(option.cloneNode(true));
            ev2Select.appendChild(option); // Append same option to EV 2 dropdown
        });
    } catch (error) {
        console.error('Error populating select options: ', error);
    }
};

// Populate select options when the page loads
populateSelectOptions();

// Event listener for form submission
document.getElementById('compareEvForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission

    // Get selected EV IDs
    const ev1Id = document.getElementById('ev1').value;
    const ev2Id = document.getElementById('ev2').value;

    // Redirect to comparison results page with selected EV IDs as query parameters
    window.location.href = `comparison-results.html?ev1=${ev1Id}&ev2=${ev2Id}`;
});

// Function to get EV details from Firestore based on ID
getEVDetails = async (evId) => {
    try {
        const doc = await db.collection('electric_vehicles').doc(evId).get();
        if (doc.exists) {
            return doc.data();
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error getting EV details: ', error);
        return null;
    }
};

// Function to display EV details with highlighting
displayEVDetails = (evData, elementId) => {
    const detailsDiv = document.getElementById(elementId);
    detailsDiv.innerHTML = ''; // Clear previous details

    // Create HTML elements to display EV details
    for (const attribute in evData) {
        if (evData.hasOwnProperty(attribute) && attribute !== 'name') {
            const value = evData[attribute];
            const paragraph = document.createElement('p');
            if (attribute === 'cost') {
                paragraph.textContent = `${attribute}: ${value}`;
                paragraph.className = 'highlight-red'; // Highlight lowest cost in red
            } else {
                paragraph.textContent = `${attribute}: ${value}`;
                paragraph.className = 'highlight-green'; // Highlight highest attribute in green
            }
            detailsDiv.appendChild(paragraph);
        }
    }

    // Create a hyperlink for EV name to the information page
    const nameLink = document.createElement('a');
    nameLink.href = `ev-details.html?id=${evData.id}`;
    nameLink.textContent = evData.name;
    detailsDiv.appendChild(nameLink);
};

// Retrieve EV IDs from query parameters
urlParams = new URLSearchParams(window.location.search);
const ev1Id = urlParams.get('ev1');
const ev2Id = urlParams.get('ev2');

// Get and display EV details for EV 1
getEVDetails(ev1Id)
    .then(evData => {
        if (evData) {
            displayEVDetails(evData, 'ev1Details');
        } else {
            console.error('EV 1 details not found');
        }
    })
    .catch(error => {
        console.error('Error getting EV 1 details: ', error);
    });

// Get and display EV details for EV 2
getEVDetails(ev2Id)
    .then(evData => {
        if (evData) {
            displayEVDetails(evData, 'ev2Details');
        } else {
            console.error('EV 2 details not found');
        }
    })
    .catch(error => {
        console.error('Error getting EV 2 details: ', error);
    });

// Function to submit a review
const submitReview = async (evId, review, rating) => {
    try {
        // Add review to the 'reviews' subcollection of the EV document
        await addDoc(collection(db, `electric_vehicles/${evId}/reviews`), {
            review: review,
            rating: rating,
            timestamp: serverTimestamp() // Add server timestamp for sorting
        });
        console.log('Review submitted successfully');
        alert('Review submitted successfully');
        // Refresh the page to display the new review
        location.reload();
    } catch (error) {
        console.error('Error submitting review: ', error);
        alert('Error submitting review');
    }
};

// Event listener for review form submission
document.getElementById('reviewForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission

    // Get review and rating from form fields
    const review = document.getElementById('review').value;
    const rating = parseInt(document.getElementById('rating').value);

    // Retrieve EV ID from query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const evId = urlParams.get('id');

    // Call submitReview function with review, rating, and EV ID
    submitReview(evId, review, rating);
});

// Function to display reviews
const displayReviews = async (evId) => {
    try {
        // Get reviews for the specified EV
        const querySnapshot = await getDocs(collection(db, `electric_vehicles/${evId}/reviews`));
        const reviewsDiv = document.getElementById('reviews');
        reviewsDiv.innerHTML = ''; // Clear previous reviews

        // Display reviews
        querySnapshot.forEach(doc => {
            const reviewData = doc.data();
            const reviewParagraph = document.createElement('p');
            reviewParagraph.textContent = `Rating: ${reviewData.rating}, Review: ${reviewData.review}`;
            reviewsDiv.appendChild(reviewParagraph);
        });
    } catch (error) {
        console.error('Error displaying reviews: ', error);
    }
};

// Retrieve EV ID from query parameters
urlParams = new URLSearchParams(window.location.search);
const evIdForReviews = urlParams.get('id');

// Display reviews for the EV
displayReviews(evIdForReviews);
