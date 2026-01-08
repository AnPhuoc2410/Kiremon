import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Text } from "..";
import { POKEMON_IMAGE } from "../../../config/api.config";

const RelatedPokemonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin: 16px 0;
`;

const PokemonCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 12px;
  border-radius: 12px;
  background-color: white;
  box-shadow:
    0px 1px 3px rgba(16, 24, 40, 0.1),
    0px 1px 2px rgba(16, 24, 40, 0.06);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0px 12px 16px -4px rgba(16, 24, 40, 0.08),
      0px 4px 6px -2px rgba(16, 24, 40, 0.03);
  }

  .pokemon-name {
    font-weight: 600;
    text-transform: capitalize;
    margin-top: 8px;
  }

  .pokemon-id {
    color: #6b7280;
    font-size: 1rem;
  }
`;

interface RelatedPokemonProps {
  pokemonList: {
    id: number;
    name: string;
    url?: string;
  }[];
  title: string;
}

const RelatedPokemon: React.FC<RelatedPokemonProps> = ({
  pokemonList,
  title,
}) => {
  return (
    <div>
      <Text as="h3">{title}</Text>
      <RelatedPokemonContainer>
        {pokemonList.map((pokemon) => {
          // Extract ID from URL if not provided
          const id =
            pokemon.id ||
            (pokemon.url
              ? parseInt(pokemon.url.split("/").filter(Boolean).pop() || "0")
              : 0);

          return (
            <Link
              key={pokemon.name}
              to={`/pokemon/${pokemon.name}`}
              style={{ textDecoration: "none" }}
            >
              <PokemonCard>
                <LazyLoadImage
                  src={`${POKEMON_IMAGE}/${id}.png`}
                  alt={pokemon.name}
                  width={80}
                  height={80}
                  effect="blur"
                />
                <Text className="pokemon-id">
                  #{String(id).padStart(3, "0")}
                </Text>
                <Text className="pokemon-name">{pokemon.name}</Text>
              </PokemonCard>
            </Link>
          );
        })}
      </RelatedPokemonContainer>
    </div>
  );
};

export default RelatedPokemon;
