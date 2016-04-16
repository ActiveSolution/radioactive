var player = function () {
    function playUrl(url) {
        var promise = new Promise(function (resolve) {
            var audioObject = new Audio(url);
            audioObject.onended = function () {
                resolve();
            };
            audioObject.play();
        });

        return promise;
    }

    return {
        play: playUrl
    };
}();