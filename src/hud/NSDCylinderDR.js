import BaseElement from './Element.js';

export default class NSDCylinder extends BaseElement
{
    constructor(ctx)
    {
        super(ctx);
        
		this.width = ctx.canvas.width;
		this.height = ctx.canvas.height;

		this.bullets = [];
		this.giro = 0;
    }
    
    setScale()
    {
        this.r = this.height * 0.45 * 0.8;

        this.x = this.r * -0.1;
        this.y = this.height * 0.58;

        var n = this.bullets.length;
        while (n--)
            this.bullets[n].setScale(this.r / 200);
    }
    
	dibujarCilindro()
    {
        var i, ang;

        this.context.save();

        this.context.beginPath();
        this.context.arc(0, 0, this.r + 10, 0, Math.PI * 2);
        this.context.clip();

        this.context.globalCompositeOperation = 'source-over';

        this.context.fillStyle = '#d40000';
        this.context.beginPath();
        this.context.arc(0, 0, this.r, 0, Math.PI * 2);
        this.context.fill();

        this.context.fillStyle = 'black';
        for (i = 0; i < 6; i++) {
            ang = this.giro + (Math.PI * i / 3);
            this.context.beginPath();
            this.context.arc(this.r * 0.63 * Math.cos(ang), this.r * 0.63 * Math.sin(ang), this.r * 0.24, 0, Math.PI * 2);
            this.context.fill();
        }

        this.context.globalCompositeOperation = 'destination-out';
        for (i = 0.5; i < 6; i++) {
            ang = this.giro + (Math.PI * i / 3);
            this.context.beginPath();
            this.context.arc(this.r * 1.67 * Math.cos(ang), this.r * 1.67 * Math.sin(ang), this.r * 0.76, 0, Math.PI * 2);
            this.context.fill();
        }

        this.context.restore();
    }
    
    dibujarArcoInterior(giro)
    {
        this.context.globalCompositeOperation = 'source-over';

        this.context.strokeStyle = 'white';
        this.context.lineCap = 'square';
        this.context.lineWidth = this.r * 0.07;

        for (var i = 0; i < 4; i++) {
            this.context.beginPath();
            this.context.arc(0, 0, this.r * 1.5, giro + (Math.PI * i / 2), giro + (Math.PI * i / 2) + 1);
            this.context.stroke();
        }
    }
    
	dibujarArcoExterior(giro)
    {
        this.context.globalCompositeOperation = 'source-over';

        this.context.lineWidth = this.r * 0.025;

        for (var i = 0; i < 2; i++) {
            this.context.beginPath();
            this.context.arc(0, 0, this.r * 1.0625, (Math.PI * i) - giro, (Math.PI * i) + 2.3 - giro);
            this.context.stroke();
        }
    }
    
    draw(time)
    {
        var i,
            bullets_total,
            bullet_index,
            normalized, limit_lower, limit_upper,
            bullet, inter_index;

        // time < t
        // t is the amount of seconds for the cylinder intro from left
        if (time < 0.25)
            // x = [-2 * r] -> [-0.1 * r]
            this.x = (7.6 * time - 2) * this.r;
        else {
            this.x = -0.1 * this.r;
            this.giro = 0;
            bullets_total = this.bullets.length;

            // k * time - (k*t):
            // k sets the speed of the bullets animation
            // bullet_index -> [0, total amount of bullets]
            bullet_index = Math.min(2.4 * time - 0.6, bullets_total);
        }

        this.context.clearRect(0, 0, this.width, this.height);

        this.context.save();

        // bullet movement is relative to the center of the cylinder
        this.context.translate(this.x, this.y);
        this.context.rotate(-0.1);

        this.dibujarArcoInteriorDR1(time / 1.2);
        this.dibujarArcoExteriorDR1(time / 1.2);

        if (bullet_index >= 0) {
            normalized = bullets_total + (bullets_total % 2) - 1;
            limit_upper = normalized / -2;
            limit_lower = limit_upper + bullets_total;

            i = bullets_total;
            while (i--) {
                // A normalized index [0, 1] for every cicle
                inter_index = Math.max(0, bullet_index - i);

                bullet = this.bullets[i];

                // Circular aligning
                bullet.x = this.r * (1.5 - 0.2 * Math.sin(Math.PI / 2 * Math.abs(bullet.y) * 0.3));
                bullet.y = bullet.order - Math.floor(bullet_index);
                bullet.opacity = 1;

                // Horizontal entry from right
                if (inter_index < 0.5) {
                    bullet.x += this.width * (1 - Math.min(1, inter_index / 0.5));
                    this.giro = (Math.PI / -3) * inter_index / 0.5;
                }

                else if (bullets_total > 1) {
                    // Vertical movement one place up
                    if (inter_index - Math.floor(inter_index) > 0.5
                        && inter_index - Math.floor(inter_index) < 1)
                        bullet.y -= (inter_index - Math.floor(inter_index) - 0.5) / 0.5;

                    // Upper limit
                    if (bullet.y < limit_upper)
                        bullet.y += bullets_total;

                    // Upper opacity fade-out
                    if (bullet.y < limit_upper + 0.5)
                        bullet.opacity = -2 * (limit_upper - bullet.y);

                    // Lower opacity fade-in
                    if (bullet.y > limit_lower - 0.5)
                        bullet.opacity = 2 * (limit_lower - bullet.y);
                }

                bullet.draw(this.r);
            }
        }

        this.dibujarCilindro();

        this.context.restore();

        return (2.4 * time > bullets_total + 10);
    }
}
