import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { AofTimebankService } from './app.service';
import { iSprite } from './app.interface';

@Component({
    selector: 'aof-timebank',
    template:`<canvas #aofTimebankCanvas width="240" height="96"></canvas>`
})

export class AofTimebankComponent implements AfterViewInit {
    private context: CanvasRenderingContext2D;    
    private imgDynamite: HTMLImageElement = new Image(); //다이너마이트 이미지
    private imgRope: HTMLImageElement = new Image(); //로프 이미지
    private imgFire: HTMLImageElement = new Image(); //불꽃 이미지
    private imgExplosion: HTMLImageElement = new Image(); //폭발 이미지
    private anmationFrame: any; //requestAnimationFrame
    private bezierXY: Object; //곡선 x, y 좌표값
    private percent: number = 0;
    private direction: number = 1;
    private fps: number = 0.4; //속도조절
    private isTimeBomb: boolean = false; //심지가 타고 있는 중인가?
    private fireSpriteOptions: iSprite; //
    private dynamiteSpriteOptions: iSprite;
    private ropeSpriteOptions: iSprite;
    private explosionSpriteOptions: iSprite;
    private frameIndex = 0;
	private tickCount = 0;
    private alphaValue:number = 0;//알파 값
    private alphaChangeAmount:number = 0.08;//알파 속도 값
    private explosionSprite: any;
    
    @ViewChild('aofTimebankCanvas') aofTimebankCanvas: any;

    constructor( ){
        //이미지 객체의 src request를 미리 받아옴
        this.imgDynamite.src = 'assets/img/dynamite_sprite.png';
        this.imgRope.src = 'assets/img/rope.png';
        this.imgFire.src = 'assets/img/dynamite_fire_sprite.png';
        this.imgExplosion.src = 'assets/img/explosion_sprite.png';

        //각각의 스프라이트 이미지 옵션 객체 생성
        this.fireSpriteOptions = {
            name: 'fire',
            width: 138,
            height: 54,
            dx: 0,
            dy: 0,
            image: this.imgFire,
            numberOfFrames: 3,
            ticksPerFrame: 3,
            isSprite: true
        }
        this.ropeSpriteOptions = {
            name: 'rope',
            width: 138,
            height: 28,
            dx: 70,
            dy: 41,
            image: this.imgRope,
            numberOfFrames: 0,
            ticksPerFrame: 0,
            isSprite: false
        }
        this.explosionSpriteOptions = {
            name: 'explosion',
            width: 1395,
            height: 100,
            dx: 0,
            dy: 0,
            image: this.imgExplosion,
            numberOfFrames: 15,
            ticksPerFrame: 3,
            isSprite: true
        }
    }
    
    ngAfterViewInit() {
        let canvas: HTMLCanvasElement = this.aofTimebankCanvas.nativeElement;
        this.context = canvas.getContext('2d');
        this.context.canvas.style.width = '100%';
        console.log(this.context);
        this.explosionSprite = new createSpriteObject(this.context, this.explosionSpriteOptions);
        this.motion();
    }
    
    public motion = () => {
        
        this.context.clearRect(0, 0, 240, 96);
        this.percent += (this.direction * this.fps);
        
        if (this.percent < 0) {
            this.percent = 0;
            this.direction = 1;
        }
        if(this.percent >= 60){
            //console.log('빨간색 경고 다이너마이트 깜빡깜빡');
            this.alphaValue += this.alphaChangeAmount;
            if (this.alphaValue >= 0.7) {
                this.alphaValue = 0.7;
                this.alphaChangeAmount *= -1;
            } else if ( this.alphaValue <= 0 ) {
                this.alphaValue = 0;
                this.alphaChangeAmount *= -1;
            }
        }
        if (this.percent > 98) {
            //console.log('시간초과 폭파 뻥!!');
            this.alphaValue = 1;
            this.explosionSprite.render();
            if(this.isTimeBomb && this.percent < 100){
                //타임뱅크가 종료되면 아래 메서드 실행
                this.timebankEnd();
            }
        }
        if(this.percent > 120){
            this.percent = 0;
            this.direction = 0;
            this.fps = 0;
        }

        this.drawBezierCurve(this.percent);
        this.fireSpriteDrawImage(this.bezierXY, this.ropeSpriteOptions);
        this.dynamiteDrawImages(this.imgDynamite, 0, 0, this.alphaValue);
        this.dynamiteDrawImages(this.imgDynamite, 78, 0, this.alphaValue);
        this.fireSpriteDrawImage(this.bezierXY, this.fireSpriteOptions);

        this.anmationFrame = requestAnimationFrame(this.motion);
    }

    public dynamiteDrawImages(image: any, x: number, y: number, alpha: number = 0){
        if(!this.isTimeBomb){
            let alphaVal = (x == 78) ? alpha : 1;
            this.context.save();
            this.context.translate(0, 0);
            this.context.globalAlpha = alphaVal;
            this.context.drawImage(image, x, y, 78, 50, 0, 20, 78, 50);
        }
    }
    
