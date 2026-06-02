export type MockProductInput = {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
};

export const DEFAULT_MOCK_PRODUCT_COUNT = 160;

const categories = [
  'Hoodie',
  'Jacket',
  'Sneakers',
  'Backpack',
  'Watch',
  'Bottle',
  'T-Shirt',
  'Cap',
  'Socks',
  'Laptop Sleeve',
  'Wallet',
  'Scarf',
  'Gloves',
  'Belt',
  'Travel Bag',
  'Notebook'
];

const colors = [
  'Black',
  'Graphite',
  'Navy',
  'Forest',
  'Ivory',
  'Burgundy',
  'Stone',
  'Olive',
  'Copper',
  'Sky'
];

const collections = [
  'Urban',
  'Alpine',
  'Studio',
  'Transit',
  'Nordic',
  'Essential',
  'Summit',
  'Harbor'
];

const materials = [
  'organic cotton',
  'recycled nylon',
  'brushed fleece',
  'water-resistant canvas',
  'merino blend',
  'vegan leather',
  'ripstop fabric',
  'soft-touch knit'
];

const features = [
  'built for everyday city routines',
  'made for changing weather and long commutes',
  'designed with a clean silhouette and durable details',
  'balanced for travel, work, and weekend use',
  'crafted for lightweight comfort without extra bulk',
  'finished with practical pockets and reliable hardware',
  'made to pair easily with a minimal wardrobe',
  'designed for repeated use across busy seasons'
];

const roundPrice = (price: number): number => Math.round(price * 100) / 100;

export const createMockProducts = (
  count = DEFAULT_MOCK_PRODUCT_COUNT
): MockProductInput[] =>
  Array.from({ length: count }, (_, index) => {
    const category = categories[index % categories.length];
    const color = colors[index % colors.length];
    const collection = collections[index % collections.length];
    const material = materials[index % materials.length];
    const feature = features[index % features.length];
    const productNumber = String(index + 1).padStart(3, '0');
    const price = roundPrice(14.99 + (index % 35) * 3.75 + Math.floor(index / 12) * 1.2);

    return {
      title: `Nord ${collection} ${color} ${category} ${productNumber}`,
      price,
      description: `A ${material} ${category.toLowerCase()} ${feature}. Seed item ${productNumber} for catalog, cache, and pagination testing.`,
      imageUrl: `https://picsum.photos/seed/nord-store-product-${productNumber}/900/700`
    };
  });
