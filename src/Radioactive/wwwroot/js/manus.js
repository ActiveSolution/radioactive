var manus = function () {
    var options = { rate: 1.5 };
    var voice = "Swedish Female";

    var texts = {
        intro: [
            "Radioactive, din kajplats i etern!",
            "Radioactive, ditt ljus i mörket!",
            "Radioactive, din mistlur i dimman"
        ],
        welcome: [
            "Välkommen till Radioactive i Dublin",
            "Årets konferens presenteras i samarbete med Radioactive"

        ],
        introSong: [
            "Nästa låt som ska spelas är {song} som framförs av {artist}!",
            "Här kommer {artist} med {song}!",
            "Den här låten är önskad av Fonus Mangberg, Svan Kjellberg, Allan Stelgren och Hedrik Fredlund!"
        ]
    };


    function getRandomPart(parts) {
        return parts[Math.floor(Math.random() * parts.length)];
    }

    function speakIt(text) {
        return new Promise(function (resolve) {
            var opt = {};
            $.extend(opt, options, { onend: resolve });
            responsiveVoice.speak(text, voice, opt);
        });

    }

    function speakSong(artist, song) {
        var text = getRandomPart(texts.introSong);

        text = text.replace("{song}", song);
        text = text.replace("{artist}", artist);

        return speakIt(text);
    }

    function speak(parts) {
        var text = getRandomPart(parts);
        return speakIt(text);
    }

    function start() {
        spotify.search("dublin")
            .then(function (songs) {
                speak(texts.intro)
                    .then(function () {
                        return speak(texts.welcome);
                    })
                    .then(function () {
                        newSongLoop(songs);
                    });
            });
    }

    function newSongLoop(songs) {
        if (songs.length === 0)
            return;

        var currentSong = songs[0];

        speakSong(currentSong.artistName, currentSong.name)
            .then(function () {
                player.play(currentSong.url)
                    .then(function () {
                        songs.shift();
                        newSongLoop(songs);
                    });
            });
    }


    return {
        start: start
    };
}();