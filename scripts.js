//stalemate to do

var grid = [[0, 1, 0, 1, 0, 1, 0, 1],
[1, 0, 1, 0, 1, 0, 1, 0],
[0, 1, 0, 1, 0, 1, 0, 1],
[1, 0, 1, 0, 1, 0, 1, 0],
[0, 1, 0, 1, 0, 1, 0, 1],
[1, 0, 1, 0, 1, 0, 1, 0],
[0, 1, 0, 1, 0, 1, 0, 1],
[1, 0, 1, 0, 1, 0, 1, 0]];

var piecegrid =
    [[9, 10, 11, 12, 13, 11, 10, 9],
    [8, 8, 8, 8, 8, 8, 8, 8],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [3, 4, 5, 6, 7, 5, 4, 3]];


const pieces = {
    EMPTY: 0,
    WHITE_PAWN: 2,
    WHITE_ROOK: 3,
    WHITE_HORSE: 4,
    WHITE_BISHOP: 5,
    WHITE_QUEEN: 6,
    WHITE_KING: 7,
    BLACK_PAWN: 8,
    BLACK_ROOK: 9,
    BLACK_HORSE: 10,
    BLACK_BISHOP: 11,
    BLACK_QUEEN: 12,
    BLACK_KING: 13
}

function pieceStrToNum(str) {
    if (str == "EMPTY") return 0;
    if (str == "WHITE_PAWN") return 2;
    if (str == "WHITE_ROOK") return 3;
    if (str == "WHITE_HORSE") return 4;
    if (str == "WHITE_BISHOP") return 5;
    if (str == "WHITE_QUEEN") return 6;
    if (str == "WHITE_KING") return 7;
    if (str == "BLACK_PAWN") return 8;
    if (str == "BLACK_ROOK") return 9;
    if (str == "BLACK_HORSE") return 10;
    if (str == "BLACK_BISHOP") return 11;
    if (str == "BLACK_QUEEN") return 12;
    if (str == "BLACK_KING") return 13;
    return 0;
}

var selected = [0, 0];
var firstRound = true;
var roundcount = 0;
var roundcolor = "white";
var whitecheck = false;
var blackcheck = false;
var black_king_y = 0;
var black_king_x = 4;
var white_king_y = 7;
var white_king_x = 4;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


function drawGrid() {
    if (roundcolor === "white") {
        document.getElementById("turn").innerHTML = "<div class=\"whiteturn\">White</div>"
    }
    else {
        document.getElementById("turn").innerHTML = "<div class=\"blackturn\">Black</div>"
    }
    clearCheck();
    checkPawnPromotion();

    document.getElementById("maingrid").innerHTML = "";
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === 0) {
                var emptycell = document.createElement("div");
                emptycell.setAttribute("class", "cell whitecell");
                emptycell.setAttribute("name", i + "-" + j);
                emptycell.setAttribute("onclick", "movePiece(this)");
                var piececell = document.createElement("div");
                if (piecegrid[i][j] != 0) {
                    piececell.setAttribute("class", Object.keys(pieces)[piecegrid[i][j] - 1].toString())
                }
                else {

                    piececell.setAttribute("class", "EMPTY");
                }
                emptycell.appendChild(piececell);

            }
            else {

                var emptycell = document.createElement("div");
                emptycell.setAttribute("class", "cell blackcell");
                emptycell.setAttribute("name", i + "-" + j);
                emptycell.setAttribute("onclick", "movePiece(this)");
                var piececell = document.createElement("div");
                if (piecegrid[i][j] != 0) {
                    piececell.setAttribute("class", Object.keys(pieces)[piecegrid[i][j] - 1].toString())
                    if (piecegrid[i][j] === 7) {
                        white_king_y = i;
                        white_king_x = j;
                    }

                    if (piecegrid[i][j] === 13) {
                        black_king_y = i;
                        black_king_x = j;
                    }
                }
                else {
                    piececell.setAttribute("class", "EMPTY");
                }
                emptycell.appendChild(piececell);
            }

            document.getElementById("maingrid").appendChild(emptycell);

        }
    }
    checkCheckmate();

    if (roundcount !== 0 && !isKingAlive("black")) {
        declareVictory("white", "resignation");
        return;
    }

    if (roundcount !== 0 && !isKingAlive("white")) {
        declareVictory("black", "resignation");
        gameReset();
        return;
    }
}

