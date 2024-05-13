import express from 'express';
import session from 'express-session';
import lodash from 'lodash';
import morgan from 'morgan';
import nunjucks from 'nunjucks';
import ViteExpress from 'vite-express';

const app = express();
const port = '8000';

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: false }));

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

const MOST_LIKED_FOSSILS = {
  aust: {
    img: '/img/australopith.png',
    name: 'Australopithecus',
    num_likes: 584,
  },
  quetz: {
    img: '/img/quetzal_torso.png',
    name: 'Quetzalcoatlus', // Respect my boy and the other azhdarchids. Full names only
    num_likes: 587,
  },
  steg: {
    img: '/img/stego_skull.png',
    name: 'Stegosaurus',
    num_likes: 598,
  },
  trex: {
    img: '/img/trex_skull.png',
    name: 'Tyrannosaurus Rex',
    num_likes: 601,
  },
};

const OTHER_FOSSILS = [
  {
    img: '/img/ammonite.png',
    name: 'Ammonite',
  },
  {
    img: '/img/mammoth_skull.png',
    name: 'Mammoth',
  },
  {
    img: '/img/ophthalmo_skull.png',
    name: 'Opthalmosaurus',
  },
  {
    img: '/img/tricera_skull.png',
    name: 'Triceratops',
  },
];

//Homepage
app.get('/', (req, res) => {
  // condense session
  const sess = req.session

  // check for user's name
  !sess.name ? 

    // if no name, push to login and advise them to login
    res.render('homepage.html.njk', {advice: `Please log in before accessing the world's best fossils`}) :
    
    // if name, fossils
    res.redirect('/top-fossils')
    
});

//Top Fossils
app.get('/top-fossils', (req, res) => {
  // condense session
  const sess = req.session;

  // add keys as values for use in dropdown ( I did this for fun to add another njk loop in top-fossils)
  Object.keys(MOST_LIKED_FOSSILS).forEach((element) => {
    MOST_LIKED_FOSSILS[element].id = element;
  })

  // check for user's name
  sess.name ? 

    //If so - render MLF and pass the name
    res.render('top-fossils.html.njk', {fossils: MOST_LIKED_FOSSILS, name: sess.name}) :

    //If not, redirect to login
    res.render('homepage.html.njk', {advice: `Please log in before accessing the world's best fossils`})
});

// Handle Form to get a username
app.post('/get-name', (req, res) => {
  //condense session
  const sess = req.session

  //define a name in the session cookie
  sess.name = req.body.name
  
  //yeet us back to the stone age
  res.redirect('/top-fossils');
});

app.post('/like-fossil', (req, res) => {
  // define a variable with the result of the dropdown - not necessary, but more readable
  const fossilUpdate = req.body.choice

  // update the object with the result
  MOST_LIKED_FOSSILS[fossilUpdate].num_likes ++

  //condense session for continuity at this point
  const sess = req.session
  res.render('thank-you.html.njk', {name: sess.name });
});

//this is route is used by Axios to generate the random boyo
app.get('/random-fossil.json', (req, res) => {
  const randomFossil = lodash.sample(OTHER_FOSSILS);
  res.json(randomFossil);
});

//The dinosaurs still outnumber us: there are 4 - 6 birds on earth for every human
ViteExpress.listen(app, port, () => {
  console.log(`Server running on http://localhost:${port}...`);
});
