var spotify = function () {

    function searchTracks(query) {
        return $.ajax({
            url: 'https://api.spotify.com/v1/search',
            data: {
                q: query,
                type: 'track'
            }
        });
    };

    function search(query) {
        return searchTracks(query).then(function(result) {
            var songs = [];
            result.tracks.items.forEach(function(item) {
                var song = {
                    url: item.preview_url,
                    image: item.album.images[1].url,
                    name: item.name,
                    artistName: item.artists[0].name
                };
                songs.push(song);
            });

            return songs;
        });
    }


    return {
        search: search
    };
}();