export default class { 

    generateDrawingInstructions(thisDNA) {
        let polys = [];
        let r,g,b,a,x,y;
        const w = this.w;
        const h = this.h;
        for (var i = 1; i < thisDNA.length; i += (this.parts * this.p)) {
            let poly = [];

            r = thisDNA[i] % 256;
            g = thisDNA[i + 1] % 256;
            b = thisDNA[i + 2] % 256;
            a = thisDNA[i + 3];
        
            poly.push('rgba(' + r + ',' + g + ',' + b + ',' + Math.round(a/255*100)/100 + ')');

            poly.push([thisDNA[i + 4] % w, thisDNA[i + 5] % h]);
            poly.push([thisDNA[i + 6] % w, thisDNA[i + 7] % h]);        
            poly.push([thisDNA[i + 8] % w, thisDNA[i + 9] % h]);        
        
            poly.push(thisDNA[i+10]%2);
            polys.push(poly); 
        }
        
        return polys;
    }
    
    constructor(width, height, masterCtx, parentCtx, childCtx, img) {
        
        const t = 50, // Number of shapes
            p = 1, // points
            parts = 11, // 11 (r, g, b, alpha, 3 coordinates, shape * number of shapes)
        n = parts * t;
            
            this.radiation = 2;

            this.w = width;
            this.h = height;
            this.p = p;
            this.parts = parts;

        this.gen = 0;     
        this.dna = [p];

        for (var i = 0; i < n; i++) {
            this.dna.push(Math.random() * 256 | 0);
        }

        this.masterCtx = masterCtx;
        this.parentCtx = parentCtx;
        this.childCtx = childCtx;

        this.parentScore;
        this.topScore = 0;
        this.t0;
        
        this.masterCtx.fillStyle = '#fff';
        this.masterCtx.fillRect(0, 0, img.width, img.height);
        this.masterCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.w, this.h);

        this.masterID = masterCtx.getImageData(0, 0, this.w, this.h);

        const polys = this.generateDrawingInstructions(this.dna);
        this.draw(parentCtx, polys);
        this.parentScore = this.score(parentCtx);
    }

    genRunner() {
        for (var i = 0; i < 1000; i++) {
            this.generation();
        }
        
        setTimeout(this.genRunner.bind(this), 0);
    }
    
    init() {
        this.t0 = Date.now();
        this.genRunner();
    }

    generation() {
        this.gen++;

        let childDna = [this.dna[0]];

        for (let i = 0; i < this.dna.length; i++) {
            childDna[i] = this.dna[i] || 0;
            if (Math.random() < 1/Math.pow(10,this.radiation)) {
                childDna[i] = childDna[i] ^ (1 << (Math.random() * 8 | 0));
            }
        }

        let polys = this.generateDrawingInstructions(childDna);
        this.draw(this.childCtx, polys);

        let childScore = this.score(this.childCtx);


        if (childScore > this.parentScore) {
            this.parentScore = childScore;
            this.dna = childDna;
            this.draw(this.parentCtx, polys);
        } else {
            // console.log("No Improvement");
        }

        this.outputStep();
    }
    
    generationsPerSecond() {
        return this.gen/(Date.now()-this.t0)*1000;
    }

    outputStep() {
        if (this.gen % 1000 === 0) {
            console.log(this.gen);
            var t1 = Date.now();
            console.log(this.parentScore);
            console.log(this.generationsPerSecond());
        } 
    }

    score(ctx) {
        const id = ctx.getImageData(0, 0, this.w, this.h);
        let total = 0;

        for (let i = 0; i < id.data.length; i++) {
            total += Math.abs(id.data[i] - this.masterID.data[i]);
        }

        return (1 - total / (id.data.length * 128));
    }
    
    draw(ctx, polys) {

        ctx.fillStyle = "#fff";
        ctx.clearRect(0,0,this.w,this.h);
        ctx.fillRect(0, 0, this.w, this.h);

        polys.forEach(function (o) {            
             ctx.fillStyle = o[0];
             ctx.beginPath();
         
             if (o[4] === 0 ){
                 ctx.moveTo(o[1][0], o[1][1]);
                 ctx.lineTo(o[2][0], o[2][1]);
                 ctx.lineTo(o[3][0], o[3][1]);
             } else {
                 ctx.arc(o[1][0], o[1][1], o[2][0], 0, 2 * Math.PI, false);
             }
             ctx.fill();
        });
    }

 };