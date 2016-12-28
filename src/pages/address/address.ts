import { Component,OnInit } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {Address,UserInfo} from '../../app/app.module';
import { ValuesService } from '../../services/ValuesService';
import { LoadingController } from 'ionic-angular';
import {LoginPage} from '../login/login';
/*
  Generated class for the Address page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-address',
  templateUrl: 'address.html'
})
export class AddressPage  implements OnInit {
	public loading :any= this.loadingCtrl.create({
      content: "Please wait...",      
      dismissOnPageChange: true
    });
	public userInfo :UserInfo;
public myVar:boolean;
public address:any={
				Address1:'',
				Address2:'',
				State:'',
				City:'',
				Country:'India',
				Address3:'',
				UserName:'',
				Id:0,
				IsDefault:false,
				PostalCode:''
				};
	ngOnInit() {
		
		
  }
	

  constructor(public navCtrl: NavController,
	public loadingCtrl: LoadingController,public navParams: NavParams,
	public valuesService:ValuesService) {
		
			let add:string =  this.navParams.get('address');	
			console.log(this.navParams);
if(add!=null)
{
	let addd : string[] = add.split(',');
	
	this.address.Address1=addd[0];
	this.address.State=addd[2];
	this.address.City=addd[1];
	this.address.PostalCode=addd[3];
}	
			let currentUser = 	localStorage.getItem('UserInfo');
			console.log(currentUser);
			if(currentUser!=null)
			{
				this.userInfo =  this.valuesService.UserInfo;
			
				if(this.userInfo.Addresses!=undefined && this.userInfo.Addresses.length==0)
			{
				
					
				this.myVar=true;
			}
			else
			{
			this.myVar=false;
			}
			}	else{
				this.navCtrl.push(LoginPage);
			}
			
	}
EditAddress(Addresses:any)
{
	this.address=Addresses;
	this.myVar=!this.myVar;
}
GoBack()
{
	this.myVar=!this.myVar;
}
remove(id:number)
{	this.loading.present();
	this.valuesService.DeleteAddress(id).
	 subscribe(
                da => 
		  
			{
				this.userInfo.Addresses = this.userInfo.Addresses
      .filter(todo => todo.Id !== id);
			localStorage.setItem('UserInfo',JSON.stringify(this.userInfo));
				console.log(this.userInfo);
			      this.navCtrl.pop();
			
					this.loading.dismiss();
           this.navCtrl.push(AddressPage);
	},err => {
											this.loading.dismiss();
									});
}
	
	 save(model: Address, isValid: boolean) {
  
		if(isValid)
		{this.loading.present();
			if(model.Id>0)
			{
			this.valuesService.UpdateAddress(model)
            .subscribe(
                da => {	
							this.loading.dismiss();
									this.userInfo.Addresses = this.userInfo.Addresses
      .filter(todo => todo.Id !== model.Id);
		                 
			this.userInfo.Addresses.push(model);
			localStorage.setItem('UserInfo',JSON.stringify(this.userInfo));
			this.navCtrl.pop();
			
 this.navCtrl.push(AddressPage);
			this.myVar=false;
									});
			}
			else{
				this.valuesService.InsertAddress(model)
            .subscribe(
                da => {	
							this.loading.dismiss();
										this.userInfo.Addresses.push(da);
			localStorage.setItem('UserInfo',JSON.stringify(this.userInfo));
			this.navCtrl.pop();
			
 this.navCtrl.push(AddressPage);
									this.myVar=false;});
			}
		}
  }

}
export class SerializationHelper {
    static toInstance<T>(obj: T, json: string) : T {
        var jsonObj = JSON.parse(json);

        if (typeof obj["fromJSON"] === "function") {
            obj["fromJSON"](jsonObj);
        }
        else {
            for (var propName in jsonObj) {
                obj[propName] = jsonObj[propName]
            }
        }

        return obj;
    }
}