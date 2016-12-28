import {
    Component,ViewChild, ElementRef
} from '@angular/core';
import {
    NavController,
    AlertController,
    NavParams,Platform
} from 'ionic-angular';
import {
    HomePage
} from "../home/home";
import {
    AddressPage
} from "../address/address";
import {
    UserInfo
} from '../../app/app.module';
import {
    CartService
} from '../../services/cart-service';
import {
    ValuesService
} from '../../services/ValuesService';
import {
    LoadingController
} from 'ionic-angular';
import { Geolocation } from 'ionic-native';
declare var google;

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-checkout',
    templateUrl: 'checkout.html'
})
export class CheckoutPage {
	
	public currentAddress:any;
    public DeliveyTime: any;
    public DeliveyDate: string = new Date().toISOString();
    public userInfo: UserInfo;
    public addressId: any;
    public paymentMethod: any = 0;
    public total: any;
    public cart: any[] = [];
    public checkouts: any = {
        DeliveryTime: '',
        DeliveryDate: ''

    };
    public loading: any = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: true
    });

		  // slides for slider 
 @ViewChild('map') mapElement: ElementRef;
  map: any;

 
  loadMap(){
 
    this.platform.ready().then(() => {
 
        let locationOptions = {timeout: 10000, enableHighAccuracy: true};
 
        navigator.geolocation.getCurrentPosition(
 
            (position) => {
               let geocoder = new google.maps.Geocoder;
							 var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                let options = {
                  center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                  zoom: 64,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                }
 
                //this.map = new google.maps.Map(document.getElementById("map"), options);
								
								 geocoder.geocode({'latLng': latlng}, function(results, status) {
 
            if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
              
									this.currentAddress= results[0].formatted_address;
                  var element = document.getElementById("p1");
                  element.innerHTML = this.currentAddress;
									console.log(this.currentAddress);
                    }
            else {
                    console.log('Unable to detect your address.');
										this.currentAddress ='Unable to detect your address.';
                    }
        } else {
             console.log('Unable to detect your address.');	this.currentAddress ='Unable to detect your address.';
        }
    });
            },
 
            (error) => {
                console.log(error);
            }, locationOptions
 
        );
 
    });
 
  }
		
		
		
		
    constructor(public nav: NavController,
        public alertController: AlertController,
        public navParams: NavParams,
        public cartService: CartService,
        private valuesService: ValuesService,
        public loadingCtrl: LoadingController,public platform:Platform) {
        // set data for categories
        this.cart = cartService.getCart();
        let currentUser = localStorage.getItem('UserInfo');
        this.total = this.navParams.get('total');
        if(currentUser != null) {
            this.userInfo = SerializationHelper.toInstance(new UserInfo(), currentUser);
        }
				this.platform = platform;this.loadMap();
				
    }

    // edit address
    editAddress() {
        let prompt = this.alertController.create({
            title: 'Address',
            message: "",
            inputs: [{
                name: 'address',
                value: ''
            }, ],
            buttons: [{
                text: 'Cancel',
                handler: data => {
                    console.log('Cancel clicked');
                }
            }, {
                text: 'Save',
                handler: data => {
                    console.log('Saved clicked');
                }
            }]
        });

        prompt.present();
    }
    GetPayMent(id) {
        this.paymentMethod = id;
    }
    GetAddressId(Id) {
        this.addressId = Id;
    }
		
		addAddress()
		{
			this.nav.push(AddressPage,{address: JSON.stringify(document.getElementById("p1").innerText)});
		}
    GoToAddress() {

            this.nav.push(AddressPage);
        }
        // place order button click
    buy() {
        // show alert
        if(this.addressId > 0 && this.paymentMethod > 0) {
            this.loading.present();
            let OrderDetail = {
                DeliveryTime: this.DeliveyTime,
                DeliveryDate: this.DeliveyDate,
                cart: this.cartService.getCart(),
                AddressId: this.addressId,
                PaymentMethod: this.paymentMethod
            };
            this.PlaceOrder(OrderDetail);

        } else {

        }

    }

    public showAlert() {
        let alert = this.alertController.create({
            title: 'Info',
            subTitle: 'Your order has been sent.',
            buttons: [{
                text: 'OK',
                handler: data => {
           
                    this.cartService.ClearCart();
                    this.nav.setRoot(HomePage);
                }
            }]
        });

        alert.present();
    }

    public PlaceOrder(OrdDetail: any) {
        this.valuesService.PostOrder(OrdDetail).subscribe(
            data => {
                this.getUserInfo();
            },
            error => {
                this.loading.dismiss();
            });
    }
		
		public getUserInfo()
		{
			this.valuesService.getAll().subscribe(
			data=>{
            				localStorage.removeItem("UserInfo");
				          localStorage.setItem('UserInfo',JSON.stringify(data)); 
				         this.loading.dismiss();
                this.showAlert();
			},error =>
			{ this.loading.dismiss();
			});
		}
}
class SerializationHelper {
    static toInstance < T > (obj: T, json: string): T {
        var jsonObj = JSON.parse(json);

        if(typeof obj["fromJSON"] === "function") {
            obj["fromJSON"](jsonObj);
        } else {
            for(var propName in jsonObj) {
                obj[propName] = jsonObj[propName]
            }
        }

        return obj;
    }
}