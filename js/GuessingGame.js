var Game = function() {
    this.playersGuess = null;
    this.winningNumber = generateWinningNumber();
    this.pastGuesses = [];
}

function generateWinningNumber() {
    return Math.ceil(Math.random() * 100);
}


function newGame() {
    return new Game(); //check that old game !== new game
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess) {
    if (typeof guess !== 'number' || guess < 1 || guess > 100) {
        throw "That is an invalid guess.";
    }
    this.playersGuess = guess;
    return this.checkGuess();
}

Game.prototype.checkGuess = function() {


    var diff = this.difference();
    if (this.playersGuess === this.winningNumber) {
        $('#hint, #submit, #player-input').prop("disabled", true);
        $('#subtitle').text('Press the reset button to play again');
        return 'You Win!';
    } else {
        if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
            $('#subtitle').text('You have guessed that number. Try again.')
            return 'You have already guessed that number.';
        } else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child(' +
                this.pastGuesses.length + ')').text(this.playersGuess);

            if (this.pastGuesses.length === 5) {
                $('#hint, #submit, #player-input').prop("disabled", true);
                $('#subtitle').text('Press the reset button to play again');
                return 'You Lose.';
            } else {
                var sub

                if (this.isLower()) {
                    sub = 'Try guessing Higher.';
                } else {
                    sub = 'Try guessing Lower.';
                }
                $('#subtitle').text(sub + ' (' +
                    (5 - this.pastGuesses.length) + ' Guesses remaining)');
                if (diff < 10) return 'You\'re burning up!';
                else if (diff < 25) return 'You\'re lukewarm.';
                else if (diff < 50) return 'You\'re a bit chilly.';
                else return 'You\'re ice cold!';
            }
        }
    }


}


Game.prototype.provideHint = function() {
    var hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(hintArray);
}

function shuffle(arr) { //Fisher-Yates - https://bost.ocks.org/mike/shuffle/
    for (var i = arr.length - 1; i > 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[randomIndex];
        arr[randomIndex] = temp;
    }
    return arr;
}

$(document).ready(function() {
    var game = new Game,
        originalTitle = $('#title').html(),
        originalSubtitle = $('#subtitle').html();



    $('#player-input').on('keypress', function(event) {
        let submitEvent = () => {
            let guess = +$('#player-input').val(),
                result = game.playersGuessSubmission(guess);
            $('#player-input').val(null);

            $('#title').text(result);
            return result; //prevent defaulting and bubbling;

        }
        if (event.which == 13) {
            submitEvent(event);
        };
        $('#submit').on('click', function() {
            submitEvent(event);
        });


    });
    $('#reset').on('click', reset);
    $('#hint').on('click', function() {
        let numberlist = game.provideHint();
        $('#title').text('One of these three numbers: ' +
            numberlist.join(', '));
    });

    function reset() {
        $('#title').html(originalTitle);
        $('#subtitle').html(originalSubtitle);
        $('#hint, #submit, #player-input').prop("disabled", false)

        $('li').text('-');
        game = new Game;
    }


}); //ready wrapper