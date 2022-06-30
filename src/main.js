const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

//Funcion para devolver la
//primera letra de una
//palabra en mayuscla
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//Esta funcion fue creada solo para
//llamarla y crear pokemon dentro de la
//pokedex
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

  const pokemonMainDiv = document.querySelector(".pokedex-main");
  pokemonMainDiv.appendChild(pokemonDiv);
}

/* async function fetchPokemon() {
  for (let poke = 1; poke <= 151; poke++) {
    const { data } = await api(`pokemon/${poke}`);

    createPokemon(data);
  }
} */

async function filterTypePokemon(type) {
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

filterTypePokemon("fire");
