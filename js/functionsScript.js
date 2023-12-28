// Function to check if the name contains only characters
function isValidName(name) {
    // Using a regular expression to check if the name contains only letters
    return /^[a-zA-Z\s]+$/.test(name) && name.length >= 5;
}

// Function to show alert messages with a delay
function showAlert(alertClass, message) {
    alertMessage.style.display = 'block';
    alertMessage.classList.add(alertClass);
    alertMessage.querySelector('strong').textContent = message;
    setTimeout(function () {
        alertMessage.style.display = 'none';
        alertMessage.querySelector('strong').textContent = ''; // Clear any previous error message
    }, 4000);
}

// Function to show sweet alert messages with a delay
function showSweetAlert(title, message, icon) {
    Swal.fire({
        icon: icon,
        iconHtml: "؟",
        title: title,
        text: message,
        position: 'center',
        // timer: 3000,
        showConfirmButton: true,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",

        iconColor: "#bf74bf",
        confirmButtonColor: "#911489",
        cancelButtonColor: "#c03c3f",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    });
}

// Function used to pass to event listener on name input
const checkNameValidationFunction = function () {
    if (userNameInput && isValidName(userNameInput.value)) {
        playButton.disabled = false;            // Enable the play button if the name is valid
    } else {
        playButton.disabled = true;
        showAlert('danger', 'Please enter a valid name with at least 5 characters.');
    }
}

const setUserDataInLocalStorage = function (userData) {
    // Stringify the object before storing in local storage
    let userDataString = JSON.stringify(userData);
    // Store user data in local storage with a single key
    localStorage.setItem("userData", userDataString);
}

const getUserDataInLocalStorage = function (key) {
    // Retrieve and parse stored data from local storage
    return JSON.parse(localStorage.getItem(key));
}

const showLoggedInUserName = function () {
    let loggedInUserName = document.getElementsByClassName('player-name');
    let storedUserName = getUserDataInLocalStorage('userData').userName;    // Access individual properties

    if (loggedInUserName) {
        loggedInUserName.item(0).textContent = storedUserName;
        showAlert('success', 'Welcome, Let\'s play ' + storedUserName + '!');
    }
}

/*==========================*************************************************===========================*/
const updateGrid = function () {
    let imageGrid = document.getElementById('digits');
    let storedSelectedLevel = getUserDataInLocalStorage('userData').selectedLevel;    // Access individual properties
    var imageBoxes = Array.from(document.querySelectorAll('div .image-box'));

    if (storedSelectedLevel) {
        let newDiv = '<div class=""></div>'
        imageGrid.innerHTML += newDiv.repeat(storedSelectedLevel * storedSelectedLevel);
        imageGrid.style.gridTemplateColumns = `repeat(${storedSelectedLevel}, 1fr)`;
        let gridItems = imageGrid.querySelectorAll('div');
        gridItems.forEach(function (gridItem, index) {
            gridItem.style.display = index < storedSelectedLevel * storedSelectedLevel ? 'flex' : 'none';
        });

        // Use slice to select the desired number of elements
        var elementsToShow = imageBoxes.slice(0, storedSelectedLevel);

        // Show selected elements, hide the rest
        imageBoxes.forEach(function (box) {
            if (elementsToShow.includes(box)) {
                box.style.display = 'inline-block';
            } else {
                box.style.display = 'none';
            }
        });
        console.log(storedSelectedLevel)
    }
}


var timerInterval;                                    // Declare a global variable to store the timer interval
var initialGameTime = 2 * 60 * 1000;        // Set the initial game time (2 minutes in milliseconds)
var elapsedTime = 0;                       // Track the elapsed time
var isGameRunning = false;                // Flag to track whether the game is running
let startButton = document.getElementById('start');
let timerSpan = document.getElementById('timer');

function startOrStopTimer() {
    if (!isGameRunning) {
        // Start the game
        startButton.textContent = 'Stop';
        startButton.disabled = false;

        // Update the timer every second
        timerInterval = setInterval(function () {
            // Calculate minutes and seconds
            var totalMilliseconds = initialGameTime - elapsedTime;
            var minutes = Math.floor(totalMilliseconds / (60 * 1000));
            var seconds = Math.floor((totalMilliseconds % (60 * 1000)) / 1000);

            // Display the time in the timer div
            timerSpan.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            // Increment the elapsed time
            elapsedTime += 1000;

            if (totalMilliseconds < 0) {
                stopGame();
                // Function to show SweetAlert error message
                showSweetAlert('Time is up! Game Over', 'Please enter a valid name with only 5 characters.', 'error');
            }
        }, 1000);

        startGameWithAppendImagesRandom();
    } else {
        // Stop the game
        stopGame();
    }

    // Toggle the game state
    isGameRunning = !isGameRunning;
}

