const css = require('./style.scss');
import Poisson from "./poisson";


const poisson = new Poisson(100,5,true);


poisson.iteration(10);


console.log("HELLO")
window.poisson = poisson;