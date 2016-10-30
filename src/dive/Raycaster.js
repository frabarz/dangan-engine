class Raycaster extends THREE.Raycaster
{
	constructor(origin, direction, near, far)
	{
		super(origin, direction, near, far);
	}

	getClosestIntersection(object, intersects, recursive)
	{
			return intersectObject(object, this, intersects, recursive);
	}
}

function ascSort( a, b ) {
	return a.distance - b.distance;
}

function intersectObject(object, raycaster, intersects, recursive) {
	if (object.visible) {

		object.raycast(raycaster, intersects);

		if (recursive) {
			var children = object.children;

			for ( var i = 0, l = children.length; i < l; i ++ ) {
				intersectObject( children[ i ], raycaster, intersects, true );
			}
		}

	}
}