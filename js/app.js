let mouse = false
let width = 100
let height = 40
let move_start = true
let move_finish = false
let add_wall = false
let delete_wall = false
let generation = false

$(document).ready(function(){
    $("#width-selector").on("input", function(){
        width = parseInt($(this).val());
        if(width > 100) {
          width = 100
          $(this).val(100);
        }
        if(width != 0 && height != 0)
          setGrid()
    });
    $("#height-selector").on("input", function(){
        height = parseInt($(this).val());
        if(height > 100) {
          height = 100
          $(this).val(100);
        }
        if(width != 0 && height != 0)
          setGrid()
    });
    $("input:checkbox").on('click', function() {
        if(!generation) {
            var box = $(this);
            var name = this.name;
            if (box.is(":checked")) {
                $("input:checkbox").prop("checked", false);
                box.prop("checked", true);
                checkboxCheck(name)
            } else {
                box.prop("checked", false);
                switch (name) {
                    case "move-start":
                        move_start = false
                        break;
                    case "move-finish":
                        move_finish = false
                        break;
                    case "add-wall":
                        add_wall = false
                        break;
                    case "delete-wall":
                        delete_wall = false
                        break;
                    default:
                        break;
                }
            }
        }
    });
});

function checkboxCheck (name) {
    switch (name) {
        case "move-start":
            move_start = true
            move_finish = false
            add_wall = false
            delete_wall = false
            break;
        case "move-finish":
            move_start = false
            move_finish = true
            add_wall = false
            delete_wall = false
            break;
        case "add-wall":
            move_start = false
            move_finish = false
            add_wall = true
            delete_wall = false
            break;
        case "delete-wall":
            move_start = false
            move_finish = false
            add_wall = false
            delete_wall = true
            break;
        default:
            break;
  }
}

//Fonction pour générer la grille
function setGrid () {
    var i = 0;

    var container = document.getElementById('grid-container')
    container.style.gridTemplateColumns = 'repeat(' + width + ',1fr)'
    container.setAttribute('style','aspect-ratio:'+width+'/'+height+';'+
            'grid-template-columns:repeat(' + width + ',1fr)')

    while(container.firstChild) {
        container.removeChild(container.firstChild)
    }

    for(i; i < width*height; i++) {
        var newDiv = document.createElement('div');
        newDiv.setAttribute('onmouseover','mouseOver(this)')
        newDiv.setAttribute('onmousedown','mouseClick(this)')
        newDiv.setAttribute('class','grid-item')
        newDiv.setAttribute('id',i)
        container.appendChild(newDiv)
    }
}

//Fonction pour déterminer le choix d'action
function mouseOver(elem) {
    if(!generation) {
        if(add_wall)
            changeToBlack(elem)
        
        if(delete_wall)
            changeToWhite(elem)

        if(move_start)
            moveStart(elem)

        if(move_finish)
            moveFinish(elem)
    }
}
function mouseClick(elem) {
    if(!generation) {
        if(add_wall)
            forceToBlack(elem)

        if(delete_wall)
            forceToWhite(elem)  
            
        if(move_start)
            forceMoveStart(elem)

        if(move_finish)
            forceMoveFinish(elem)
    }
}

//Fonction pour ajout de mur
function changeToBlack(square) {
    if(mouse && square.className == "grid-item")
        square.setAttribute('class','grid-item-black')
}
function forceToBlack(square){
    if(square.className == "grid-item")
        square.setAttribute('class','grid-item-black')
}

//Fonction pour suppression de mur
function changeToWhite(square) {
    if(mouse && square.className == "grid-item-black")
        square.setAttribute('class','grid-item')
}
function forceToWhite(square){
    if(square.className == "grid-item-black")
        square.setAttribute('class','grid-item')
}

