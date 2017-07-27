var fs = require('fs');
var Canvas = require('canvas'),
    Image = Canvas.Image; 

import geneticDrawingNode from './geneticDrawingNode.js';

const w = 278,
    h = 278;

const master = new Canvas(w,h),
    parent = new Canvas(w,h),
    child = new Canvas(w,h);

const masterCtx = master.getContext('2d'),
    parentCtx = parent.getContext('2d'),
    childCtx = child.getContext('2d');

fs.readFile(__dirname + '/lime-slice-02.jpg', function(err, imageFile){
  if (err) throw err;
  let img = new Image;
  img.src = imageFile;
  let gd = new geneticDrawingNode(w, h, masterCtx, parentCtx, childCtx, img, parent);
  
  gd.init();
});