function declareVictory(color, condition) {
    alert(color.toUpperCase() + " has won by " + condition + "!");
    gameReset();
}


function isKingAlive(color) {
    if (color === "black") {
        for (var i = 0; i < piecegrid.length; i++) {
            for (var j = 0; j < piecegrid[i].length; j++) {
                if (piecegrid[i][j] === pieces.BLACK_KING) {
                    return true;
                }
            }
        }
        return false;
    }
    if (color === "white") {
        for (var i = 0; i < piecegrid.length; i++) {
            for (var j = 0; j < piecegrid[i].length; j++) {
                if (piecegrid[i][j] === pieces.WHITE_KING) {
                    return true;
                }
            }
        }
        return false;
    }
    return false;
}

function gameReset() {
    window.location.reload();
}

function clearCheck() {
    whitecheck = false;
    blackcheck = false;
    document.getElementById("check1").innerHTML = "";
    document.getElementById("check2").innerHTML = "";
}

function setCheck(color) {
    if(color==="white") document.getElementById("check1").innerHTML = color.toUpperCase();
    if(color==="black") document.getElementById("check2").innerHTML = color.toUpperCase();
    return;
}

function getLegalMoves(pt, roundconstraint) {

    var piece = piecegrid[pt[0]][pt[1]];

    var piecey = pt[0];
    var piecex = pt[1];
    var legalpositions = [];
    var piececolor = getPieceColor(pt[0], pt[1]);

    if (piececolor !== roundcolor && roundconstraint === true) {
        return legalpositions;
    }
    //PAWN==================================================================================================================
    if (piece === pieces.WHITE_PAWN || piece === pieces.BLACK_PAWN) {

        if (!isOccupied([piecey + 1], [piecex]) && isInBounds([piecey + 1], [piecex])) {
            // console.log("isocc "+ isOccupied([piecey+1],[piecex]));
            // console.log("isemp "+ isInBounds([piecey+1],[piecex]));      
            if (piece === pieces.BLACK_PAWN) legalpositions.push([piecey + 1, piecex]);
        }

        if (!isOccupied([piecey], [piecex + 1]) && isInBounds([piecey], [piecex + 1])) {
            // console.log("isocc "+ isOccupied([piecey+1],[piecex]));
            // console.log("isemp "+ isInBounds([piecey+1],[piecex]));             
            legalpositions.push([piecey, piecex + 1]);
        }

        if (!isOccupied([piecey], [piecex - 1]) && isInBounds([piecey], [piecex - 1])) {
            // console.log("isocc "+ isOccupied([piecey+1],[piecex]));
            // console.log("isemp "+ isInBounds([piecey+1],[piecex]));               
            legalpositions.push([piecey, piecex - 1]);
        }

        if (!isOccupied([piecey - 1], [piecex]) && isInBounds([piecey - 1], [piecex])) {
            // console.log("isocc "+ isOccupied([piecey+1],[piecex]));
            // console.log("isemp "+ isInBounds([piecey+1],[piecex]));               
            if (piece === 2) legalpositions.push([piecey - 1, piecex]);
        }
        //CAPTURE CHECKS FOR WHITE!
        if ((piece === pieces.WHITE_PAWN) && isOccupied([piecey - 1], [piecex - 1]) && getPieceColor([piecey - 1], [piecex - 1]) !== piececolor) {

            legalpositions.push([piecey - 1, piecex - 1]);
        }

        if ((piece === pieces.WHITE_PAWN) && isOccupied([piecey - 1], [piecex + 1]) && getPieceColor([piecey - 1], [piecex - 1]) !== piececolor) {
            legalpositions.push([piecey - 1, piecex + 1]);
        }
        //CAPTURE CHECKS FOR BLACK
        if ((piece === pieces.BLACK_PAWN) && isOccupied([piecey + 1], [piecex - 1]) && getPieceColor([piecey - 1], [piecex - 1]) !== piececolor) {

            legalpositions.push([piecey + 1, piecex - 1]);
        }

        if ((piece === pieces.BLACK_PAWN) && isOccupied([piecey + 1], [piecex + 1]) && getPieceColor([piecey - 1], [piecex - 1]) !== piececolor) {

            legalpositions.push([piecey + 1, piecex + 1]);
        }

        if (piecey === 6) {
            if (piececolor === "white" && !isOccupied(piecey - 1, piecex)) {
                legalpositions.push([piecey - 2, piecex]);
            }
        }

        if (piecey === 1) {
            if (piececolor === "black" && !isOccupied(piecey + 1, piecex)) {
                legalpositions.push([piecey + 2, piecex]);
            }
        }
    }
    //HORSE==================================================================================================================
    if (piece === pieces.WHITE_HORSE || piece === pieces.BLACK_HORSE) {
        var possible = [];
        possible.push([piecey - 2, piecex - 1], [piecey - 2, piecex + 1], [piecey - 1, piecex + 2], [piecey + 1, piecex + 2], [piecey + 2, piecex + 1],
            [piecey + 2, piecex - 1], [piecey + 1, piecex - 2], [piecey - 1, piecex - 2]);

        possible.forEach(i => {
            // console.log("for i: "+i[0]+" "+i[1]);
            // console.log(isOccupied(i[0],i[1]));
            // console.log(isInBounds(i[0],i[1]));

            if ((!isOccupied(i[0], i[1])) && (isInBounds(i[0], i[1]))) {
                legalpositions.push([i[0], i[1]]);
            }

            if ((isOccupied(i[0], i[1])) && (getPieceColor(i[0], i[1]) !== piececolor)) {
                legalpositions.push([i[0], i[1]]);
            }
        });
    }

    //BISHOP=================================================================================================================
    if (piece === pieces.WHITE_BISHOP || piece === pieces.BLACK_BISHOP) {
        //checks 4 diagonals with each loop pass
        var checky = piecey;
        var checkx = piecex;
        var distancey = parseInt(-1);
        var distancex = parseInt(-1);
        var pass = 0 //0=↖ 1=↗ 2=↘ 3=↙
        var endpass = false;

        while (pass <= 3) {
            if (!isInBounds(parseInt(checky + distancey), parseInt(checkx + distancex)) || endpass === true) {
                if (pass === 0) {
                    pass++; //goes to 1
                    checky = piecey;
                    checkx = piecex;
                    distancey = parseInt(-1);
                    distancex = parseInt(+1);
                    endpass = false;
                    continue;
                }
                if (pass === 1) {
                    pass++;//goes to 2
                    checky = piecey;
                    checkx = piecex;
                    distancey = parseInt(+1);
                    distancex = parseInt(+1);
                    endpass = false;
                    continue;
                }

                if (pass === 2) {
                    pass++;//goes to 3
                    checky = piecey;
                    checkx = piecex;
                    distancey = parseInt(+1);
                    distancex = parseInt(-1);
                    endpass = false;
                    continue;
                }

                if (pass === 3) {
                    pass++;//loop ending condition  
                }
            }
            else {
                if (!isOccupied(parseInt(checky + distancey), parseInt(checkx + distancex))) {
                    legalpositions.push([parseInt(checky + distancey), parseInt(parseInt(checkx + distancex))]);
                    if (distancey > 0) distancey = distancey + 1;
                    if (distancey < 0) distancey = distancey - 1;
                    if (distancex > 0) distancex = distancex + 1;
                    if (distancex < 0) distancex = distancex - 1;

                }
                else {
                    if (getPieceColor(parseInt(checky + distancey), parseInt(checkx + distancex)) !== piececolor) {
                        legalpositions.push([parseInt(checky + distancey), parseInt(checkx + distancex)]);
                        endpass = true;
                    }
                    else {
                        endpass = true;
                    }
                }
            }
        }
    }

    //ROOK=================================================================================================================
    if (piece === pieces.WHITE_ROOK || piece === pieces.BLACK_ROOK) {

        var checky = piecey;
        var checkx = piecex;
        var distancey = parseInt(-1);
        var distancex = 0
        var pass = 0 //0=^ 1=> 2=v 3=<
        var endpass = false;

        while (pass <= 3) {
            if (!isInBounds(parseInt(checky + distancey), parseInt(checkx + distancex)) || endpass === true) {
                if (pass === 0) {
                    pass++; //goes to 1
                    checky = piecey;
                    checkx = piecex;
                    distancey = 0
                    distancex = parseInt(+1);
                    endpass = false;
                    continue;
                }
                if (pass === 1) {
                    pass++;//goes to 2
                    checky = piecey;
                    checkx = piecex;
                    distancey = parseInt(+1);
                    distancex = 0
                    endpass = false;
                    continue;
                }

                if (pass === 2) {
                    pass++;//goes to 3
                    checky = piecey;
                    checkx = piecex;
                    distancey = 0
                    distancex = parseInt(-1);
                    endpass = false;
                    continue;
                }

                if (pass === 3) {
                    pass++;//loop ending condition  
                }
            }
            else {
                if (!isOccupied(parseInt(checky + distancey), parseInt(checkx + distancex))) {
                    legalpositions.push([parseInt(checky + distancey), parseInt(parseInt(checkx + distancex))]);
                    if (distancey > 0) distancey = distancey + 1;
                    if (distancey < 0) distancey = distancey - 1;
                    if (distancex > 0) distancex = distancex + 1;
                    if (distancex < 0) distancex = distancex - 1;

                }
                else {
                    if (getPieceColor(parseInt(checky + distancey), parseInt(checkx + distancex)) !== piececolor) {
                        legalpositions.push([parseInt(checky + distancey), parseInt(checkx + distancex)]);
                        endpass = true;
                    }
                    else {
                        endpass = true;
                    }
                }
            }
        }

    }
    //QUEENE
    if (piece === pieces.WHITE_QUEEN || piece === pieces.BLACK_QUEEN) {

        var checky = piecey;
        var checkx = piecex;
        var distancey = parseInt(-1);
        var distancex = 0
        var pass = 0 //0=^ 2=↗ 3=> 4=↘ 5=v 6=↙ 7=< 8=↖
        var endpass = false;

        while (pass <= 7) {
            if (!isInBounds(parseInt(checky + distancey), parseInt(checkx + distancex)) || endpass === true) {
                if (pass === 0) {
                    pass++; //goes to 1
                    checky = piecey;
                    checkx = piecex;
                    distancey = parseInt(-1);
                    distancex = parseInt(+1);
                    endpass = false;
                    continue;
                }
                if (pass === 1) {
                    pass++;//goes to 2
                    checky = piecey;
                    checkx = piecex;
                    distancey = 0
                    distancex = parseInt(+1);
                    endpass = false;
                    continue;
                }

                if (pass === 2) {
                    pass++;//goes to 3
                    checky = piecey;
                    checkx = piecex;
                    distancey = parseInt(+1);
                    distancex = parseInt(+1);
                    endpass = false;
                    continue;
                }

                if (pass === 3) {
                    pass++;//goes to 4
                    checky = piecey;
                    checkx = piecex;
                    distancey = parseInt(+1);
                    distancex = 0
                    endpass = false;
                    continue;
                }

                if (pass === 4) {
                    pass++;//goes to 5
                    checky = piecey;
                    checkx = piecex;
                    distancey = parseInt(+1);
                    distancex = parseInt(-1);
                    endpass = false;
                    continue;
                }

                if (pass === 5) {
                    pass++;//goes to 6
                    checky = piecey;
                    checkx = piecex;
                    distancey = 0
                    distancex = parseInt(-1);
                    endpass = false;
                    continue;
                }

                if (pass === 6) {
                    pass++;//goes to 7
                    checky = piecey;
                    checkx = piecex;
                    distancey = parseInt(-1);
                    distancex = parseInt(-1);
                    endpass = false;
                    continue;
                }
                if (pass === 7) {
                    pass++;//loop ending condition  
                }
            }
            else {
                if (!isOccupied(parseInt(checky + distancey), parseInt(checkx + distancex))) {
                    legalpositions.push([parseInt(checky + distancey), parseInt(parseInt(checkx + distancex))]);
                    if (distancey > 0) distancey = distancey + 1;
                    if (distancey < 0) distancey = distancey - 1;
                    if (distancex > 0) distancex = distancex + 1;
                    if (distancex < 0) distancex = distancex - 1;

                }
                else {
                    if (getPieceColor(parseInt(checky + distancey), parseInt(checkx + distancex)) !== piececolor) {
                        legalpositions.push([parseInt(checky + distancey), parseInt(checkx + distancex)]);
                        endpass = true;
                    }
                    else {
                        endpass = true;
                    }
                }
            }
        }

    }

    if (piece === pieces.WHITE_KING || piece === pieces.BLACK_KING) {

        var possible = [];
        possible.push([piecey - 1, piecex], [piecey - 1, piecex + 1], [piecey, piecex + 1], [piecey + 1, piecex + 1], [piecey + 1, piecex],
            [piecey + 1, piecex - 1], [piecey, piecex - 1], [piecey - 1, piecex - 1]);
        possible.forEach(i => {

            if ((!isOccupied(i[0], i[1])) && (isInBounds(i[0], i[1]))) {
                legalpositions.push([i[0], i[1]]);
            }

            if ((isOccupied(i[0], i[1])) && (getPieceColor(i[0], i[1]) !== piececolor)) {
                legalpositions.push([i[0], i[1]]);
            }
        });
    }


    return legalpositions;
}

