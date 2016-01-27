export default {
    // t: start time, b: begInnIng value, c: change In value, d: duration
	none: function() {
		return 1;
	},
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
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t * t;
        return -c / 2 * ((t -= 2) * t * t * t - 2);
    },
    easeInQuint: function (x) {
        return c * (t /= d) * t * t * t * t;
    },
    easeOutQuint: function (x) {
        return c * ((t = t / d - 1) * t * t * t * t + 1);
    },
    easeInOutQuint: function (x) {
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t * t * t;
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
}