document.addEventListener('DOMContentLoaded', () => {
    createSquares();
    getNewWord();

    let guessedWords = [[]]
    let availableSpace = 1;
    let word;
    let guessedWordCount = 0;


    function getNewWord() {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
                'X-RapidAPI-Key': '02af0f4156mshe18eabcaa4adbdap1d17d0jsnb6ee2882aee6'
            }
        };
        
        fetch(`https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`, options)
            .then(response => {
                return response.json();
            })
            .then((response) => {
                word = response.word;
            })
            .catch(err => {
                console.error(err)
            });
    }

    function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr()
        const removedLetter = currentWordArr.pop() 

        guessedWords[guessedWords.length - 1] = currentWordArr

        const lastLetterEl = document.getElementById(String(availableSpace - 1))

        lastLetterEl.textContent = ''
        availableSpace = availableSpace - 1;
    }


    const keys = document.querySelectorAll('.keyboard-row button')
    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute('data-key')

            if (letter === 'enter') {
                handleSubmitWord()
                return;
            }

            if (letter === 'del') {
                handleDeleteLetter()
                return;
            }
            updateGuessedWord(letter);
        }
        
    }


    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length
        return guessedWords[numberOfGuessedWords - 1]
    }

    function updateGuessedWord(letter) { 
        const currentWordArr = getCurrentWordArr()
        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter) 

            const availableSpaceEl = document.getElementById(String(availableSpace))
            availableSpace = availableSpace + 1;

            availableSpaceEl.textContent = letter;
        }
    }

    function createSquares() {
        const gameBoard = document.getElementById('board');

        for (let index = 0; index < 30; index++) {
            let square = document.createElement('div');
            square.classList.add('square');
            square.classList.add('animate__animated');
            square.setAttribute('id', index + 1);
            gameBoard.appendChild(square);           
        }
    }

    function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter)

        if (!isCorrectLetter) {
            return "rgb(58, 58, 60)";
        }

        const letterInCorrectPosition = word.charAt(index)
        const isCorrectPosition = letter === letterInCorrectPosition;

        if (isCorrectPosition) {
            return "rgb(83, 141, 78)";
        }

        return "rgb(181, 159, 59)";
    } 

    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr()
        if (currentWordArr.length !== 5) {
            window.alert("Word must be 5 letters ")
        }

        const currentWord  = currentWordArr.join('')

        fetch(`https://wordsapiv1.p.rapidapi.com/words/${currentWord}`,
            {
                method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
                'X-RapidAPI-Key': '02af0f4156mshe18eabcaa4adbdap1d17d0jsnb6ee2882aee6'
            }
            }
        ).then((response) => {
            if (!response.ok) {
                throw Error()
            }
            const firstLetterId = guessedWordCount * 5 + 1;
            const interval = 200;
            currentWordArr.forEach((letter, index) => {
                setTimeout(() => {
                    const tileColor = getTileColor(letter, index)
                    const letterId = firstLetterId + index;
                    const letterEl = document.getElementById(letterId);
                    letterEl.classList.add("animate__flipInX");
                    letterEl.style = `background-color:${tileColor}; border-color:${tileColor};`
                }, interval * index);
            });
    
            guessedWordCount += 1;
    
            if (currentWord === word) {
                window.alert('Congratulations');
            }
    
            if (guessedWords.length === 6) {
                window.alert(`You have run out of guesses! The word is ${word}!`)
            }
    
            guessedWords.push([])

        }).catch(() => {
            window.alert("Word is not in the list!");
        })
    }
})