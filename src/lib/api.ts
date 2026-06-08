import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { Product } from "../types";

// Auto-seed mechanism
const initialProducts = [
  { id: "1", name: "Premium Butter Cookies", price: 120, category: "Butter Cookies", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=500&q=60", description: "Delicious rich butter cookies made with premium Danish butter.", rating: 4.8, reviews: 120, stock: 50, brand: "Royal Bakers" },
  { id: "2", name: "Chocolate Chip Delights", price: 150, category: "Chocolate Biscuits", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=60", description: "Crispy cookies loaded with rich dark chocolate chips.", rating: 4.9, reviews: 340, stock: 100, brand: "ChocoBites" },
  { id: "3", name: "Digestive Essentials", price: 80, category: "Digestive Biscuits", image: "https://images.unsplash.com/photo-1620935105269-e05445fc6e4b?auto=format&fit=crop&w=500&q=60", description: "Healthy digestive biscuits rich in fiber and whole wheat.", rating: 4.5, reviews: 89, stock: 200, brand: "HealthO" },
  { id: "4", name: "Vanilla Cream Sandwich", price: 90, category: "Cream Biscuits", image: "https://images.unsplash.com/photo-1620478028212-32aeb48f3223?auto=format&fit=crop&w=500&q=60", description: "Sweet vanilla cream sandwiched between two crispy biscuits.", rating: 4.7, reviews: 210, stock: 75, brand: "SweetTreats" },
  { id: "5", name: "Sugar-Free Oats Biscuits", price: 110, category: "Sugar-Free Biscuits", image: "https://images.unsplash.com/photo-1549556110-377fbc8d67d7?auto=format&fit=crop&w=500&q=60", description: "Perfect for diet-conscious individuals, made with real oats.", rating: 4.6, reviews: 45, stock: 30, brand: "FitSnack" },
  { id: "6", name: "Kids Animal Crackers", price: 60, category: "Kids Biscuits", image: "https://images.unsplash.com/photo-1557349132-72cc5db73919?auto=format&fit=crop&w=500&q=60", description: "Fun animal shapes your kids will love, fortified with vitamins.", rating: 4.8, reviews: 150, stock: 120, brand: "KidsJoy" }
];

const initialBanners = [
  { id: "1", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80", title: "Chocolate Delights" },
  { id: "2", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80", title: "Butter Cookies" },
  { id: "3", image: "https://images.unsplash.com/photo-1620935105269-e05445fc6e4b?auto=format&fit=crop&w=800&q=80", title: "Healthy Digestive" },
  { id: "4", image: "https://images.unsplash.com/photo-1557349132-72cc5db73919?auto=format&fit=crop&w=800&q=80", title: "Kids Cookies" }
];

let hasSeeded = false;

export async function checkAndSeed() {
  if (hasSeeded) return;
  try {
    const snap = await getDocs(collection(db, "products"));
    if (snap.empty) {
      console.log("Seeding products...");
      for (const p of initialProducts) {
        await setDoc(doc(db, "products", p.id), p);
      }
      for (const b of initialBanners) {
        await setDoc(doc(db, "banners", b.id), b);
      }
    }
    hasSeeded = true;
  } catch (err) {
    console.error("Firebase permissions might not allow seeding or read", err);
    hasSeeded = true; // prevent infinite loops
  }
}

// Banners
export async function getBanners() {
  await checkAndSeed();
  try {
    const snap = await getDocs(collection(db, "banners"));
    if (snap.empty) return initialBanners;
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
  } catch(e) {
    return initialBanners;
  }
}

export async function addBanner(banner: any) {
  const newId = Date.now().toString();
  await setDoc(doc(db, "banners", newId), { ...banner, id: newId });
  return { ...banner, id: newId };
}

export async function updateBanner(id: string, updates: any) {
  await updateDoc(doc(db, "banners", id), updates);
}

export async function deleteBanner(id: string) {
  await deleteDoc(doc(db, "banners", id));
}

// Products
export async function getProducts(category?: string) {
  await checkAndSeed();
  try {
    let q = collection(db, "products") as any;
    if (category) {
      q = query(collection(db, "products"), where("category", "==", category));
    }
    const snap = await getDocs(q);
    if (snap.empty) return category ? initialProducts.filter(p=>p.category===category) : initialProducts;
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Product));
  } catch(e) {
    return category ? initialProducts.filter(p=>p.category===category) : initialProducts;
  }
}

export async function addProduct(product: Omit<Product, 'id'>) {
  const newId = Date.now().toString();
  await setDoc(doc(db, "products", newId), { ...product, id: newId, rating: 5.0, reviews: 0 });
  return { ...product, id: newId, rating: 5.0, reviews: 0 };
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  await updateDoc(doc(db, "products", id), updates);
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, "products", id));
}

