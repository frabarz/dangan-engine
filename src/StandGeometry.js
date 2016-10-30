export default class StandGeometry extends THREE.Geometry
{
    constructor(dist, altu)
    {
        super();
        
        // Atril
        this.vertices.push(
            new THREE.Vector3(0.8, dist - 2, altu + 10.2), // 4 del frente   0
            new THREE.Vector3(-0.8, dist - 2, altu + 10.2),
            new THREE.Vector3(-0.8, dist - 2, altu + 8.7),
            new THREE.Vector3(0.8, dist - 2, altu + 8.7),
            new THREE.Vector3(0.8, dist + 4, altu + 10.2), // 4 detras      4
            new THREE.Vector3(-0.8, dist + 4, altu + 10.2),
            new THREE.Vector3(-0.8, dist + 4, altu + 8.5),
            new THREE.Vector3(0.8, dist + 4, altu + 8.5),
            new THREE.Vector3(0.8, dist + 0, altu + 7.5), // 4 debajo      8
            new THREE.Vector3(-0.8, dist + 0, altu + 7.5),
            new THREE.Vector3(-0.8, dist + 3, altu + 7.5),
            new THREE.Vector3(0.8, dist + 3, altu + 7.5)
            );

        this.faces.push(
            new THREE.Face3(0, 1, 2), // Frente
            new THREE.Face3(2, 3, 0),
            new THREE.Face3(3, 2, 9),
            new THREE.Face3(9, 8, 3),
            new THREE.Face3(4, 5, 1), // Arriba
            new THREE.Face3(1, 0, 4),
            new THREE.Face3(4, 0, 3), // Derecha
            new THREE.Face3(3, 7, 4),
            new THREE.Face3(7, 3, 8),
            new THREE.Face3(8, 11, 7),
            new THREE.Face3(1, 5, 6), // Izquierda
            new THREE.Face3(6, 2, 1),
            new THREE.Face3(2, 6, 10),
            new THREE.Face3(10, 9, 2),
            new THREE.Face3(5, 4, 7), // Atrás
            new THREE.Face3(7, 6, 5),
            new THREE.Face3(6, 7, 11),
            new THREE.Face3(11, 10, 6),
            new THREE.Face3(8, 9, 10), // Abajo
            new THREE.Face3(10, 11, 8)
            );

        // Poste
        this.vertices.push(
            new THREE.Vector3(0.6, dist + 0.2, altu + 7.5), // 4 del frente, 12
            new THREE.Vector3(-0.6, dist + 0.2, altu + 7.5),
            new THREE.Vector3(-0.6, dist + 0.2, altu + 1.1),
            new THREE.Vector3(0.6, dist + 0.2, altu + 1.1),
            new THREE.Vector3(-0.6, dist + 2.8, altu + 7.5), // 4 de atrás
            new THREE.Vector3(0.6, dist + 2.8, altu + 7.5),
            new THREE.Vector3(0.6, dist + 2.8, altu + 1.1),
            new THREE.Vector3(-0.6, dist + 2.8, altu + 1.1)
            );

        this.faces.push(
            new THREE.Face3(12, 13, 14),
            new THREE.Face3(14, 15, 12),
            new THREE.Face3(16, 17, 18),
            new THREE.Face3(18, 19, 16),
            new THREE.Face3(17, 12, 15),
            new THREE.Face3(15, 18, 17),
            new THREE.Face3(13, 16, 19),
            new THREE.Face3(19, 14, 13)
            );

        // Base
        this.vertices.push(
            new THREE.Vector3(0.8, dist + 0, altu + 1.4), // 4 del frente
            new THREE.Vector3(-0.8, dist + 0, altu + 1.4),
            new THREE.Vector3(-0.8, dist + 0, altu + 0.0),
            new THREE.Vector3(0.8, dist + 0, altu + 0.0),
            new THREE.Vector3(-0.8, dist + 3, altu + 1.4), // 2 superiores
            new THREE.Vector3(0.8, dist + 3, altu + 1.4),
            new THREE.Vector3(0.8, dist + 4, altu + 0.7), // 2 del bisel
            new THREE.Vector3(-0.8, dist + 4, altu + 0.7),
            new THREE.Vector3(0.8, dist + 4, altu + 0.0), // 2 inferiores
            new THREE.Vector3(-0.8, dist + 4, altu + 0.0)
            );

        this.faces.push(
            new THREE.Face3(20, 21, 22),
            new THREE.Face3(22, 23, 20),
            new THREE.Face3(25, 24, 21),
            new THREE.Face3(21, 20, 25),
            new THREE.Face3(20, 23, 28),
            new THREE.Face3(28, 26, 20),
            new THREE.Face3(26, 25, 20),
            new THREE.Face3(24, 25, 26),
            new THREE.Face3(26, 27, 24),
            new THREE.Face3(27, 26, 28),
            new THREE.Face3(28, 29, 27),
            new THREE.Face3(21, 24, 27),
            new THREE.Face3(21, 27, 29),
            new THREE.Face3(21, 29, 22)
            );

        var n = this.faces.length / 2,
            j = [new THREE.Vector2(0, 1), new THREE.Vector2(0, 0), new THREE.Vector2(1, 1)],
            k = [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)];

        this.faceVertexUvs[0] = [];
        while (n--)
            this.faceVertexUvs[0].push(j, k);

        this.computeFaceNormals();
        this.computeVertexNormals();
    }
}