//Fonction pour déplacer le départ
function moveStart(square) {
    if(mouse) {
        if(document.getElementsByClassName('grid-start')[0])
            document.getElementsByClassName('grid-start')[0].setAttribute('class','grid-item')
    
        square.setAttribute('class','grid-start')
    }
}
function forceMoveStart(square) {
    if(document.getElementsByClassName('grid-start')[0])
            document.getElementsByClassName('grid-start')[0].setAttribute('class','grid-item')
    
        square.setAttribute('class','grid-start')
}

//Fonction pour déplacer l'arrivée
function moveFinish(square) {
    if(mouse) {
        if(document.getElementsByClassName('grid-finish')[0])
            document.getElementsByClassName('grid-finish')[0].setAttribute('class','grid-item')
    
        square.setAttribute('class','grid-finish')
    }
}
function forceMoveFinish(square) {
    if(document.getElementsByClassName('grid-finish')[0])
            document.getElementsByClassName('grid-finish')[0].setAttribute('class','grid-item')
    
        square.setAttribute('class','grid-finish')
}

//Fonction pour réinitialiser la grille
function reset() {
    var squares = document.getElementsByClassName('grid-item-black')
    while(squares[0]){
        squares[0].setAttribute('class','grid-item')
    } 

    squares = document.getElementsByClassName('grid-item-gradient')
    while(squares[0]){
        squares[0].setAttribute('class','grid-item')
    }

    squares = document.getElementsByClassName('grid-start')
    while(squares[0]){
        squares[0].setAttribute('class','grid-item')
    }

    squares = document.getElementsByClassName('grid-finish')
    while(squares[0]){
        squares[0].setAttribute('class','grid-item')
    }

    squares = document.getElementsByClassName('grid-path')
    while(squares[0]){
        squares[0].setAttribute('class','grid-item')
    }

    squares = document.getElementsByClassName('grid-no-path')
    while(squares[0]){
        squares[0].setAttribute('class','grid-item')
    }

}

//Fonctions qui vérifie l'état de la souris
function mouseDown () {
    event.preventDefault();
    mouse = true
}
function mouseUp() {
    mouse = false
}

//Fonction pour visualiser
function visualise () {
    if(document.getElementsByClassName('grid-start')[0] 
            && document.getElementsByClassName('grid-finish')[0]) {
        lock()
        dijkstra()
    }
        
}

//Fonction pour empêcher de modifier la grille
function lock() {
    generation = true
    $("input:checkbox").prop('readonly', true)
    $("input:text").prop('readonly', true)
    $("button").prop('disabled', true)
}

//Fonction pour permettre de modifier la grille
function unlock() {
    generation = false
    $("input:checkbox").prop('readonly', false)
    $("input:text").prop('readonly', false)
    $("button").prop('disabled', false)
}

//Fonction algorithme de Dijkstra
function dijkstra() {
    var start = parseInt($(".grid-start").attr('id'))
    var finish = parseInt($(".grid-finish").attr('id'))
    var current = []
    var explored = []
    var dist = []
    var parent = []

    for(let i = 0; i < width*height; i++) {
        parent.push(-1)
        dist.push(-1)
    }

    current.push(start)
    dist[start] = 0
        
    interval1 = setInterval(function() {
        var size = current.length
        for(let i = 0; i < size; i++) {
            //carré de droite
            if((current[0] + 1) % width != 0 && dist[current[0] + 1] == -1 &&
                    document.getElementById(current[0]+1).className != 'grid-item-black') {
                dist[current[0] + 1] = dist[current[0]] + 1
                current.push(current[0] + 1)
                parent[current[0] + 1] = current[0] 
            }

            //carré de gauche
            if(current[0] % width != 0 && dist[current[0] - 1] == -1 &&
                    document.getElementById(current[0]-1).className != 'grid-item-black') {
                dist[current[0] - 1] = dist[current[0]] + 1
                current.push(current[0] - 1)
                parent[current[0] - 1] = current[0] 
            }

            //carré du haut
            if(current[0] + width < width*height && dist[current[0] + width] == -1 &&
                    document.getElementById(current[0]+width).className != 'grid-item-black') {
                dist[current[0] + width] = dist[current[0]] + 1
                current.push(current[0] + width)
                parent[current[0] + width] = current[0] 
            }

            //carré du bas
            if(current[0] - width > 0 && dist[current[0] - width] == -1 &&
                    document.getElementById(current[0]-width).className != 'grid-item-black') {
                dist[current[0] - width] = dist[current[0]] + 1
                current.push(current[0] - width)
                parent[current[0] - width] = current[0] 
            }

            explored.push(current[0])
            current.shift()
            
        }

        //Affichage des prochains élément
        for(let i of current) {
            square = document.getElementById(i)
            if(square.className != 'grid-finish') {
                square.setAttribute('class','grid-item-gradient')
            }
        }

        //Affichage du chemin trouvé
        if(current.indexOf(finish) != -1) {
            var path = []
            var currentPath = finish
            while(currentPath != start) {
                currentPath = parent[currentPath]
                path.unshift(currentPath)
            }
            path.shift()
            drawPath(path)
            clearInterval(interval1)
        }

        //Aucun chemin trouvé
        if(current.length == 0) {
            drawNoPath(explored)
            clearInterval(interval1)
        }

    },100)

}

