import BaseCylinder from './NSDCylinder.js';

export default class NSDCylinder extends BaseCylinder
{
    constructor(ctx)
    {
        super(ctx);
    }

	dibujarCilindro()
    {
        var i, ang;

        this.ctx.save();

        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.r + 10, 0, Math.PI * 2);
        this.ctx.clip();

        this.ctx.globalCompositeOperation = 'source-over';

        this.ctx.fillStyle = '#d40000';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.r, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = 'black';
        for (i = 0; i < 6; i++) {
            ang = this.giro + (Math.PI * i / 3);
            this.ctx.beginPath();
            this.ctx.arc(this.r * 0.63 * Math.cos(ang), this.r * 0.63 * Math.sin(ang), this.r * 0.24, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.globalCompositeOperation = 'destination-out';
        for (i = 0.5; i < 6; i++) {
            ang = this.giro + (Math.PI * i / 3);
            this.ctx.beginPath();
            this.ctx.arc(this.r * 1.67 * Math.cos(ang), this.r * 1.67 * Math.sin(ang), this.r * 0.76, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    dibujarArcoExterior(giro)
    {
        this.ctx.lineCap = 'square';

        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = this.r * 0.1;
        for (var i = 0; i < 4; i++) {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.r * 1.17, giro + (Math.PI * i / 2), giro + (Math.PI * i / 2) + 1.4);
            this.ctx.stroke();
        }

        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.lineWidth = this.r * 0.08;
        for (var i = 0; i < 4; i++) {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.r * 1.17, giro + (Math.PI * i / 2), giro + (Math.PI * i / 2) + 1.4);
            this.ctx.stroke();
        }

        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        this.ctx.lineWidth = this.r * 0.09;
        for (var i = 0; i < 4; i++) {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.r * 1.17, giro + (Math.PI * i / 2), giro + (Math.PI * i / 2) + 1.4);
            this.ctx.stroke();
        }
    }

	dibujarArcoInterior(giro)
    {
        this.ctx.globalCompositeOperation = 'source-over';

        this.ctx.strokeStyle = 'white';
        this.ctx.lineCap = 'square';
        this.ctx.lineWidth = this.r * 0.05;

        for (var i = 0; i < 2; i++) {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.r * 1.0625, (Math.PI * i) - giro, (Math.PI * i) + 3 - giro);
            this.ctx.stroke();
        }

        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.lineWidth = this.r * 0.036;
        for (var i = 0; i < 2; i++) {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.r * 1.0625, (Math.PI * i) - giro, (Math.PI * i) + 3 - giro);
            this.ctx.stroke();
        }

        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        this.ctx.lineWidth = this.r * 0.04;
        for (var i = 0; i < 2; i++) {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.r * 1.0625, (Math.PI * i) - giro, (Math.PI * i) + 3 - giro);
            this.ctx.stroke();
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

        this.ctx.clearRect(0, 0, this.W, this.H);

        this.ctx.save();

        // bullet movement is relative to the center of the cylinder
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(-0.1);

        this.dibujarArcoInterior(time / 1.2);
        this.dibujarArcoExterior(time / 1.2);

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
                    bullet.x += this.W * (1 - Math.min(1, inter_index / 0.5));
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

        this.ctx.restore();

        return (2.4 * time > bullets_total + 10);
    }
}
