from boggle import Boggle
from flask import Flask, render_template, session, request, jsonify, json
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = "abc123"
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
debug = DebugToolbarExtension(app)
app.debug = True

boggle_game = Boggle()


@app.route('/game')
def set_up_board():
    """Creates and displays the board"""
    session['board'] = boggle_game.make_board() #unsure if I should make a new board each time called
    board = session['board']
    return render_template('board.html', board=board)



@app.route('/guess')
def get_user_guess():
    """Extract user's guess from AJAX request"""
    user_guess = request.args['word']
    is_word = check_guess(user_guess)#why do I need to check this seems like extra step
    print(is_word)
    is_valid = check_if_on_board(user_guess)
    results = {"result": is_valid}
    return jsonify(results)

@app.route('/increment', methods=['POST'])
def increment_game_count():
    """increments the game's played count by 1, returngs the game's played and highscore"""
    data = request.get_json()
    if(session.get('game_count') != True):
        session['game_count'] = 1
    else:
        session['game_count'] += 1

    game_count = session['game_count']
    high_score = check_high_score(data.get('currScore'))
    return {'high_score' : high_score, 'game_count' : int(game_count)}


def check_high_score(last_score):
    """Checks the user's most recent score agains the highest score"""
    if(session.get('high_score') != True):
        session['high_score'] = last_score
    elif(session['high_score'] < last_score):
        session['high_score'] = last_score

    return session['high_score']


def check_guess(user_guess):
    """Checks if the user's guess is an actual word"""
    if (user_guess in boggle_game.words):
        return True
    else:
        return False



def check_if_on_board(user_guess):
    """Check if the user's guess is on the board"""
    board = session['board']
    result = boggle_game.check_valid_word(board, user_guess)
    return result
