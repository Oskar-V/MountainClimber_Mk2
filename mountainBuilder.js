var mountainDataArray = grid,
    landscape,
    landscapeWidth = findLongestRowLength();
function buildMountain() {

    /* Cleares the body element and builds the landscape for the mountain */
    document.getElementsByTagName('body')[0].innerHTML = "";
    var landscape = document.createElement('div');
    document.getElementsByTagName('body')[0].appendChild(landscape);
    /*landscape.setAttribute("id","landscape");*/
    landscape.style.height = mountainDataArray.length*10 + "px";
    landscape.style.width = findLongestRowLength()*10 + "px";
    landscape.style.position = "absolute";
    landscape.style.top = landscape.style.left = "50%";
    landscape.style.display = "block";
    landscape.style.marginTop = "-" + 0.5*landscape.offsetHeight + "px";
    landscape.style.marginLeft = "-" + 0.5*landscape.offsetWidth + "px";
    landscape.style.border = "1px solid #f0f";
    landscape.style.backgroundColor = "#37b903";

    /* Creates the grid for the mountain  with values from the "mountainDataArray" array */
    for(i = 0;i<mountainDataArray.length;i++){
        for(j=0;j<mountainDataArray[i].length;j++){
            var coordinates = document.createElement('div');
            coordinates.setAttribute("id",j+":"+i);
            landscape.appendChild(coordinates);
            coordinates.style.height = coordinates.style.width = "10px";
            //coordinates.style.border = "1px solid #000";
            coordinates.style.display = "inline-block";
            coordinates.style.cursor = "pointer";
            coordinates.style.fontSize = "5px";
            coordinates.style.textAlign = "center";
            coordinates.style.position = "absolute";
            coordinates.style.top = i*10 + "px";
            coordinates.style.left = j*10 + "px";
            coordinates.innerHTML = mountainDataArray[i][j];
            colorLandscape([j]+":"+[i]);
        }
    }
}

function findLongestRowLength(){
    var longestRowLength = mountainDataArray[0].length;
    for(i=0;i<mountainDataArray.length;i++){
        if(mountainDataArray[i].length>=longestRowLength) {
            longestRowLength = mountainDataArray[i].length;
        }
    }
    return longestRowLength;
}

function generateRandomMountainData(xAxis,yAxis,maximumHeight) {
    var highestPointPos = [Math.round(Math.random()*xAxis),Math.round(Math.random()*yAxis)];
    noise.seed(prompt("Enter the see you wish to use for map generation",Math.random()));
    mountainDataArray = [];
    for(i=0;i<yAxis;i++) {
        mountainDataArray[i] = [];
        for(j=0;j<xAxis;j++) {
            var value = noise.simplex2(i/xAxis, j/yAxis);
            //console.log(value);
            mountainDataArray[i][j] = Math.round(Math.abs(value) * maximumHeight);
            //mountainDataArray[i][j] = Math.round(Math.random()*maximumHeight);
            //console.log(noise.simplex2())
        }
    }
}

document.addEventListener("keydown",function(e){
    if(e.keyCode===40) {
        // Down arrow key:
        generateRandomMountainData(prompt("Landscape xAxis length",10),prompt("Landscape yAxis length",10),prompt("Maximum tile value(a.k.a height)",100));
        buildMountain();
    }
    if(e.keyCode===66) {
        // B key:
        buildMountain();
    }
    if(e.keyCode===16) {
        // Left shift key:
        noise.seed(Math.random());

        for (var y = 0; y < mountainDataArray.length; y++) {
            for (var x = 0; x < mountainDataArray[y].length; x++) {
                // All noise functions return values in the range of -1 to 1.
                var nx = x/mountainDataArray[y].length , ny = y/mountainDataArray.length;
                // noise.simplex2 and noise.perlin2 for 2d noise
                var value = noise.simplex2(x / 100, y / 100);
                console.log(Math.abs(value)*256);
                // ... or noise.simplex3 and noise.perlin3:
                //var value = noise.simplex3(x / 100, y / 100, time);
                mountainDataArray[y][x] = Math.round(Math.abs(value)*256); // Or whatever.
            }
        }
        //console.log(mountainDataArray);
    }
});

function colorLandscape(tileID) {
    document.getElementById(tileID).style.background = "rgb(0%,"+Number(document.getElementById(tileID).innerHTML)+"%,"+(100-Number(document.getElementById(tileID).innerHTML))+"%)";
    document.getElementById(tileID).style.color = "rgb(0%,"+Number(document.getElementById(tileID).innerHTML)+"%,"+(100-Number(document.getElementById(tileID).innerHTML))+"%)";
}




window.onload = function() {
    buildMountain();
}