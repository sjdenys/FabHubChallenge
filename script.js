class Game { 
    constructor(){
        this.tiles = []
    }
    
    init(){
        this.reset();
    }
    
    draw(){
        document.querySelector('#table').innerHTML = "";
        for(let i = 0; i < this.tiles.sort((a,b)=>{return a.order > b.order}).length; i++){
            let tileDiv = document.createElement('div');
            tileDiv.textContent = this.tiles[i].tile.value;
            tileDiv.id = this.tiles[i].tile.value;
            tileDiv.onclick = (t) => {
                this.tiles[i].tile.move(
                    this.tiles.filter((e) => e.tile.value == t.target.id)[0].order,
                    this.tiles.filter((e) => e.tile.value == "-")[0].order,
                    this.reorder.bind(this) 
                );
            };
            document.querySelector('#table').appendChild( tileDiv )
        };
    }

    reset(){
        this.tiles = [];
        for(let i = 1; i <= 15; i++){
            this.tiles.push({tile: new Tile(i,this), order: i});
        }
        this.tiles.push({tile: new Tile("-",this), order: 16});

        this.draw();
    }

    reorder(selectedTileOrder,blankTileOrder){
        let validMove = false;
        if(blankTileOrder - 4 == selectedTileOrder){
            validMove = true;
        }
        else if(blankTileOrder + 4 == selectedTileOrder){
            validMove = true;
        }
        else if(blankTileOrder + 1 == selectedTileOrder && selectedTileOrder % 4 != 1){
            validMove = true;
        }
        else if(blankTileOrder - 1 == selectedTileOrder && selectedTileOrder % 4 != 0){
            validMove = true;
        }

        if(validMove){
            let selectedTileIndex = this.tiles.findIndex((e) => e.order == selectedTileOrder)
            let blankTileIndex = this.tiles.findIndex((e) => e.order == blankTileOrder)
            this.tiles[ selectedTileIndex ].order = blankTileOrder;
            this.tiles[ blankTileIndex ].order = selectedTileOrder;
            this.draw();
        }
    }

    shuffle(){
        let availableSpaces = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
        this.tiles.forEach((e) => {
            let thing = availableSpaces.splice( Math.floor(Math.random() * Math.floor(availableSpaces.length)) , 1)[0];
            e.order = thing
        })

        this.draw();
    }
}

class Tile {
    constructor(value){
        this.value = value;
    }

    move(selectedTileOrder,blankTileOrder,reorder){
        if(selectedTileOrder != blankTileOrder){
            reorder(selectedTileOrder,blankTileOrder);
        }
        else{
            console.log("no");
        }
    }
}

