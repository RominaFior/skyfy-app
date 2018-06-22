import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from './services/global';
import { UserService } from './services/user.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = 'SKYFY';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url: string;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    
  }

  public onSubmit() {
    console.log(this.user);
    //conseguir los datos de usuario identificado
    this._userService.singup(this.user).subscribe(
      response => {
        var identity = response.user;
        this.identity = identity;
        
        if (!this.identity._id) {
          alert("El usuario no está correctamente identificado")
        } else {
          //crear elemento en el localstorage para tener al usuario en sesion
          localStorage.setItem('identity', JSON.stringify(identity));
          
          //conseguir el token para enviarselo a cada peticion http
          this._userService.singup(this.user, 'true').subscribe(
            response => {
              var token = response.token;
              this.token = token;
              
              if (this.token.length <= 0 ) {
                alert("El token no se ha generado")
              } else {
                //crear elemento en el localstorage para tener el token disponible
                localStorage.setItem('token', token);
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
              }
            },
            error => {
              var errorMessage = <any>error;
              if (errorMessage != null) {
                var body = JSON.parse(error._body)
                this.errorMessage = body.message;
                console.log(error);
              }
            }
          );
        }
        
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var body = JSON.parse(error._body)
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  }
    logout(){
      localStorage.removeItem('identity');
      localStorage.removeItem('token');
      localStorage.clear();
      this.identity = null;
      this.token = null;
      this._router.navigate(['/']);
    }
    

    onSubmitRegister(){
     console.log(this.user_register);
     this._userService.register(this.user_register).subscribe(
       response =>{
        var user = response.user;
        this.user_register = user;

       if (!user._id) {
        this.alertRegister='Error al registrarse';
       }else{
        this.alertRegister=`El registro se ha realizado correctamente, identifícate con ${this.user_register.email}`;
        this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
       } 
       },
       error =>{
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = JSON.parse(error._body)
          this.alertRegister = body.message;
          console.log(error);
        }
       }
     );
    }
  }
