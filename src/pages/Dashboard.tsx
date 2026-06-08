import { useAuthStore } from '../store';
import { useContentStore } from '../store/contentStore';
import { useNavigate } from 'react-router-dom';
import { 
  getProducts, getOrders, getVouchers, getBanners, 
  addProduct, deleteProduct, updateProduct,
  addBanner, updateBanner, deleteBanner 
} from '../lib/api';
import { LogOut, LayoutDashboard, Package, Users, Settings as SettingsIcon, PlusCircle, FileText, Check, ShoppingCart, Tag, Trash2, Edit, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { pages, updatePage } = useContentStore();
  const [editingPageSlug, setEditingPageSlug] = useState('privacy');
  const [pageContentTemp, setPageContentTemp] = useState(pages['privacy']?.content || '');

  // Admin Data State
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      getProducts().then(setProducts);
      getOrders().then(setOrders);
      getVouchers().then(setVouchers);
      getBanners().then(setBanners);
    }
  }, [user]);

  const handleAddProduct = async () => {
    const name = window.prompt("Enter new product name:");
    if (!name) return;
    const price = parseInt(window.prompt("Enter price:") || "100");
    const stock = parseInt(window.prompt("Enter stock:") || "50");
    
    try {
      const p = await addProduct({ name, price, stock, category: 'New Arrivals', image: '', description: '', rating: 0, reviews: 0, brand: '' });
      setProducts([...products, p]);
    } catch(e) { console.error(e); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch(e) { console.error(e); }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    // Orders update not fully wired, keep mock updating
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleEditProduct = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const name = window.prompt("Enter new product name:", product.name);
    if (!name) return;
    const priceStr = window.prompt("Enter price:", product.price.toString());
    const stockStr = window.prompt("Enter stock:", product.stock?.toString() || "0");
    if (!priceStr || !stockStr) return;
    
    try {
      const price = parseInt(priceStr);
      const stock = parseInt(stockStr);
      await updateProduct(id, { name, price, stock });
      setProducts(products.map(p => p.id === id ? { ...p, name, price, stock } : p));
    } catch (e) {
      console.error("Error updating product:", e);
    }
  };

  const handleAddVoucher = async () => {
    const code = window.prompt("Enter voucher code (e.g. SALE20):");
    if (!code) return;
    const discount = parseInt(window.prompt("Enter discount amount/percent:") || "10");
    // Mock for now since we didn't add the addVoucher api yet
    const v = { id: Date.now().toString(), code, discount, type: 'fixed', active: true };
    setVouchers([...vouchers, v]);
  };

  const handleDeleteVoucher = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    setVouchers(vouchers.filter(v => v.id !== id));
  };

  const handleAddBanner = async () => {
    const title = window.prompt("Enter banner title:");
    if (!title) return;
    const image = window.prompt("Enter image URL:");
    if (!image) return;
    try {
      const b = await addBanner({ title, image });
      setBanners([...banners, b]);
    } catch(e) { console.error(e); }
  };

  const handleEditBanner = async (id: string) => {
    const banner = banners.find(b => b.id === id);
    if (!banner) return;
    const title = window.prompt("Enter new banner title:", banner.title);
    if (title === null) return;
    const image = window.prompt("Enter new image URL:", banner.image);
    if (image === null) return;
    try {
      await updateBanner(id, { title, image });
      setBanners(banners.map(b => b.id === id ? { ...b, title, image } : b));
    } catch(e) { console.error(e); }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteBanner(id);
      setBanners(banners.filter(b => b.id !== id));
    } catch(e) { console.error(e); }
  };

  useEffect(() => {
    if (editingPageSlug && pages[editingPageSlug]) {
      setPageContentTemp(pages[editingPageSlug].content);
    }
  }, [editingPageSlug, pages]);

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPageSlug) {
      updatePage(editingPageSlug, pageContentTemp);
      alert('Content saved successfully!');
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar sidebar */}
      <aside className="w-full md:w-64 bg-emerald-900 text-white min-h-[200px] md:min-h-screen p-6 shadow-xl z-10 flex flex-col">
        <div className="mb-8 hidden md:block">
           <h2 className="text-xl font-bold tracking-tight text-white/90">Dashboard</h2>
           <p className="text-sm text-emerald-300 capitalize">Role: {user.role}</p>
        </div>
        
        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible flex-grow">
          <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'overview' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
            <LayoutDashboard className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Overview</span>
          </button>
          
          {user.role === 'admin' && (
            <>
              <button onClick={() => setActiveTab('products')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'products' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
                <Package className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Products</span>
              </button>
              <button onClick={() => setActiveTab('customers')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'customers' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
                <Users className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Customers</span>
              </button>
              <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'orders' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
                <ShoppingCart className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Orders</span>
              </button>
              <button onClick={() => setActiveTab('vouchers')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'vouchers' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
                <Tag className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Vouchers</span>
              </button>
              <button onClick={() => setActiveTab('banners')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'banners' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
                <ImageIcon className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Banners</span>
              </button>
              <button onClick={() => setActiveTab('pages')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'pages' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
                <FileText className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Pages</span>
              </button>
              <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'settings' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
                <SettingsIcon className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Settings</span>
              </button>
            </>
          )}

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl font-medium text-orange-400 transition-colors shrink-0 md:mt-auto"
          >
            <LogOut className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.name}!</h1>
          <p className="text-gray-500">Here's what's happening with your account today.</p>
        </div>

        {user.role === 'admin' && activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Total Revenue</h3>
              <p className="text-3xl font-bold text-gray-900">৳24,500</p>
              <span className="text-emerald-500 text-sm font-bold mt-2 inline-block">+15% this week</span>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Active Orders</h3>
              <p className="text-3xl font-bold text-gray-900">42</p>
              <span className="text-orange-500 text-sm font-bold mt-2 inline-block">12 pending shipment</span>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Products Sold (Today)</h3>
              <p className="text-3xl font-bold text-gray-900">128</p>
              <span className="text-emerald-500 text-sm font-bold mt-2 inline-block">+5% than yesterday</span>
            </div>
          </div>
        )}
        
        {user.role !== 'admin' && activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center h-48 cursor-pointer hover:border-emerald-500 transition-colors">
              <Package className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-1">My Orders</h3>
              <p className="text-sm text-gray-500">View and track your previous orders</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center h-48 cursor-pointer hover:border-emerald-500 transition-colors">
              <SettingsIcon className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-1">Account Details</h3>
              <p className="text-sm text-gray-500">Update your email, password and addresses</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-dashed flex flex-col justify-center items-center text-center h-48 cursor-pointer hover:border-emerald-500 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-100 transition-colors">
                 <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-emerald-600 mb-1">Start New Order</h3>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">Recent Activity</h3>
              <button className="text-sm text-emerald-600 font-medium hover:underline">View All</button>
            </div>
            <div className="divide-y divide-gray-50">
              {[1, 2, 3].map(i => (
                 <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-emerald-600" />
                     </div>
                     <div>
                       <p className="font-medium text-gray-900">Order #ORD-{100500 + i}</p>
                       <p className="text-sm text-gray-500">Placed on {new Date().toLocaleDateString()}</p>
                     </div>
                   </div>
                   <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase tracking-wide">
                     {i === 1 ? 'Processing' : 'Delivered'}
                   </span>
                 </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Products Management</h2>
              <button onClick={handleAddProduct} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors text-sm">
                <PlusCircle className="w-4 h-4" /> Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">৳{product.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleEditProduct(product.id)} className="text-blue-600 hover:text-blue-800 font-medium mr-3"><Edit className="w-4 h-4 inline-block mb-1"/> Edit</button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800 font-medium"><Trash2 className="w-4 h-4 inline-block mb-1"/> Delete</button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                     <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No products found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Sales Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{order.customer}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">৳{order.total}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select 
                          className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-2 py-1 outline-none mr-2"
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        >
                          <option>Processing</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                     <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No recent orders.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'vouchers' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Voucher Codes</h2>
              <button onClick={handleAddVoucher} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors text-sm">
                <PlusCircle className="w-4 h-4" /> Add Voucher
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">Voucher Code</th>
                    <th className="px-6 py-4">Discount</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vouchers.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{v.code}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{v.discount}</td>
                      <td className="px-6 py-4 text-gray-500 uppercase text-xs font-bold">{v.type}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteVoucher(v.id)} className="text-red-600 hover:text-red-800 font-medium"><Trash2 className="w-4 h-4 inline-block mb-1"/> Delete</button>
                      </td>
                    </tr>
                  ))}
                  {vouchers.length === 0 && (
                     <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No vouchers available.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'banners' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Banner Management</h2>
              <button onClick={handleAddBanner} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors text-sm">
                <PlusCircle className="w-4 h-4" /> Add Banner
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {banners.map((banner) => (
                  <div key={banner.id} className="relative rounded-2xl overflow-hidden shadow-sm group border border-gray-100 bg-gray-50">
                    <img src={banner.image} alt={banner.title} className="w-full h-48 object-cover" />
                    <div className="p-4 flex justify-between items-center bg-white border-t border-gray-100">
                      <h3 className="font-bold text-gray-900 truncate pr-4">{banner.title}</h3>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditBanner(banner.id)} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 hover:text-blue-700 transition-colors shrink-0">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteBanner(banner.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 hover:text-red-700 transition-colors shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
               ))}
               {banners.length === 0 && (
                 <div className="col-span-full py-12 text-center text-gray-500">No banners found.</div>
               )}
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Customer Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Total Orders</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { id: 1, name: 'John Doe', email: 'john@example.com', orders: 12, status: 'Active' },
                    { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 5, status: 'Active' },
                    { id: 3, name: 'Robert Fox', email: 'robert@example.com', orders: 0, status: 'Inactive' }
                  ].map(customer => (
                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                      <td className="px-6 py-4 text-gray-500">{customer.email}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{customer.orders}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${customer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                          {customer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Pages Content Management</h2>
            </div>
            
            <div className="p-6">
              <div className="mb-6 overflow-x-auto whitespace-nowrap">
                <div className="flex gap-2 pb-2">
                 {Object.keys(pages).map(slug => (
                    <button 
                      key={slug} 
                      onClick={() => setEditingPageSlug(slug)}
                      className={`px-4 py-2 rounded-full font-medium transition-colors ${editingPageSlug === slug ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
                    >
                       {pages[slug].title}
                    </button>
                 ))}
                </div>
              </div>

              {editingPageSlug && (
                <form onSubmit={handleSavePage} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-sm font-medium text-gray-700">Content for '{pages[editingPageSlug].title}'</label>
                    </div>
                    <textarea 
                      rows={12}
                      value={pageContentTemp}
                      onChange={(e) => setPageContentTemp(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm leading-relaxed whitespace-pre-wrap"
                    />
                  </div>
                  <button type="submit" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2">
                    <Check className="w-5 h-5" /> Save Content Changes
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Platform Settings</h2>
            </div>
            <div className="p-6 md:p-8">
              <form className="max-w-2xl space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Settings saved successfully!'); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                    <input type="text" defaultValue="Biscuit Bazar" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                    <input type="email" defaultValue="hello@biscuitbazar.com" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900">
                      <option>BDT (৳)</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                    <input type="number" defaultValue="5" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
