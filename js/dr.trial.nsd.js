/* global THREE */
/* global Promise */
DR.NSD = (function (DR) {
	"use strict";

	var bullet_img = [new Image(), new Image(), new Image()];
	bullet_img[0].src = '/textures/bullet_1.svg';
	bullet_img[1].src = '/textures/bullet_2.svg';
	bullet_img[2].src = '/textures/bullet_3.svg';

	Animacion.prototype.iniciarNSD = function (balas) {
		this.promise = this.promise
			.then(presentNSD)
			.then(function () {
				return presentBullets(balas);
			});

		return this;
	};

	// http://www.jlabstudio.com/webgl/2013/04/three-js-tutorial-3-texturas-iluminacion-y-transparencias/

	function presentNSD() {
		return new Promise(function (resolve, reject) {
			var transition,
				start,
				tiempo = 3500;

			transition = function (ahora) {
				var avance = Math.min(1, (ahora - start) / tiempo),
					angle = (avance - 0.25) * 2.125 * Math.PI;

				DR.camara.position.set(
					(56 - 46 * Math.pow(avance, 2)) * Math.cos(angle),
					(56 - 46 * Math.pow(avance, 2)) * Math.sin(angle),
					35 - 18 * avance
					);

				DR.camara.up.set(
					0.16 * (1 - avance) * Math.sin(angle),
					-0.16 * (1 - avance) * Math.cos(angle),
					1
					);

				DR.camara.lookAt(new THREE.Vector3(
					0,
					0,
					10 + avance * 6
					));

				if (avance < 0.3) {
					DR.hud.clearRect(0, 0, DR.canvas.width, DR.canvas.height);
					DR.hud.beginPath();
					DR.hud.fillStyle = 'rgba(0, 0, 0, ' + ((0.3 - avance) / 0.3) + ')';
					DR.hud.rect(0, 0, DR.canvas.width, DR.canvas.height);
					DR.hud.fill();
				}

				DR.renderizar();

				if (avance < 1) {
					Animacion.cuadro = requestAnimationFrame(transition);
				} else {
					DR.hudClear();
					resolve();
				}
			};

			cancelAnimationFrame(Animacion.cuadro);
			start = ('performance' in window ? performance.now() : Date.now());
			transition(start);
		});
	}

	function presentBullets(bullets) {
		return new Promise(function (resolve, reject) {
			var transition,
				start = 0,
				start_angle = Math.random() * 2 * Math.PI;

			var cilinder = new Cilindro(DR.hud);
			cilinder.bullets = bullets.map(function (texto, i) {
				return new Bala(texto, i, DR.hud);
			});
			cilinder.setScale();

			transition = function (now) {
				var sin, cos,
					time = (now - start) / 1000,
					angle = start_angle + time * 0.1 * Math.PI;

				sin = Math.sin(angle);
				cos = Math.cos(angle);

				DR.camara.position.set(8 * cos, 8 * sin, 16);
				DR.camara.up.set(0.1 * sin, -0.1 * cos, 1);
				DR.camara.lookAt(new THREE.Vector3(20 * cos, 20 * sin, 16));

				sin = cilinder.renderBulletPresentation(time);

				DR.renderizar();

				if (sin) {
					DR.hudClear();
					resolve();
				} else
					Animacion.cuadro = requestAnimationFrame(transition);
			};

			cancelAnimationFrame(Animacion.cuadro);
			start = ('performance' in window ? performance.now() : Date.now());
			transition(start);
		});
	};

	function Bala(text, i, context) {
		this.context = context;
		this.order = i;
		this.text = text;

		this.opacity = 1;
		this.x = 0;
		this.y = 0;

		this.setScale(1);
	}

	Object.defineProperties(Bala.prototype, {
		setScale: {
			value: function (s) {
				this.scale = s;
				this.font = Math.floor(36 * s) + 'px Calibri';

				this.context.save();
				this.context.font = this.font;
				this.textWidth = Math.floor(this.context.measureText(this.text).width);
				this.context.restore();
			}
		},
		draw: {
			value: function (r) {
				var h = bullet_img[0].naturalHeight * this.scale,
					w1 = bullet_img[0].naturalWidth * this.scale,
					w3 = bullet_img[2].naturalWidth * this.scale,
					y = this.y * 60 * this.scale;

				this.context.save();

				this.context.globalAlpha = this.opacity;

				this.context.drawImage(bullet_img[0], this.x, y - h / 2, w1, h);
				this.context.drawImage(bullet_img[1], this.x + w1 - 1, y - h / 2, this.textWidth, h);
				this.context.drawImage(bullet_img[2], this.x + w1 + this.textWidth - 2, y - h / 2, w3, h);

				this.context.beginPath();
				this.context.font = this.font;
				this.context.textAlign = 'left';
				this.context.textBaseline = 'middle';
				this.context.fillStyle = 'white';
				this.context.fillText(this.text, this.x + w1 * 0.6, y);

				this.context.restore();
			}
		}
	});

	function Cilindro(context) {
		this.width = DR.canvas.width;
		this.height = DR.canvas.height;
		this.context = context;

		this.bullets = [];
		this.giro = 0;
	}

	Object.defineProperties(Cilindro.prototype, {
		setScale: {
			value: function () {
				this.r = this.height * 0.45 * 0.8;

				this.x = this.r * -0.1;
				this.y = this.height * 0.58;

				var n = this.bullets.length;
				while (n--)
					this.bullets[n].setScale(this.r / 200);
			}
		},
		dibujarCilindro: {
			value: function () {
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
				for (i = -0.1; i < 6; i++) {
					ang = this.giro + (Math.PI * i / 3);
					this.context.beginPath();
					this.context.arc(this.r * 0.63 * Math.cos(ang), this.r * 0.63 * Math.sin(ang), this.r * 0.24, 0, Math.PI * 2);
					this.context.fill();
				}

				this.context.globalCompositeOperation = 'destination-out';
				for (i = 0.4; i < 6; i++) {
					ang = this.giro + (Math.PI * i / 3);
					this.context.beginPath();
					this.context.arc(this.r * 1.67 * Math.cos(ang), this.r * 1.67 * Math.sin(ang), this.r * 0.76, 0, Math.PI * 2);
					this.context.fill();
				}

				this.context.restore();
			}
		},
		dibujarArcoExteriorDR2: {
			value: function (giro) {
				this.context.lineCap = 'square';

				this.context.globalCompositeOperation = 'source-over';
				this.context.strokeStyle = 'white';
				this.context.lineWidth = this.r * 0.1;
				for (var i = 0; i < 4; i++) {
					this.context.beginPath();
					this.context.arc(0, 0, this.r * 1.17, giro + (Math.PI * i / 2), giro + (Math.PI * i / 2) + 1.4);
					this.context.stroke();
				}

				this.context.globalCompositeOperation = 'destination-out';
				this.context.lineWidth = this.r * 0.08;
				for (var i = 0; i < 4; i++) {
					this.context.beginPath();
					this.context.arc(0, 0, this.r * 1.17, giro + (Math.PI * i / 2), giro + (Math.PI * i / 2) + 1.4);
					this.context.stroke();
				}

				this.context.globalCompositeOperation = 'source-over';
				this.context.strokeStyle = 'rgba(255,255,255,0.3)';
				this.context.lineWidth = this.r * 0.09;
				for (var i = 0; i < 4; i++) {
					this.context.beginPath();
					this.context.arc(0, 0, this.r * 1.17, giro + (Math.PI * i / 2), giro + (Math.PI * i / 2) + 1.4);
					this.context.stroke();
				}
			}
		},
		dibujarArcoInteriorDR2: {
			value: function (giro) {
				this.context.globalCompositeOperation = 'source-over';

				this.context.strokeStyle = 'white';
				this.context.lineCap = 'square';
				this.context.lineWidth = this.r * 0.05;

				for (var i = 0; i < 2; i++) {
					this.context.beginPath();
					this.context.arc(0, 0, this.r * 1.0625, (Math.PI * i) - giro, (Math.PI * i) + 3 - giro);
					this.context.stroke();
				}

				this.context.globalCompositeOperation = 'destination-out';
				this.context.lineWidth = this.r * 0.036;
				for (var i = 0; i < 2; i++) {
					this.context.beginPath();
					this.context.arc(0, 0, this.r * 1.0625, (Math.PI * i) - giro, (Math.PI * i) + 3 - giro);
					this.context.stroke();
				}

				this.context.globalCompositeOperation = 'source-over';
				this.context.strokeStyle = 'rgba(255,255,255,0.3)';
				this.context.lineWidth = this.r * 0.04;
				for (var i = 0; i < 2; i++) {
					this.context.beginPath();
					this.context.arc(0, 0, this.r * 1.0625, (Math.PI * i) - giro, (Math.PI * i) + 3 - giro);
					this.context.stroke();
				}
			}
		},
		dibujarArcoInteriorDR1: {
			value: function (giro) {
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
		},
		dibujarArcoExteriorDR1: {
			value: function (giro) {
				this.context.globalCompositeOperation = 'source-over';

				this.context.lineWidth = this.r * 0.025;

				for (var i = 0; i < 2; i++) {
					this.context.beginPath();
					this.context.arc(0, 0, this.r * 1.0625, (Math.PI * i) - giro, (Math.PI * i) + 2.3 - giro);
					this.context.stroke();
				}
			}
		},
		renderBulletPresentation: {
			value: function (time) {
				var i,
					bullets_total,
					bullet_index,
					normalized, limit_lower, limit_upper,
					bullet, inter_index;

				// time < t, t is the amount of seconds for the cilinder intro from left
				if (time < 0.25)
					// x = [-2 * r] -> [-0.1 * r]
					this.x = (7.6 * time - 2) * this.r;
				else {
					this.x = -0.1 * this.r;
					bullets_total = this.bullets.length;

					// k * time - (k*t):
					// k sets the speed of the bullets animation
					// bullet_index -> [0, total amount of bullets]
					bullet_index = Math.min(2 * time - 0.5, bullets_total);
				}

				this.context.clearRect(0, 0, this.width, this.height);
				this.context.save();
				this.context.translate(this.x, this.y);
				this.context.rotate(-0.1);

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
						if (inter_index < 0.7) {
							bullet.x += this.width * (1 - Math.min(1, inter_index / 0.7));
							this.giro = (Math.PI / -3) * (inter_index / 0.7);
						}

						else if (bullets_total > 1) {
							// Vertical movement one place up
							if (inter_index - Math.floor(inter_index) > 0.7
								&& inter_index - Math.floor(inter_index) < 1)
								bullet.y -= (inter_index - Math.floor(inter_index) - 0.7) / 0.3;

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
				this.dibujarArcoInteriorDR2(time / 1.2);
				this.dibujarArcoExteriorDR2(time / 1.2);

				this.context.restore();

				return (2 * time > bullets_total + 8);
			}
		}
	});



	return {
		start: presentNSD,
		balas: presentBullets
	};

})(DR);