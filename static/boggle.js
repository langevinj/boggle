let $guess = $('#guess')
let $response = $('#response')
let $score = $('#score')
let $timer = $('#timer')
let currScore = 0;
// const TIME = 60;

//Event handler for a user submitting a guess
$('#guess').on("submit", async function(e){
    e.preventDefault();
    let userGuess = $('#userGuess').val();
    let res = await axios.get(`/guess?word=${userGuess}`)
    let result = res.data.result
    appendResponse(result);
    scoreWord(userGuess, result);
    appendCurrScore();
    // timer();
});

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

// function timer(){
//     count = TIME;
//     while (count > 0){
//         $timer.append(`<h3>Time: ${count}</h3>`)
//         count--;
//         setTimeout(function(){
//             $timer.empty();
//             console.log(count);
//         }, 1000);
//     }
// }