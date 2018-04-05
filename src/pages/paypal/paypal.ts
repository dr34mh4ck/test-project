import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { VideosPage } from '../videos/videos';

/**
 * Generated class for the PaypalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-paypal',
  templateUrl: 'paypal.html',
  providers : [ PayPal ]
})
export class PaypalPage {

  public videos : any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _payPal: PayPal) {
                this. videos = VideosPage;
  }

  public makePayment(){
    this._payPal.init({
      PayPalEnvironmentProduction: '',
      PayPalEnvironmentSandbox: 'AUmLPs3lkOw9Xyuvpi31vu4_8rbmOKadL4NZqMYZ0muZ4qZrRcBO5PNSmCIShgzZOA6vtgAY__fmoxXX'
    }).then(() => {
          // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
          this._payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
            // Only needed if you get an "Internal Service Error" after PayPal login!
            //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
          })).then(() => {
            let payment = new PayPalPayment('3.33', 'USD', 'Buying a test token', 'sale');
            this._payPal.renderSinglePaymentUI(payment).then((response) => {
              // Successfully paid
              console.log('pago realizado');
              console.log(response);
              // Example sandbox response
              //
              // {
              //   "client": {
              //     "environment": "sandbox",
              //     "product_name": "PayPal iOS SDK",
              //     "paypal_sdk_version": "2.16.0",
              //     "platform": "iOS"
              //   },
              //   "response_type": "payment",
              //   "response": {
              //     "id": "PAY-1AB23456CD789012EF34GHIJ",
              //     "state": "approved",
              //     "create_time": "2016-10-03T13:33:33Z",
              //     "intent": "sale"
              //   }
              // }
            }, () => {
              // Error or render dialog closed without being successful
            });
          }, () => {
            // Error in configuration
          });
        }, () => {
          // Error in initialization, maybe PayPal isn't supported or something else
        });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaypalPage');
  }

}
