var express		= require('express');
var bodyParser	= require('body-parser');
var five		= require('johnny-five');
var mqtt		= require('mqtt');
var client  	= mqtt.connect('mqtt://iot.eclipse.org');

var app			= express();

var PORT		= 3000;
var TOPIC_SWITCH= '/brewster/switch';
var TOPIC_STATUS= '/brewster/switch/status';

// -------------------------------------------------------------------------------------------
// Inerceptador Middleware
// -------------------------------------------------------------------------------------------
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Auth');
    res.setHeader('Access-Control-Expose-Headers', 'Auth');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
// -------------------------------------------------------------------------------------------


// -------------------------------------------------------------------------------------------
// Configuracao de componentes eletronicos
// -------------------------------------------------------------------------------------------
var board = new five.Board({
	port : 'COM3'
});

var temperatura = {
	setPoint	: 0,
	tolerance	: 1,
	current		: 0
};

var switchStatus= false;
var manualMode	= false;
// -------------------------------------------------------------------------------------------


// -------------------------------------------------------------------------------------------
// Rotas funcionais da API
// -------------------------------------------------------------------------------------------

app.get('/', function(req, res){
	res.status(200).send({});
});

app.get('/temperaturas', function(req, res){
	res.send({
		temperatura : temperatura
	});
});

app.post('/temperaturas', function(req, res){
	temperatura.setPoint = req.body.temperatura.setPoint;
	temperatura.tolerance = req.body.temperatura.tolerance;
	res.status(200).send({});
});

app.get('/switch', function(req, res){
	res.send({
		switchStatus : switchStatus,
		manualMode : manualMode
	});
});

app.post('/switch', function(req, res){
	switchStatus = req.body.switchStatus
	manualMode = req.body.manualMode;

	if(manualMode){
		var comando = (switchStatus) ? 'TURN_ON' : 'TURN_OFF';
		enviaMensagemSwitch(comando);
	} else {
		verificaTemperaturas();
	}

	res.status(200).send({});
});
// -------------------------------------------------------------------------------------------


// -------------------------------------------------------------------------------------------
// Configuracao do client mqtt
// -------------------------------------------------------------------------------------------

client.on('connect', function(){
	client.subscribe(TOPIC_SWITCH);
	client.subscribe(TOPIC_STATUS);
	console.log('MQTT Client conectado...');
});

client.on('message', function(topic, message){
	if (topic == TOPIC_STATUS){
		verificaSwitch(message.toString());
	}

	// client.end();
});
// -------------------------------------------------------------------------------------------


// -------------------------------------------------------------------------------------------
// Configuracao do server http
// -------------------------------------------------------------------------------------------
app.listen(PORT, function(){
	console.log('Servidor iniciado com sucesso...');
});
// -------------------------------------------------------------------------------------------


// -------------------------------------------------------------------------------------------
// Eventos dos componentes eletronicos
// -------------------------------------------------------------------------------------------
board.on('ready', function () {
	var thermometer = new five.Thermometer({
		controller: "DS18B20",
		pin: 2,
		freq: 5000
	});

	thermometer.on("change", function () {
		temperatura.current = Number(this.celsius).toFixed(2);
	});
});

setInterval(function() {
	verificaTemperaturas();
}, 1000);

function verificaSwitch(mensagem){
	var obj = JSON.parse(mensagem);

	if(typeof obj.status == 'boolean'){
		switchStatus = obj.status;
	}
};

function verificaTemperaturas(){
	if(manualMode){
		return;
	}

	if((temperatura.current - temperatura.setPoint) > temperatura.tolerance){
		enviaMensagemSwitch('TURN_ON');
		/////////////////////
		switchStatus = true;
		console.log('ON');
	} else if((temperatura.current - temperatura.setPoint) < (temperatura.tolerance * -1)) {
		enviaMensagemSwitch('TURN_OFF');
		//////////////////////
		switchStatus = false;
		console.log('OFF');
	}
};

function enviaMensagemSwitch(mensagem){
	client.publish(TOPIC_SWITCH, mensagem);
};
// -------------------------------------------------------------------------------------------