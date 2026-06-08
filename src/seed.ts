import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const configPath = path.resolve("./firebase-applet-config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const products = [
  { id: "1", name: "Premium Butter Cookies", price: 120, category: "Butter Cookies", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=500&q=60", description: "Delicious rich butter cookies made with premium Danish butter.", rating: 4.8, reviews: 120, stock: 50, brand: "Royal Bakers" },
  { id: "2", name: "Chocolate Chip Delights", price: 150, category: "Chocolate Biscuits", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=60", description: "Crispy cookies loaded with rich dark chocolate chips.", rating: 4.9, reviews: 340, stock: 100, brand: "ChocoBites" },
  { id: "3", name: "Digestive Essentials", price: 80, category: "Digestive Biscuits", image: "https://images.unsplash.com/photo-1620935105269-e05445fc6e4b?auto=format&fit=crop&w=500&q=60", description: "Healthy digestive biscuits rich in fiber and whole wheat.", rating: 4.5, reviews: 89, stock: 200, brand: "HealthO" },
  { id: "4", name: "Vanilla Cream Sandwich", price: 90, category: "Cream Biscuits", image: "https://images.unsplash.com/photo-1620478028212-32aeb48f3223?auto=format&fit=crop&w=500&q=60", description: "Sweet vanilla cream sandwiched between two crispy biscuits.", rating: 4.7, reviews: 210, stock: 75, brand: "SweetTreats" },
  { id: "5", name: "Sugar-Free Oats Biscuits", price: 110, category: "Sugar-Free Biscuits", image: "https://images.unsplash.com/photo-1549556110-377fbc8d67d7?auto=format&fit=crop&w=500&q=60", description: "Perfect for diet-conscious individuals, made with real oats.", rating: 4.6, reviews: 45, stock: 30, brand: "FitSnack" },
  { id: "6", name: "Kids Animal Crackers", price: 60, category: "Kids Biscuits", image: "https://images.unsplash.com/photo-1557349132-72cc5db73919?auto=format&fit=crop&w=500&q=60", description: "Fun animal shapes your kids will love, fortified with vitamins.", rating: 4.8, reviews: 150, stock: 120, brand: "KidsJoy" }
];

const orders = [
  { id: "ORD-100501", date: "2026-06-01", customer: "John Doe", total: 450, status: "Processing" },
  { id: "ORD-100502", date: "2026-06-02", customer: "Jane Smith", total: 120, status: "Delivered" }
];

const vouchers = [
  { id: "1", code: "WELCOME10", discount: 10, type: "percent", active: true },
  { id: "2", code: "FLAT50", discount: 50, type: "fixed", active: true }
];

const banners = [
  { id: "1", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80", title: "Chocolate Delights" },
  { id: "2", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80", title: "Butter Cookies" },
  { id: "3", image: "https://images.unsplash.com/photo-1620935105269-e05445fc6e4b?auto=format&fit=crop&w=800&q=80", title: "Healthy Digestive" },
  { id: "4", image: "https://images.unsplash.com/photo-1557349132-72cc5db73919?auto=format&fit=crop&w=800&q=80", title: "Kids Cookies" }
];

async function seed() {
  console.log("Seeding data to Firebase...");
  for (const p of products) {
    await setDoc(doc(db, "products", p.id), p);
  }
  for (const o of orders) {
    await setDoc(doc(db, "orders", o.id), o);
  }
  for (const v of vouchers) {
    await setDoc(doc(db, "vouchers", v.id), v);
  }
  for (const b of banners) {
    await setDoc(doc(db, "banners", b.id), b);
  }
  console.log("Seeding complete.");
  process.exit(0);
}
seed().catch(err => {
  console.error(err);
  process.exit(1);
});