function isOccupied(y, x) {
    if (!isInBounds(y, x)) return false;
    if (piecegrid[y][x] !== 0) {
        return true;
    }
    else {
        return false;
    }
}

function isInBounds(y, x) {
    if (y < 0 || y > 7 || x < 0 || x > 7) {
        return false;
    }
    else {
        return true;
    }
}

function clearOutlines() {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            document.getElementsByName(i + "-" + j)[0].childNodes[0].style.outline = null;
        }
    }
    return;
}

function getPieceColor(y, x) {
    if (piecegrid[y][x] >= 2 && piecegrid[y][x] <= 7) {
        return "white"
    }
    else if (piecegrid[y][x] >= 8 && piecegrid[y][x] <= 13) {
        return "black";
    }
    else {
        return "empty";
    }
}

function searchYXinArray(y, x, array) {

    for (var i = 0; i < array.length; i++) {
        if (array[i][0] === y && array[i][1] === x) {
            return true;
        }
    }
    return false;
}

function checkPawnPromotion() { //player must make choice

    for (var i = 0; i < piecegrid[0].length; i++) {
        if (piecegrid[0][i] === pieces.WHITE_PAWN) {
            var promotion = prompt("A pawn has been promoted! Select its new rank:\n"
                + "Type \"KNIGHT\" or \"1\" for KNIGHT,\n"
                + "Type \"BISHOP\" or \"2\" FOR BISHOP,\n"
                + "Type \"ROOK\" or \"3\" FOR ROOK,\n"
                + "Type \"QUEEN\" or \"4\" FOR QUEEN.");

            switch (promotion) {
                case ("KNIGHT" || "1"):
                    piecegrid[0][i] = pieces.WHITE_HORSE;
                    break;
                case ("BISHOP" || "2"):
                    piecegrid[0][i] = pieces.WHITE_BISHOP;
                    break;
                case ("ROOK" || "3"):
                    piecegrid[0][i] = pieces.WHITE_ROOK;
                    break;
                case ("QUEEN" || "4"):
                    piecegrid[0][i] = pieces.WHITE_QUEEN;
                    break;
                default:
                    break;
            }

        }
    }

    for (var i = 0; i < piecegrid[7].length; i++) {//player must make choice
        if (piecegrid[7][i] === pieces.BLACK_PAWN) {
            var promotion = prompt("A pawn has been promoted! Select its new rank:\n"
                + "Type \"KNIGHT\" or \"1\" for KNIGHT,\n"
                + "Type \"BISHOP\" or \"2\" FOR BISHOP,\n"
                + "Type \"ROOK\" or \"3\" FOR ROOK,\n"
                + "Type \"QUEEN\" or \"4\" FOR QUEEN.");

            switch (promotion) {
                case ("KNIGHT" || "1"):
                    piecegrid[0][i] = pieces.BLACK_HORSE;
                    break;
                case ("BISHOP" || "2"):
                    piecegrid[0][i] = pieces.BLACK_BISHOP;
                    break;
                case ("ROOK" || "3"):
                    piecegrid[0][i] = pieces.BLACK_ROOK;
                    break;
                case ("QUEEN" || "4"):
                    piecegrid[0][i] = pieces.BLACK_QUEEN;
                    break;
                default:
                    break;
            }
        }
    }
}

