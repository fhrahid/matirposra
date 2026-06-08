import dbConnect from "./mongodb";
import Product from "../models/Product";
import Artisan from "../models/Artisan";
import Category from "../models/Category";
import Review from "../models/Review";
import seedProducts from "../data/seedProducts.json";

const categoryMeta: { name: string; icon: string }[] = [
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

export async function seedDatabase() {
  await dbConnect();

  // Clear existing data
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Artisan.deleteMany({});
  await Review.deleteMany({});

  // Build categories with real product counts derived from the dataset.
  const categories = categoryMeta.map((c) => ({
    name: c.name,
    icon: c.icon,
    productCount: seedProducts.filter((p) => p.category === c.name).length,
  }));

  await Category.insertMany(categories);
  await Product.insertMany(seedProducts);
  await Artisan.insertMany(artisans);

  console.log(`Database seeded: ${seedProducts.length} products, ${categories.length} categories.`);
}
