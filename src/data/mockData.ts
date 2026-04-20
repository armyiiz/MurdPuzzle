export type Category = {
  id: string;
  name: string;
  items: string[];
};

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "suspects",
    name: "Suspects",
    items: ["Plum", "Peacock", "Mustard"],
  },
  {
    id: "weapons",
    name: "Weapons",
    items: ["Candlestick", "Dagger", "Lead Pipe"],
  },
  {
    id: "locations",
    name: "Locations",
    items: ["Library", "Study", "Hall"],
  },
];

export const MOCK_CATEGORIES_4: Category[] = [
  {
    id: "suspects",
    name: "Suspects",
    items: ["Plum", "Peacock", "Mustard", "Green"],
  },
  {
    id: "weapons",
    name: "Weapons",
    items: ["Candlestick", "Dagger", "Lead Pipe", "Revolver"],
  },
  {
    id: "locations",
    name: "Locations",
    items: ["Library", "Study", "Hall", "Kitchen"],
  },
  {
    id: "motives",
    name: "Motives",
    items: ["Jealousy", "Revenge", "Greed", "Blackmail"],
  },
];

export const MOCK_CLUES = [
  "Professor Plum was seen near the Library.",
  "The Candlestick was not found in the Study.",
  "Colonel Mustard does not use Daggers."
];
