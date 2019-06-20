class Hipek {
    constructor(xCord,yCord, spaceSize){
        this.x = xCord;
        this.y = yCord;
        this.spaceSize = spaceSize;
        this.iterator = 0;
        this.isActive = false;
        this.isInitialSearchFinished = false;
        this.isClimbing = false;
        this.isFinish = false;
        this.space = null;
        this.lookedPoint = [];
        this.bestLookedPoint = null;
    }

    wakeUp = (space) => {
        this.isActive = true;
        this.space = space;
    }

    draw = () => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        const hipekIteratorElem = document.querySelector('[data-hipek-iterator]');
        hipekIteratorElem.innerHTML = this.iterator;
        
        ctx.fillStyle = "rgb(" + 255 + "," + 0 + "," + 0 + ")";
        ctx.fillRect(this.x , this.y, 1, 1);
    }

    initSearch = (initStepInput = 15) => {
        const initStep = initStepInput;

        const neighbors = this.getNeigbors();
        const bestNeighbor = this.getBestSearchInPointArray(neighbors);
        
        this.lookedPoint.push({x:bestNeighbor.x, y:bestNeighbor.y, val: bestNeighbor.val})
        this.iterator++;

        // Move to step point
        if(this.x < (this.spaceSize - initStep)) {
            this.x += initStep;
        } else if (this.x >= (this.spaceSize - initStep)) {
            this.y += initStep;
            this.x = initStep;
        }
        
        if(this.lookedPoint.length == 1){
            M.toast({html: `I start initial search`});
        }
        if(this.y >= (this.spaceSize - initStep)){
            this.y = initStep;
            M.toast({html: `I finish initial search`});
            this.isInitialSearchFinished = true;
        }

    }

    getCurrentValue = () => {
        return this.space[this.x][this.y];
    }

    getBestSearchInPointArray= (pointArray) => {
        let bestPoint = pointArray[0];
        pointArray.forEach(elem => {
            if(elem.val > bestPoint.val){
                bestPoint = elem;
            }
        })
        return bestPoint;
    }

    getNeigbors = (xCoord = this.x, yCoord = this.y) => {
        const neighbors = [];
        let i = xCoord;
        let j = yCoord;

        neighbors.push({x:i-1,y:j-1,val: this.space[i-1][j-1]})
        neighbors.push({x:i-1,y:j,val: this.space[i-1][j]})
        neighbors.push({x:i-1,y:j+1,val: this.space[i-1][j+1]})
        
        neighbors.push({x:i,y:j-1,val: this.space[i][j-1]})
        neighbors.push({x:i,y:j+1,val: this.space[i][j+1]})
        
        neighbors.push({x:i+1,y:j-1,val: this.space[i+1][j-1]})
        neighbors.push({x:i+1,y:j,val: this.space[i+1][j]})
        neighbors.push({x:i+1,y:j+1,val: this.space[i+1][j+1]})

        return neighbors;
    }

    bestNeighborValue = () => {
        const neighbors = this.getNeigbors();
        const bestNeighbor = this.getBestSearchInPointArray(neighbors);   

        return bestNeighbor;
    }

    heuristicSearch = () => {
        
        if(!this.hipek.isFinish){

            if(!this.isClimbing && this.isActive && this.lookedPoint.length == 0) {
                alert("Looked points is empty!")
                this.initSearch(10);
            }


            if(!this.isClimbing && this.isActive && this.lookedPoint.length > 0){

                let bestPoint = this.getBestSearchInPointArray(this.lookedPoint);
                this.bestLookedPoint = bestPoint;
                this.move(bestPoint.x, bestPoint.y); 
                this.isClimbing = true;
                M.toast({html: `Go to best looked point to (${bestPoint.x},${bestPoint.y})`});

            } else {

                let nextPoint = this.bestNeighborValue();
                this.move(nextPoint.x,nextPoint.y);    
                
                if(this.space[this.x][this.y] == 75){
                    this.isClimbing = false;
                    let closePoint = this.bestNeighborValue();
                    if(closePoint.val < nextPoint.val){
                        this.lookedPoint = this.lookedPoint.filter(elem => (elem.x != this.bestLookedPoint.x && elem.y != this.bestLookedPoint.y));
                        this.lookedPoint = this.lookedPoint.filter(elem => (elem.x != this.x && elem.y != this.y));
                        M.toast({html: `Found local maximum (${nextPoint.x},${nextPoint.y})=${Math.round(nextPoint.val)}`});
                    }
                }
                
                if(this.space[this.x][this.y] > 99){
                    this.lookedPoint[0] = nextPoint;
                    M.toast({html: `Found MAX source (${nextPoint.x},${nextPoint.y})=${Math.round(nextPoint.val)}`, classes: 'green'});
                    this.finishSearch(true)
                }
            } 
        }
    }
    
    finishSearch = (status) => {
        this.isFinish = true;

        if(!status){
            console.log("Can\'t find max value")
        }

        document.querySelectorAll('#modal-succes').openModal()
        const elem = document.querySelectorAll('.modal')
        const instance = M.Modal.getInstance(elem);
        instance.open();


    }

    move = (x,y) => {
        this.x = x;
        this.y = y;
        this.iterator++;
    }

}

class Poisson {
    constructor(size, srcCount, dynamicFlag = false){
        this.size = size;
        this.sourceCounter = srcCount;
        this.iterationCounter = 0;
        this.sources = this.initSources(size, srcCount);
        this.canvas = {};
        this.isDynamic = dynamicFlag;
        this.space = this.initSpace(size);
        this.hipek = new Hipek(10,10,size);
        this.hipekWakeUpIteration = 1000; // start move after X iteration
        this.animationId = null;
    }

