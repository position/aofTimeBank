import { Component, ViewChild, AfterViewInit } from '@angular/core';

@Component({
    selector: 'aof-timebank',
    template:`<canvas #aofTimebankCanvas width="240" height="96"></canvas>`
})

export class AofTimebankComponent implements AfterViewInit {
    private context: CanvasRenderingContext2D;
    private imgDynamite: any = new Image(); //다이너마이트 이미지
    private imgRope: any = new Image(); //로프 이미지
    private imgFire: any = new Image(); //불꽃 이미지
    private imgExplosion: any = new Image(); //폭발 이미지
    private anmationFrame: any;
    private fireX: number = 93;
    private vx: number = 0.5;
    private bezierXY: Object;
    private percent: number = 0
    private direction: number = 1;
    private fps: number = 0.03;
    private isTimeBomb: boolean = false;
    private fireSpriteOptions: Object;
    private dynamiteSpriteOptions: Object;
    private ropeSpriteOptions: Object;
    private explosionSpriteOptions: Object;
    private frameIndex = 0;
	private tickCount = 0;
	
    @ViewChild('aofTimebankCanvas') aofTimebankCanvas: any;

    constructor(){
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
            ticksPerFrame: 10,
            isSprite: true
        }
        this.dynamiteSpriteOptions = {
            name: 'dynamite',
            width: 156,
            height: 50,
            dx: 0,
            dy: 0,
            image: this.imgDynamite,
            numberOfFrames: 2,
            ticksPerFrame: 1,
            isSprite: true
        }
        this.ropeSpriteOptions = {
            name: 'rope',
            width: 138,
            height: 28,
            dx: 70,
            dy: 21,
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
            ticksPerFrame: 20,
            isSprite: true
        }
    }
    
    ngAfterViewInit() {
        let canvas = this.aofTimebankCanvas.nativeElement;
        this.context = canvas.getContext('2d');
        console.log(this.context);
        this.init();
    }

    public init(){
        this.loadImages();
    }

    public loadImages(){
        this.imgDynamite = new Image();
        this.imgDynamite.src = 'assets/img/dynamite.png';
        this.imgDynamite.onload = () => {
            this.context.drawImage(this.imgDynamite, 0, 0);
            this.loadImageComplete();
        }
        this.imgRope = new Image();
        this.imgRope.src = 'assets/img/rope.png';
        this.imgRope.onload = () => {
            this.context.drawImage(this.imgRope, 0, 0);
            this.loadImageComplete();
        }
        this.imgFire = new Image();
            this.imgFire.src = 'assets/img/dynamite_fire_sprite.png';
            this.imgFire.onload = () => {
            this.context.drawImage(this.imgFire, 0, 0);
            this.loadImageComplete();
        }
    }

    public loadImageComplete(){
        this.context.clearRect(0, 0, 240, 96);
        this.context.canvas.style.width = '100%';
        this.motion();
    }

    
    public motion = () => {
        this.context.clearRect(0, 0, 240, 96);
        let bezierXY;
        //this.spriteDrawImage(bezierXY, this.dynamiteSpriteOptions);
        this.timebankDrawImages(this.imgDynamite, 0, 0);
        
        this.percent += (this.direction * this.fps);
        if (this.percent < 0) {
            this.percent = 0;
            this.direction = 1;
        }
        if (this.percent > 25) {
            this.percent = 25;
            this.direction = -1;
        }
        this.drawBezierCurve(this.percent);
        this.anmationFrame = requestAnimationFrame(this.motion);
    }

    public timebankDrawImages(image: any, x: number, y: number){
        this.context.save();
        this.context.translate(x, y);
        this.context.drawImage(image, x, y);
        this.context.restore();
    }
    
    public spriteDrawImage(point: any, options: any){
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

                if(name != 'dynamite' && name != 'explosion'){
                    this.context.drawImage(
                        image, 
                        this.frameIndex * width / numberOfFrames, 
                        0, 
                        width / numberOfFrames,
                        height,
                        point.x - 27, 
                        point.y - 27, 
                        width / numberOfFrames,
                        height
                    );
                } else {
                    this.context.drawImage(
                        image, 
                        this.frameIndex * width / numberOfFrames, 
                        0, 
                        width / numberOfFrames,
                        height,
                        0, 
                        0, 
                        width / numberOfFrames,
                        height
                    );
                }

                
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

        let bezierXY: Object = {};
        if(!this.isTimeBomb){
            if (sliderValue < 25) {
                let percent = sliderValue / 24;
                this.isTimeBomb = percent > 1 ? true : false;
                bezierXY = this.getCubicBezierXYatPercent({
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
        
        this.spriteDrawImage(bezierXY, this.ropeSpriteOptions);
        this.spriteDrawImage(bezierXY, this.fireSpriteOptions);
        this.spriteDrawImage(bezierXY, this.explosionSpriteOptions);
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
    
}