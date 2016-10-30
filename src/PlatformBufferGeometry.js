export default class PlatformBufferGeometry extends THREE.BufferGeometry
{
    constructor(radiusInternal, radiusExternal, segments)
    {
        super();

        this.type = 'PlatformBufferGeometry';

        radiusInternal = radiusInternal || 20;
        radiusExternal = radiusExternal || 31;
        segments = segments || 32;

        var s,
            this_x, this_y, next_x, next_y,
            angle = (2 * Math.PI) / segments,

            vertices = new Float32Array(segments * 6 * 3),
            uvs = new Float32Array(segments * 6 * 2);

        for (s = 0; s < segments; s++) {
            this_x = Math.cos(angle * s);
            this_y = Math.sin(angle * s);
            next_x = Math.cos(angle * (s+1));
            next_y = Math.sin(angle * (s+1));

            uvs[12 * s +  0] = 0;
            uvs[12 * s +  1] = 0;
            vertices[18 * s +  0] = radiusInternal * this_x;
            vertices[18 * s +  1] = radiusInternal * this_y;
            vertices[18 * s +  2] = 0;

            uvs[12 * s +  2] = 1;
            uvs[12 * s +  3] = 0;
            vertices[18 * s +  3] = radiusExternal * this_x;
            vertices[18 * s +  4] = radiusExternal * this_y;
            vertices[18 * s +  5] = 0;

            uvs[12 * s +  4] = 1;
            uvs[12 * s +  5] = 1;
            vertices[18 * s +  6] = radiusExternal * next_x;
            vertices[18 * s +  7] = radiusExternal * next_y;
            vertices[18 * s +  8] = 0;


            uvs[12 * s +  6] = 1;
            uvs[12 * s +  7] = 1;
            vertices[18 * s +  9] = radiusExternal * next_x;
            vertices[18 * s + 10] = radiusExternal * next_y;
            vertices[18 * s + 11] = 0;

            uvs[12 * s +  8] = 0;
            uvs[12 * s +  9] = 1;
            vertices[18 * s + 12] = radiusInternal * next_x;
            vertices[18 * s + 13] = radiusInternal * next_y;
            vertices[18 * s + 14] = 0;

            uvs[12 * s + 10] = 0;
            uvs[12 * s + 11] = 0;
            vertices[18 * s + 15] = radiusInternal * this_x;
            vertices[18 * s + 16] = radiusInternal * this_y;
            vertices[18 * s + 17] = 0;
        }

        this.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        //this.computeVertexNormals();

        this_x = this_y = null;
        next_x = next_y = null;
        uvs = null;
        vertices = null;
    }
}