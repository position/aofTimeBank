import { Injectable } from '@angular/core';

@Injectable()

export class AofTimebankService {
	
	public spriteObj: Object;
	
	constructor(){

	}

	public aofTimebankSprite(spriteObj: any): void{
		this.spriteObj = spriteObj;
		console.log(this.spriteObj);
	}

    public draw = ():void => {
//        this.ctx.save();
//        this.ctx.translate(0, 0);
    }
}
