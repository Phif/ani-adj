import adjectives from './adjectives.js';

let searching = false;
let animeCard = {};

let spinner = document.querySelector("#spinner")
let button = document.querySelector("#button")
let card = document.querySelector("#card")
let image = document.querySelector("#image")
let songTitle = document.querySelector("#song-title")
let songArtist = document.querySelector("#song-artist")
let animeName = document.querySelector("#anime-name")
let synopsis = document.querySelector("#synopsis")
let videoContainer = document.querySelector("#video-container")

button.onclick = async () => {
    if (searching) {
        return
    } else {
        beginSearch();
        getRandomSong();
    }
}

function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function populateCard(animeCard) {
    // image.src = "";
    animeName.innerHTML = `From the anime <strong><em>${animeCard.animeName}</em></strong>`;
    synopsis.innerHTML = animeCard.synopsis;
    songTitle.innerHTML = animeCard.songTitle
    songArtist.innerHTML = animeCard.songArtist ? `by ${animeCard.songArtist.join(", ")}` : "<em>No artist found</em>"
    embedVideo(animeCard.videoUrl)
}

function beginSearch() {
    spinner.style.display = "inline";
    card.style.visibility = "hidden";
    // image.src = "";
    searching = true;
}

function endSearch() {
    spinner.style.display = "none";
    card.style.visibility = "visible";
    searching = false;
}

async function getRandomSong() {
    const word = getRandomElement(adjectives);
    console.log(word);

    try {
        const response = await fetch(`https://api.animethemes.moe/anime?sort=random&include=animethemes.song.artists,animethemes.animethemeentries.videos.audio&filter[has]=animethemes.song&filter[song][title-like]=%${word}%&page[size]=1`);
        const data = await response.json();
        const anime = data.anime[0];
        const themes = anime.animethemes.filter(theme => theme.song.title.toLowerCase().includes(word.toLowerCase()));
        const theme = getRandomElement(themes);
        const animeCard = {
            animeName: anime.name,
            synopsis: anime.synopsis,
            year: anime.year,
            songTitle: theme.song.title,
            songArtist: theme.song.artists.length > 0 ? theme.song.artists.map(artist => artist.name) : undefined,
            videoUrl: theme.animethemeentries[0].videos[0].link
        };
        console.log(animeCard);
        populateCard(animeCard);
        endSearch();
    } catch (error) {
        console.error(error);
        setTimeout(getRandomSong, 1000); // Retry after 1 second
    }
}

function embedVideo(url) {
    const videoUrl = url;
    
    const video = document.createElement('video');
    video.id = "video";
    video.src = videoUrl;
    video.controls = true;
    video.autoplay = false;
    
    videoContainer.appendChild(video);
}