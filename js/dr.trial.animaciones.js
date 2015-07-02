/* global Promise */
/* global THREE */
/* global render */
(function (DR) {
    "use strict";

    var EASE = {
        // t: start time, b: begInnIng value, c: change In value, d: duration
        linear: function (x) {
            return x;
        },
        inQuad: function (x) {
            return x * x;
        },
        outQuad: function (x) {
            return -x * (x - 2);
        },
        inOutQuad: function (x) {
            return 0.5 * ((x *= 2) < 1 ? x * x : x * (2 - x) - 2);
        },
        inCubic: function (x) {
            return x * x * x;
        },
        outCubic: function (x) {
            return Math.pow(x - 1, 3) + 1;
        },
        inOutCubic: function (x) {
            return 0.5 * ((x *= 2) < 1 ? x * x * x : Math.pow(2 * x - 2, 3) + 2);
        },/*
        easeInQuart: function (x) {
            return c * (t /= d) * t * t * t;
        },
        easeOutQuart: function (x) {
            return -c * ((t = t / d - 1) * t * t * t - 1);
        },
        easeInOutQuart: function (x) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t;
            return -c / 2 * ((t -= 2) * t * t * t - 2);
        },
        easeInQuint: function (x) {
            return c * (t /= d) * t * t * t * t;
        },
        easeOutQuint: function (x) {
            return c * ((t = t / d - 1) * t * t * t * t + 1);
        },
        easeInOutQuint: function (x) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t;
            return c / 2 * ((t -= 2) * t * t * t * t + 2);
        },*/
        inSine: function (x) {
            return 1 - Math.cos(x * Math.PI / 2);
        },
        outSine: function (x) {
            return Math.sin(x * Math.PI / 2);
        },
        inOutSine: function (x) {
            return -0.5 * (Math.cos(Math.PI * x) - 1);
        },
        easeInExpo: function (x) {
            return Math.pow(1024, x - 1);
        },
        easeOutExpo: function (x) {
            return 1.0009765626 - Math.pow(1024, -x);
        },
        easeInOutExpo: function (x) {
            return 0.5 * ((x *= 2) < 1 ? Math.pow(1024, x - 1) : 2 - Math.pow(1024, 1 - x));
        }
    };


    function Animacion() {
        this.promise = Promise.resolve(true);
    }

    Object.defineProperty(Animacion, 'cuadro', {
        value: 0,
        writable: true
    });
    
    Animacion.prototype.loadScript = function (script) {
        var self = this;
        script.forEach(function(item) {
            if ('sprite' in item)
                self.cambiarSprite(item.character, item.sprite);
            
            self.transicion(item);
        });
        
        return this;
    };
    
    Animacion.prototype.delay = function(time) {
        this.promise = this.promise.then(function() {
            return Promise.delay(time);
        });
        
        return this;
    };

    Animacion.prototype.cambiarSprite = function (persona, archivo) {
        this.promise = this.promise.then(function () {
            return DR.Sprites.change(persona, archivo);
        });

        return this;
    };

    Animacion.prototype.cortarHacia = function (newcam) {
        this.promise = this.promise.then(function () {
            cancelAnimationFrame(Animacion.cuadro);

            if ('fov' in newcam) {
                DR.camara.fov = newcam.fov;
                DR.camara.updateProjectionMatrix();
            }

            if ('up' in newcam)
                DR.camara.up.copy(newcam.up);

            if ('position' in newcam)
                DR.camara.position.copy(newcam.position);

            if ('lookat' in newcam)
                DR.camara.lookAt(newcam.lookat.threeJsVector);

            DR.renderizar();
        });

        return this;
    };

    var INTERPRETE = {
        Position: function (param) {
            var route = new Trayectoria({
                    start: new Coordenada(param.position.start || DR.camara.position),
                    end: new Coordenada(param.position.end || param.position),
                    route: param.position.route || param.route
                });
            
            this.apply = function (t) {
                DR.camara.position.copy(route.getVector(t));
            };
            
            param = null;
        },
        LookAt: function (param) {
            var route = new Trayectoria({
                    start: new Coordenada(param.lookat.start || new THREE.Vector3(0, 0, -10).applyMatrix4(DR.camara.matrixWorld)),
                    end: new Coordenada(param.lookat.end || param.lookat),
                    route: param.lookat.route || param.route
                });

            this.apply = function (t) {
                DR.camara.lookAt(route.getVectorThree(t));
            };
            
            param = null;
        },
        Up: function (param) {
            var route = new Trayectoria({
                    start: new Coordenada(param.up.start || DR.camara.up),
                    end: new Coordenada(param.up.end || param.up),
                    route: param.up.route || param.route
                });

            this.apply = function (t) {
                DR.camara.up.copy(route.getVector(t));
            };
            
            param = null;
        },
        FOV: function (param) {
            var start = (param.fov.start || DR.camara.fov),
                delta = (param.fov.end || param.fov) - start;

            this.apply = function (t) {
                DR.camara.fov = start + delta * t;
                DR.camara.updateProjectionMatrix();
            };
            
            param = null;
        }
    };

    Animacion.prototype.transicion = function (param) {
        this.promise = this.promise.then(function () {
            var duration = param.duration || 10,
                easing = EASE[param.easing] || EASE.linear,
                delta = {};

            if ('fov' in param)
                delta.fov = new INTERPRETE.FOV(param);

            if ('up' in param)
                delta.up = new INTERPRETE.Up(param);

            if ('position' in param)
                delta.position = new INTERPRETE.Position(param);

            if ('lookat' in param)
                delta.lookat = new INTERPRETE.LookAt(param);

            param = null;

            return new Promise(function (resolve, reject) {
                var inicio;

                function transicion(now) {
                    now = now || ('performance' in window ? performance.now() : Date.now());

                    var avance = Math.min(1, (now - inicio) / duration),
                        recorrido = easing(avance);

                    if ('fov' in delta)
                        delta.fov.apply(recorrido);

                    if ('up' in delta)
                        delta.up.apply(recorrido);

                    if ('position' in delta)
                        delta.position.apply(recorrido);

                    if ('lookat' in delta)
                        delta.lookat.apply(recorrido);

                    DR.renderizar();

                    if (avance < 1) {
                        Animacion.cuadro = requestAnimationFrame(transicion);
                    } else {
                        delta = easing = duration = null;
                        inicio = now = null;
                        avance = recorrido = null;
                        resolve();
                    }
                }

                cancelAnimationFrame(Animacion.cuadro);
                inicio = 'performance' in window ? performance.now() : Date.now();
                transicion(inicio);
            });
        });

        return this;
    };

    Animacion.prototype.tutorial = function () {
        var inicio, transition;

        DR.camara.up.set(0, 0, 1);
        DR.camara.fov = 40;
        DR.camara.updateProjectionMatrix();

        transition = function (now) {
            var delta = (now - inicio) / 1000,
                angle = delta * 0.04 * Math.PI,
                sin = Math.sin(angle),
                cos = Math.cos(angle);

            DR.camara.position.set(-28 * cos, -28 * sin, 33);
            DR.camara.lookAt(new THREE.Vector3(19 * cos, 19 * sin, 9));
            // look: -19, 0, 9
            // pos: 28, 0, 33

            DR.renderizar();
            Animacion.cuadro = requestAnimationFrame(transition);
        };

        this.promise = this.promise.then(function (resolve, reject) {
            cancelAnimationFrame(Animacion.cuadro);
            inicio = ('performance' in window ? performance.now() : Date.now());
            transition(inicio);
        });

        return this;
    };
    
    Animacion.prototype.tutorialToNSD = function () {
        this.promise = this.promise.then(function (resolve, reject) {
            DR.camara.up.set(0, 0, 1);
            
            return new Promise(function (resolve) {
                var inicio,
                    start = Math.PI + new Coordenada(DR.camara.position).p,
                    darkFadeIn = new THREE.Sprite();
                
                cancelAnimationFrame(Animacion.cuadro);
                
                function transition(now) {
                    var delta = (now - inicio) / 1000,
                        angle = start - (delta * Math.PI),
                        sin = Math.sin(angle),
                        cos = Math.cos(angle);
    
                    DR.camara.position.set(-28 * cos, -28 * sin, 33 - (delta * 7));
                    DR.camara.lookAt(new THREE.Vector3(19 * cos, 19 * sin, 9));
                    
                    if (delta > 1) {
                        DR.hud.clearRect(0, 0, DR.canvas.width, DR.canvas.height);
                        DR.hud.beginPath();
                        DR.hud.fillStyle = 'rgba(0, 0, 0, '+ (delta - 1) +')';
                        DR.hud.rect(0, 0, DR.canvas.width, DR.canvas.height);
                        DR.hud.fill();
                    }
        
                    DR.renderizar();
                    
                    if (delta < 2)
                        Animacion.cuadro = requestAnimationFrame(transition);
                    else {
                        DR.hudClear();
                        resolve();
                    }
                };
                
                inicio = ('performance' in window ? performance.now() : Date.now());
                transition(inicio);
            });
        });

        return this;
    };

    Animacion.prototype.cuestionamiento = function () {
        return this
            .cortarHacia({
            fov: 40,
            up: new Coordenada([0, 0, 1]),
            position: new Coordenada({ r: 3, p: 1.5707963267, z: 14 }),
            lookat: new Coordenada({ r: 19, p: 1.5707963267, z: 13 })
        })
            .transicion({
            duration: 600,
            position: new Coordenada({ r: 1, p: 1.5707963267, z: 14 }),
            lookat: new Coordenada({ r: 19, p: 1.5707963267, z: 13 }),
            easing: 'inOutQuad'
        })
            .transicion({
            duration: 600,
            fov: 60,
            position: new Coordenada({ r: 10, p: 1.5707963267, z: 15 }),
            lookat: new Coordenada({ r: 19, p: 1.5707963267, z: 13.4 }),
            easing: 'inOutQuad'
        });
    };

    function Coordenada(input) {
        this._x = 0;
        this._y = 0;
        this._z = 0;

        this.esferica = input.esferica || !!input[4];

        this.cx = input.cx || 0;
        this.cy = input.cy || 0;
        this.cz = input.cz || 0;

        if (input instanceof Coordenada) {
            this._x = input._x;
            this._y = input._y;
            this._z = input._z;
        }

        else if (input.hasOwnProperty('x')) {
            this._x = input.x;
            this._y = input.y;
            this._z = input.z;
        }

        else if (input.hasOwnProperty('t')) {
            this.esferica = true;
            this.setEsferica(input);
        }

        else if (input.hasOwnProperty('p')) {
            this.setPolar(input);
            this.z = input.z;
        }

        else if (Array.isArray(input)) {
            this._x = input[0];
            this._y = input[1];
            this._z = input[2];
        }
    }

    Object.defineProperties(Coordenada.prototype, {
        toString: {
            writable: false,
            value: function() {
                return JSON.stringify(this.vectorThree);
            }
        },
        x: {
            get: function () {
                return this._x - this.cx;
            },
            set: function (i) {
                this._x = this.cx + i;
            }
        },
        y: {
            get: function () {
                return this._y - this.cy;
            },
            set: function (i) {
                this._y = this.cy + i;
            }
        },
        z: {
            get: function () {
                return this._z - this.cz;
            },
            set: function (i) {
                this._z = this.cz + i;
            }
        },
        r: {
            get: function () {
                var x = this._x - this.cx,
                    y = this._y - this.cy,
                    z = this._z - this.cz;
                return Math.sqrt(x * x + y * y + (this.esferica ? z * z : 0));
            },
            set: function (i) {
                if (this.esferica)
                    this.setEsferica(i, this.t, this.p);
                else
                    this.setPolar(i, this.p);
            }
        },
        t: {
            get: function () {
                var x = this._x - this.cx,
                    y = this._y - this.cy,
                    z = this._z - this.cz;
                return Math.acos(z / Math.sqrt(x * x + y * y + z * z));
            },
            set: function (i) {
                this.setEsferica(this.r, i, this.p);
            }
        },
        p: {
            get: function () {
                return Math.atan2(this._y - this.cy, this._x - this.cx);
            },
            set: function (i) {
                if (this.esferica) {
                    this.setEsferica(this.r, this.t, i);
                } else {
                    this.setPolar(this.r, i);
                }
            }
        },
        centro: {
            get: function () {
                return [this.cx, this.cy, this.cz];
            },
            set: function (input) {
                this.cx = input.x || input[0];
                this.cy = input.y || input[1];
                this.cz = input.z || input[2];
            }
        },
        vectorThree: {
            get: function () {
                return new THREE.Vector3(this.x, this.y, this.z);
            }
        },
        setEsferica: {
            value: function (r, t, p) {
                // t: inclinación, 0°-180°
                // p: azimuth, 0°-360°
                if (r.hasOwnProperty('t') && r.hasOwnProperty('p')) {
                    p = r.p;
                    t = r.t;
                    r = r.r;
                }

                this._x = this.cx + r * Math.sin(t) * Math.cos(p);
                this._y = this.cy + r * Math.sin(t) * Math.sin(p);
                this._z = this.cz + r * Math.cos(t);
            }
        },
        setPolar: {
            value: function (r, p) {
                if (r.hasOwnProperty('p')) {
                    p = r.p;
                    r = r.r;
                }

                this._x = this.cx + r * Math.cos(p);
                this._y = this.cy + r * Math.sin(p);
            }
        }
    });
    
    function Trayectoria(param) {
        param.center = param.center || {x: 0, y: 0, z: 0};
        
        this.cx = param.center.x;
        this.cy = param.center.y;
        this.cz = param.center.z;
        
        this.ax = param.start.x - this.cx;
        this.ay = param.start.y - this.cy;
        this.az = param.start.z - this.cz;
        this.ar = Math.sqrt(this.ax * this.ax + this.ay * this.ay + (param.type == 'spherical' ? this.az * this.az : 0));
        this.ap = Math.atan2(this.ay, this.ax);
        this.at = Math.acos(this.az / Math.sqrt(this.ax * this.ax + this.ay * this.ay + this.az * this.az));
        
        this.bx = param.end.x - this.cx;
        this.by = param.end.y - this.cy;
        this.bz = param.end.z - this.cz;
        this.br = Math.sqrt(this.bx * this.bx + this.by * this.by + (param.type == 'spherical' ? this.bz * this.bz : 0));
        this.bp = Math.atan2(this.by, this.bx);
        this.bt = Math.acos(this.bz / Math.sqrt(this.bx * this.bx + this.by * this.by + this.bz * this.bz));
        
        if (this.bp - this.ap > Math.PI)
            this.ap += 2 * Math.PI;
        else if (this.bp - this.ap < -Math.PI)
            this.bp += 2 * Math.PI;
        
        this.route = param.route || 'linear';
        
        this.geometry = new THREE.SphereGeometry( 0.1, 4, 4 );
        this.material = new THREE.MeshBasicMaterial({ color: Math.floor(Math.random() * 0xFFFFFF) });
        
        param = null;
    }
    
    Object.defineProperties(Trayectoria.prototype, {
        getVector: {
            value: function(t) {
                return {x: this.getX(t), y: this.getY(t), z: this.getZ(t)};
            }
        },
        getVectorThree: {
            value: function(t) {
                return new THREE.Vector3(this.getX(t), this.getY(t), this.getZ(t));
            }
        },
        getX: {
            value: function(t) {
                if (this.route == 'spherical')
                    return this.cx + this.getR(t) * Math.sin(this.getT(t)) * Math.cos(this.getP(t));
                
                if (this.route == 'circular')
                    return this.cx + this.getR(t) * Math.cos(this.getP(t));
                
                return (1-t) * this.ax + t * this.bx;
            }
        },
        getY: {
            value: function(t) {
                if (this.route == 'spherical')
                    return this.cy + this.getR(t) * Math.sin(this.getT(t)) * Math.sin(this.getP(t));
                
                if (this.route == 'circular')
                    return this.cy + this.getR(t) * Math.sin(this.getP(t));
                
                return (1-t) * this.ay + t * this.by;
            }
        },
        getZ: {
            value: function(t) {
                if (this.route == 'spherical')
                    return this.cz + this.getR(t) * Math.cos(this.getT(t));
                    
                return (1-t) * this.az + t * this.bz;
            }
        },
        getR: {
            value: function(t) {
                return (1-t) * this.ar + t * this.br;
            }
        },
        getP: {
            value: function(t) {
                return (1-t) * this.ap + t * this.bp;
            }
        },
        getT: {
            value: function(t) {
                return (1-t) * this.at + t * this.bt;
            }
        },
        drawStep: {
            value: function(t) {
                var esfera = new THREE.Mesh( this.geometry, this.material );
                esfera.position.copy(this.getVector(t));
                DR.escena.add(esfera);
                return esfera;
            }
        },
        draw: {
            value: function(t) {
                var i, esfera,
                    obj = new THREE.Object3D();
                
                for (i=0; i<1; i+=0.02) {
                    esfera = new THREE.Mesh( this.geometry, this.material );
                    esfera.position.copy(this.getVector(i));
                    obj.add(esfera);
                }
                
                DR.escena.add(obj);
                return obj;
            }
        }
    });

    Object.defineProperties(window, {
        'Coordenada': {
            value: Coordenada,
            writable: false
        },
        'Trayectoria': {
            value: Trayectoria,
            writable: false
        },
        'Animacion': {
            value: Animacion,
            writable: false
        }
    });

})(DR);
