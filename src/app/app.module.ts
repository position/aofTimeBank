import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AofTimebankComponent } from './app.component';
import { AofTimebankService } from './app.service';

@NgModule({
  declarations: [
    AofTimebankComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [AofTimebankService],
  bootstrap: [AofTimebankComponent]
})
export class AppModule { }
