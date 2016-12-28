import { Platform} from 'ionic-angular';
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {AuthenticationService} from "../../services/login-service";
import {ValuesService} from "../../services/ValuesService";
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {RegisterPage} from "../register/register";

import {Facebook, Google} from "ng2-cordova-oauth/core";
import {OauthCordova} from 'ng2-cordova-oauth/platform/cordova';
import 'rxjs/add/operator/catch';
import  'rxjs/add/operator/mergeMap'; 
/*
 Generated class for the LoginPage page. 

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
 private oauth: OauthCordova = new OauthCordova();
    private facebookProvider: Facebook = new Facebook({
      clientId: "1828020577450397",
      appScope: ["email"]
    });
		
		 private GoogleProvider: Google = new Google({
      clientId: "406482357619-hmp0u9j36fst2dt9mhj8nefe8ked5rlb.apps.googleusercontent.com",
      appScope: ["email"] 
    })
		
public username:string;
public token:string;
public loading :any= this.loadingCtrl.create({
      content: "Please wait...",      
      dismissOnPageChange: true
    });
public password:string;
  constructor(public nav: NavController, 
	            private authenticationService: AuthenticationService,
							public loadingCtrl: LoadingController,
							public valuesService: ValuesService,
							public alertCtrl: AlertController,public platform:Platform)
							{ 					
							this.platform = platform;
								localStorage.removeItem("UserInfo");
						    localStorage.removeItem('currentUser');				
  }

   // go to register page
  register() {
    this.nav.setRoot(RegisterPage);
  }
	
public launch(url:any) {
        this.platform.ready().then(() => {
            this.oauth.logInVia(this.facebookProvider).then(success => {
                console.log("RESULT: " + JSON.stringify(success));
            }, error => {
                console.log("ERROR: ", error);
            });
        });
    }
		public googleLogin(url:any) {
        this.platform.ready().then(() => {
            this.oauth.logInVia(this.GoogleProvider).then(success => {
                console.log("RESULT: " + JSON.stringify(success));
								  this.nav.setRoot(HomePage);
            }, error => {
                console.log("ERROR: ", error);
            });
        });
    }
		
  // login and go to home page
  login() { 
	
		this.loading.present();
		 this.authenticationService.login(this.username, this.password)
            .subscribe(
                data => {
										this.getUserInfo();
                    
  
                }, 
                error => {
									this.loading.dismiss();
                  this.nav.setRoot(LoginPage);
                });
    
  }
	
	
	getUserInfo()
	{
		this.valuesService.getAll()
            .subscribe(
                data => {		
                				this.getCatogories();				
                localStorage.setItem('UserInfo',JSON.stringify(data)); 
                }, 
                error => {
									this.loading.dismiss();
                  
                });
								
	}
	
	getCatogories()
	{
		this.valuesService.getAllCategories()
            .subscribe(
                data => {			this.loading.dismiss();							
		
		 localStorage.setItem('categories',JSON.stringify(data)); this.nav.setRoot(HomePage);
                }, 
                error => {
                  	this.loading.dismiss();
                });		
	}
}

