import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare var Peer: any;

@Component({
  selector: 'app-citofono',
  templateUrl: './citofono.component.html',
  styleUrls: ['./citofono.component.scss']
})
export class CitofonoComponent implements OnInit {

  @ViewChild('myvideo') myvideo: ElementRef;


  peer;
  mypeerid;
  anotherid;

  constructor() {

    const peerserver = {
      host: 'rtc.pignus.app',
      port: 443,
      path: '/',
      secure: true,
      debug: 3,
    };

    this.peer = new Peer(null, peerserver);

  }

  ngOnInit() {

    this.peer.on('open', id => {
      this.mypeerid = id;
    });

    let n = <any>navigator;
    let video = this.myvideo.nativeElement;
    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;

    this.peer.on('call', call => {
      n.getUserMedia({video: true, audio: true}, stream => {
        call.answer(stream);
        call.on('stream', remotestream => {
          video.src = URL.createObjectURL(remotestream);
          video.play();
        });
      }, error => {
        console.log('Failed to get stream', error);
      });
    });
  }

  makeCall() {

    let n = <any>navigator;
    let video = this.myvideo.nativeElement;
    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;

    n.getUserMedia({video: true, audio: true}, (stream) => {
      let call = this.peer.call(this.anotherid, stream);
      call.on('stream', remotestream => {
        video.src = URL.createObjectURL(remotestream);
        video.play();
      });
    }, error => {
      console.log('Failed to get local stream', error);
    });

  }

}
