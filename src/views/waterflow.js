class WaterFlow {
    constructor() {
        this.particles = [];
    }

    addMoreParticles(x, y){
        this.particles.push(new WaterParticle(x, y, -0.5, 0.5));
    }

    handleCircle(water) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            this.particles[i].show(water);

            if (this.particles[i].alpha <= 0) this.particles.splice(i, 1);
        }
    }
}

class WaterParticle {
    constructor(x, y, min, max) {
        this.x = x;
        this.y = y;
        this.vx = random(min, max);
        this.vy = random(-4, -1);
        this.alpha = 255;
        this.frame = 0;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if(this.frame >= 19)
            this.frame = 0;
        this.frame++;
        this.alpha -= 3;
    }

    show(water) {
        noStroke();
        fill(255, this.alpha);
        ellipse(this.x, this.y, 16, 16);
    }
}