/*
Each card is an object of this class
All data manipulation occurs in this class
*/
class CardInfo {
    constructor(data){
        this.text = '';
        this.points = 0;
        this.drinks = 0;
        this.numPlayers = 0;
        this.extrapolateData(data);
        this.convertString();
    }

    /*takes in data (a single line from the data (.csv) files)
    converts to useful data including point calculations */
    extrapolateData(data) {
        const dataArray = data.split(',');
        this.numPlayers = parseInt(dataArray[0]);
        this.points = parseInt(dataArray[1]);
        if (this.points != 0){
            this.drinks = Math.max(1, Math.floor(this.points / 2));
        }
        this.text = dataArray[2];
    }

    //converts string from data into something usable.
    convertString() {
        for (let i = 0; i < this.text.length; i++) {
            if (this.text[i] == ';') {
                this.text = this.setCharAt(this.text, i, ',');
            }
        }
        console.log(this.points);
    }

    //sets the character of a string (str) at index to a character or string (chr)
    setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substring(0,index) + chr + str.substring(index+1);
    }

    //testing class by force loading data
    async getData() {
        const response = await fetch ('data/normal-cards.csv');
        const data = await response.text();
        const events = data.split('\n').slice(1);
        events.forEach(event => {
            let c = new CardInfo(event);
        });
    }


}

//const ci = new CardInfo("0,0,'jshdjhhd'");
//ci.getData();