const PLATFORMS = {
  NETFLIX: "NETFLIX",
  AMAZON_PRIME: "AMAZON_PRIME",
  DISNEY_HOTSTAR: "DISNEY_HOTSTAR",
};

function getCurrentPlatform() {
  const hostname = window.location.hostname;

  if (hostname.includes("netflix.com")) {
    return PLATFORMS.NETFLIX;
  } else if (hostname.includes("primevideo.com")) {
    return PLATFORMS.AMAZON_PRIME;
  } else if (hostname.includes("hotstar.com")) {
    return PLATFORMS.DISNEY_HOTSTAR;
  }
}

function getTitleElements(platform) {
  if (platform === PLATFORMS.NETFLIX) {
    return document.querySelectorAll("[data-uia='title-card-title']");
  } else if (platform === PLATFORMS.AMAZON_PRIME) {
    // Logic for Amazon Prime Video
  } else if (platform === PLATFORMS.DISNEY_HOTSTAR) {
    // Logic for Disney+ Hotstar
  }
}

function injectIMDbData(titleElement, imdbData) {
  // Create a new element to display the IMDb data
  const imdbElement = document.createElement("div");
  imdbElement.style.fontSize = "0.8rem";
  imdbElement.style.fontWeight = "bold";
  imdbElement.style.marginTop = "0.5rem";
  imdbElement.style.color = "#8f8f8f";

  // Add the IMDb rating and link to the element
  const imdbLink = document.createElement("a");
  imdbLink.href = `https://www.imdb.com/title/${imdbData.imdbID}`;
  imdbLink.target = "_blank";
  imdbLink.textContent = `IMDb: ${imdbData.imdbRating}`;

  imdbElement.appendChild(imdbLink);

  // Add the IMDb genres to the element
  const genres = imdbData.Genre.split(", ");
  const genreText = genres.length > 1 ? "Genres: " : "Genre: ";

  const genreSpan = document.createElement("span");
  genreSpan.textContent = genreText;
  imdbElement.appendChild(genreSpan);

  for (let i = 0; i < genres.length; i++) {
    const genreLink = document.createElement("a");
    genreLink.href = `https://www.imdb.com/search/title/?genres=${encodeURIComponent(
      genres[i]
    )}`;
    genreLink.target = "_blank";
    genreLink.textContent = genres[i];

    imdbElement.appendChild(genreLink);

    if (i < genres.length - 1) {
      imdbElement.appendChild(document.createTextNode(", "));
    }
  }

  // Add the IMDb cast to the element
  const cast = imdbData.Actors.split(", ");
  const castText = cast.length > 1 ? "Cast: " : "Cast: ";

  const castSpan = document.createElement("span");
  castSpan.textContent = castText;
  imdbElement.appendChild(castSpan);

  for (let i = 0; i < cast.length; i++) {
    const castLink = document.createElement("a");
    castLink.href = `https://www.imdb.com/find?q=${encodeURIComponent(
      cast[i]
    )}&ref_=nv_sr_sm`;
    castLink.target = "_blank";
    castLink.textContent = cast[i];

    imdbElement.appendChild(castLink);

    if (i < cast.length - 1) {
      imdbElement.appendChild(document.createTextNode(", "));
    }
  }

  // Insert the IMDb element into the DOM
  titleElement.parentElement.appendChild(imdbElement);
}

function processTitles(platform) {
  const titleElements = getTitleElements(platform);

  for (const titleElement of titleElements) {
    const title = titleElement.textContent.trim();

    chrome.runtime.sendMessage(
      {
        type: "fetch_imdb_data",
        title: title,
      },
      (imdbData) => {
        if (imdbData) {
          injectIMDbData(titleElement, imdbData);
        }
      }
    );
  }
}

// Get the current OTT platform
const platform = getCurrentPlatform();

// If the platform is supported, process the titles
if (platform) {
  processTitles(platform);
}

