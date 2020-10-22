const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require('http');
const server = http.Server(app);
var io = require('./src/io/io').initialize(server);

app.use((req, res, next) => {
  if ((req.headers["x-forwarded-proto"] || "").endsWith("http")) 
      res.redirect(`https://${req.headers.host}${req.url}`);
  else
      next();
});

const handlebars = require('express-handlebars');
const database = require('./src/database/index');
app.database = database;
const tamer_routes = require('./routes/tamer');
const root_routes = require('./routes/root_routes');
const {is_logged} = require('./helpers/routes_restriction');

var choosed_lang = 'US'; 
const language = require(`./public/language/language_${choosed_lang}.json`);
const core_load = require('./services/server_core_load');

//Game structures Global vars
PERSONALITY = core_load.personality();
ATTRIBUTE = core_load.attribute();
ELEMENT = core_load.element();
FIELD = core_load.field();
BACKGROUND = core_load.background();
MON = core_load.mon();
EVOSTAGE = core_load.evostage();
EVOCHART = core_load.evochart();
SKILL = core_load.skill();
MON_SKILL = core_load.mon_skill();
MONSKIN = core_load.monskin();
PLACE = core_load.place();
SKIN = core_load.skin();
ITEM = core_load.item();
DROP = core_load.drop();
LANGUAGE = core_load.language();

//Global variable to handle all online users
TAMER_LIST = [];
BATTLES = [];
PVP_POOL = [[],[],[]];

// Folders definition
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Template Engine
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Config session
require('./src/config/passport')(passport);

var sessionMiddleware = (session({
  name: process.env.COOKIE_NAME, 
  secret: process.env.COOKIE_SECRET,
  cookie: { path: '/', httpOnly: true, maxAge: null},
  saveUninitialized: false, 
  resave: false,
}));

app.use(sessionMiddleware);

io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(passport.initialize());
app.use(passport.session());

//Locals
 app.use((req, res, next) => {
  res.locals.authenticate = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.online_tamers = Object.keys(TAMER_LIST).length;
  res.locals.language = language;
  next();
}) 

io.on('connection', (socket) => {
  let sessionId = socket.request.sessionID;
  let session = socket.request.sessionStore.sessions[sessionId];
  if(session != undefined && session != null){
    let tamer = JSON.parse(socket.request.sessionStore.sessions[sessionId]).passport.user;
    //Send a message notifying about multi tabs, just one will be registered as valid.
    io.to(TAMER_LIST[tamer.login].socket_id).emit('duplicatedTab', 'Use just one tab.');
    TAMER_LIST[tamer.login].socket_id = socket.id;
    require('./src/io/digivice_events')(io, socket, tamer);
    require('./src/io/chat')(io, socket, tamer);
    //Updates connection to pendulums every new connection.
    TAMER_LIST[tamer.login].pendulum.set_connection(socket.id);
  } 
});

// Routes
app.use('/tamer', is_logged, tamer_routes);
app.use(root_routes);

//All undefined pages goes redirected to /
app.use('*', function(req, res){
 req.isAuthenticated() ? res.redirect('/tamer/digivice') : res.redirect('/tamer/login');
});

server.listen(process.env.PORT);
module.exports = {app, io};

//GLOBAL CHECK
/* function globals() { return this; }
function varsList() {
  return Object.getOwnPropertyNames(globals());
}
console.log(varsList()) */

/* 
TO DO
  1 rever a declaracao do socket io, tirar os requrires de dentro do connect :v
  
  2 Rever toda as chamadas e a organizacao do projeto, acredito que esta mal organizado 
  com sobre carga de funcao, rotas, controllers e repo tudo misturado, entender melhor
  e fazer o remanejo disso tudo.
*/