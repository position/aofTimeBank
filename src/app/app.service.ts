import { Injectable } from '@angular/core';

@Injectable()

export class AofTimebankService {
	
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
    public point: any;
    
    constructor(
        context: CanvasRenderingContext2D,
        options: any,
        alpha: number,
        point: any = {}
        /*
        dx: number,
        dy: number,
        width: number,
        height: number,
        ticksPerFrame: number,
        numberOfFrames: number,
        image: HTMLImageElement
        */
        
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
        this.alphaValue = alpha;
        this.point = point;
        
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
       // console.log('update');
    }

    public render(){
        this.update();
        // Clear the canvas
        //this.context.clearRect(0, 0, this.width, this.height);
        
        // Draw the animation
        if(this.isSprite){
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
        } else {
            //이미지 스프라이트가 아닌것은 로프이미지 밖에 없으므로 아래 코드 실행
            this.context.drawImage(this.image, this.dx, this.dy, this.width, this.height, 0, 20, this.width, this.height);
            //로프가 점점 줄어듬
           // this.context.clearRect(this.dx, this.dy, this.width, this.height);
        }
        //this.context.drawImage(image, x, y, 78, 50, 0, 20, 78, 50);

        //console.log('render', this.width);
    }
}
