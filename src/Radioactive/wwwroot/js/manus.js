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
        ],
        outroSong: [
            "Det där var {song}",
            "{song} av {artist}",
            "En av mina favoriter {artist}"
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

    function speakSong(artist, song, phrases) {
        var text = getRandomPart(phrases);

        text = text.replace("{song}", song);
        text = text.replace("{artist}", artist);

        return speakIt(text);
    }

    function speak(parts) {
        var text = getRandomPart(parts);
        return speakIt(text);
    }

    var fetchWeather = function (city, country) {
        return $.ajax({
            url: 'https://query.yahooapis.com/v1/public/yql?q=select%20item.condition.text%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22Dublin%2C%20Ireland%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
        });
    }


    var translate = function (translateText) {
        return $.ajax({
            url: 'https://translate.googleapis.com/translate_a/t?client=gtx&sl=en&tl=sv&dt=t&q=' + encodeURIComponent(translateText),
            dataType: 'text'
        });
    };

    function start() {
        spotify.search("dublin")
        .then(function (songs) {
            speak(texts.intro)
            .then(function () {
                return speak(texts.welcome);
            })
            .then(function () {
               return fetchWeather('Dublin', 'Ireland')
                    .then(function (result) {
                        return translate(result.query.results.channel.item.condition.text).then(function (translated) {
                            return speakIt('Idag är vädret ' + translated + ' här i Dublin');
                        });
                 });
            })
            .then(function () {
                newSongLoop(songs);
            });
    });





        //spotify.search("dublin")
        //    .then(function (songs) {
        //        speak(texts.intro)
        //            .then(function () {
        //                return speak(texts.welcome);
        //            })
        //            .then(function () {
        //                newSongLoop(songs);
        //            });
        //    });
    }

    function newSongLoop(songs) {
        if (songs.length === 0)
            return;

        var currentSong = songs[0];

        speakSong(currentSong.artistName, currentSong.name, texts.introSong)
            .then(function () {
                setAlbumArtAndTrackName(currentSong.image, currentSong.artistName, currentSong.name);
                player.play(currentSong.url)
                    .then(function () {
                        speakSong(currentSong.artistName, currentSong.name, texts.outroSong)
                            .then(function () {
                                songs.shift();
                                newSongLoop(songs);
                            });
                    });
            });
    }

    function setAlbumArtAndTrackName(albumArtUrl, artistName, trackName) {
        document.getElementById('album-art').src = albumArtUrl;
        document.getElementById('track-name').innerHTML = trackName;
        document.getElementById('artist-name').innerHTML = artistName;

    }






    return {
        start: start
    };
}();