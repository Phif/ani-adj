let searching = false;
// let adjectives;
// let randomAdjective;

let spinner = document.querySelector("#spinner")
let button = document.querySelector("#button")
let card = document.querySelector("#card")
let image = document.querySelector("#image")
let title = document.querySelector("#title")
let text = document.querySelector("#text")
let music = document.querySelector("#music")

button.onclick = async () => {
    if (searching) {
        return
    } else {
        beginSearch();
        fetchRandomAnime();
    }
}

async function getRandomAdjective() {
    fetch("adjectives.js")
    .then(response => response.json())
    .then(adjectives => {
        const randomAdjective = getRandomElement(adjectives)
        console.log(randomAdjective)
        return randomAdjective
    })
    .catch(error => console.error('Error fetching adjectives:', error));
}

function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function populateCard(anime, song) {
    image.src = anime.images.webp.large_image_url;
    title.innerHTML = anime.title;
    text.innerHTML = anime.synopsis;
    let songTitle = song.match(/(?<=").*(?=")/)
    let songArtist = song.match(/(?<=" by ).*/)
    music.innerHTML = `<strong>${songTitle}</strong> — ${songArtist}`;
}

async function fetchRandomAnime() {
    // fetch(`https://api.jikan.moe/v4/anime/${animeId}`)
    fetch(`https://api.jikan.moe/v4/random/anime`)
    .then(data => data.json())
    .then(anime => {
        console.log(anime)
        fetchAnimeTheme(anime.data)
    })
}

async function fetchAnimeTheme(anime) {
    fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}/themes`)
    .then(data => data.json())
    .then(data => {
        const songs = data.data.openings.concat(data.data.endings);
        let songList = [];
        if (songs.length > 0) {
            for (const song of songs) {
                songList.push(song);
            }
            const randomSong = getRandomElement(songList);
            populateCard(anime, randomSong)
            endSearch();
        } else {
            setTimeout(() => {
                fetchRandomAnime();
            }, 1000)
        }
    })
}

function beginSearch() {
    spinner.style.display = "inline";
    card.style.visibility = "hidden";
    image.src = "";
    searching = true;
}

function endSearch() {
    spinner.style.display = "none";
    card.style.visibility = "visible";
    searching = false;
}