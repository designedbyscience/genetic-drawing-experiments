import geneticDrawing from './geneticDrawing.js';

var fs = require('fs');

let Canvas = require("canvas"),
    Image = Canvas.Image;
    
export default class extends geneticDrawing { 

    constructor(width, height, masterCtx, parentCtx, childCtx, img, parent) { 
        super(width, height, masterCtx, parentCtx, childCtx, img);
        this.parent = parent;
    
    }

    genRunner() {
        for (var i = 0; i < 1000; i++) {
            this.generation();
        }
        
        setImmediate(this.genRunner.bind(this));
    }

    outputStep() {
            if (this.gen % 1000 === 0) {
                console.log(this.gen);
                console.log(this.parentScore);
                console.log(this.generationsPerSecond());

                var out = fs.createWriteStream(__dirname + '/output/' + this.gen + '.png');
                var stream = this.parent.pngStream();

                stream.on('data', function(chunk){
                  out.write(chunk);
                });

                stream.on('end', function(){
                  console.log('saved png');
                });

                fs.writeFile(__dirname + '/output/' + this.gen + '.json', JSON.stringify(this.dna), function (err) {

                });
            }
        
    }


} 