function checkCheckmate() {

    var whitelegals = [];
    var blacklegals = [];
    var whiteking_legals = [];
    var blackking_legals = [];

    for (var i = 0; i < piecegrid.length; i++) {
        for (var j = 0; j < piecegrid[i].length; j++) {
            if (piecegrid[i][j] !== 0) {

                var color = getPieceColor(i, j);

                if (color === 'white') {
                    var wlegals = getLegalMoves([i, j], false);
                    if (piecegrid[i][j] === pieces.WHITE_KING) { //so i dont need to recount it afterwards
                        whiteking_legals = wlegals.slice();
                    }
                    whitelegals = whitelegals.concat(wlegals);
                }
                if (color === 'black') {
                    var blegals = getLegalMoves([i, j], false);
                    if (piecegrid[i][j] === pieces.BLACK_KING) { //so i dont need to recount it afterwards
                        blackking_legals = blegals.slice();
                    }
                    blacklegals = blacklegals.concat(blegals);
                }
            }
        }
    }

    var white_escape_paths = [];
    var black_escape_paths = [];
    for (var i = 0; i < whiteking_legals.length; i++) {
        if (searchYXinArray(white_king_y, white_king_x, blacklegals)) {
            blackcheck = true;
            setCheck("black");
        }
    }

    for (var i = 0; i < blackking_legals.length; i++) {
        if (searchYXinArray(black_king_y, black_king_x, whitelegals)) {
            whitecheck = true;
            setCheck("white");
        }
    }

    if(whitecheck===true){
        for(var i=0;i<blackking_legals.length;i++){
            if(!searchYXinArray(blackking_legals[i][0],blackking_legals[i][1],whitelegals)){
                black_escape_paths.push(blackking_legals[i]);
            }
        }
    }

    if(blackcheck===true){
        for(var i=0;i<whiteking_legals.length;i++){
            if(!searchYXinArray(whiteking_legals[i][0],whiteking_legals[i][1],blacklegals)){
                white_escape_paths.push(whiteking_legals[i]);
            }
        }
    }

    console.log("wk legals")
    console.log(whiteking_legals);
    console.log("bk legals")
    console.log(blackking_legals);
    console.log("whitelegals")
    console.log(whitelegals);
    console.log("blacklegals")
    console.log(blacklegals);
    console.log(whitecheck);
    console.log(blackcheck);
    console.log('black escape', black_escape_paths);
    console.log('white escape ',white_escape_paths);
     if(black_escape_paths.length===0 && whitecheck===true){
        declareVictory("white","checkmate");
     }

     if(white_escape_paths.length===0 && blackcheck===true){
        declareVictory("black","checkmate");
     }

}


