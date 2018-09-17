var gameOfLife = {

    width: 12,
    height: 12, // dimensiones alto y ancho del tablero
    stepInterval: null, // debería ser usada para guardar referencia a una intervalo que esta siendo jugado
    //var botonClear = document.querySelector("#clear_btn");
//    var botonClear = document.querySelector("#clear_btn");
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
        //goltable crea la tbody dentro de table#board

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

        // agrega la tabla a #board
        var board = document.getElementById('board');
        board.appendChild(goltable);
        // una vez que los elementos html son añadidos a la pagina le añadimos los eventos
        this.setupBoardEvents();
    },

    forEachCell: function (iteratorFunc) {
        /*
          Escribe forEachCell aquí. Vas a necesitar visitar
          cada celda en el tablero, llama la "iteratorFunc",
          y pasa a la funcion, la celda y la coordenadas x & y
          de la celda. Por ejemplo: iteratorFunc(cell, x, y)
        */

        for(var x =0; x < this.width; x++){
            for(var y =0; y < this.height; y++){
                var celda = document.getElementById(x + '-' + y);
                iteratorFunc(celda);
            }
        }
    },

    setupBoardEvents: function() {
        // cada celda del tablero tiene un id CSS en el formato "x-y"
        // donde x es la coordinada-x e y es la coordenada-y
        // usa este hecho para loopear a traves de todos los ids y asignales

        // "click" events que permite a un usuario clickear en
        // celdas para configurar el estado inicial del juego
        // antes de clickear  "Step" o "Auto-Play"

        // clickear en una celda deberia alternar la celda entre "alive" y "dead"
        // por ejemplo: una celda "alive"  este pintado de azul, y una celda "dead" puede mantenerse blanco

        // EJEMPLO PARA UNA CELDA
        // Aquí esta como tendríamos un click event en sol una celda 0-0
        // Necesitas agregar el click event en cada celda en el tablero
        var onCellClick = function (e) {
            //e -> la celda clickeada
            // Pregunta para hacerte a ti mismo: Que es this en este contexto?

            // como setear el estilo de la celda cuando es clickeada
            if (this.dataset.status == 'dead') {
                  //This hacer referencia a la celda clickeada
                  //Si la celda esta muerta, la activa
                this.className = 'alive';
                this.dataset.status = 'alive';
            } else {
                  //Si la celda esta viva, la mata
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

        // Acá es donde querés loopear a través de las celdas
        // en el tablero y determina, basado en tus vecinos,
        // si la celda debe estar viva o muerta en la siguiente
        // evolución del juego.tbody.children[y+i].children[x+j].className == "alive"

        // Necesitas:
        // 1. Cuenta vecinos vivos para todas las celdas
        // 2. Sete el siguiente estado de todas las celdas basado en las vecinas vivas
        var tbody = document.querySelector("tbody");
        var arregloNextGen = [];
        gameOfLife.forEachCell(function(cell){
            var contador = 0;
            var [y,x] = cell.id.split('-');
            y = parseInt(y);
            x = parseInt(x);
            //console.log(tbody.children[0].children[0]);
            console.log('------');
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
        setInterval(gameOfLife.step, 300);
    }


}; // FIN GAME OF LIFE

gameOfLife.createAndShowBoard();
