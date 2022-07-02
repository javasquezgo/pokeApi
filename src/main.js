//Eventos del navegador
window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);

//Variables del DOM
const menuBtn = document.querySelector(".pokedex-header i");
const pokemonTypesContainer = document.querySelector(".pokemon--types");
const pokemonMainDiv = document.querySelector(".pokedex-main");
const pokedexHeader = document.querySelector(".pokedex-header--div");
const pokemonInfo = document.querySelector(".pokemon-info");

//Consulta a la api
const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

//Eventos addEventListener
menuBtn.addEventListener("click", () => {
  pokemonTypesContainer.classList.toggle("invisible");
});

pokedexHeader.addEventListener("click", () => {
  history.back();
});

//Funciones

//Funcion para devolver la primera letra de una
//palabra en mayuscla
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//Esta funcion fue creada solo para llamarla y
//crear pokemon dentro de la pokedex
function createPokemon(pokemon) {
  const pokeId = document.createElement("p");
  pokeId.className = "pokemon-id";
  pokeId.textContent = pokemon.id;

  const pokeImage = document.createElement("img");
  pokeImage.setAttribute("src", pokemon.sprites.front_default);

  const pokeText = document.createElement("div");
  pokeText.className = "poke-text";

  const pokeName = document.createElement("h4");
  pokeName.className = "pokemon-name";
  pokeName.innerText = pokemon.name;
  pokeText.appendChild(pokeName);

  const pokemonDiv = document.createElement("div");
  pokemonDiv.className = "pokemon";
  pokemonDiv.addEventListener("click", () => {
    console.log(pokemon.name);
    location.hash = `pokemon=${pokemon.name}`;
  });

  pokemonDiv.appendChild(pokeId);
  pokemonDiv.appendChild(pokeImage);
  pokemonDiv.appendChild(pokeText);

  pokemonMainDiv.appendChild(pokemonDiv);
}

//Funcion para navegar a travez del navegador
//por medio del location.hash
function navigator() {
  console.log("se movio a " + location.hash);
  if (location.hash.startsWith("#type=")) {
    typePage();
  } else if (location.hash.startsWith("#pokemon=")) {
    pokemonPage();
  } else if (location.hash.startsWith("#")) {
    homePage();
  } else {
    homePage();
  }
}

function homePage() {
  fetchPokemon();
}

function typePage() {
  console.log("Estamos con un tipo de pokemon");
  const [_, pokemonType] = location.hash.split("=");
  pokemonTypesContainer.classList.add("invisible");
  filterTypePokemon(pokemonType);
}

function pokemonPage() {
  console.log("Estamos en pokemon");
  const [_, pokemon] = location.hash.split("=");

  pokemonMainDiv.classList.add("invisible");

  createPokemonOne(pokemon);
}

//Funciones asincronas

async function fetchTypes() {
  const { data } = await api("type");
  const types = data.results;

  const pokemonTypesSection = document.querySelector(".pokemon--types");

  types.forEach((type) => {
    const tagA = document.createElement("a");
    const tagSpan = document.createElement("span");
    tagSpan.textContent = type.name;
    tagA.appendChild(tagSpan);
    pokemonTypesSection.appendChild(tagA);
    tagSpan.addEventListener("click", () => {
      location.hash = `type=${type.name}`;
    });
  });
}

async function fetchPokemon() {
  pokemonMainDiv.innerHTML = "";
  const pokemonTotal = [];
  for (let poke = 1; poke <= 151; poke++) {
    const { data } = await api(`pokemon/${poke}`);

    pokemonTotal.push(data);
  }
  await Promise.all(pokemonTotal).then((allPokemon) => {
    allPokemon.forEach((pokemon) => {
      createPokemon(pokemon);
    });
  });
}

async function filterTypePokemon(type) {
  pokemonMainDiv.innerHTML = "";
  for (let poke = 1; poke <= 151; poke++) {
    const { data } = await api(`pokemon/${poke}`);

    const typePokemon = data.types;

    typePokemon.forEach((pokemon) => {
      if (pokemon.type.name === type) {
        createPokemon(data);
      }
    });
  }
}

async function createPokemonOne(pokemonOne) {
  const { data } = await api(`pokemon/${pokemonOne}`);
  const stats = data.stats;

  const valueStats = [];
  for (let i = 0; i < stats.length; i++) {
    valueStats.push(stats[i].base_stat);
  }

  const nameStats = [];
  for (let i = 0; i < stats.length; i++) {
    nameStats.push(stats[i].stat.name);
  }

  //Los elementos del DOM
  const h2 = document.createElement("h2");
  h2.innerText = data.name;

  const img = document.querySelector("img");
  img.setAttribute("src", data.sprites.front_default);
  img.setAttribute("alt", data.name);

  const h3 = document.createElement("h3");
  h3.innerText = "Types";

  const ul = document.createElement("ul");

  const canvasU = document.getElementById("miGrafica").getContext("2d");

  const pokemonTypes = data.types;

  pokemonTypes.forEach((type) => {
    const li = document.createElement("li");
    li.innerText = type.type.name;
    ul.appendChild(li);
  });

  const h3Stat = document.createElement("h3");
  h3Stat.innerText = "Stats";

  pokemonInfo.appendChild(h2);
  pokemonInfo.appendChild(h3);
  pokemonInfo.appendChild(img);
  pokemonInfo.appendChild(ul);
  pokemonInfo.appendChild(h3Stat);

  const canvasChar = new Chart(canvasU, {
    type: "bar",
    data: {
      labels: nameStats,
      datasets: [
        {
          label: "Stats",
          backgroundColor: ["#00f", "#f00", "#0f0", "#000", "#0ff", "#f0f"],
          data: valueStats,
        },
      ],
    },
  });
}

fetchTypes();
