const form = document.querySelector('.search-form');
const search = document.getElementById('search');
const songs = document.getElementById('songs');
const paginate = document.getElementById('paginate');

const currentPage = 1;
const pageSize = 5;


form.addEventListener('submit', fetchSuggestions);

songs.addEventListener('click', e => {
    var element = e.target;

    if(element.nodeName == "BUTTON" && element.classList.contains("lyrics-btn")) {
        const songInfo = e.path.find(item => {
            return item.classList.contains('lyrics-btn');
        })

        if(songInfo){
            const artistName = songInfo.getAttribute('data-artistName');
            const songTitle = songInfo.getAttribute('data-title');
            fetchLyrics(artistName,songTitle);
        }
    } else {
        return false;
    }
});


function fetchSuggestions(e){
    e.preventDefault();
    songs.innerHTML = '';
    const term = search.value;
    
    const suggestUrl = 'https://api.lyrics.ovh/suggest/' + term;
    console.log(suggestUrl); 

    fetch(suggestUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);

        songs.innerHTML = data.data.map(song=> 
            `<div class="song">
                <h3 class="song-heading">${song.artist.name} - ${song.title}</h3>
                <button class="lyrics-btn" id="lyrics" data-artistName = "${song.artist.name}" data-title = "${song.title}">Show Lyrics</button>
            </div>
            `
        ).join('')

    })
    .catch(function(error) {
        console.log(error); 
      });
}


function fetchLyrics(artist, title){
    const lyricsApiUrl = 'https://api.lyrics.ovh/v1/' + artist + '/' + title;
    
    fetch(lyricsApiUrl)
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);

        paginate.innerHTML = ``

        if(data.lyrics!==''){
            var formattedString = data.lyrics.replace(/(\r|\n)/g, '<br>');;
            songs.innerHTML =
                `<h1 class="lyrics-heading"><b>${artist}</b> - ${title}</h1>
                <p class="lyrics">${formattedString}</p>`
            } else {
                songs.innerHTML =
                `<h1 class="lyrics-heading">Lyrics Not Found</h1>`
            }
    }).catch(function(error) {
        console.log(error); 
      });
}

