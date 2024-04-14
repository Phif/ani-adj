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
        endSearch()
        fetchYouTubeVideoID("harumodoki")
        // const adjective = await getRandomAdjective()
        // fetchRandomAnime();
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

async function fetchYouTubeVideoID(songName) {
    const apiKey = '';
    const maxResults = 1;
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(songName)}&type=video&maxResults=${maxResults}&key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const videoId = data.items[0].id.videoId;
        console.log(videoId);
        embedYouTubeVideo(videoId)
        return videoId;
    } catch (error) {
        console.error('Failed to fetch video ID:', error);
    }
}

function embedYouTubeVideo(videoId) {
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', embedUrl);
    iframe.setAttribute('width', '560');
    iframe.setAttribute('height', '315');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.allowFullscreen = true;

    const container = document.getElementById('videoContainer'); // Ensure you have a div with id="videoContainer"
    container.innerHTML = ''; // Clear previous contents
    container.appendChild(iframe);
}

