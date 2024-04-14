let searching = false;
let adjectives;
let randomAdjective;

let spinner = document.querySelector("#spinner")
let button = document.querySelector("#button")
let card = document.querySelector("#card")
let image = document.querySelector("#image")
let title = document.querySelector("#title")
let text = document.querySelector("#text")

button.onclick = () => {
    if (searching) {
        return
    } else {
        spinner.style.display = "inline";
        card.style.visibility = "hidden";
        searching = true;
        processAdjectives();
    }
}

function processAdjectives() {
    fetch("adjectives.js")
    .then(response => response.json())
    .then(adjectives => {
        randomAdjective = getRandomElement(adjectives)
        console.log(randomAdjective)
        fetchRandomMatchingAnime(randomAdjective);
    })
    .catch(error => console.error('Error fetching adjectives:', error));
}


function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

async function fetchRandomMatchingAnime(randomWord) {
    const url = 'https://graphql.anilist.co';
    const query = `
    query ($search: String) {
        Page {
            media(search: $search, type: ANIME) {
                title {
                    english
                }
            }
        }
    }`;
    const variables = {
        search: randomWord
    };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };
    
    fetch(url, options)
    .then(handleResponse)
    .then(handleData)
    .catch((error) => console.error('Error fetching data: ', error));
    
    function handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }
    
    function handleData(data) {
        let map = data.data.Page.media.map(entry => entry.title.english).filter(item => item !== null)
        console.log(map)
        const regex = new RegExp("\\b"+randomAdjective+"\\b", 'i'); 
        map = map.filter(entry => entry.match(regex))
        let randomAnime = getRandomElement(map); 
        console.log(randomAnime)
        if (randomAnime) {
            fetchAnimeInfo(randomAnime)
        } else {
            setTimeout(() => {
                processAdjectives()
            }, 2000);
        }
    }
} 

function fetchAnimeInfo(englishName) {
    const query = `
    query ($search: String) {
        Media (search: $search, type: ANIME) {
            id
            title {
                romaji
                english
                native
            }
            description
            episodes
            genres
            bannerImage
        }
    }
    `;
    
    const variables = {
        search: englishName
    };
    
    const url = 'https://graphql.anilist.co';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };
    
    fetch(url, options)
    .then(handleResponse)
    .then(handleData)
    .catch(handleError);
}

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleData(data) {
    console.log(data);
    populateCard(data.data.Media);
    return data
}

function handleError(error) {
    console.error(error);
}

function populateCard(anime) {
    card.style.visibility = "visible";
    image.src = anime.bannerImage;
    title.innerHTML = anime.title.english;
    text.innerHTML = anime.description;
    searching = false;
    spinner.style.display = "none";
}