    initHipek = () => {
        this.hipek = new Hipek(20,30);
    }

    initSpace = (size) => {
        const arr = [];
        for(let x = 0; x < size; x++){
            arr[x] = new Float32Array(size);    
            for(let y = 0; y < size; y++){ 
                arr[x][y] = 0;    
            }    
        }
        return arr;
    }

    initSources = (size, srcCount) => {
        const sourcePoints = [];

        // sourcePoints[0] = this.makePoint(68,68,75);
        // sourcePoints[1] = this.makePoint(20,20,75);
        // sourcePoints[2] = this.makePoint(40,40,75);
        // sourcePoints[3] = this.makePoint(60,60,100);
        // sourcePoints[4] = this.makePoint(80,80,75);
        
        sourcePoints[0] = this.randPoint(100);
        sourcePoints[1] = this.randPoint(75);
        sourcePoints[2] = this.randPoint(75);
        sourcePoints[3] = this.randPoint(75);
        sourcePoints[4] = this.randPoint(75);

        return sourcePoints;
    }

    randPoint = (value) => {
        let x = Math.floor(Math.random() * Math.floor(this.size));
        let y = Math.floor(Math.random() * Math.floor(this.size));
         
        if ((x <= 3) || (x >= (this.size - 3)) || (y <= 3) || (y >= (this.size - 3))){
            return this.randPoint(value);
        }

        return {x:x,y:y,val:value};
    }

    makePoint = (x,y,val) => { return {x,y,val} } ;

    setStaticSources = () => {
        this.sources.forEach(element => {
            this.space[element.x][element.y] = element.val;
        })
    }

    moveSources = (point) => {
        const movedPoint = point;
        let randMove = Math.floor(Math.random() * Math.floor(4));

        if(randMove === 0 && movedPoint.x > 1) {
            // left
            movedPoint.x--;
        } else if(randMove === 1  && movedPoint.x < (this.size - 2)){
            // right
            movedPoint.x++;
        } else if(randMove === 2 && movedPoint.y > 1){
            // top
            movedPoint.y--;
        } else if(randMove === 3 && movedPoint.y < (this.size - 2)){
            // bottom
            movedPoint.y++;
        } else {
            this.moveSources(point);
        }

        return movedPoint;
    }

    // Laplace operator
    calculate = () => {
        const SIZE = this.size;
        for( let i=1; i<SIZE-1; i++)
        {
            for( let j=1; j<SIZE-1; j++)
            {
                this.setStaticSources()
                this.space[i][j] = ( this.space[i+1][j] + this.space[i-1][j] + this.space[i][j-1] + this.space[i][j+1] ) * 0.25;
                if(this.space[i][j] < 0.01) { this.space[i][j] = 0};
            }
        }
    }

    normalize = (val, max=100, min=0) => { return ((val - min) / (max - min))*255; }

    iteration = (iterCounter = 1) => {
        for(let i = 0; i < iterCounter; i++){
            this.calculate();
            this.iterationCounter++;
            if(this.isDynamic && (this.iterationCounter % 10 == 0)){
                for(let srcCount = 0; srcCount < this.sources.length; srcCount++){
                    this.sources[srcCount] = this.moveSources(this.sources[srcCount]);
                }     
            }

            if(this.iterationCounter > this.hipekWakeUpIteration){
                if(!this.hipek.isActive){
                    this.hipek.wakeUp(this.space)
                } 
                
                if(!this.hipek.isInitialSearchFinished){    
                   this.hipek.initSearch();
                } else {
                    this.hipek.heuristicSearch();
                }
            }

            if(this.hipek.iterator > 250){ 
                this.stopAnimation();
                this.hipek.finishSearch(false); 
            }
            if(this.hipek.isFinish) {  
                this.stopAnimation();
            }
        }

        this.drawSpace();
        this.viewIterationBadge();
        this.hipek.draw();
    }


    playAnimation = () => {
        this.animationId = setInterval(this.iteration, 500);
    }

    stopAnimation = () => {
        clearInterval(this.animationId);
    }

    setDynamicSourceStatus = (status) => {
        this.isDynamic = status;
    }

    viewIterationBadge = () => {
        const badge = document.querySelector('[data-iteration-counter]');
        badge.innerHTML = `${this.iterationCounter}`
    }

    drawSpace = () => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        const colorArr = []
        const SIZE = this.size;

        for (let i=0; i < SIZE; i++) {
            colorArr[i] = new Int16Array(100)
            for(let j=0; j < SIZE; j++) {
                let arrValue = this.space[i][j];
                let greyScale = 0;
                if (arrValue > 90){
                    greyScale = 255;
                } else if(arrValue > 70){
                    greyScale = 168;
                } else if(arrValue > 50){
                    greyScale = 144;
                } else if(arrValue > 10){
                    greyScale = 128;
                } else if(arrValue > 4){
                    greyScale = 64;
                } else if(arrValue > 1){
                    greyScale = 32;
                } else if( arrValue > 0.1){
                    greyScale = 12;
                } 
    
                colorArr[i][j] = this.normalize(arrValue);             
                greyScale = this.normalize(arrValue);             
                
                ctx.fillStyle = "rgb(" + greyScale + "," + greyScale + "," + greyScale + ")";
                ctx.fillRect(i, j, 1, 1);
            }
        }
    }

}


export default Poisson;