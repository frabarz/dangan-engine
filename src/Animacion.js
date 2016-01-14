import Promise from '../lib/promise-custom.js';
import Coordenada from './Coordenada.js';

import EASE from './easing.js';
import INTERPRETE from './interprete.js';

class Animacion
{
    constructor(trial)
    {
        this.trial = trial;
        this.promise = Promise.resolve(true);
    }

    loadScript(script)
    {
        var self = this;
        script.forEach(function (item) {
            if ('sprite' in item)
                self.changeSprite(item.character, item.sprite);

            self.transicion(item);
        });

        return this;
    }

    delay(time)
    {
        this.promise = this.promise.then(function () {
            return Promise.delay(time);
        });

        return this;
    }

    changeSprite(persona, sprite)
    {
        this.trial.characters[persona].changeSprite(sprite);
        return this;
    }

    cortarHacia(newcam)
    {
        var trial = this.trial;
        this.promise = this.promise.then(function () {
            cancelAnimationFrame(Animacion.cuadro);

            if ('fov' in newcam) {
                trial.mainCamera.fov = newcam.fov;
                trial.mainCamera.updateProjectionMatrix();
            }

            if ('up' in newcam)
                trial.mainCamera.up.copy(newcam.up);

            if ('position' in newcam)
                trial.mainCamera.position.copy(newcam.position);

            if ('lookat' in newcam)
                trial.mainCamera.lookAt(newcam.lookat.threeJsVector);

            trial.render();
        });

        return this;
    }

    transicion(param)
    {
        param.trial = this.trial;
        this.promise = this.promise.then(function () {
            var trial = param.trial,
                duration = param.duration || 10,
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

                    trial.render();

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
				inicio = window.performance.now();
                transicion(inicio);
            });
        });

        return this;
    }

    tutorial()
    {
        var inicio, transition,
            trial = this.trial;

        trial.mainCamera.up.set(0, 0, 1);
        trial.mainCamera.fov = 40;
        trial.mainCamera.updateProjectionMatrix();

        transition = function (now) {
			Animacion.cuadro = requestAnimationFrame(transition);
			
			var angle = (now - inicio) / 1000 * 0.04 * Math.PI,
                sin = Math.sin(angle),
                cos = Math.cos(angle);

			angle = null;

            trial.mainCamera.position.set(-28 * cos, -28 * sin, 33);
            trial.mainCamera.lookAt(new THREE.Vector3(19 * cos, 19 * sin, 9));
            // look: -19, 0, 9
            // pos: 28, 0, 33

			sin = null;
			cos = null;

			trial.render(now);
        };

        this.promise = this.promise.then(function (resolve, reject) {
            cancelAnimationFrame(Animacion.cuadro);
			inicio = window.performance.now();
            transition(inicio);
        });

        return this;
    }


    cuestionamiento()
    {
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
    }
}

Object.defineProperties(Animacion, {
    cuadro: {
        value: 0,
        writable: true
    },

    step: {
        value: function (step) {
            this.cuadro = requestAnimationFrame(step);
        },
        writable: false
    },

    stop: {
        value: function () {
            cancelAnimationFrame(this.cuadro);
        },
        writable: false
    }
});

export default Animacion