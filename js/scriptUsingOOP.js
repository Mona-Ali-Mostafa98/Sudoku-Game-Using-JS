class SudokuGame {
    constructor() {
        this.timerInterval = null;
        this.initialGameTime = 2 * 60 * 1000;
        this.elapsedTime = 0;
        this.isGameRunning = false;
        this.userNameInput = document.getElementById('user_name');
        this.playButton = document.querySelector('.select-level .play');
        this.alertMessage = document.getElementById('alertMessage');
        this.startButton = document.getElementById('start');
        this.timerSpan = document.getElementById('timer');
        this.digitsContainer = document.getElementById('digits');
        this.selectedDiv = null;

        this.init();
    }

    init() {
        this.addEventListeners();
        this.showLoggedInUserName();
        this.updateGrid();
        this.digitsContainer.style.display = 'inline-grid';
    }

    addEventListeners() {
        if (this.userNameInput) {
            this.userNameInput.addEventListener('blur', () => this.checkNameValidation());
        }

        if (this.playButton) {
            this.playButton.addEventListener('click', () => this.startGame());
        }

        this.digitsContainer.addEventListener('click', (event) => this.handleDigitContainerClick(event));
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    }

    checkNameValidation() {
        if (this.userNameInput && this.isValidName(this.userNameInput.value)) {
            this.playButton.disabled = false;
        } else {
            this.playButton.disabled = true;
            this.showAlert('danger', 'Please enter a valid name with at least 5 characters.');
        }
    }

    isValidName(name) {
        return /^[a-zA-Z\s]+$/.test(name) && name.length >= 5;
    }

    showAlert(alertClass, message) {
        this.alertMessage.style.display = 'block';
        this.alertMessage.classList.add(alertClass);
        this.alertMessage.querySelector('strong').textContent = message;
        setTimeout(() => {
            this.alertMessage.style.display = 'none';
            this.alertMessage.querySelector('strong').textContent = '';
        }, 4000);
    }

    showSweetAlert(title, message, icon) {
        Swal.fire({
            icon: icon,
            iconHtml: "؟",
            title: title,
            text: message,
            position: 'center',
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

    showLoggedInUserName() {
        let loggedInUserName = document.getElementsByClassName('player-name');
        let storedUserName = this.getUserDataInLocalStorage('userData').userName;

        if (loggedInUserName) {
            loggedInUserName.item(0).textContent = storedUserName;
            this.showAlert('success', 'Welcome, Let\'s play ' + storedUserName + '!');
        }
    }

    updateGrid() {
        let storedSelectedLevel = this.getUserDataInLocalStorage('userData').selectedLevel;
        var imageBoxes = Array.from(document.querySelectorAll('div .image-box'));

        if (storedSelectedLevel) {
            let newDiv = '<div class=""></div>'
            this.digitsContainer.innerHTML += newDiv.repeat(storedSelectedLevel * storedSelectedLevel);
            this.digitsContainer.style.gridTemplateColumns = `repeat(${storedSelectedLevel}, 1fr)`;
            let gridItems = this.digitsContainer.querySelectorAll('div');
            gridItems.forEach((gridItem, index) => {
                gridItem.style.display = index < storedSelectedLevel * storedSelectedLevel ? 'flex' : 'none';
            });

            var elementsToShow = imageBoxes.slice(0, storedSelectedLevel);

            imageBoxes.forEach((box) => {
                if (elementsToShow.includes(box)) {
                    box.style.display = 'inline-block';
                } else {
                    box.style.display = 'none';
                }
            });
        }
    }

    startGame() {
        if (!this.isGameRunning) {
            this.startButton.textContent = 'Stop';
            this.startButton.disabled = false;

            this.timerInterval = setInterval(() => {
                this.calculateTime();
            }, 1000);

            this.startGameWithAppendImagesRandom();
        } else {
            this.stopGame();
        }

        this.isGameRunning = !this.isGameRunning;
    }

    stopGame() {
        clearInterval(this.timerInterval);
        this.startButton.textContent = 'Resume';
    }

    calculateTime() {
        var totalMilliseconds = this.initialGameTime - this.elapsedTime;
        var minutes = Math.floor(totalMilliseconds / (60 * 1000));
        var seconds = Math.floor((totalMilliseconds % (60 * 1000)) / 1000);

        this.timerSpan.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        this.elapsedTime += 1000;

        if (totalMilliseconds < 0) {
            this.stopGame();
            this.showSweetAlert('Time is up! Game Over', 'Play again or leave game', 'error');
        }
    }

    startGameWithAppendImagesRandom() {
        let imageGrid = document.getElementById('digits');
        imageGrid.innerHTML = '';
        let imagesNumberInSelectedLevel = this.getUserDataInLocalStorage('userData').selectedLevel;
        const images = ['images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg'];

        for (let i = 0; i < imagesNumberInSelectedLevel * imagesNumberInSelectedLevel; i++) {
            let divElement = document.createElement('div');
            divElement.className = '';
            imageGrid.appendChild(divElement);
        }

        var gameCells = imageGrid.querySelectorAll('div');
        var shuffledGameCells = Array.from(gameCells).sort(() => Math.random() - 0.5);

        for (let i = 0; i < imagesNumberInSelectedLevel; i++) {
            var image = document.createElement('img');
            image.src = images[i];
            image.alt = 'Image';
            shuffledGameCells[i].appendChild(image);
        }
    }

    handleDigitContainerClick(event) {
        var clickedDiv = event.target;
        if (clickedDiv.tagName === 'DIV' && !clickedDiv.querySelector('img')) {
            this.selectedDiv = clickedDiv;
        }
    }

    handleKeyDown(event) {
        let imagesNumberInSelectedLevel = this.getUserDataInLocalStorage('userData').selectedLevel;

        if (this.selectedDiv && event.key >= '1' && event.key <= imagesNumberInSelectedLevel) {
            var pressedNumber = parseInt(event.key);

            var image = document.createElement('img');
            image.src = `images/${pressedNumber}.jpg`;
            image.alt = 'Image';
            this.selectedDiv.appendChild(image);

            this.selectedDiv = null;
        }
    }

    getUserDataInLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }
}

// Instantiate the SudokuGame class
const sudokuGame = new SudokuGame();