function stopGame() {
    // Stop the timer interval
    clearInterval(timerInterval);

    // Change the button text and disable it temporarily
    startButton.textContent = 'Resume';
    // startButton.disabled = true;
}

// Reset the game when the page is loaded
// window.onload = function () {
//     stopGame();
// };


function startGameWithAppendImagesRandom() {
    let imageGrid = document.getElementById('digits');
    imageGrid.innerHTML = ''; // Clear the existing content
    let imagesNumberInSelectedLevel = getUserDataInLocalStorage('userData').selectedLevel;    // Access individual properties
    const images = ['images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg']

    for (let i = 0; i < imagesNumberInSelectedLevel * imagesNumberInSelectedLevel; i++) {
        let divElement = document.createElement('div');
        divElement.className = ''; // Add your class name if needed
        imageGrid.appendChild(divElement);
    }

    var gameCells = imageGrid.querySelectorAll('div');

    // Shuffle the game cells array
    var shuffledGameCells = Array.from(gameCells).sort(() => Math.random() - 0.5);

    // Append images to the first 'imagesNumberInSelectedLevel' game cells
    for (let i = 0; i < imagesNumberInSelectedLevel; i++) {
        var image = document.createElement('img');
        image.src = images[i];  // Replace with your image URL
        image.alt = 'Image';
        shuffledGameCells[i].appendChild(image);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    // Get the digits container
    var digitsContainer = document.getElementById('digits');
    var selectedDiv = null; // Keep track of the selected div

    // Add a click event listener to the digits container
    digitsContainer.addEventListener('click', function (event) {
        // Check if the clicked element is an empty div
        var clickedDiv = event.target;
        if (clickedDiv.tagName === 'DIV' && !clickedDiv.querySelector('img')) {
            // Set the selected div
            selectedDiv = clickedDiv;
        }
    });

    // Add a keydown event listener to the document
    document.addEventListener('keydown', function (event) {
        let imagesNumberInSelectedLevel = getUserDataInLocalStorage('userData').selectedLevel;    // Access individual properties

        // Check if a div is selected and the pressed key is a number (1-4)
        if (selectedDiv && event.key >= '1' && event.key <= imagesNumberInSelectedLevel) {
            var pressedNumber = parseInt(event.key);

            // Add the image to the selected div
            var image = document.createElement('img');
            image.src = `images/${pressedNumber}.jpg`;
            image.alt = 'Image';
            selectedDiv.appendChild(image);

            // Clear the selection after adding the image
            selectedDiv = null;
        }
    });

    // Add a keydown event listener to navigate with arrow keys
    document.addEventListener('keydown', function (event) {
        var currentDiv = document.activeElement;
        var currentIndex = Array.from(digitsContainer.children).indexOf(currentDiv);

        if (event.key === 'ArrowRight' && currentIndex < digitsContainer.children.length - 1) {
            digitsContainer.children[currentIndex + 1].focus();
        } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
            digitsContainer.children[currentIndex - 1].focus();
        }
    });
});


// Array of image sources
const imageSources = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg'];

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to create a 2D array with images
function createImageArray(imgNumber) {
    if (imgNumber <= 0) {
        console.error("imgNumber must be a positive integer");
        return [];
    }

    const validateImageSources = imageSources.slice(0, imgNumber);
    const totalImages = imgNumber * imgNumber;

    // Duplicate and shuffle the validated image sources to ensure enough unique images
    const duplicatedImages = [...validateImageSources, ...validateImageSources, ...validateImageSources, ...validateImageSources];
    shuffleArray(duplicatedImages);

    // Create a 2D array
    const imageArray = [];
    for (let i = 0; i < imgNumber; i++) {
        let row = [...duplicatedImages];

        // Shuffle the row to ensure a random order
        shuffleArray(row);

        imageArray.push(row);
    }

    return imageArray;
}

// Example usage with imgNumber = 3
const imgNumber = 3;
const resultArray = createImageArray(imgNumber);
console.log(resultArray);
// const imageSources = ['images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg']
// let imagesNumberInSelectedLevel = getUserDataInLocalStorage('userData').selectedLevel;    // Access individual properties
// const validateImageSources = imageSources.slice(0, imagesNumberInSelectedLevel);

