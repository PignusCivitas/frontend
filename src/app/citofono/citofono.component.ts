import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';

declare var Peer: any;

@Component({
  selector: 'app-citofono',
  templateUrl: './citofono.component.html',
  styleUrls: ['./citofono.component.scss']
})
export class CitofonoComponent implements OnInit {

  @ViewChild('myvideo') myvideo: ElementRef;
  @ViewChild('myanswerButton') myanswerButton: ElementRef;
  @ViewChild('mymsg') mymsg: ElementRef;
  @ViewChild('myhangup') myhangup: ElementRef;


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

    const n = <any>navigator;
    const video = this.myvideo.nativeElement;
    const answerButton = this.myanswerButton.nativeElement;
    const msg = this.mymsg.nativeElement;
    const hangup = this.myhangup.nativeElement;
    hangup.style = 'display: none';
    answerButton.style = 'display: none';

    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;

    const answerOnClick = fromEvent(answerButton, 'click');

    this.peer.on('call', call => {
      n.getUserMedia({video: true, audio: true}, stream => {
        answerButton.style = 'display: inline';
        msg.innerHTML = 'Incoming Call...';
        answerOnClick.subscribe(x => {
          call.answer(stream);
          call.on('stream', remotestream => {
            video.src = URL.createObjectURL(remotestream);
            video.play();
            answerButton.style = 'display: none';
            hangup.style = 'display: inline';
            msg.innerHtml = 'Connected';
          });
        }, err => {
          console.log('Error:', err);
        }, () => {
          console.log('Completed');
        });


      }, error => {
        console.log('Failed to get stream', error);
      });
    });

  }

  makeCall() {

    const n = <any>navigator;
    const video = this.myvideo.nativeElement;
    const answerButton = this.myanswerButton.nativeElement;
    const msg = this.mymsg.nativeElement;
    const hangup = this.myhangup.nativeElement;

    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;

    n.getUserMedia({video: true, audio: true}, (stream) => {
      const call = this.peer.call(this.anotherid, stream);
      call.on('stream', remotestream => {
        video.src = URL.createObjectURL(remotestream);
        video.play();
        hangup.style = 'display:inline';
      });
    }, error => {
      console.log('Failed to get local stream', error);
    });

  }



}
