import dbConnect from "./mongodb";
import Product from "../models/Product";
import Artisan from "../models/Artisan";
import Category from "../models/Category";
import Review from "../models/Review";

const categories = [
  { name: "রান্নাঘরের পণ্য", productCount: 48, icon: "🍲" },
  { name: "ঘর সাজানো", productCount: 62, icon: "🏠" },
  { name: "বাগানের পণ্য", productCount: 35, icon: "🌱" },
  { name: "আলোকসজ্জা", productCount: 24, icon: "🕯" },
  { name: "উপহারের সামগ্রী", productCount: 40, icon: "🎁" },
  { name: "ঐতিহ্যবাহী সংগ্রহ", productCount: 51, icon: "🏺" },
];

const bestSellingProducts = [
  {
    name: "হস্তশিল্প মাটির হাঁড়ি",
    description: "ঐতিহ্যবাহী পদ্ধতিতে তৈরি এই মাটির হাঁড়ি রান্নাঘরের সৌন্দর্য বৃদ্ধির পাশাপাশি খাবারের পুষ্টিগুণ বজায় রাখে। এটি সম্পূর্ণ পরিবেশবান্ধব এবং কোনো রাসায়নিক মুক্ত।",
    price: 350,
    originalPrice: 500,
    rating: 5,
    reviewsCount: 128,
    badge: "hot",
    icon: "🏺",
    category: "রান্নাঘরের পণ্য",
    isBestSelling: true,
    images: ["🏺", "🏺"]
  },
  {
    name: "টেরাকোটা ফুলদানি",
    description: "দক্ষ কারিগরের নিপুণ ছোঁয়ায় তৈরি এই টেরাকোটা ফুলদানি আপনার ড্রয়িং রুমকে দেবে এক অভিজাত লুক। এর গায়ে খোদাই করা নকশা বাঙালির আবহমান সংস্কৃতির পরিচয় বহন করে।",
    price: 480,
    originalPrice: 650,
    rating: 4,
    reviewsCount: 84,
    badge: "new",
    icon: "🏺",
    category: "ঘর সাজানো",
    isBestSelling: true,
    images: ["🏺", "🏺"]
  },
  {
    name: "মাটির চা সেট (৬ পিস)",
    description: "মাটির কাপে চায়ের আড্ডা হবে আরও জমজমাট। এই সেটটিতে রয়েছে ৬টি কাপ এবং একটি আধুনিক ডিজাইনের কেটলি। মেহমানদারিতে এটি যোগ করবে নতুন মাত্রা।",
    price: 850,
    originalPrice: 1200,
    rating: 5,
    reviewsCount: 203,
    badge: "sale",
    icon: "🫖",
    category: "রান্নাঘরের পণ্য",
    isBestSelling: true,
    images: ["🫖", "🫖"]
  },
  {
    name: "সাজানোর মাটির ঘোড়া",
    description: "পোড়ামাটির তৈরি এই ঘোড়াটি লোকশিল্পের এক অনন্য নিদর্শন। ঘরের কোণে বা সেলফে এটি বেশ মানানসই। বাচ্চাদের জন্য এটি একটি চমৎকার খেলনাও হতে পারে।",
    price: 620,
    originalPrice: 800,
    rating: 5,
    reviewsCount: 67,
    icon: "🐴",
    category: "ঘর সাজানো",
    isBestSelling: true,
    images: ["🐴", "🐴"]
  },
  {
    name: "মাটির পানির ফিল্টার",
    description: "প্রাকৃতিকভাবে পানি ঠান্ডা ও বিশুদ্ধ রাখতে মাটির ফিল্টারের কোনো বিকল্প নেই। এর সূক্ষ্ম ছিদ্রগুলো পানির ক্ষতিকারক উপাদান দূর করে পানিকে করে তোলে স্বাস্থ্যকর।",
    price: 1250,
    originalPrice: 1800,
    rating: 4,
    reviewsCount: 156,
    badge: "hot",
    icon: "🏺",
    category: "রান্নাঘরের পণ্য",
    isBestSelling: true,
    images: ["🏺", "🏺"]
  },
];

const artisans = [
  {
    name: "রহিম মৃধা",
    village: "ধামরাই, ঢাকা",
    experience: "২৫ বছরের অভিজ্ঞতা",
    story: "ধামরাইয়ের মাটি দিয়ে তৈরি প্রতিটি পাত্রে তিনি ঢেলে দেন নিজের জীবনের অভিজ্ঞতা। ছোটবেলা থেকে বাবার হাত ধরে শেখা এই শিল্পকে তিনি বাঁচিয়ে রেখেছেন প্রজন্মের পর প্রজন্ম ধরে।",
  },
  {
    name: "রাবেয়া বেগম",
    village: "রাজশাহী",
    experience: "১৮ বছরের অভিজ্ঞতা",
    story: "রাজশাহীর ঐতিহ্যবাহী নকশায় টেরাকোটার পণ্য তৈরি করেন তিনি, যা আন্তর্জাতিক মানের। তাঁর হাতের ছোঁয়ায় মাটি যেন জীবন্ত হয়ে ওঠে নতুন রূপে।",
  }
];

export async function seedDatabase() {
  await dbConnect();

  // Clear existing data
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Artisan.deleteMany({});
  await Review.deleteMany({});

  // Insert new data
  await Category.insertMany(categories);
  await Product.insertMany(bestSellingProducts);
  await Artisan.insertMany(artisans);

  console.log("Database seeded successfully!");
}
