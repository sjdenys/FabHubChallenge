class Game { 
    constructor(){
        this.tiles = []
        this.complete = false;
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
         document.querySelector('#win').style.visibility = this.complete ? "visible" : "hidden";
    }

    reset(){
        this.complete = false;
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
            if( this.tiles.filter((e) => e.tile.value != "-").every((e)=>{return e.order == e.tile.value}) ){
                this.complete = true
            }
            this.draw();
        }
    }

    isSolvable() {
        //any time a tile is preceded by a tile of a high value, it's an inversion.
        let inversions = 0;
        let sortedByOrder = this.tiles.sort((a,b)=>{return a.order > b.order}).filter((e) => e.tile.value != "-")
        for (let i = 0; i < sortedByOrder.length; i++) {
            for (let j = 0; j < i; j++) {
                if (sortedByOrder[j].tile.value > sortedByOrder[i].tile.value){
                    inversions++;
                }
            }
        }
      
        //check if blank space is on an even row relative to the bottom, e.g. second from bottom is even
        let blankTileOrder = this.tiles.filter((e) => e.tile.value == "-")[0].order;
        let blankTileEven = true;
        for(let i = this.tiles.length; i > 0; (i -= Math.sqrt(this.tiles.length) * 2) ){
            let divider = i - Math.sqrt(this.tiles.length) + 1;
            if( blankTileOrder <= i && ~~(blankTileOrder / divider ) == 1){
                blankTileEven = false;
            }
        }
        
        //board is solvable if blank tile row is even and inversions are odd or vice versa
        return (inversions % 2 == 0) != blankTileEven;
    }

    shuffle(){
        this.complete = false;
        do{
            let availableSpaces = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
            this.tiles.forEach((e) => {
                // if(e.tile.value == "-"){
                //     e.order = 16;
                // }
                // else{
                    let newOrder = availableSpaces.splice( Math.floor(Math.random() * Math.floor(availableSpaces.length)) , 1)[0];
                    e.order = newOrder
                //}
            })
        }while(!this.isSolvable())

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
    }
}

