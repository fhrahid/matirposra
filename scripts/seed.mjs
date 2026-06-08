// Standalone seeder: loads env from .env.local and writes products,
// categories and artisans straight into MongoDB. Run with: node scripts/seed.mjs
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Minimal .env.local loader (avoids an extra dependency).
function loadEnv() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // ignore — rely on existing process env
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set (.env.local).");
  process.exit(1);
}

const seedProducts = JSON.parse(readFileSync(join(root, "src/data/seedProducts.json"), "utf8"));

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    originalPrice: Number,
    rating: Number,
    reviewsCount: Number,
    category: String,
    badge: String,
    image: String,
    images: { type: [String], default: [] },
    icon: String,
    stock: { type: Number, default: 0 },
    isBestSelling: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CategorySchema = new mongoose.Schema({
  name: String,
  productCount: Number,
  image: String,
  icon: String,
});

const ArtisanSchema = new mongoose.Schema({
  name: String,
  village: String,
  experience: String,
  story: String,
  image: String,
});

const categoryMeta = [
  { name: "রান্নাঘরের পণ্য", icon: "🍲" },
  { name: "ঘর সাজানো", icon: "🏠" },
  { name: "বাগানের পণ্য", icon: "🌱" },
  { name: "আলোকসজ্জা", icon: "🕯" },
  { name: "উপহারের সামগ্রী", icon: "🎁" },
  { name: "ঐতিহ্যবাহী সংগ্রহ", icon: "🏺" },
];

const artisans = [
  {
    name: "রহিম মৃধা",
    village: "ধামরাই, ঢাকা",
    experience: "২৫ বছরের অভিজ্ঞতা",
    story:
      "ধামরাইয়ের মাটি দিয়ে তৈরি প্রতিটি পাত্রে তিনি ঢেলে দেন নিজের জীবনের অভিজ্ঞতা। ছোটবেলা থেকে বাবার হাত ধরে শেখা এই শিল্পকে তিনি বাঁচিয়ে রেখেছেন প্রজন্মের পর প্রজন্ম ধরে।",
  },
  {
    name: "রাবেয়া বেগম",
    village: "রাজশাহী",
    experience: "১৮ বছরের অভিজ্ঞতা",
    story:
      "রাজশাহীর ঐতিহ্যবাহী নকশায় টেরাকোটার পণ্য তৈরি করেন তিনি, যা আন্তর্জাতিক মানের। তাঁর হাতের ছোঁয়ায় মাটি যেন জীবন্ত হয়ে ওঠে নতুন রূপে।",
  },
];

async function run() {
  await mongoose.connect(MONGODB_URI, { dbName: "matir-poshra" });
  console.log("Connected to MongoDB.");

  const Product = mongoose.model("Product", ProductSchema);
  const Category = mongoose.model("Category", CategorySchema);
  const Artisan = mongoose.model("Artisan", ArtisanSchema);

  await Promise.all([Product.deleteMany({}), Category.deleteMany({}), Artisan.deleteMany({})]);

  const categories = categoryMeta.map((c) => ({
    name: c.name,
    icon: c.icon,
    productCount: seedProducts.filter((p) => p.category === c.name).length,
  }));

  const insertedProducts = await Product.insertMany(seedProducts);
  await Category.insertMany(categories);
  await Artisan.insertMany(artisans);

  console.log(`Seeded ${insertedProducts.length} products, ${categories.length} categories, ${artisans.length} artisans.`);
  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
