import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global'
import { ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
/* import { UploadService } from '../services/upload.service'; */
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public albums: Album[];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService,

    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;

    }

    ngOnInit() {
        //llamar al metodo del api para sacar un artista en base a su id get Artist
        this.getArtist();
    }

    getArtist() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._artistService.getArtist(this.token, id).subscribe(
                response => {
                    if (!response.artist) {
                        this._router.navigate(['/']);
                    } else {
                        this.artist = response.artist;
                        //sacar los albums del artista
                        this._albumService.getAlbums(this.token, response.artist._id).subscribe(
                            response=> {
                                if (!response.albums) {
                                    this.alertMessage = 'Este artista no tiene albums';
                                }else{
                                    
                                    this.albums = response.albums;
                                }
                            },
                            error => {
                                var errorMessage = <any>error;
                                if (errorMessage != null) {
                                    var body = JSON.parse(error._body)
                                    //this.alertMessage = body.message;
                                    console.log(error);
                                }
                            }
                        )
                    }
                },
                error => {
                    var errorMessage = <any>error;
                    if (errorMessage != null) {
                        var body = JSON.parse(error._body)
                        //this.alertMessage = body.message;
                        console.log(error);
                    }
                }
            );
        });
    }
public confirmado;
    onDeleteConfirm(id){
        this.confirmado = id;
    }

    onCancelAlbum(){
       this.confirmado = null; 
    }

    onDeleteAlbum(id){
        this._albumService.deleteAlbum(this.token, id).subscribe(
            response => {
                if (!response.album) {
                    alert('Error en el servidor');
                }
                this.getArtist();
            },
            error => {
                var errorMessage = <any>error;
                if (errorMessage != null) {
                    var body = JSON.parse(error._body)
                    //this.alertMessage = body.message;
                    console.log(error);
                }
            }
        )
    }

}