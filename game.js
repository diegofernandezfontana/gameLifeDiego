var gameOfLife = {

    width: 50,
    height: 50, // dimensiones alto y ancho del tablero
    stepInterval: null,
    createAndShowBoard: function () {

        // crea el elemento <table>
        var goltable = document.createElement("tbody");
        var botonClear = document.querySelector("#clear_btn");
        botonClear.addEventListener('click', this.clear)
        var botonStep = document.querySelector("#step_btn");
        botonStep.addEventListener('click', this.step)
        var botonResetRandom = document.querySelector("#reset_btn");
        botonResetRandom.addEventListener('click', this.resetRandom);
        var botonPlay = document.querySelector("#play_btn");
        botonPlay.addEventListener('click', this.enableAutoPlay);

        // Construye la Tabla HTML
        var tablehtml = '';
        for (var h=0; h<this.height; h++) {
            tablehtml += "<tr id='row+" + h + "'>";
            for (var w=0; w<this.width; w++) {
                tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
            }
            tablehtml += "</tr>";
        }
        //Se le asigna tablehtml a goltable
        goltable.innerHTML = tablehtml;

        var board = document.getElementById('board');
        board.appendChild(goltable);
        // una vez que los elementos html son añadidos a la pagina le añadimos los eventos
        this.setupBoardEvents();
    },

    forEachCell: function (iteratorFunc) {
        for(var x =0; x < this.width; x++){
            for(var y =0; y < this.height; y++){
                var celda = document.getElementById(x + '-' + y);
                iteratorFunc(celda);
            }
        }
    },

    setupBoardEvents: function() {
        var onCellClick = function (e) {
            if (this.dataset.status == 'dead') {
                this.className = 'alive';
                this.dataset.status = 'alive';
            } else {
                this.className = 'dead';
                this.dataset.status = 'dead';
            }
        };
        this.forEachCell(function(cell){
            cell.addEventListener('click', onCellClick)
        })
    },//FIN setupBoardEvents

    clear: function(){
        gameOfLife.forEachCell(function(cell){
            cell.className= "dead";
            cell.dataset.status='dead';
        })
    },
    resetRandom: function(){
        gameOfLife.forEachCell(function(celda){
            var num = Math.floor(Math.random()* 2) ;
            if(num === 0){
                celda.className = 'dead';
                celda.dataset.status = 'dead';
            }else{
                celda.className = 'alive';
                celda.dataset.status = 'alive';
            }
        });
    },

    step: function () {
        var tbody = document.querySelector("tbody");
        var arregloNextGen = [];
        gameOfLife.forEachCell(function(cell){
            var contador = 0;
            var [y,x] = cell.id.split('-');
            y = parseInt(y);
            x = parseInt(x);
            for(var i = -1; i < 2; i++){
                for(var j = -1; j < 2; j++){
                    if(tbody.children[y + i]){
                        if(tbody.children[y+i].children[x+j]){
                            if(tbody.children[y+i].children[x+j].className == "alive"){
                                contador++;
                            }
                        }
                    }
                }
            }
            if(contador > 0 && tbody.children[y].children[x].className == "alive"){
                contador--;
            }
            var celda = tbody.children[y].children[x];
            if(celda.dataset.status == "alive"){
                if(contador > 3 || contador < 2){
                    arregloNextGen.push(celda);
                }
            } else if(celda.dataset.status == "dead" && contador == 3){
                arregloNextGen.push(celda);
            }
        })//FIN Foreach
        for(var i = 0; i < arregloNextGen.length; i++){
            if(arregloNextGen[i].dataset.status == "alive"){
                arregloNextGen[i].dataset.status = "dead";
                arregloNextGen[i].className = "dead";
            } else if(arregloNextGen[i].dataset.status == "dead"){
                    arregloNextGen[i].dataset.status = "alive";
                    arregloNextGen[i].className = "alive";
            }
        }
    },

    enableAutoPlay: function () {
        // Comienza Auto-Play corriendo la función step
        // automaticamente de forma reptida cada intervalo de tiempo fijo
        setInterval(gameOfLife.step, 1000);
    }


}; // FIN GAME OF LIFE

gameOfLife.createAndShowBoard();
