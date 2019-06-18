class Poisson {

    constructor(size, srcCount, dynamicFlag = false){
        this.size = size;
        this.sourceCounter = srcCount;
        this.sources = this.initSources(size, srcCount);
        this.canvas = {};
        this.isDynamic = dynamicFlag;
        this.space = this.initSpace(size);
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
        sourcePoints[1] = this.makePoint(20,20,75);
        sourcePoints[2] = this.makePoint(20,40,75);
        sourcePoints[3] = this.makePoint(60,60,75);
        sourcePoints[4] = this.makePoint(80,80,75);

        return sourcePoints;
    }

    makePoint = (x,y,val) => {return {x,y,val}} ;

    setStaticSources = () => {
        this.sources.forEach(element => {
            this.space[element.x][element.y] = element.val;
        })
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
            this.calculate()
            if(this.isDynamic){
                console.log("TODO: ITERATION DYNAMIC SRC")
            }
        }

        this.drawSpace();
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