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
  @ViewChild('myhangup') myhangup: ElementRef;


  peer;
  mypeerid;
  anotherid;
  mymsg: string;


  constructor() {
    // PeerServer Configuration
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

    // Get Assigned Peer id
    this.peer.on('open', id => {
      this.mypeerid = id;
    });

    // Variables and constants
    const n = <any>navigator;
    const video = this.myvideo.nativeElement;
    const answerButton = this.myanswerButton.nativeElement;
    const hangupButton = this.myhangup.nativeElement;
    hangupButton.style = 'display: none';
    answerButton.style = 'display: none';

    this.mymsg = 'Awaiting...';

    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;

    const answerOnClick = fromEvent(answerButton, 'click');
    const hangupOnClick = fromEvent(hangupButton, 'click');

    // Answer call context
    this.peer.on('call', call => {
      if (n.mediaDevices) {
        n.getUserMedia({video: true, audio: true}, stream => {
          answerButton.style = 'display: inline';
          this.mymsg = 'Incoming Call...';

          // Answer click event handler
          answerOnClick.subscribe(x => {
            call.answer(stream);
            call.on('stream', remotestream => {
              video.src = URL.createObjectURL(remotestream);
              // Show loading animation.
              const playPromise = video.play();

              if (playPromise !== undefined) {
                playPromise.then(_ => {
                  answerButton.style = 'display: none';
                  hangupButton.style = 'display: inline';
                  this.mymsg = 'Connected';
                })
                .catch(error => {
                  console.log(error);
                });
              }
            });
          }, err => {
            console.log('Error:', err);
          }, () => {
            console.log('Completed');
          });

          // Hangup click event handler
          hangupOnClick.subscribe(x => {
            call.close();
          }, err => {
            console.log('Error:', err);
          }, () => {
            console.log('Completed');
          });

          call.on('close', () => {
            // Show loading animation.
            const playPromise = video.play();

            if (playPromise !== undefined) {
              playPromise.then(_ => {
                video.src = '';
                hangupButton.style = 'display: none';
                this.mymsg = 'Awaiting...';
                stream.getAudioTracks()[0].stop();
                stream.getVideoTracks()[0].stop();
              })
              .catch(error => {
                console.log(error);
              });
            }

          });


       }, error => {
          this.mymsg = 'Failed to get local stream ' + error;
        });
      }

    });

    // On Error Handler
    this.peer.on('error', err => {
      this.mymsg = err;
    });

    // On disconnected handler
    this.peer.on('disconnected', () => {
      this.peer.reconnect();
    });
  }

  makeCall() {

    // Variables and constants
    const n = <any>navigator;
    const video = this.myvideo.nativeElement;
    const hangupButton = this.myhangup.nativeElement;
    this.mymsg = 'Calling...';
    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;

    const hangupOnClick = fromEvent(hangupButton, 'click');

    // Making the Call
    n.getUserMedia({video: true, audio: true}, (stream) => {
      const call = this.peer.call(this.anotherid, stream);

      call.on('close', () => {
        // Show loading animation.
        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise.then(_ => {
            video.src = '';
            hangupButton.style = 'display: none';
            this.mymsg = 'Awaiting...';
            stream.getAudioTracks()[0].stop();
            stream.getVideoTracks()[0].stop();
          })
          .catch(error => {
            console.log(error);
          });
        }
      });

      call.on('stream', remotestream => {
        video.src = URL.createObjectURL(remotestream);
        // Show loading animation.
        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise.then(_ => {
            hangupButton.style = 'display:inline';
            this.mymsg = 'Connected';
          })
          .catch(error => {
            console.log(error);
          });
        }

        // Hangup click event handler
        hangupOnClick.subscribe(x => {
          call.close();
        }, err => {
          console.log('Error:', err);
        }, () => {
          console.log('Completed');
        });
      });
    }, error => {
      console.log('Failed to get local stream ' + error);
    });

  }



}
