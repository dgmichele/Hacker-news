import '../css/style.css';
import logoPath from '../img/Logo.png';

// Otteniamo il logo (configurazione Webpack)
const logoImage = document.querySelector('.img-logo');
logoImage.src = logoPath;

// Variabile d'ambiente per gestire l'API
const urlAPI = process.env.API_URL;

// Otteniamo elementi UI principali
const newsContainer = document.getElementById("news-container");
const loadMoreButton = document.getElementById("load-more");

// Inizializziamo la creazione delle news
let newsID = [];
let startNewsBlock = 0;
const updatedNewsBlock = 10;

// Qui otteniamo la lista di ID delle ultime news
async function fetchNewsID() {
    try {
        const response = await fetch(`${urlAPI}/newstories.json`);
        if (!response.ok) throw new Error("Error in retrieving news list");
        
        newsID = await response.json();
        loadMoreNews();  // Carica il primo blocco di news allo start
    } catch (error) {
        console.error("Error:", error);
    }
}

// Qui otteniamo i dettagli (titolo, link, data) di una singola news tramite ID
async function fetchNewsDetails(news) {
    try {
        const response = await fetch(`${urlAPI}/item/${news}.json`);
        if (!response.ok) throw new Error(`Error in retrieving details for news with ID ${news}`);
        
        const newsData = await response.json();
        displayNews(newsData);  // Visualizziamo la news recuperata
    } catch (error) {
        console.error("Error:", error);
    }
}

// Qui carichiamo e visualizziamo il nuovo blocco di 10 notizie
async function loadMoreNews() {
    const newsToLoad = newsID.slice(startNewsBlock, startNewsBlock + updatedNewsBlock);
    for (const id of newsToLoad) {
        await fetchNewsDetails(id);
    }
    startNewsBlock += updatedNewsBlock;  // Aggiorna il conteggio delle news caricate
}

// Qui creiamo il contenitore della news, con titolo, data e bottone del link
// title, url e date sono le proprietà dell'oggetto JSON che otteniamo nella funzione fetchNewDetails()
function displayNews(news) {
    const newsGrid = document.createElement("div");
    newsGrid.classList.add("news-grid");

    const title = document.createElement("h3");
    title.textContent = news.title;
    const link = document.createElement("a");
    link.classList.add("news-button");
    link.href = news.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = `Read more↗️`;

    const date = document.createElement("p");
    date.classList.add("date");
    const formattedDate = new Date(news.time * 1000).toLocaleDateString("en-EN");
    date.textContent = `${formattedDate}`;

    newsGrid.append(title);
    newsGrid.append(date);
    newsGrid.append(link);
    newsContainer.append(newsGrid);
}

// Qui gestiamo il click sul bottone "load more"
loadMoreButton.addEventListener("click", loadMoreNews);

fetchNewsID();