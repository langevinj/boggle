let $guess = $('#guess')
let $response = $('#response')
let $score = $('#score')
let $timer = $('#timer')
let currScore = 0;
let count = 60;
let timeLeft = true;
let guessedWords = [];


//Event handler for a user submitting a guess
$('#guess').on("submit", async function(e){
    e.preventDefault();
    if (timeLeft === true){
        let userGuess = $('#userGuess').val();
        let has_guessed = alreadyGuessed(userGuess);
        if(!has_guessed){
        let res = await axios.get(`/guess?word=${userGuess}`)
        let result = res.data.result
        appendResponse(result);
        scoreWord(userGuess, result);
        appendCurrScore();
        }
    }
    $('#userGuess').val("");
});

//checks if a word was already guessed this game
function alreadyGuessed(word){
    if(guessedWords.includes(word)){
        return true
    }
    guessedWords.push(word);
    return false
}

//Appends result of a guess on the front-end
function appendResponse(result){
    let response;
    if (result === "ok"){
        response = "That word is valid and exists on the board!"
    } else if (result === "not-on-board"){
        response = "That is a real word, but is not on the board"
    } else {
        response = "Your guess is not a real word"
    }
    clearResponses()
    $('#response').append(`<p>${response}</p>`)
}

//Clears all previous font-end guess responses
function clearResponses(){
    $response.empty()
}

//Add the score of a user's guessed word to the current score
function scoreWord(word, result){
    if(result === "ok"){
        currScore += word.length
    }
}

//Updates the current score displayed to the user
function appendCurrScore(){
    $score.empty()
    $score.append(`<h3>Current Score: ${currScore}</h3>`)
}

timer = setInterval(function() {
    $timer.empty();
    $timer.append(`<h3>Time: ${count--}</h3>`);
    if(count == 0){
        $timer.empty();
        $timer.append(`<h3>Time's up!</h3>`);
        clearInterval(timer);
        timeLeft = false;
        guessedWords = [];
        endOfGameData();
    } 
}, 1000)

//incremenet the games played count by 1 and check the high schore when a game finishes, want to hacksafe this route
async function endOfGameData(){
    let finalScore;
    currScore === 0 ? finalScore = 0 : finalScore = currScore;
    let res = await axios.post('/increment', {"currScore" : `${finalScore}`})
    displayHistory(res)
}

//uses AJAX response to display the highscore and game count
function displayHistory(res){
    $('#gameHistory').empty()
    $('#gameHistory').append(`<h3>High Score: ${res.data.high_score}, Games Played: ${res.data.game_count}</h3>`)
}