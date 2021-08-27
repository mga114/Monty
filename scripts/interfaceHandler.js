const decks = ['normal', 'game', 'drunk', 'sexy'];
const colours = ['#ff2cf6', '#732cff', '#4caf50', '#2ce1ff', '#2c5eff', '#009688', '#1ef2c5', '#fb69a7', '#3cf21e', '#3ea6d6'];

/*
Handles all code for the start of the game
Gets active decks and players and initialises game
*/
class InterfaceHandler {
    constructor () {
        this.activeDecks = [];
        this.pointsToWin = parseInt(document.getElementById('points-to-win').value);
        this.players = [];
        this.allCards = [];
        this.resetStorage();
        this.invalid = false;
    }

    //get active decks in play
    getActiveDecks () {
        for (let i = 0; i < decks.length; i++) {
            if (document.getElementById(decks[i]).checked) {
                this.activeDecks.push(decks[i]);
            }
        }
        //if invalid daat
        if (this.activeDecks.length == 0) {
            this.invalid = true;
        }
    }

    //get active players
    getActivePlayers () {
        let elements = document.getElementsByClassName('player-input-field');
        for (let i = 0; i < elements.length; i++) {
            //if invalid data
            if (elements[i].value == ''){
                this.invalid = true;
            } else {
                let p = new Player(elements[i].value, i);
                this.players.push(p);
            }
        }
        this.storePlayers();
    }

    //gets all the active decks and sends each file to be extracted.
    constructCards () {
        for (let i = 0; i < this.activeDecks.length; i++) {
            this.extractCardsFromFile (this.activeDecks[i]);
        }
        return true;
    }

    //extracts the data from each csv file and makes them into cards
    async extractCardsFromFile (file) {
        const response = await fetch ('data/' + file + '-cards.csv');
        const data = await response.text();
        //let aC = JSON.parse(localStorage.getItem('cards'));
        this.allCards = [];
        const lines = data.split('\n').slice(1);
        lines.forEach(line => {
            let c = new CardInfo(line);
            this.allCards.push(c);
        });
        this.storeCards(this.allCards);
    }

    //stores all card details in local storage
    storeCards (c) {
        let oldCards = JSON.parse(localStorage.getItem('cards'));
        let nCards = oldCards.concat(c);
        localStorage.setItem('cards', JSON.stringify(nCards));
    }

    resetStorage () {
        localStorage.setItem('cards', '[]');
    }

    storePlayers () {
        localStorage.setItem('players', JSON.stringify(this.players));
    }

    storePoints () {
        localStorage.setItem('points', JSON.stringify(document.getElementById('points-to-win').value));
    }

    storePlayerNums () {
        localStorage.setItem('numPlayers', JSON.stringify (numPlayers));
    }
}

let numPlayers = 3;

//starts the gane!
function startGame() {
    let ih = new InterfaceHandler();
    ih.getActiveDecks();
    ih.getActivePlayers();
    if (!ih.invalid) {
        if (ih.constructCards()) {
            ih.storePoints();
            ih.storePlayerNums();
            window.location.replace('scene.html');
        }
    }
}


function addPlayer () {
    if (numPlayers < 10) {
        numPlayers++;
        document.getElementById('player-form').innerHTML += '<input type="text" id="name'+ numPlayers.toString() +'" name="name-'+ numPlayers.toString() +' " placeholder="Player '+numPlayers.toString()+'" class="player-input-field player'+numPlayers.toString()+'">';
        document.getElementById("name" + numPlayers.toString()).style.backgroundColor = colours[numPlayers - 1];
    } 
}