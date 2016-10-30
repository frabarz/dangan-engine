export default class CylinderBufferGeometry extends THREE.BufferGeometry
{
    constructor(sides, height, apothem)
    {
        super();

        this.type = 'CylinderBufferGeometry';

        var radius = apothem / Math.cos(Math.PI / sides);

        var s,
            this_x, this_y, next_x, next_y,
            angle = (2 * Math.PI) / sides,

            vertices = new Float32Array(sides * 6 * 3),
            uvs = new Float32Array(sides * 6 * 2);

        for (s = 0; s <= sides; s++) {
            this_x = radius * Math.cos(angle * (s - 0.5));
            this_y = radius * Math.sin(angle * (s - 0.5));
            next_x = radius * Math.cos(angle * (s + 0.5));
            next_y = radius * Math.sin(angle * (s + 0.5));

            // (x,y) = 1,1 : Top right vertex
            uvs[s * 12 + 0] = 1;
            uvs[s * 12 + 1] = 1;
            vertices[s * 18 + 0] = next_x;
            vertices[s * 18 + 1] = next_y;
            vertices[s * 18 + 2] = height;
            // (x,y) = 0,1 : Top left vertex
            uvs[s * 12 + 2] = 0;
            uvs[s * 12 + 3] = 1;
            vertices[s * 18 + 3] = this_x;
            vertices[s * 18 + 4] = this_y;
            vertices[s * 18 + 5] = height;
            // (x,y) = 0,0 : Bottom left vertex
            uvs[s * 12 + 4] = 0;
            uvs[s * 12 + 5] = 0;
            vertices[s * 18 + 6] = this_x;
            vertices[s * 18 + 7] = this_y;
            vertices[s * 18 + 8] = 0;

            // (x,y) = 0,0 : Bottom left vertex
            uvs[s * 12 + 6] = 0;
            uvs[s * 12 + 7] = 0;
            vertices[s * 18 + 9] = this_x;
            vertices[s * 18 + 10] = this_y;
            vertices[s * 18 + 11] = 0;
            // (x,y) = 1,0 : Bottom right vertex
            uvs[s * 12 + 8] = 1;
            uvs[s * 12 + 9] = 0;
            vertices[s * 18 + 12] = next_x;
            vertices[s * 18 + 13] = next_y;
            vertices[s * 18 + 14] = 0;
            // (x,y) = 1,1 : Top right vertex
            uvs[s * 12 + 10] = 1;
            uvs[s * 12 + 11] = 1;
            vertices[s * 18 + 15] = next_x;
            vertices[s * 18 + 16] = next_y;
            vertices[s * 18 + 17] = height;
        }

        this.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));

        this_x = this_y = null;
        next_x = next_y = null;
        uvs = null;
        vertices = null;
    }
}