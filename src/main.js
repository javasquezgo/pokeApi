window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);

const menuBtn = document.querySelector(".pokedex-header i");
const pokemonTypesContainer = document.querySelector(".pokemon--types");
const pokemonMainDiv = document.querySelector(".pokedex-main");

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

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
  pokeImage.setAttribute("loading", "lazy");

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
    Swal.fire({
      title: `You choose `,
      text: `${capitalizeFirstLetter(pokemon.name)}`,
      imageUrl: `${pokemon.sprites.front_default}`,
      imageHeight: 196,
      imageWidth: 196,
      confirmButtonText: "Exit",
    });
  });

  pokemonDiv.appendChild(pokeId);
  pokemonDiv.appendChild(pokeImage);
  pokemonDiv.appendChild(pokeText);

  pokemonMainDiv.appendChild(pokemonDiv);
}

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
  for (let poke = 1; poke <= 151; poke++) {
    const { data } = await api(`pokemon/${poke}`);

    createPokemon(data);
  }
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

menuBtn.addEventListener("click", () => {
  pokemonTypesContainer.classList.toggle("invisible");
});

function navigator() {
  if (location.hash.startsWith("#type=")) {
    typePage();
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
  filterTypePokemon(pokemonType);
}

fetchTypes();
