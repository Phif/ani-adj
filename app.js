let searching = false;
// let adjectives;
// let randomAdjective;

let spinner = document.querySelector("#spinner")
let button = document.querySelector("#button")
let card = document.querySelector("#card")
let image = document.querySelector("#image")
let title = document.querySelector("#title")
let text = document.querySelector("#text")

button.onclick = async () => {
    if (searching) {
        return
    } else {
        beginSearch();
        // const adjective = await getRandomAdjective()
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


function populateCard(anime) {
    card.style.visibility = "visible";
    image.src = anime.bannerImage;
    title.innerHTML = anime.title.english;
    text.innerHTML = anime.description;
    searching = false;
    spinner.style.display = "none";
}

async function fetchRandomAnime() {
    // fetch(`https://api.jikan.moe/v4/anime/${animeId}`)
    fetch(`https://api.jikan.moe/v4/random/anime`)
    .then(data => data.json())
    .then(data => {
        console.log(data)
        fetchAnimeThemes(data.data.mal_id)
    })
}

async function fetchAnimeThemes(animeId) {
    fetch(`https://api.jikan.moe/v4/anime/${animeId}/themes`)
    .then(data => data.json())
    .then(data => {
        const songs = data.data.openings.concat(data.data.endings)
        console.log(songs)
        if (songs.length > 0) {
            for (const song of songs) {
                console.log(song)
            }
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
    searching = true;
}

function endSearch() {
    spinner.style.display = "none";
    card.style.visibility = "visible";
    searching = false;
}