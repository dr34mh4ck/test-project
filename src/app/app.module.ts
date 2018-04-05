import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { VideosPage } from '../pages/videos/videos';

import { PaypalPage } from '../pages/paypal/paypal';

import { MediaCapture } from '@ionic-native/media-capture';

import { File } from '@ionic-native/file';

import { FileTransfer } from '@ionic-native/file-transfer';

import { HttpModule } from '@angular/http';

import { VideoEditor } from '@ionic-native/video-editor';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PaypalPage,
    VideosPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PaypalPage,
    VideosPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MediaCapture,
    File,
    FileTransfer,
    VideoEditor,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
