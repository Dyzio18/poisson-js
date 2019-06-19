const css = require('./style.scss');
import Poisson from "./poisson";


console.log("HELLO")
const poisson = new Poisson(100,5,false);

poisson.iteration(1000);



const uiAnimationBtnList = document.querySelectorAll('[data-animation-times]');
for (const button of uiAnimationBtnList) {
    button.addEventListener('click', function(event) {
        let times = button.dataset.animationTimes;
        poisson.iteration(times);
    })
}

const uiAnimationPlay = document.querySelector('[data-animation-play]');
uiAnimationPlay.addEventListener('click', function(event) {
    console.log("PLAY")
});



let checkbox = document.querySelector("[data-checkbox-dynamic-source]");
checkbox.addEventListener( 'change', function() {
    if(this.checked) {
        poisson.setDynamicSourceStatus(true)
    } else {
        poisson.setDynamicSourceStatus(false)
    }
});


window.poisson = poisson;