/*function realTime() {
    var start = parseInt($(".grid-start").attr('id'))
    var finish = parseInt($(".grid-finish").attr('id'))
    var current = []
    var explored = []
    var dist = []
    var parent = []

    for(let i = 0; i < width*height; i++) {
        parent.push(-1)
        dist.push(-1)
    }

    current.push(start)
    dist[start] = 0
        
    while(true) {
        if(current.length == 0)
            break

        if(current.indexOf(finish) != -1) {
            break
        }
               

        var size = current.length
        for(let i = 0; i < size; i++) {
            if((current[0] + 1) % width != 0 && dist[current[0] + 1] == -1 &&
                    document.getElementById(current[0]+1).className != 'grid-item-black') {
                dist[current[0] + 1] = dist[current[0]] + 1
                current.push(current[0] + 1)
                parent[current[0] + 1] = current[0] 
            }
            if(current[0] % width != 0 && dist[current[0] - 1] == -1 &&
                    document.getElementById(current[0]-1).className != 'grid-item-black') {
                dist[current[0] - 1] = dist[current[0]] + 1
                current.push(current[0] - 1)
                parent[current[0] - 1] = current[0] 
            }
            if(current[0] + width < width*height && dist[current[0] + width] == -1 &&
                    document.getElementById(current[0]+width).className != 'grid-item-black') {
                dist[current[0] + width] = dist[current[0]] + 1
                current.push(current[0] + width)
                parent[current[0] + width] = current[0] 
            }
            if(current[0] - width > 0 && dist[current[0] - width] == -1 &&
                    document.getElementById(current[0]-width).className != 'grid-item-black') {
                dist[current[0] - width] = dist[current[0]] + 1
                current.push(current[0] - width)
                parent[current[0] - width] = current[0] 
            }
            explored.push(current[0])
            current.shift()
            
        }

        for(let i of current) {
            square = document.getElementById(i)
            if(square.className != 'grid-finish')
                square.setAttribute('class','grid-explored')
        }
    }
    var path = []
    var currentPath = finish
    while(currentPath != start) {
        currentPath = parent[currentPath]
        path.unshift(currentPath)
    }
    path.shift()
    while(path.length != 0){
        document.getElementById(path[0]).setAttribute('class','grid-path-instant')
        path.shift()
    }
    unlock()
}*/

//Fonction qui trace le chemin optimal
function drawPath(path) {
    interval2 = setInterval(function () {
        if(path.length == 0) {
            unlock()
            clearInterval(interval2)
        }

        document.getElementById(path[0]).setAttribute('class','grid-path')
        path.shift()
    },50)
}

//Fonction qui affiche qu'aucun chemin n'est possible
function drawNoPath(explored) {
    for(let i of explored) {
        var square = document.getElementById(i)
        if(square.className != 'grid-start') {
            square.setAttribute('class','grid-no-path')
        }
    }
    unlock()
}

window.onload = setGrid