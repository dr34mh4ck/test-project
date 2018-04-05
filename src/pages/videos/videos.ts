import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions, /**ConfigurationData*/ } from '@ionic-native/media-capture';
import { VideoEditor, GetVideoInfoOptions } from '@ionic-native/video-editor';
import { File, DirectoryEntry, FileEntry } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Http, Headers } from '@angular/http';
import { UploadVideo } from './../../services/uploadVideo.service'
import 'rxjs/add/operator/map';

/**
 * Generated class for the VideosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-videos',
  templateUrl: 'videos.html',
})
export class VideosPage {

  public imagenPreview: any;
  public videoPreview: any;
  private token: string;
  private url: string = 'https://csdev-test.herokuapp.com/';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _mediaCapture: MediaCapture,
    private _file: File,
    private _http: Http,
    private _transfer: FileTransfer,
    private _videoEditor: VideoEditor,
    private _uploadVideo: UploadVideo) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideosPage');
  }


  public captureSingleImage() {
    let options: CaptureImageOptions = { limit: 1 };
    this._mediaCapture.captureImage(options)
      .then(
      (data: MediaFile[]) => {
        let file = data.pop();
        let path = file.fullPath.replace('file:', '');
        this.imagenPreview = path;
      },
      (err: CaptureError) => console.error(err)
      );
  }

  public verFormatos() {
    console.log('Formatos Videos-----------------------------------------');
    console.log(this._mediaCapture.supportedVideoModes.length)
    for (let mode of this._mediaCapture.supportedVideoModes) {
      console.log(JSON.stringify(mode));
    }
    console.log('Formatos Imagenes-----------------------------------------');
    console.log(this._mediaCapture.supportedImageModes.length)
    for (let mode of this._mediaCapture.supportedImageModes) {
      console.log(JSON.stringify(mode));
    }
  }

  public captureVideo() {
    const fileTransfer: FileTransferObject = this._transfer.create();
    let options: CaptureVideoOptions = { limit: 1, duration: 60, quality: 1 };
    let self = this;
    this._mediaCapture.captureVideo(options).then(
      (data: MediaFile[]) => {
        let file1 = data.pop();
        let path = file1.fullPath.replace('file:', '');
        let dir = file1.fullPath.substring(0, file1.fullPath.lastIndexOf('/'));
        let fileName = file1.fullPath.substring((file1.fullPath.lastIndexOf('/') + 1), file1.fullPath.length);
        let headers = {
          'Authorization': "JWT " + self.token
        };
        let uploadOptions: FileUploadOptions = {
          fileKey: 'file',
          headers: headers,
          httpMethod: 'POST',
          mimeType: 'video/mp4',
          chunkedMode: true
        };
        self._file.resolveDirectoryUrl(dir).then(
          (directory: DirectoryEntry) => {
            this._file.getFile(directory, fileName, {}).then(
              (file: FileEntry) => {
                file.file(function (video) {
                  let newFilename = 'cs' + fileName.substring(0, fileName.lastIndexOf('.'));
                  let getVidOpt: GetVideoInfoOptions = { fileUri: file1.fullPath }
                  self._videoEditor.getVideoInfo(getVidOpt).then(
                    vidInfo => {
                      let width = Math.floor(vidInfo.width * 0.5);
                      let height = Math.floor(vidInfo.height * 0.5);
                      self._videoEditor.transcodeVideo({
                        fileUri: file1.fullPath,
                        outputFileName: newFilename,
                        outputFileType: 1,
                        deleteInputFile: true,
                        width: width,
                        height: height,
                        videoBitrate: 1000000
                      }).then((fileUri: string) => {
                        console.log('video transcode success');
                        console.log(fileUri);
                        let newDir = 'file://' + fileUri.substring(0, fileUri.lastIndexOf('/'));
                        self._file.resolveDirectoryUrl(newDir).then(
                          (newDirectory: DirectoryEntry) => {
                            newFilename = newFilename + '.mp4'
                            console.log('directory resolved');
                            console.log(JSON.stringify(newDirectory));
                            self._file.getFile(newDirectory, newFilename, {}).then(
                              (newFile: FileEntry) => {
                                console.log('preparando video para subir...');
                                newFile.file(function (videoFile) {

                                  var reader = new FileReader();
                                  reader.onloadend = function () {
                                    console.log('LOAD ENDED .......');
                                    // Create a blob based on the FileReader "result", which we asked to be retrieved as an ArrayBuffer
                                    var blob = new Blob([new Uint8Array(this.result)], { type: "video/mp4" });
                                    self._uploadVideo.upload(blob, self.token).then(res => {
                                      console.log("Succes" + res);

                                    },
                                      err => {
                                        console.log(err);

                                      })

                                    /*var oReq = new XMLHttpRequest();

                                    oReq.onload = function (oEvent) {
                                      // all done!
                                      console.log('ARCHIVO SUBIDO EXITOSAMENTE');
                                      self.videoPreview = 'https://s3.us-east-2.amazonaws.com/camstories/44222f3e-2168-4be6-8706-4cc288fdbb5e.mp4';
                                    };


                                    oReq.onreadystatechange = function (e) {
                                      if (4 == this.readyState) {
                                        console.log(['xhr upload complete************', e]);
                                        console.log(JSON.stringify(e));
                                      }
                                    };

                                    oReq.open("POST", "https://csdev-test.herokuapp.com/upload", true);
                                    oReq.setRequestHeader('Authorization', "JWT " + self.token);
                                    oReq.setRequestHeader("Content-Type", "multipart/form-data");


                                    console.log('Passing the blob to the xhr');
                                    // Pass the blob in to XHR's send method
                                    var formData = new FormData();
                                    formData.append("file", blob);
                                    oReq.send(formData);*/
                                  };
                                  console.log('reading file with buffer reader');
                                  // Read the file as an ArrayBuffer
                                  reader.readAsArrayBuffer(videoFile);

                                });
                              },
                              err => {
                                console.error('Error leyendo archivo transcodificado ', err);
                                console.log(JSON.stringify(err));
                              }
                            );
                          },
                          err => {
                            console.error('Error leyendo nuevo directorio');
                            console.log(JSON.stringify(err));
                          });
                      }).catch((error: any) => {
                        console.log('video transcode error', error);
                        console.log(JSON.stringify(error));
                      });
                    }
                  ).catch(err => {
                    console.error('Error obteniendo informacion del video: ', err);
                    console.log(JSON.stringify(err));
                  });
                  console.log('Result File::::');
                  console.log(JSON.stringify(video));
                  self.videoPreview = video;
                });
              },
              err => console.error('Error leyendo archivo; ', err)
            );
          },
          err => console.error(err)
        );
        this.imagenPreview = path;
      },
      (err: CaptureError) => console.error(err)
    );
  }


  public autenticar() {
    let self = this;
    let params = { 'username': 'david', 'password': 'root' };
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + 'login', JSON.stringify(params), { headers: headers })
      .map(res => res.json()).subscribe(
      response => {
        self.token = response.access_token;
        console.log(self.token);
      },
      error => {
        console.error('error autenticando:: ', error);
      }
      );
  }


}