function movePiece(el) {  //NEED LOGIC HERE

    if (el.childNodes[0].getAttribute("class") === "EMPTY" && firstRound === true) {
        return;
    }

    if (firstRound == true) {

        var nom = el.getAttribute("name");
        var splits = nom.split("-");
        var point = [parseInt(splits[0]), parseInt(splits[1])];
        selected = point;
        el.childNodes[0].style.backgroundColor = "#fffaa3";
        firstRound = false;
        var legal = getLegalMoves(selected, true);
        for (var i = 0; i < legal.length; i++) {
            document.getElementsByName(legal[i][0] + "-" + legal[i][1])[0].childNodes[0].style.boxShadow = "inset 0px 0px 2px 2px #002bff";
        }
        return;
    }

    var prevy = selected[0];
    var prevx = selected[1];
    var prevel = document.getElementsByName(selected[0] + "-" + selected[1]);
    var legal = getLegalMoves(selected, true);
    if (prevel.length !== 0) {

        clearOutlines();
        var nom = el.getAttribute("name");
        var splits = nom.split("-");
        var point = [parseInt(splits[0]), parseInt(splits[1])];
        selected = point;

        for (var i = 0; i < legal.length; i++) {
            document.getElementsByName(legal[i][0] + "-" + legal[i][1])[0].childNodes[0].style.boxShadow = "inset 0px 0px 2px 2px #002bff";
        }

        if (prevel[0].childNodes[0].getAttribute("class") !== "EMPTY" && searchYXinArray(selected[0], selected[1], legal) === true) {
            piecegrid[prevy][prevx] = 0;
            piecegrid[splits[0]][splits[1]] = pieceStrToNum(prevel[0].childNodes[0].getAttribute("class"));
            if (prevy != splits[0] || prevx != splits[1]) roundcount++;

            if (roundcolor === "white") {
                roundcolor = "black";
            }
            else {
                roundcolor = "white";
            }
        }
    }
    drawGrid();
    firstRound = true;
}

drawGrid();

