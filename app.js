console.log("hello")
fetch("https://api.datamuse.com/words?sp=*&md=p&max=1000")
.then(response => response.json())
.then(data => {
    const adjectives = data.filter(word => word.tags && word.tags.includes('adj'));
    console.log(adjectives);
})
.catch(e => console.log("Error:", e))