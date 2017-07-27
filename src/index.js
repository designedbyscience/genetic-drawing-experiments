import geneticDrawing from './geneticDrawing.js';

const w = 278,
h = 278;

const master = document.querySelector("#master");
master.width = w
master.height = h;

const parent = document.querySelector("#parent");
parent.width = w
parent.height = h;
    
const child = document.createElement("canvas"); //document.querySelector("#child");
child.width = w;
child.height = h;

const masterCtx = master.getContext('2d'),
    parentCtx = parent.getContext('2d'),
    childCtx = child.getContext('2d');

let img = document.querySelector("#input");
 
document.querySelector("body").onload = function(){    
    let gd = new geneticDrawing(w, h, masterCtx, parentCtx, childCtx, img);
    gd.init()
};
         