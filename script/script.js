class Point{
    constructor(x,y,color){
        this.x = x;
        this.y = y;
        this.color = color;
    }

    equalTo(point){
        return point.x == this.x && point.y == this.y
    }
}

class Figure{
    constructor(){
        this.points = [];
    }

    draw(field){
        this.points.forEach(point => field.drawPoint(point))
    }
}

class Field{
    constructor(width, height, psize, canvas){
        this.width = width;
        this.height = height;
        this.psize = psize;
        this.canvas = canvas;
        this.dc = canvas.getContext("2d");
        this.canvas.width = width*psize;
        this.canvas.height = height*psize;
        this.clear();
    }

    clear(){
        this.dc.strokeStyle = "red";
        this.dc.lineWidth = 4;
        this.dc.clearRect(0,0,this.width*this.psize,this.height*this.psize);
        this.dc.strokeRect(0,0,this.width*this.psize,this.height*this.psize);
    }

    drawPoint(point){
        this.dc.fillStyle = point.color;
        this.dc.fillRect(this.psize*point.x, this.psize*point.y, this.psize, this.psize);
    }
}

/*class Diahonal extends Figure{
    constructor(){
        super();
        for(let i=0;i<7;i++){
            this.points.push(new Point(i,i,"red"))
        }
    }
}*/


const TOP_DIR=0, BOTTOM_DIR=1, LEFT_DIR=2, RIGHT_DIR=3;

class Snake extends Figure{
    constructor(len,x,y){
        super();
        this.direction = RIGHT_DIR;
        for(let i=0; i<len; i++){
            this.points.push(new Point(x-i, y, "blue"));
        }

    }
    _getNextPoint(field){
        let point = new Point(0,0,"blue");
        if(this.direction==RIGHT_DIR){
            point.x = (this.points[0].x<field.width-1)?this.points[0].x+1:0;
            point.y = this.points[0].y
        }

        if(this.direction==LEFT_DIR){
            point.x = (this.points[0].x>0)?this.points[0].x-1:field.width-1;
            point.y = this.points[0].y
        }

        if(this.direction==BOTTOM_DIR){
            point.y = (this.points[0].y<field.height-1)?this.points[0].y+1:0;
            point.x = this.points[0].x
        }

        if(this.direction==TOP_DIR){
            point.y = (this.points[0].y>0)?this.points[0].y-1:field.height-1;
            point.x = this.points[0].x
        }
        return point;
    }

     move(field){
        let point = this._getNextPoint(field);
        this.points.unshift(point);
        this.points.pop();
     }

     growUp(field){
         let point = this._getNextPoint(field);
         this.points.unshift(point);
     }

     setDirection(dir){
         if(
             (dir == TOP_DIR && this.direction == BOTTOM_DIR)||
             (dir == BOTTOM_DIR && this.direction == TOP_DIR)||
             (dir == LEFT_DIR && this.direction == RIGHT_DIR)||
             (dir == RIGHT_DIR && this.direction == LEFT_DIR)
         ) this.points.reverse();

         this.direction = dir;
     }

     biteSelf(){
        let head = this.points[0];
        let tails = this.points.slice(1);
        return tails.some(point=>point.equalTo(head));
     }

     isAbleToEat(food){
        return (this.direction == TOP_DIR && food.isTopOf(this.points[0]))
        || (this.direction == BOTTOM_DIR && food.isBottomOf(this.points[0]))
        || (this.direction == LEFT_DIR && food.isLeftOf(this.points[0]))
        || (this.direction == RIGHT_DIR && food.isRightOf(this.points[0]))

     }
}


class Food extends Figure{
    constructor(field, snake){
        super();
        this.snake = snake;
        this.field = field;
        this.points.push(this._generate());
    }

    _generate(){
        let point;
        do {
            this.x = Math.floor(Math.random() * this.field.width);
            this.y = Math.floor(Math.random() * this.field.height);
            point = new Point(this.x, this.y, "red");
        }while(this.snake.points.some(p=>p.equalTo(point)));
        return point;
    }

    nextPos(){
        this.points[0] = this._generate();
    }

    isLeftOf(point){
        return this.points[0].equalTo(new Point(point.x>0?point.x-1:this.field.width-1, point.y))
    }
    isRightOf(point){
        return this.points[0].equalTo(new Point(point.x<this.field.width-1?point.x+1:0, point.y))
    }
    isTopOf(point){
        return this.points[0].equalTo(new Point(point.x, point.y>0?point.y-1:this.field.height-1))
    }
    isBottomOf(point){
        return this.points[0].equalTo(new Point(point.x, point.y<this.field.height-1?point.y+1:0))
    }
}




window.addEventListener("load", function () {
    let cvs = document.getElementById("cvs");
    let f = new Field(20,10,20,cvs);
    let snake = new Snake(3,2,0);
    let food = new Food(f, snake);
    window.addEventListener("keydown", e=>{
        if(e.keyCode == 38) snake.setDirection(TOP_DIR);
        if(e.keyCode == 40) snake.setDirection(BOTTOM_DIR);
        if(e.keyCode == 37) snake.setDirection(LEFT_DIR);
        if(e.keyCode == 39) snake.setDirection(RIGHT_DIR);
    });


    let timer = setInterval(()=>{
        if(snake.isAbleToEat(food)){
            snake.growUp(f);
            food.nextPos();
        }else{
            snake.move(f);
        }

        if(snake.biteSelf()){
            clearInterval(timer);
            alert("Game Over");
        }else{
            f.clear();
            snake.draw(f);
            food.draw(f);
        }


    },100);


    /*let diahonal = new Diahonal();
    diahonal.draw(f);*/

})