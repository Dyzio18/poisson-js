class Hipek {
    constructor(xCord,yCord, spaceSize){
        this.x = xCord;
        this.y = yCord;
        this.spaceSize = spaceSize;
        this.iterator = 0;
        this.isActive = false;
        this.space = null;
        this.lookPoint = [];
    }

    wakeUp = (space) => {
        this.isActive = true;
        this.space = space;
    }

    draw = () => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "rgb(" + 255 + "," + 0 + "," + 0 + ")";
        ctx.fillRect(this.x , this.y, 1, 1);
    }

    initSearch = () => {
        const initStep = 10;

        if(this.x < (this.spaceSize - initStep)) {
            this.x += initStep;
        } else if (this.x >= (this.spaceSize - initStep)) {
            this.y += initStep;
            this.x = initStep;
        }
        
        if(this.y >= (this.spaceSize - initStep)){
            this.y = initStep;
        }

        //TODO: save value
        console.log(this.getCurrentValue())
        M.toast({html: `I find ${this.getCurrentValue()}`});

        
    }

    getCurrentValue = () => {
        return this.space[this.x][this.y];
    }

    move = (x,y) => {
        this.x++;
        this.y++;
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

    // TODO: make dynamic init
    initSources = (size, srcCount) => {
        const sourcePoints = [];

        sourcePoints[0] = this.makePoint(30,30,100);
        sourcePoints[1] = this.makePoint(2,20,75);
        sourcePoints[2] = this.makePoint(20,40,75);
        sourcePoints[3] = this.makePoint(60,60,75);
        sourcePoints[4] = this.makePoint(80,80,75);

        return sourcePoints;
    }

    randPoint = () => {

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

    iteration = (iterCounter) => {
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
                } else{    
                   this.hipek.initSearch();
                }
            }
        }

        this.drawSpace();
        this.viewIterationBadge();
        this.hipek.draw();
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
                    greyScale = 220;
                } else if(arrValue > 50){
                    greyScale = 200;
                } else if(arrValue > 10){
                    greyScale = 164;
                } else if(arrValue > 4){
                    greyScale = 128;
                } else if(arrValue > 1){
                    greyScale = 64;
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