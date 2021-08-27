class Controller {
    constructor () {
        this.activeCards = null;
        this.currentCard = null;
        this.currentPlayer = null;
        this.getCards();
        this.pointsToWin = parseInt(JSON.parse(localStorage.getItem('points')));
        localStorage.setItem('last-player', '[]');
        this.players = JSON.parse(localStorage.getItem('players'));
        if (document.URL.includes('scene.html')) {
            this.displayNewCard();
        }
    }


    nextCard () {
        this.hideComponents();
        let next = this.pickNextCard();
        this.currentCard = this.activeCards[next];
        this.activeCards.splice(next, 1);
        if (this.currentCard.numPlayers != 0) {
            this.addPlayers();
        }
        if (this.currentCard.points != 0) {
            document.getElementById('action-text').innerText = this.currentCard.points.toString() + " Points";
            document.getElementById('drink-text').innerText = "Drink: " + this.currentCard.points.toString() + " times ("+this.currentCard.drinks.toString() + " Points)";
            this.showComponents();
        }
        document.getElementById('text').innerText = this.currentCard.text;
    }


    pickNextCard () {
        const max = this.activeCards.length;
        return Math.floor (Math.random() * max);
    }


    hideComponents () {
        document.getElementById('action').style.visibility = "hidden";
        document.getElementById('drink').style.visibility = "hidden";
    }

    showComponents () {
        document.getElementById('action').style.visibility = "visible";
        document.getElementById('drink').style.visibility = "visible";
    }

    storeNewData () {
        localStorage.setItem('cards', JSON.stringify(this.activeCards));
    }

    getNextPlayer (num) {
        let r = Math.floor (Math.random() * num);
        let pPlayer = JSON.parse(localStorage.getItem('last-player'));
        let found = true;
        for (let i = 0; i < pPlayer.length; i++) {
            if (pPlayer[i].name == this.players[r].name) {
                found = false;
            }
        }

        while (!found) {
            r = Math.floor (Math.random() * num);
            for (let i = 0; i < pPlayer.length; i++) {
                if (pPlayer[i].name == this.players[r].name) {
                    found = false;
                    break;
                } else {
                    found = true;
                }
            }
        }
        return r;
    }

    addPlayers () {
        let randPlayer = this.getNextPlayer(this.players.length);
        /*
        let pPlayer = JSON.parse(localStorage.getItem('last-player'));
        while (randPlayer == this.players.indexOf(pPlayer)) {
            randPlayer = this.getNextPlayer(this.players.length);
        }*/
        if (this.currentCard.numPoints != 0) {
            this.updatePreviousPlayers(randPlayer);
        }
        this.currentPlayer = this.players[randPlayer];
        this.players.splice(this.players.indexOf(this.currentPlayer), 1);
        this.setPlayerText (this.currentPlayer, this.players);
    }

    updatePreviousPlayers (currPlayerNum) {
        let lp = JSON.parse(localStorage.getItem('last-player'));
        if (lp.length >= nPlayers - 1) {
            lp.splice(lp.length - 1, 1);
        }
        lp.splice(0, 0, this.players[currPlayerNum]);
        localStorage.setItem('last-player', JSON.stringify(lp));
    }


    setPlayerText(mainPlayer, players) {
        this.addPlayer(mainPlayer);
        for (let i = 0; i < this.currentCard.numPlayers - 1; i++) {
            let nPlayer = Math.floor( Math.random() * players.length );
            this.addPlayer(players[nPlayer]);
            players.splice(players.indexOf(players[nPlayer]), 1);
        }
    }

    addPlayer (player) {
        for (let i = 0; i < this.currentCard.text.length; i++) {
            if (this.currentCard.text[i] == '*') {
                this.currentCard.text = this.setCharAt(this.currentCard.text, i, player.name);
                break;
            }
        }
    }

    setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substring(0,index) + chr + str.substring(index+1);
    }

    updateScores () {
        this.changePlayerScore();
        this.getPlayers();
        let pp = document.getElementById('points-panel');
        pp.innerHTML = '';
        for (let i = 0; i < this.players.length; i++) {
            let si = i.toString();
            pp.innerHTML += '<div id= "player'+si+'" class="player-info"><p id="name'+si+'" class="player-name">'+this.players[i].name+'</p><div id="colour'+si+'" class="player-score"><p id="points'+si+'">'+this.players[i].points+'</p></div></div>';
            document.getElementById('name' + si).style.backgroundColor = colours[i];
            document.getElementById('colour' + si).style.backgroundColor = colours[i];
        }
    }

    getCards () {
        this.activeCards = JSON.parse(localStorage.getItem('cards'));
    }

    getPlayers () {
        this.players = JSON.parse(localStorage.getItem('players'));
    }

    changePlayerScore () {
        if (this.currentCard && this.currentCard.points != 0) {
            let p = JSON.parse(localStorage.getItem('players'));
            let pi = this.getIndex(p, this.currentPlayer);
            if (document.getElementById ('a-checkbox').checked) {
                p[pi].points += this.currentCard.points;

                document.getElementById ('a-checkbox').checked = false;
            }
            if (document.getElementById ('d-checkbox').checked) {
                p[pi].points += this.currentCard.drinks;
                document.getElementById ('d-checkbox').checked = false;
            }
            localStorage.setItem('players', JSON.stringify(p));
        }
    }

    getIndex (a, o) {
        for (let i = 0; i < a.length; i++) {
            if (a[i].name == o.name) {
                return i;
            }
        }
    }

    displayNewCard () {
        this.getCards();
        this.getPlayers();
        this.updateScores();
        this.nextCard();
        this.storeNewData();
    }

    checkWin () {
        let p = JSON.parse(localStorage.getItem('players'));
        for (let i = 0; i < p.length; i++) {
            if(p[i].points >= this.pointsToWin){
                return p[i];
            }
        }
        if (JSON.parse(localStorage.getItem('cards')).length == 0) {
            let mPoints = 0;
            let wPlayer = null;
            for (let i = 0; i < p.length; i++) {
                if (p[i].points > mPoints) {
                    mPoints = p[i].points;
                    wPlayer = p[i];
                }
            }
            return wPlayer;
        }
        return null;
    }

    conditionsMet () {
        if (document.getElementById ('a-checkbox').checked || document.getElementById ('d-checkbox').checked) {
            return true;
        }
        if (this.currentCard.points == 0) {
            return true;
        }
        return false;
    }
}

let nPlayers = JSON.parse(localStorage.getItem('numPlayers'));

let c = new Controller();

function getNewCard () {
    if (c.conditionsMet()) {
        c.getCards();
        c.getPlayers();
        c.updateScores();
        let p = c.checkWin();
        if (p) {
            document.getElementById('text').innerHTML = p.name + " wins!";
            document.getElementById('action').style.visibility = "hidden";
            document.getElementById('drink').style.visibility = "hidden";
            document.getElementById('done-button').style.visibility = "hidden";
        } else {
            c.nextCard();
            c.storeNewData();
        }
    }
}

function resetGame () {
    window.location.replace('index.html');
}