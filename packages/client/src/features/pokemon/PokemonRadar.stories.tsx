import type { Meta, StoryObj } from "@storybook/react";
import { PokemonRadar } from "./FaunaRegistry";
import type { Pokemon } from "../../types";

const meta: Meta<typeof PokemonRadar> = {
  title: "Features/Pokemon/PokemonRadar",
  component: PokemonRadar,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: { type: "range", min: 150, max: 500, step: 10 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PokemonRadar>;

const pikachu: Pokemon = {
  id: 25,
  name: "pikachu",
  types: ["electric"],
  stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90, total: 320 },
  height: 0.4,
  weight: 6,
  spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  artworkUrl: null,
  abilities: ["static", "lightning-rod"],
  baseExperience: 112,
  generation: "generation-i",
};

const mewtwo: Pokemon = {
  id: 150,
  name: "mewtwo",
  types: ["psychic"],
  stats: { hp: 106, attack: 110, defense: 90, specialAttack: 154, specialDefense: 90, speed: 130, total: 680 },
  height: 2,
  weight: 122,
  spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
  artworkUrl: null,
  abilities: ["pressure", "unnerve"],
  baseExperience: 340,
  generation: "generation-i",
};

const snorlax: Pokemon = {
  id: 143,
  name: "snorlax",
  types: ["normal"],
  stats: { hp: 160, attack: 110, defense: 65, specialAttack: 65, specialDefense: 110, speed: 30, total: 540 },
  height: 2.1,
  weight: 460,
  spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
  artworkUrl: null,
  abilities: ["immunity", "thick-fat"],
  baseExperience: 189,
  generation: "generation-i",
};

export const Pikachu: Story = {
  args: { pokemon: pikachu, size: 300 },
};

export const Mewtwo: Story = {
  args: { pokemon: mewtwo, size: 300 },
};

export const Snorlax: Story = {
  args: { pokemon: snorlax, size: 300 },
};

export const Small: Story = {
  args: { pokemon: pikachu, size: 180 },
};

export const Large: Story = {
  args: { pokemon: mewtwo, size: 450 },
};
