from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!
    def setUp(self):
        """Done before each test"""
        self.client = app.test_client()
    
    def test_homepage(self):
        """Test that homepage loads correctly and the correct information"""
        with self.client:
            resp = self.client.get('/')
            self.assertEqual(resp.status_code, 200)
            self.assertIn(b'<h1>Boggle!</h1>', resp.data)
            self.assertIn('board', session)
            self.assertIsNone(session.get('high_score'))
            self.assertIsNone(session.get('game_count'))
            self.assertIn(b'<div id="timer">', resp.data)


    
    def test_guess(self):
        """Test if word is valid on the board"""
        with self.client as client:
            with client.session_transaction() as sess:
                sess['board'] = [["T", "H", "E", "E", "E"],
                                 ["T", "H", "E", "E", "E"], 
                                 ["T", "H", "E", "E", "E"],
                                 ["T", "H", "E", "E", "E"], 
                                 ["T", "H", "E", "E", "E"]]
        resp = self.client.get('/guess?word=the')
        self.assertEqual(resp.json['result'], 'ok')
    
    def test_invalid_word(self):
        """check if the guess is a real word"""
        with self.client as client:
            self.client.get('/')
            resp = self.client.get('/guess?word=jkhksldhkqnewfojco')
            self.assertEqual(resp.json['result'], 'not-word')
    
    def test_on_board(self):
        """check if a real word is on the board"""
        with self.client as client:
            self.client.get('/')
            resp = self.client.get('/guess?word=supercanonization')
            self.assertEqual(resp.json['result'], 'not-on-board')
