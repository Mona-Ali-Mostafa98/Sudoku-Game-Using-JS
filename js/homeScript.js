// Our Variables
let userNameInput = document.getElementById('user_name');
let playButton = document.querySelector('.select-level .play');
let alertMessage = document.getElementById('alertMessage');

if (userNameInput) {
    // Add an input event listener to the name input
    userNameInput.addEventListener('blur', checkNameValidationFunction);
}

if (playButton) {
    // Add a click event listener to the play button
    playButton.addEventListener('click', function () {
        let selectedLevel = document.querySelector('input[name="level"]:checked').value;

        let userData = {  //object
            userName: userNameInput.value,
            score: 0,
            selectedLevel: selectedLevel
        };

        setUserDataInLocalStorage(userData);

        window.location.href = 'game.html';    // redirect to another page any code after this not execute
    });
}