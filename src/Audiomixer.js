window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new window.AudioContext();

function onError(e) {
    console.error(e.stack);
};

function loadBuffer(url, key) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onerror = reject;
        request.onload = function () {
            context.decodeAudioData(request.response, function (buffer) {
                if (!buffer) {
                    reject('Buffer vacío: ' + url);
                    return;
                }

                resolve(new Source(buffer));
            }, onError);
        };
        request.send();
    });
};

function Source(buffer) {
    this.buffer = buffer;
    this.source = null;
};

Source.PAUSED = 1;

Source.prototype.play = function (start) {
    if (!this.source) {
        var gainNode = context.createGain();
        gainNode.gain.value = 0.2;

        this.source = context.createBufferSource();
        this.source.buffer = this.buffer;

        // this.source.connect(context.destination);
        this.source.connect(gainNode);
        gainNode.connect(context.destination);
    }
    this.source.start(start || 0);
};

Source.prototype.stop = function () {
    this.source.stop();
    this.source = null;
};

export default Audiomixer;