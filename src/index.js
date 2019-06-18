const css = require('./style.scss');
import Poisson from "./poisson";


console.log("HELLO")
const poisson = new Poisson(100,5,true);

poisson.iteration(10);


const uiAnimationBtn = document.querySelectorAll('[data-animation-times]');

for (const button of uiAnimationBtn) {
    button.addEventListener('click', function(event) {
        let times = button.dataset.animationTimes;
        poisson.iteration(times);
    })
}


window.poisson = poisson;