    public fireSpriteDrawImage(point: any = {}, options: any, alpha: number = 1){
        if(!this.isTimeBomb){
            let name = options.name,
                image = options.image,
                width = options.width,
		        height = options.height,
                dx = options.dx,
                dy = options.dy,
                ticksPerFrame = options.ticksPerFrame || 0,
                numberOfFrames = options.numberOfFrames || 1,
                isSprite = options.isSprite;

            this.context.save();
            //context의 투명도를 조절한다.
            this.context.globalAlpha = alpha;
            this.context.translate(0, 0);

            //이미지 스프라이트인 이미지만 아래 코드 실행
            if(isSprite){
                this.tickCount += 1;
                if (this.tickCount > ticksPerFrame) {
                    this.tickCount = 0;
                    // If the current frame index is in range
                    if (this.frameIndex < numberOfFrames - 1) {	
                        // Go to the next frame
                        this.frameIndex += 1;
                    } else {
                        this.frameIndex = 0;
                    }
                }
                //불꽃 스프라이트만 아래코드 실행 x,y 좌표를 받아하므로
                let x: number = (name == 'fire') ? point.x - 20 : 0;
                let y: number = (name == 'fire') ? point.y - 9 : 0;
                this.context.drawImage(
                    image, 
                    this.frameIndex * width / numberOfFrames, 
                    0, 
                    width / numberOfFrames,
                    height,
                    x,
                    y,
                    width / numberOfFrames,
                    height
                );
                
            } else {
                //이미지 스프라이트가 아닌것은 로프이미지 밖에 없으므로 아래 코드 실행
                this.context.drawImage(image, dx, dy, width, height);
                //로프가 점점 줄어듬
                this.context.clearRect(point.x, dy, width, height);
            }
            this.context.restore();
        } 
    }
    
    public drawBezierCurve(sliderValue){
        this.context.beginPath();
        this.context.moveTo(208, 42);
        this.context.bezierCurveTo(143, 60, 150, -2, 70, 33);
        this.context.strokeStyle = 'rgba(0, 0, 0, 0)';
        this.context.stroke();
        if(!this.isTimeBomb){
            if (sliderValue < 100) {
                let percent = sliderValue / 99;
                this.isTimeBomb = percent > 1 ? true : false;
                this.bezierXY = this.getCubicBezierXYatPercent({
                    x: 208,
                    y: 42
                }, {
                    x: 143,
                    y: 60
                }, {
                    x: 150,
                    y: -2
                }, {
                    x: 70,
                    y: 33
                }, percent);
            }
        }
    }

    public getCubicBezierXYatPercent(startPt, controlPt1, controlPt2, endPt, percent) {
        let x = this.cubicN(percent, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
        let y = this.cubicN(percent, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
        return ({
            x: x,
            y: y
        });
    }

    //cubic helper formula at percent distance
    public cubicN(pct, a, b, c, d) {
        let t2 = pct * pct;
        let t3 = t2 * pct;
        return a + (-a * 3 + pct * (3 * a - a * pct)) * pct + (3 * b + pct * (-6 * b + b * 3 * pct)) * pct + (c * 3 - c * 3 * pct) * t2 + d * t3;
    }
    
    public timebankEnd(){
        console.log('타임 뱅크 종료!!!!!');
    }
}

class createSpriteObject {
    public context: CanvasRenderingContext2D;
    public width: number;
    public height: number;
    public dx: number;
    public dy: number;
    public ticksPerFrame: number;
    public numberOfFrames: number;
    public image: HTMLImageElement;
    public frameIndex = 0;
    public tickCount = 0;
    public spriteName: string;
    public alphaValue: number;
    public isSprite: boolean;
    
    constructor(
        context: CanvasRenderingContext2D = null,
        options: any = {}
    ){
        this.context = context;
        this.spriteName = options.name;
        this.dx = options.dx;
        this.dy = options.dy;
        this.width = options.width;
        this.height = options.height;
        this.ticksPerFrame = options.ticksPerFrame;
        this.numberOfFrames = options.numberOfFrames;
        this.image = options.image;
        this.isSprite = options.isSprite;
    }

    public update(){
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            // If the current frame index is in range
            if (this.frameIndex < this.numberOfFrames - 1) {	
                // Go to the next frame
                this.frameIndex += 1;
            } else {
                this.frameIndex = 0;
            }
        }
    }

    public render(){
        this.update();
        // Clear the canvas
        this.context.clearRect(0, 0, this.width, this.height);
        // Draw the animation
        this.context.drawImage(
            this.image,
            this.frameIndex * this.width / this.numberOfFrames,
            0,
            this.width / this.numberOfFrames,
            this.height,
            this.dx,
            this.dy,
            this.width / this.numberOfFrames,
            this.height
        );
    }
}
