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
            let out = fs.createWriteStream(__dirname + '/output/' + this.gen + '.png');
            let stream = this.parent.pngStream();

            console.log(this.gen);
            console.log(this.parentScore);                    
            console.log(this.generationsPerSecond());
            process.send({score: this.parentScore, dna: this.dna});
            

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
 