webpackJsonp([0],{

/***/ 161:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 161;

/***/ }),

/***/ 205:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 205;

/***/ }),

/***/ 254:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__ = __webpack_require__(393);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var HomePage = (function () {
    function HomePage(navCtrl, httpClient, alertCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.httpClient = httpClient;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.host = 'localhost';
        this.porta = 3000;
        this.urlBase = '';
        this.isConectado = false;
    }
    HomePage.prototype.conectar = function () {
        var _this = this;
        if (this.host.indexOf('http://') > -1) {
            this.urlBase = this.host + ':' + this.porta;
        }
        else {
            this.urlBase = 'http://' + this.host + ':' + this.porta;
        }
        this.httpClient.get(this.urlBase)
            .subscribe(function (data) {
            _this.atualizar();
        }, function (error) {
            var alert = _this.alertCtrl.create({
                title: 'Erro',
                subTitle: 'Erro ao se conectar ao servidor. Verifique se o endereço está correto.',
                buttons: ['OK']
            });
            alert.present();
            console.log(error);
            _this.isConectado = false;
        });
    };
    HomePage.prototype.desconectar = function () {
        this.isConectado = false;
    };
    HomePage.prototype.definirModos = function () {
        var _this = this;
        var obj = {
            switchStatus: this.estadoSwitch,
            manualMode: this.modoManual
        };
        this.httpClient.post(this.urlBase + '/switch', obj)
            .subscribe(function (data) {
            // NOTHING TO DO
        }, function (error) {
            _this.isConectado = false;
            console.log(error);
            var alert = _this.alertCtrl.create({
                title: 'Erro!',
                subTitle: 'Erro ao conectar: ' + error,
                buttons: ['OK']
            });
            alert.present();
        });
    };
    HomePage.prototype.definirTemperaturas = function () {
        var _this = this;
        var obj = {
            temperatura: {
                setPoint: this.tempIdeal,
                tolerance: this.tempTolerancia
            }
        };
        this.httpClient.post(this.urlBase + '/temperaturas', obj)
            .subscribe(function (data) {
            // NOTHING TO DO
        }, function (error) {
            _this.isConectado = false;
            console.log(error);
            var alert = _this.alertCtrl.create({
                title: 'Erro!',
                subTitle: 'Erro ao conectar: ' + error,
                buttons: ['OK']
            });
            alert.present();
        });
    };
    HomePage.prototype.atualizar = function () {
        this.getStatus();
        this.getTemperaturas();
    };
    HomePage.prototype.atualizarStatus = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].interval(1000)
            .takeWhile(function () { return _this.isConectado; })
            .subscribe(function (i) {
            _this.getStatus();
            _this.httpClient.get(_this.urlBase + '/temperaturas')
                .subscribe(function (data) {
                var temps = data['temperatura'];
                _this.tempAtual = temps.current;
            }, function (error) {
                _this.isConectado = false;
                var alert = _this.alertCtrl.create({
                    title: 'Erro!',
                    subTitle: 'Erro ao conectar: ' + error,
                    buttons: ['OK']
                });
                alert.present();
            });
        });
    };
    HomePage.prototype.getStatus = function () {
        var _this = this;
        this.httpClient.get(this.urlBase + '/switch')
            .subscribe(function (data) {
            _this.estadoSwitch = data['switchStatus'];
            _this.modoManual = data['manualMode'];
            _this.descStatus = (_this.estadoSwitch) ? 'Ligado' : 'Desligado';
            _this.isConectado = true;
        }, function (error) {
            _this.isConectado = false;
            var alert = _this.alertCtrl.create({
                title: 'Erro!',
                subTitle: 'Erro ao conectar: ' + error,
                buttons: ['OK']
            });
            alert.present();
        });
    };
    HomePage.prototype.getTemperaturas = function () {
        var _this = this;
        this.httpClient.get(this.urlBase + '/temperaturas')
            .subscribe(function (data) {
            var temps = data['temperatura'];
            _this.tempIdeal = temps.setPoint;
            _this.tempTolerancia = temps.tolerance;
            _this.tempAtual = temps.current;
            _this.atualizarStatus();
        }, function (error) {
            _this.isConectado = false;
            var alert = _this.alertCtrl.create({
                title: 'Erro!',
                subTitle: 'Erro ao conectar: ' + error,
                buttons: ['OK']
            });
            alert.present();
        });
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"C:\nodejs\brewster-iot\src\pages\home\home.html"*/'<ion-header>\n	<ion-navbar color="primary">\n		<ion-title>\n			Brewster\n		</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content padding>\n	<ion-card *ngIf="!isConectado">\n		<ion-card-header color="primary">\n			Servidor\n		</ion-card-header>\n\n		<ion-card-content>\n			<ion-item>\n				<ion-label floating>Endereço</ion-label>\n				<ion-input type="text" [(ngModel)]="host"></ion-input>\n			</ion-item>\n\n			<ion-item>\n				<ion-label floating>Porta</ion-label>\n				<ion-input type="number" [(ngModel)]="porta"></ion-input>\n			</ion-item>\n\n			<button ion-button block color="secondary" (click)="conectar()">Conectar</button>\n		</ion-card-content>\n	</ion-card>\n\n	<span *ngIf="isConectado">\n		<ion-card>\n			<ion-card-header color="primary">\n				Servidor\n			</ion-card-header>\n\n			<ion-card-content>\n				<button ion-button block color="danger" (click)="desconectar()">Desconectar</button>\n			</ion-card-content>\n		</ion-card>\n		\n		<ion-card>\n			<ion-card-content>\n				<button ion-button icon-left block color="secondary" (click)="atualizar()">\n					<ion-icon name="refresh"></ion-icon>\n					Atualizar\n				</button>\n			</ion-card-content>\n		</ion-card>\n\n		<ion-card>\n			<ion-card-content>\n				<ion-item>\n					<ion-label>Modo Manual</ion-label>\n					<ion-toggle checked="false" [(ngModel)]="modoManual" (ionChange)="definirModos()"></ion-toggle>\n				</ion-item>\n\n				<ion-item *ngIf="modoManual">\n					<ion-label>Estado do Switch</ion-label>\n					<ion-toggle checked="false" [(ngModel)]="estadoSwitch" (ionChange)="definirModos()"></ion-toggle>\n				</ion-item>\n			</ion-card-content>\n		</ion-card>\n\n		<ion-card>\n			<ion-card-header color="primary">\n				Teperatura Atual\n			</ion-card-header>\n\n			<ion-card-content>\n				<h1>{{tempAtual}}ºC</h1>\n			</ion-card-content>\n		</ion-card>\n\n		<ion-card>\n			<ion-card-header color="primary">\n				Estado Atual do Switch\n			</ion-card-header>\n\n			<ion-card-content>\n				<h1>{{descStatus}}</h1>\n			</ion-card-content>\n		</ion-card>\n\n		<ion-card *ngIf="!modoManual">\n			<ion-card-header color="primary">\n				Definir Teperaturas\n			</ion-card-header>\n\n			<ion-card-content>\n				<ion-item>\n					<ion-label floating>Alvo (ºC)</ion-label>\n					<ion-input type="number" value="" [(ngModel)]="tempIdeal"></ion-input>\n				</ion-item>\n\n				<ion-item>\n					<ion-label floating>Tolerância (ºC)</ion-label>\n					<ion-input type="number" value="" [(ngModel)]="tempTolerancia"></ion-input>\n				</ion-item>\n\n				<button ion-button block (click)="definirTemperaturas()">Definir</button>\n\n			</ion-card-content>\n		</ion-card>\n\n	</span>\n</ion-content>'/*ion-inline-end:"C:\nodejs\brewster-iot\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* LoadingController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* LoadingController */]) === "function" && _d || Object])
    ], HomePage);
    return HomePage;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 344:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(345);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(349);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 349:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_common_http__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__(392);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_home_home__ = __webpack_require__(254);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* HomePage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */], {}, {
                    links: []
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* HomePage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 392:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(254);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\nodejs\brewster-iot\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"C:\nodejs\brewster-iot\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ })

},[344]);
//# sourceMappingURL=main.js.map