// The fact-sheet version of the fitting-out: short, scannable entries listed
// underneath the feature cards in the Ausstattung section.
//
// It lives here rather than inside the component because the JSON-LD on the home
// page publishes the same facts to search engines. A listing that promises a
// Spülmaschine in the markup but not on the page — or the other way round — is
// worse than one that promises less, so both read from this one array.

export type AmenityGroup = {
  title: string;
  items: string[];
  // House rules are restrictions rather than features. They render with a
  // crossed-out icon, because "Haustiere nicht erlaubt" sitting in a column of
  // checkmarks reads as the opposite of what it says. They are also kept out of
  // the structured data's amenityFeature list, where schema.org has the
  // dedicated `petsAllowed` / `smokingAllowed` booleans for exactly this.
  isRestriction?: boolean;
};

export const AMENITY_GROUPS: AmenityGroup[] = [
  {
    title: 'Kochen & Essen',
    items: [
      'Küche',
      'Spülmaschine',
      'Kühlschrank',
      'Kaffeemaschine',
      'Wasserkocher',
    ],
  },
  {
    title: 'Schlafen & Bad',
    items: ['Doppelbett', 'Bettwäsche (ohne Gebühr)', 'Handtücher'],
  },
  {
    title: 'Allgemein',
    items: ['WLAN', 'Familienfreundlich'],
  },
  {
    title: 'Hausregeln',
    items: ['Nichtraucher', 'Haustiere nicht erlaubt'],
    isRestriction: true,
  },
];

// Everything a guest actually gets, flattened for the structured data.
export const AMENITY_FEATURES: string[] = AMENITY_GROUPS.filter(
  (group) => !group.isRestriction,
).flatMap((group) => group.items);
