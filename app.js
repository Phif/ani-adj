import adjectives from './adjectives2.js';

let searching = false;

let spinner = document.querySelector("#spinner")
let button = document.querySelector("#button")
let card = document.querySelector("#card")
// let image = document.querySelector("#image")
let songTitle = document.querySelector("#song-title")
let songArtist = document.querySelector("#song-artist")
let animeName = document.querySelector("#anime-name")
let synopsis = document.querySelector("#synopsis")
let video = document.querySelector("#video")

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
    animeName.innerHTML = `<strong>${animeCard.animeName}</strong> (${animeCard.year}) - ${animeCard.songType}`;
    synopsis.innerHTML = animeCard.synopsis;
    songTitle.innerHTML = animeCard.songTitle
    songArtist.innerHTML = animeCard.songArtist ? `by ${animeCard.songArtist.join(", ")}` : "no artist found ＞︿＜"
    embedVideo(animeCard.videoUrl)
}

function beginSearch() {
    // image.src = "";
    spinner.style.display = "inline";
    card.style.display = "none";
    video.src = "";
    searching = true;
}

function endSearch() {
    spinner.style.display = "none";
    card.style.display = "inline";
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
        console.log(anime)
        const animeCard = {
            animeName: anime.name,
            synopsis: anime.synopsis,
            year: anime.year,
            songTitle: theme.song.title,
            songArtist: theme.song.artists.length > 0 ? theme.song.artists.map(artist => artist.name) : undefined,
            songType: theme.slug,
            videoUrl: theme.animethemeentries[0].videos[0].link
        };
        console.log(animeCard);
        populateCard(animeCard);
        endSearch();
    } catch (error) {
        console.log("No song title found with this word.");
        setTimeout(getRandomSong, 1000); // Retry after 1 second
    }
}

function embedVideo(url) {
    const videoUrl = url;
    video.src = videoUrl;
    video.controls = true;
    video.autoplay = false;
}