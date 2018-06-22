import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '../services/global';
import { Song } from '../models/song';

@Component({
    selector: 'player',
    template: `
    <div class="album-image">
        <span *ngIf="song.album">
            <img id="play-image-album" src="{{url + 'get-image-album/' + song.album.image}}" />
        </span>

        <span *ngIf="!song.album">
            <img id="play-image-album" src="assets/images/play-2.png" />
        </span>
    </div>
    <div class="audio-file">
        <span id="play-song-title">
          {{ song.name }} 
        </span>
        <br>
        <span id="play-song-artist">
            <span *ngIf="song.album.artist">
              <p>  {{ song.album.artist.name }} </p>
            </span>
        </span>

        <audio controls id="player">
            <source id="mp3-source" src="{{url + 'get-song-file/' + song.file }}" type="audio/mpeg">
                Tu navegador no es compatible con HTML5
        </audio>
    </div>
        
    `
    
})

export class PlayerComponent implements OnInit {
    public song;
    public url: string;

    constructor() {
        this.url = GLOBAL.url;       
    }

    ngOnInit() {
        

        var song = JSON.parse(localStorage.getItem('sound_song'));
        if (song) {
            this.song = song;
        }else{
            this.song = new Song(1, '', '', '', '');
        }
    }

}