var climberCurrentHeight = [],
    startStop = 0,
    /* climberPos = [x,y] */
    climberPos = [[0,0]],
    toggleEnter = 0,
    interval = [],
    localMaximums = [],
    globalMaximum,
    /* Creates a class for tiles that the climber is currently on: */
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.climberOnTile {background: #f00 !important;color: #f00 !important;}';
    document.getElementsByTagName('head')[0].appendChild(style);

/* Registers keypresses and starts appropriate funcitons */
document.addEventListener("keydown",function(e){
    if(e.keyCode===13){
        // Enter key:
        if(toggleEnter==0){
            e.preventDefault();
            interval[0] = setInterval(function(){climb(0)},250);
            toggleEnter++;
        } else {
            console.log("Climbing stopped");
            clearInterval(interval[0]);
            toggleEnter--;
        }
    } else if(e.keyCode===27){
        // Esc key:
        e.preventDefault();
        climb(0);
    } else if(e.keyCode===9) {
        // Tab key:
        e.preventDefault();
        justFuckingShotgunIt(prompt("What would you like the time between steps to be?",250),Number(prompt("How many climbing bots would you like to create?",10)));
    }
});

/* Sets the starting position for climber[0] with a mouse click */
document.addEventListener("click",function(evt) {
    console.log(evt.target.id);
    if(evt.target.id!="landscape") {
        for(i=0;i<climberPos.length;i++) {
            clearClimberPosition(i);
        }
        climberPos[0][0] = Number(evt.target.id.substr(0,evt.target.id.indexOf(':')));
        climberPos[0][1] = Number(evt.target.id.substr(evt.target.id.indexOf(':')+1,evt.target.id.length-1));
        document.getElementById(evt.target.id).classList.add("climberOnTile");
    } else {
        console.log("Failed to register the click, please try again");
    }
},false);

function climb(climber) {
    /* Checks if the Climber has been given a location, else sets it at coordinates 0:0 */
    if(climberPos[climber][0] == null && climberPos[climber][1] == null){
        climberPos[climber] = [0,0];
        document.getElementById(climberPos[climber][0]+":"+climberPos[climber][1]).classList.add("climberOnTile");
    }
    climberCurrentHeight[climber] = Number(document.getElementById(climberPos[climber][0]+":"+climberPos[climber][1]).innerHTML);
    var direction = chooseDirection(detectSurroundings(climber),climber);
    if(direction==0) {
        move(1,-1,climber);
    } else if(direction==1) {
        move(0,1,climber);
    } else if(direction==2) {
        move(1,1,climber);
    } else if(direction==3) {
        move(0,-1,climber);
    } else {
        console.log("Reached the peak of the mountain");
        toggleEnter = 0;
        clearInterval(interval[climber]);

        /* Don't add same value more than once: */
        if(localMaximums.includes(Number(document.getElementById(climberPos[climber][0]+":"+climberPos[climber][1]).innerHTML))) {
            //console.log("Local Maximums already has this value");
        } else {
            localMaximums.push(Number(document.getElementById(climberPos[climber][0]+":"+climberPos[climber][1]).innerHTML));
        }
    }
}

function clearClimberPosition(climber){
    if(climberPos[climber][0]!=null && climberPos[climber][1]!=null){
        document.getElementById(climberPos[climber][0]+":"+climberPos[climber][1]).classList.remove("climberOnTile");
    }  
}

function move(direction, value, climber) {
    clearClimberPosition(climber);
    climberPos[climber][direction] = climberPos[climber][direction]+value;
    document.getElementById(climberPos[climber][0]+":"+climberPos[climber][1]).classList.add("climberOnTile");
    if(direction<1) {
        if(Number(document.getElementById(climberPos[climber][0]+":"+climberPos[climber][1]).innerHTML)<Number(document.getElementById((climberPos[climber][0]-value)+":"+climberPos[climber][1]).innerHTML)) {
        }
    } else {
        if(Number(document.getElementById(climberPos[climber][0]+":"+(climberPos[climber][1]-value)).innerHTML)>Number(document.getElementById(climberPos[climber][0]+":"+climberPos[climber][1]).innerHTML)){
        }
    }
}

function chooseDirection(choices, climber) {
    var movementDirection;
        highestNeighbour = climberCurrentHeight[climber];
    for(i=0;i<choices.length;i++){
        if(Number(choices[i])>=Number(highestNeighbour)) {
            highestNeighbour = choices[i];
            movementDirection = choices[i];
        }
    }
    return choices.indexOf(movementDirection);
}

function detectSurroundings(climber) {
    var surroundingHeights = [0,0,0,0];
    if(climberPos[climber][1]!=0&&Number(document.getElementById(climberPos[climber][0]+":"+climberPos[climber][1]).innerHTML)+10>=Number(document.getElementById(climberPos[climber][0]+":"+(climberPos[climber][1]-1)).innerHTML)) {
        surroundingHeights[0] = Number(document.getElementById(climberPos[climber][0]+":"+(climberPos[climber][1]-1)).innerHTML);
    } else {
        surroundingHeights[0] = 0;
    }
    if(climberPos[climber][0]!=mountainDataArray[climberPos[climber][1]].length-1&&Number(document.getElementById(climberPos[climber][0]+":"+climberPos[climber][1]).innerHTML)+10>=Number(document.getElementById((climberPos[climber][0]+1)+":"+climberPos[climber][1]).innerHTML)) {
        surroundingHeights[1] = Number(document.getElementById((climberPos[climber][0]+1)+":"+climberPos[climber][1]).innerHTML);
    } else {
        surroundingHeights[1] = 0;
    }
    if(climberPos[climber][1]!=mountainDataArray.length-1&&Number(document.getElementById(climberPos[climber][0]+":"+climberPos[climber][1]).innerHTML)+10>=Number(document.getElementById(climberPos[climber][0]+":"+(climberPos[climber][1]+1)).innerHTML)) {
        surroundingHeights[2] = Number(document.getElementById(climberPos[climber][0]+":"+(climberPos[climber][1]+1)).innerHTML);
    } else {
        surroundingHeights[2] = 0;
    }
    if(climberPos[climber][0]!=0&&Number(document.getElementById(climberPos[climber][0]+":"+climberPos[climber][1]).innerHTML)+10>=Number(document.getElementById((climberPos[climber][0]-1)+":"+climberPos[climber][1]).innerHTML)) {
        surroundingHeights[3] = Number(document.getElementById((climberPos[climber][0]-1)+":"+climberPos[climber][1]).innerHTML);
    } else {
        surroundingHeights[3] = 0;
    }
    return surroundingHeights;
}

function justFuckingShotgunIt(stepspeed, climbersCreated) {

    for(i=0;i<climberPos.length;i++) {
        clearClimberPosition(i);
        clearInterval(interval[i]);
    }
    /* The only function that is needed from the mountainBuilder.js file in order to determen the xAxis length from which climberPos[climber][0] can be chosen from */
    var fixer = findLongestRowLength();
    climberPos = [];
    for(i=0;i<climbersCreated;i++) {
        const fixerVar2 = i;
        climberPos[i] = [Math.floor(Math.random()*fixer),Math.floor(Math.random()*mountainDataArray.length)];
        climberCurrentHeight[i] = Number(document.getElementById(climberPos[i][0]+":"+climberPos[i][1]).innerHTML);
        document.getElementById(climberPos[i][0]+":"+climberPos[i][1]).classList.add("climberOnTile");
        interval[fixerVar2] = setInterval(function(){climb(fixerVar2);},stepspeed);
    }
}

/* Function to determen the globalMax from the localMax var */
function findGlobalMax(localMaximums) {
    globalMaximum = localMaximums[0];
    for(i=0;i<localMaximums.length;i++) {
        if(localMaximums[i]>globalMaximum) {
            globalMaximum = localMaximums[i];
        }
    }
    return globalMaximum;
}

document.getElementsByTagName('body')[0].addEventListener("change",function() {
    for(i=0;i<climberPos.length;i++) {
        clearClimberPosition(i);
        clearInterval(interval[i]);
    }
});