import Coordenada from './Coordenada.js';
import Trayectoria from './Trayectoria.js';

export default {
    Position: function (param) {
        var trial = param.trial,
            route = new Trayectoria({
                start: new Coordenada(param.position.start || trial.mainCamera.position),
                end: new Coordenada(param.position.end || param.position),
                route: param.position.route || param.route
            });

        this.apply = function (t) {
            trial.mainCamera.position.copy(route.getVector(t));
        };

        param = null;
    },
    LookAt: function (param) {
        var trial = param.trial,
            route = new Trayectoria({
                start: new Coordenada(param.lookat.start || new THREE.Vector3(0, 0, -10).applyMatrix4(trial.mainCamera.matrixWorld)),
                end: new Coordenada(param.lookat.end || param.lookat),
                route: param.lookat.route || param.route
            });

        this.apply = function (t) {
            trial.mainCamera.lookAt(route.getVectorThree(t));
        };

        param = null;
    },
    Up: function (param) {
        var trial = param.trial,
            route = new Trayectoria({
                start: new Coordenada(param.up.start || trial.mainCamera.up),
                end: new Coordenada(param.up.end || param.up),
                route: param.up.route || param.route
            });

        this.apply = function (t) {
            trial.mainCamera.up.copy(route.getVector(t));
        };

        param = null;
    },
    FOV: function (param) {
        var trial = param.trial,
            start = (param.fov.start || trial.mainCamera.fov),
            delta = (param.fov.end || param.fov) - start;

        this.apply = function (t) {
            trial.mainCamera.fov = start + delta * t;
            trial.mainCamera.updateProjectionMatrix();
        };

        param = null;
    }
};
