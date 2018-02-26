import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Rx"

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	host: string = 'localhost';
	porta: number = 3000;
	modoManual: boolean;
	estadoSwitch: boolean;
	isConectado: boolean;
	tempIdeal: number;
	tempTolerancia: number;
	tempAtual: number;
	descStatus: string;

	urlBase: string = '';

	constructor(public navCtrl: NavController, private httpClient: HttpClient, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
		this.isConectado = false;
	}

	conectar() {

		if (this.host.indexOf('http://') > -1) {
			this.urlBase = this.host + ':' + this.porta;
		} else {
			this.urlBase = 'http://' + this.host + ':' + this.porta;
		}

		this.httpClient.get(this.urlBase)
			.subscribe(data => {
				this.atualizar();
			}, error => {
				let alert = this.alertCtrl.create({
					title: 'Erro',
					subTitle: 'Erro ao se conectar ao servidor. Verifique se o endereço está correto.',
					buttons: ['OK']
				});

				alert.present();
				console.log(error);

				this.isConectado = false;
			});
	}

	desconectar() {
		this.isConectado = false;
	}

	definirModos() {
		var obj = {
			switchStatus: this.estadoSwitch,
			manualMode: this.modoManual
		};

		this.httpClient.post(this.urlBase + '/switch', obj)
			.subscribe(data => {
				// NOTHING TO DO
			}, error => {
				this.isConectado = false;

				console.log(error);

				let alert = this.alertCtrl.create({
					title: 'Erro!',
					subTitle: 'Erro ao conectar: ' + error,
					buttons: ['OK']
				});

				alert.present();
			});
	}

	definirTemperaturas() {
		var obj = {
			temperatura : {
				setPoint: this.tempIdeal,
				tolerance: this.tempTolerancia
			}
		};

		this.httpClient.post(this.urlBase + '/temperaturas', obj)
			.subscribe(data => {
				// NOTHING TO DO
			}, error => {
				this.isConectado = false;

				console.log(error);

				let alert = this.alertCtrl.create({
					title: 'Erro!',
					subTitle: 'Erro ao conectar: ' + error,
					buttons: ['OK']
				});

				alert.present();
			});
	}

	atualizar() {
		this.getStatus();
		this.getTemperaturas();
	}

	atualizarStatus() {

		Observable.interval(1000)
			.takeWhile(() => this.isConectado)
			.subscribe(i => {
				this.getStatus();

				this.httpClient.get(this.urlBase + '/temperaturas')
					.subscribe(data => {
						let temps = data['temperatura'];
						this.tempAtual = temps.current;
					}, error => {
						this.isConectado = false;

						let alert = this.alertCtrl.create({
							title: 'Erro!',
							subTitle: 'Erro ao conectar: ' + error,
							buttons: ['OK']
						});

						alert.present();
					});
			})

	}

	getStatus() {
		this.httpClient.get(this.urlBase + '/switch')
			.subscribe(data => {
				this.estadoSwitch = data['switchStatus'];
				this.modoManual = data['manualMode'];
				this.descStatus = (this.estadoSwitch) ? 'Ligado' : 'Desligado';
				this.isConectado = true;
			}, error => {
				this.isConectado = false;

				let alert = this.alertCtrl.create({
					title: 'Erro!',
					subTitle: 'Erro ao conectar: ' + error,
					buttons: ['OK']
				});

				alert.present();
			});
	}

	getTemperaturas() {
		this.httpClient.get(this.urlBase + '/temperaturas')
			.subscribe(data => {
				let temps = data['temperatura'];

				this.tempIdeal = temps.setPoint;
				this.tempTolerancia = temps.tolerance;
				this.tempAtual = temps.current;

				this.atualizarStatus();
			}, error => {
				this.isConectado = false;

				let alert = this.alertCtrl.create({
					title: 'Erro!',
					subTitle: 'Erro ao conectar: ' + error,
					buttons: ['OK']
				});

				alert.present();
			});
	}
}
