export default class Trayectoria
{
    constructor(param)
    {
        param.center = param.center || { x: 0, y: 0, z: 0 };

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

        this.geometry = new THREE.SphereGeometry(0.1, 4, 4);
        this.material = new THREE.MeshBasicMaterial({ color: Math.floor(Math.random() * 0xFFFFFF) });

        param = null;
    }

    getVector(t)
    {
        return { x: this.getX(t), y: this.getY(t), z: this.getZ(t) };
    }

    getVectorThree(t)
    {
        return new THREE.Vector3(this.getX(t), this.getY(t), this.getZ(t));
    }
    
    getX(t)
    {
        if (this.route == 'spherical')
            return this.cx + this.getR(t) * Math.sin(this.getT(t)) * Math.cos(this.getP(t));

        if (this.route == 'circular')
            return this.cx + this.getR(t) * Math.cos(this.getP(t));

        return (1 - t) * this.ax + t * this.bx;
    }
    
    getY(t)
    {
        if (this.route == 'spherical')
            return this.cy + this.getR(t) * Math.sin(this.getT(t)) * Math.sin(this.getP(t));

        if (this.route == 'circular')
            return this.cy + this.getR(t) * Math.sin(this.getP(t));

        return (1 - t) * this.ay + t * this.by;
    }
    
    getZ(t)
    {
        if (this.route == 'spherical')
            return this.cz + this.getR(t) * Math.cos(this.getT(t));

        return (1 - t) * this.az + t * this.bz;
    }
    
    getR(t)
    {
        return (1 - t) * this.ar + t * this.br;
    }
    
    getP(t)
    {
        return (1 - t) * this.ap + t * this.bp;
    }
    
    getT(t)
    {
        return (1 - t) * this.at + t * this.bt;
    }
    /*
            },
            drawStep: {
                value: function (t) {
                    var esfera = new THREE.Mesh(this.geometry, this.material);
                    esfera.position.copy(this.getVector(t));
                    DR.escena.add(esfera);
                    return esfera;
                }
            },
            draw: {
                value: function (t) {
                    var i, esfera,
                        obj = new THREE.Object3D();
 
                    for (i = 0; i < 1; i += 0.02) {
                        esfera = new THREE.Mesh(this.geometry, this.material);
                        esfera.position.copy(this.getVector(i));
                        obj.add(esfera);
                    }
 
                    DR.escena.add(obj);
                    return obj;
                }
    */
}
