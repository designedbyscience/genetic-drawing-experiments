let fs = require('fs'),
    Canvas = require('canvas'),
    Image = Canvas.Image,
    cluster = require('cluster');    

// Image file to score against
let imageFilename = "/lime-slice-02.jpg";

import geneticDrawingNodeCluster from './geneticDrawingNodeCluster.js';

let topScore = 0,
    gd;

if (cluster.isMaster) {
    console.log("Is Master");

    for (var i = 0; i < 4; i++) {
        cluster.fork();
    }

    // When a new worker process is forked, attach the handler
    // This handles cases where new worker processes are forked
    // on disconnect/exit, as above.
    cluster.on('fork', function(worker) {
        worker.on('message', messageRelay);
    });

    let messageRelay = function(msg) {
        if (msg.score > topScore) {
            topScore = msg.score;
            let dna = msg.dna;
            Object.keys(cluster.workers).forEach(function(id) {
                cluster.workers[id].send({dna: dna, topScore: topScore});
            });
        };
    };
    
} else {
    let messageHandler = function messageHandler(msg) {        
        if (msg.topScore > gd.parentScore) {
            gd.dna = msg.dna;            
        }
    };

    process.on('message', messageHandler);
  
    const w = 278,
    h = 278;

    const master = new Canvas(w,h),
        parent = new Canvas(w,h),
        child = new Canvas(w,h);

    const masterCtx = master.getContext('2d'),
        parentCtx = parent.getContext('2d'),
        childCtx = child.getContext('2d');

    fs.readFile(__dirname + imageFilename, function(err, imageFile){
      if (err) throw err;

      let img = new Image;
      img.src = imageFile;
      gd = new geneticDrawingNodeCluster(w, h, masterCtx, parentCtx, childCtx, img, parent);
  
      gd.init();
    });
}



