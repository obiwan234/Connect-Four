let player;
let board;
let turns;
let messageSlot;
let again;
let heights;
let pastMoves;
let undo;
let undoneMoves;
let redo;
let playerList=["Red","Yellow"];
let winLine=false;
let spacing=4;
let canvas;

// let textPad=(this.boxHeight*.2);
PlayerToken=function(pigment) {
	this.token=pigment;
	this.display=function(location) {
		fill(this.token);
		ellipse(location.midpointX,location.midpointY,
			(location.boxWidth-location.spacing)-10,(location.boxHeight-location.spacing)-10);
	}
}

function setup() {
	select("#gamename").html("Connect Four");
	canvas=createCanvas(400,400);
	canvas.position(windowWidth/2-width/2,windowHeight/3-height/2);
	messageSlot=createElement("h1");
	messageSlot.position(windowWidth/2-width/2,400+windowHeight/3-height/2);
	makeAgainButton();
	makeUndoButton();
	initializeVars();
}

function initializeVars() {
	//rows,cols,boxWidth,boxHeight,canvasWidth,canvasHeight,spacing,statusList,pigment
	board=new Grid(6,7,50,50,width,height,spacing,
		[new PlayerToken(color(0,0,0,0)),new PlayerToken(color(255,0,0))
		,new PlayerToken(color(255,255,0))],color(0,0,200));
	player=0;
	turns=0;
	winLine=false;
	heights=[5,5,5,5,5,5,5];
	pastMoves=[];
	undoneMoves=[];
	messageSlot.html(playerList[player]+"'s turn");
}

function resetGame() {
	messageSlot.html("");
	again.hide();
	undo.show();
	redo.show();
	background(0,200,0);
	initializeVars();
}

function makeUndoButton() {
	undo=createButton("Undo");
	undo.position(250+windowWidth/2-width/2,415+windowHeight/3-height/2);
	undo.mousePressed(undoMove);
	undo.size(70,40)
	undo.style("background-color","rgb(0,200,0)");
	undo.style("border","none");
	undo.style("color","rgb(0,0,200)");

	redo=createButton("Redo");
	redo.position(330+windowWidth/2-width/2,415+windowHeight/3-height/2);
	redo.mousePressed(redoMove);
	redo.size(70,40)
	redo.style("background-color","rgb(0,200,0)");
	redo.style("border","none");
	redo.style("color","rgb(0,0,200)");
}

function redoMove() {
	if(undoneMoves.length>0&&undoneMoves[undoneMoves.length-1].status==-1) {
		re_move=undoneMoves.pop();
		heights[re_move.col]--;
		pastMoves.push(re_move);
		re_move.status=player;
		switchPlayer();
		turns++;
	}
}

function undoMove() {
	if(!winLine&&turns>0) {
		let lastTurn=pastMoves[pastMoves.length-1];
		undoneMoves.push(lastTurn)
		turns--;
		switchPlayer();
		lastTurn.status=-1;
		heights[lastTurn.col]++;
		pastMoves.splice(pastMoves.length-1,1)
	}
}

function makeAgainButton() {
	again=createButton("Play Again?")
	again.position(230+windowWidth/2-width/2,415+windowHeight/3-height/2);
	again.mousePressed(resetGame);
	again.size(70,40)
	again.style("background-color","rgb(0,200,0)");
	again.style("border","none");
	again.style("color","rgb(0,0,200)");
	again.style("font-size","15px");
	again.hide();
}

function draw() {
	background(0,200,0);
	board.printGrid();
	//highlight
	let loc=board.findLocation(mouseX,mouseY);
	if(loc&&loc.status==-1&&!winLine) {
		loc.highlight(false,1);
	}
	//win line
	if(winLine) {
		strokeWeight(5);
		stroke(0);
		line(winLine[0].midpointX,winLine[0].midpointY,winLine[1].midpointX,winLine[1].midpointY);
		strokeWeight(1);
		noStroke();
	}
}

function switchPlayer() {
	player=1-player;
	messageSlot.html(playerList[player]+"'s turn");
}

function mousePressed() {
	let locationTapped=board.findLocation(mouseX,mouseY)
	if(locationTapped) {
		let location=board.get(heights[locationTapped.col],locationTapped.col);
		pastMoves[pastMoves.length]=location;
		heights[locationTapped.col]--;
		if(location&&location.status==-1&&!winLine) {
			location.status=player;
			let won=board.checkStreak(4,location.row,location.col,player);
			if(won) {
				winGame(won);
			}else{
				turns++;
				if(turns==42) {
					tieGame();
				} else {
					switchPlayer();
				}
			}
		}
	}
}

function winGame(won) {
	strokeWeight(5);
	stroke(0);
	line(won[0].midpointX,won[0].midpointY,won[1].midpointX,won[1].midpointY);
	strokeWeight(1);
	stroke(0);
	winLine=won;
	messageSlot.html(playerList[player]+" Won!!");
	again.show();
	undo.hide();
	redo.hide();
}

function tieGame() {
	messageSlot.html("Tie Game");
	again.show();
	undo.hide();
	redo.hide();
}
