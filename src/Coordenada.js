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
        value: function () {
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

export default Coordenada