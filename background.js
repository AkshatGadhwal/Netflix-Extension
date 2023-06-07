const API_KEY = "5eb97c19";

function fetchIMDbData(title) {
  const url = `https://www.omdbapi.com/?t=${title}&apikey=${API_KEY}`;
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.Error) {
        return null;
      }
      return {
        title: data.Title,
        rating: data.imdbRating,
        plot: data.Plot,
        genre: data.Genre,
        cast: data.Actors,
        poster: data.Poster,
      };
    });
}

function injectIMDbData(titleElement, imdbData) {
  const imdbRating = imdbData.rating;
  const imdbLink = `https://www.imdb.com/find?q=${encodeURIComponent(imdbData.title)}&ref_=nv_sr_sm`;
  const container = document.createElement("div");
  const ratingElement = document.createElement("a");
  ratingElement.href = imdbLink;
  ratingElement.target = "_blank";
  ratingElement.textContent = imdbRating;
  ratingElement.style.color = "orange";
  ratingElement.style.fontWeight = "bold";
  container.appendChild(document.createTextNode("IMDb Rating: "));
  container.appendChild(ratingElement);
  container.appendChild(document.createElement("br"));
  titleElement.parentElement.appendChild(container);
}

function getTitleElements(platform) {
  switch (platform) {
    case PLATFORMS.NETFLIX:
      // Find all the title elements in the Netflix browse page
      const rowElements = document.querySelectorAll(".row");
      const titleElements = [];
      rowElements.forEach((rowElement) => {
        const titleElement = rowElement.querySelector(".slider-item .fallback-text");
        if (titleElement) {
          titleElements.push(titleElement);
        }
      });
      return titleElements;

    // case PLATFORMS.AMAZON_PRIME:
    //   // Find all the title elements in the Amazon Prime browse page
    //   return [];

    // case PLATFORMS.DISNEY_HOTSTAR:
    //   // Find all the title elements in the Disney+ Hotstar browse page
    //   return [];

    default:
      return [];
  }
}

function getCurrentPlatform(url) {
  if (url.startsWith("https://www.netflix.com")) {
    return PLATFORMS.NETFLIX;
  } else if (url.startsWith("https://www.primevideo.com")) {
    return PLATFORMS.AMAZON_PRIME;
  } else if (url.startsWith("https://www.hotstar.com")) {
    return PLATFORMS.DISNEY_HOTSTAR;
  } else {
    return null;
  }
}


chrome.tabs.onUpdated.addListner((tabId, tab) => {
  const platform = getCurrentPlatform(tab.url);
  if (platform){
    chrome.tabs.sendMessage(tabId, {PLATFORM : platform})
  }else{
    
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "fetch_imdb_data") {
    fetchIMDbData(request.title).then((imdbData) => {
      sendResponse(imdbData);
    });
    return true;
  }
});

//Get the current OTT platform
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let tab = await chrome.tabs.query(queryOptions);
  return tab;
}
let currentTab  = getCurrentTab();
const platform = getCurrentPlatform(location.href);
console.log(location.log);


// If the platform is supported, process the titles
if (platform) {
  const titleElements = getTitleElements(platform);
  for (const titleElement of titleElements) {
    const title = titleElement.textContent.trim();

    fetchIMDbData(title).then((imdbData) => {
      if (imdbData) {
        injectIMDbData(titleElement, imdbData);
      }
    });
  }
}
