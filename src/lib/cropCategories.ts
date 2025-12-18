const CROP_CATEGORIES = {
  cereals_and_grains: {
    label: "Cereals & Grains",
    crops: [
      "Rice",
      "Wheat",
      "Maize (Corn)",
      "Barley",
      "Sorghum (Jowar)",
      "Pearl Millet (Bajra)",
      "Finger Millet (Ragi)",
      "Oats"
    ]
  },
  pulses_and_legumes: {
    label: "Pulses & Legumes",
    crops: [
      "Chickpea (Gram)",
      "Pigeon Pea (Arhar/Toor)",
      "Green Gram (Moong)",
      "Black Gram (Urad)",
      "Lentil (Masoor)",
      "Field Pea",
      "Cowpea",
      "Soybean"
    ]
  },
  oilseeds: {
    label: "Oilseeds",
    crops: [
      "Mustard",
      "Groundnut (Peanut)",
      "Sunflower",
      "Sesame (Til)",
      "Soybean",
      "Safflower",
      "Linseed (Flax)"
    ]
  },
  vegetables: {
    label: "Vegetables",
    subcategories: {
      leafy: [
        "Spinach",
        "Fenugreek (Methi)",
        "Coriander Leaves",
        "Lettuce",
        "Mustard Greens"
      ],
      root: [
        "Potato",
        "Onion",
        "Carrot",
        "Beetroot",
        "Radish",
        "Garlic"
      ],
      fruit_vegetables: [
        "Tomato",
        "Brinjal (Eggplant)",
        "Capsicum",
        "Chili",
        "Okra",
        "Cucumber",
        "Pumpkin",
        "Bottle Gourd"
      ]
    }
  },
  fruits: {
    label: "Fruits",
    crops: [
      "Apple",
      "Banana",
      "Mango",
      "Orange",
      "Grapes",
      "Papaya",
      "Pomegranate",
      "Guava",
      "Watermelon"
    ]
  },
  spices_and_condiments: {
    label: "Spices & Condiments",
    crops: [
      "Turmeric",
      "Ginger",
      "Chili",
      "Coriander Seeds",
      "Cumin",
      "Black Pepper",
      "Cardamom",
      "Clove"
    ]
  },
  cash_crops: {
    label: "Cash Crops",
    crops: [
      "Sugarcane",
      "Cotton",
      "Tobacco",
      "Jute",
      "Tea",
      "Coffee"
    ]
  },
  plantation_crops: {
    label: "Plantation Crops",
    crops: [
      "Coconut",
      "Arecanut",
      "Rubber",
      "Oil Palm",
      "Cocoa"
    ]
  },
  fodder_and_forage: {
    label: "Fodder & Forage",
    crops: [
      "Berseem",
      "Lucerne (Alfalfa)",
      "Napier Grass",
      "Fodder Maize",
      "Sorghum Fodder"
    ]
  },
  medicinal_and_aromatic: {
    label: "Medicinal & Aromatic Plants",
    crops: [
      "Aloe Vera",
      "Ashwagandha",
      "Tulsi",
      "Lemongrass",
      "Mint",
      "Isabgol"
    ]
  },
  dry_fruits_and_nuts: {
    label: "Dry Fruits & Nuts",
    crops: [
      "Almond",
      "Cashew",
      "Walnut",
      "Pistachio",
      "Raisin"
    ]
  },
  flowers_and_ornamentals: {
    label: "Flowers & Ornamentals",
    crops: [
      "Rose",
      "Marigold",
      "Jasmine",
      "Lotus",
      "Sunflower"
    ]
  }
};

export default CROP_CATEGORIES;

// Helper function to get category for a crop
export function getCropCategory(cropName: string): string | null {
  const normalizedCropName = cropName.toLowerCase();
  
  for (const [_categoryKey, category] of Object.entries(CROP_CATEGORIES)) {
    // Check direct crops array
    if ('crops' in category && category.crops.some(crop => 
      crop.toLowerCase().includes(normalizedCropName) || 
      normalizedCropName.includes(crop.toLowerCase())
    )) {
      return category.label;
    }
    
    // Check subcategories for vegetables
    if ('subcategories' in category) {
      for (const subcategoryArray of Object.values(category.subcategories)) {
        if (subcategoryArray.some(crop => 
          crop.toLowerCase().includes(normalizedCropName) || 
          normalizedCropName.includes(crop.toLowerCase())
        )) {
          return category.label;
        }
      }
    }
  }
  
  return null;
}

// Helper function to get all crops as a flat array
export function getAllCrops(): string[] {
  const allCrops: string[] = [];
  
  for (const category of Object.values(CROP_CATEGORIES)) {
    if ('crops' in category) {
      allCrops.push(...category.crops);
    }
    
    if ('subcategories' in category) {
      for (const subcategoryArray of Object.values(category.subcategories)) {
        allCrops.push(...subcategoryArray);
      }
    }
  }
  
  return allCrops;
}