// Categories
const initialCategories = [
  { id: "1", name: "Cream Biscuits" },
  { id: "2", name: "Chocolate Biscuits" },
  { id: "3", name: "Butter Cookies" },
  { id: "4", name: "Digestive Biscuits" },
  { id: "5", name: "Crackers" },
  { id: "6", name: "Kids Biscuits" },
  { id: "7", name: "Premium Biscuits" },
  { id: "8", name: "Sugar-Free Biscuits" }
];

export async function getCategories() {
  await checkAndSeed();
  try {
    const snap = await getDocs(collection(db, "categories"));
    if (snap.empty) {
      for (const cat of initialCategories) {
        await setDoc(doc(db, "categories", cat.id), cat);
      }
      return initialCategories;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
  } catch(e) {
    return initialCategories;
  }
}

export async function addCategory(category: any) {
  const newId = Date.now().toString();
  await setDoc(doc(db, "categories", newId), { ...category, id: newId });
  return { ...category, id: newId };
}

export async function updateCategory(id: string, updates: any) {
  await updateDoc(doc(db, "categories", id), updates);
}

export async function deleteCategory(id: string) {
  await deleteDoc(doc(db, "categories", id));
}

// Brands
const initialBrands = [
  { id: "1", name: "Royal Bakers", image: "https://images.unsplash.com/photo-1549556110-377fbc8d67d7?auto=format&fit=crop&w=500&q=60" },
  { id: "2", name: "ChocoBites", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=500&q=60" }
];

export async function getBrands() {
  await checkAndSeed();
  try {
    const snap = await getDocs(collection(db, "brands"));
    if (snap.empty) {
      for (const b of initialBrands) {
        await setDoc(doc(db, "brands", b.id), b);
      }
      return initialBrands;
    }
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  } catch(e) {
    return initialBrands;
  }
}

export async function addBrand(brand: any) {
  const newId = Date.now().toString();
  await setDoc(doc(db, "brands", newId), { ...brand, id: newId });
  return { ...brand, id: newId };
}

export async function updateBrand(id: string, updates: any) {
  await updateDoc(doc(db, "brands", id), updates);
}

export async function deleteBrand(id: string) {
  await deleteDoc(doc(db, "brands", id));
}

// Company Info
const defaultCompanyInfo = {
  establishedDate: "2010",
  mdName: "John Doe",
  mdMessage: "Welcome to Biscuit Bazar, where we bake with love and passion. Our mission is to deliver the crispiest, tastiest biscuits to your doorsteps.",
  mdImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=60",
  history: "Biscuit Bazar started as a small family bakery in 2010 and has grown into a nationwide brand loved by millions."
};

export async function getCompanyInfo() {
  try {
    const docSnap = await getDocs(collection(db, "company"));
    if (docSnap.empty) {
      await setDoc(doc(db, "company", "info"), defaultCompanyInfo);
      return defaultCompanyInfo;
    }
    return docSnap.docs[0].data() as any;
  } catch(e) {
    return defaultCompanyInfo;
  }
}

export async function updateCompanyInfo(updates: any) {
  await updateDoc(doc(db, "company", "info"), updates);
}

// Wishlist
export async function getWishlist(userId: string): Promise<string[]> {
  try {
    const snap = await getDocs(collection(db, `users/${userId}/wishlist`));
    if (snap.empty) return [];
    return snap.docs.map(d => d.id);
  } catch (e) {
    return [];
  }
}

export async function toggleWishlistAPI(userId: string, productId: string, isWished: boolean) {
  try {
    if (isWished) {
      await setDoc(doc(db, `users/${userId}/wishlist`, productId), { addedAt: new Date().toISOString() });
    } else {
      await deleteDoc(doc(db, `users/${userId}/wishlist`, productId));
    }
  } catch (e) {
    console.error("Error toggling wishlist", e);
  }
}

// Admin Authentication
export async function adminLogin(username: string, password: string) {
  if (username.toLowerCase() === 'salesadmin' && password === '123456') {
    return { token: "super_admin_token", user: { id: "super_admin", name: "Super Admin", role: "admin", permissions: ["all"] } };
  }
  
  // Check sub-admins
  const q = query(collection(db, "admins"), where("username", "==", username), where("password", "==", password));
  const snap = await getDocs(q);
  if (!snap.empty) {
    const adminData = snap.docs[0].data();
    return { 
      token: "sub_admin_token_" + snap.docs[0].id, 
      user: { id: snap.docs[0].id, name: adminData.name, role: "subadmin", permissions: adminData.permissions || [] } 
    };
  }
  throw new Error("Invalid admin credentials");
}

export async function getSubAdmins() {
  const snap = await getDocs(collection(db, "admins"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addSubAdmin(data: any) {
  const newRef = doc(collection(db, "admins"));
  await setDoc(newRef, data);
  return { id: newRef.id, ...data };
}

export async function deleteSubAdmin(id: string) {
  await deleteDoc(doc(db, "admins", id));
}

// Pending Changes API
export async function submitPendingChange(data: any) {
  const newRef = doc(collection(db, "pending_changes"));
  const changeData = { ...data, status: "pending", createdAt: new Date().toISOString() };
  await setDoc(newRef, changeData);
  return { id: newRef.id, ...changeData };
}

export async function getPendingChanges() {
  const q = query(collection(db, "pending_changes"), where("status", "==", "pending"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function resolvePendingChange(id: string, action: 'approve' | 'reject', actualData?: any) {
  const ref = doc(db, "pending_changes", id);
  if (action === 'approve' && actualData) {
    // apply the actual change depending on type
    const { type, payload, docId } = actualData;
    if (type === 'add_product') await addProduct(payload);
    else if (type === 'edit_product') await updateProduct(docId, payload);
    else if (type === 'delete_product') await deleteProduct(docId);
    else if (type === 'update_order') await updateOrderStatus(docId, payload.status);
    // Add more types as needed
  }
  await updateDoc(ref, { status: action, resolvedAt: new Date().toISOString() });
}

// Admin Mock Check (User login)
export async function handleLoginMock(email: string) {
  if (email === "Salesadmin") {
    return { token: "admin_token_123", user: { id: 1, name: "Admin", role: "admin" } };
  }
  return { token: "user_token_123", user: { id: 2, name: email.split("@")[0], role: "user" } };
}

// Mock Orders moved to seed mechanism
const initialOrders = [
  { id: "ORD-100501", date: "2026-06-01", customer: "John Doe", total: 450, status: "Processing" },
  { id: "ORD-100502", date: "2026-06-02", customer: "Jane Smith", total: 120, status: "Delivered" },
];

export async function getOrders() {
  await checkAndSeed();
  try {
    const snap = await getDocs(collection(db, "orders"));
    if (snap.empty) {
      for (const o of initialOrders) {
        await setDoc(doc(db, "orders", o.id), o);
      }
      return initialOrders;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
  } catch(e) {
    return initialOrders;
  }
}

export async function getOrderById(id: string) {
  try {
    const snap = await getDocs(collection(db, "orders"));
    const data = snap.docs.find(d => d.id === id);
    if (data) return { id, ...data.data() };
  } catch(e) {}
  return initialOrders.find(o => o.id === id) || null;
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    await updateDoc(doc(db, "orders", id), { status });
  } catch(e) { console.error(e) }
}

// Mock Vouchers  
const initialVouchers = [
  { id: "1", code: "WELCOME10", discount: 10, type: "percent", active: true },
  { id: "2", code: "FLAT50", discount: 50, type: "fixed", active: true },
];

export async function getVouchers() {
  await checkAndSeed();
  try {
    const snap = await getDocs(collection(db, "vouchers"));
    if (snap.empty) {
      for (const v of initialVouchers) {
        await setDoc(doc(db, "vouchers", v.id), v);
      }
      return initialVouchers;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
  } catch(e) {
    return initialVouchers;
  }
}

export async function addVoucher(voucher: any) {
  const newId = Date.now().toString();
  await setDoc(doc(db, "vouchers", newId), { ...voucher, id: newId });
  return { ...voucher, id: newId };
}

export async function updateVoucher(id: string, updates: any) {
  await updateDoc(doc(db, "vouchers", id), updates);
}

export async function deleteVoucher(id: string) {
  await deleteDoc(doc(db, "vouchers", id));
}
