import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store';
import { useContentStore } from '../store/contentStore';
import { useNavigate } from 'react-router-dom';
import { 
  getProducts, addProduct, updateProduct, deleteProduct,
  getOrders, addOrder, updateOrder, deleteOrder,
  getVouchers,
  getBanners,
  getBrands,
  getCompanyInfo,
  getCategories, addCategory, updateCategory, deleteCategory,
  addBrand, updateBrand as updateBrandAPI, deleteBrand as deleteBrandAPI,
  updateCompanyInfo,
  addBanner, updateBanner, deleteBanner,
  updateOrderStatus, addVoucher, updateVoucher, deleteVoucher,
  submitPendingChange, getPendingChanges, resolvePendingChange,
  getSubAdmins, addSubAdmin, deleteSubAdmin,
  getCustomers, addCustomer, updateCustomer, deleteCustomer
} from '../lib/api';
import ImageUploader from '../components/ImageUploader';
import { LogOut, LayoutDashboard, Package, Users, Settings as SettingsIcon, PlusCircle, FileText, Check, ShoppingCart, Tag, Trash2, Edit, Image as ImageIcon, Briefcase, Star, X, Shield, Clock, Layers } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { pages, updatePage, addPage, deletePage, settings, updateSettings } = useContentStore();
  const [editingPageSlug, setEditingPageSlug] = useState('privacy');
  const [pageContentTemp, setPageContentTemp] = useState(pages['privacy']?.content || '');

  // Admin Data State
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [companyInfo, setCompanyInfo] = useState<any>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState<any>({
    id: '', name: ''
  });

  const [customers, setCustomers] = useState<any[]>([]);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState<any>({
    id: '', name: '', email: '', orders: 0, status: 'Active'
  });

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState<any>({
    id: '', date: '', customer: '', total: 0, status: 'Processing'
  });

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState<any>({
    id: '', name: '', price: '100', stock: '50', category: '', image: '', description: '', brand: 'Bazar'
  });

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState<any>({
    id: '', title: '', description: '', link: '', image: ''
  });

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [brandForm, setBrandForm] = useState<any>({
    id: '', name: '', image: ''
  });

  const [isSubAdminModalOpen, setIsSubAdminModalOpen] = useState(false);
  const [subAdminForm, setSubAdminForm] = useState<any>({
    name: '', username: '', password: '', permissions: 'products,orders'
  });

  const [subadmins, setSubadmins] = useState<any[]>([]);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'subadmin') {
      getProducts().then(setProducts);
      getOrders().then(setOrders);
      getVouchers().then(setVouchers);
      getBanners().then(setBanners);
      getBrands().then(setBrands);
      getCompanyInfo().then(setCompanyInfo);
      getCategories().then(setCategories);
      getCustomers().then(setCustomers);
    }
    if (user?.role === 'admin') {
      getSubAdmins().then(setSubadmins);
      getPendingChanges().then(setPendingChanges);
    }
  }, [user]);

  const handleAddProduct = () => {
    setProductForm({ id: '', name: '', price: '100', stock: '50', category: categories[0]?.name || 'Premium Biscuits', image: '', description: '', brand: brands[0]?.name || 'Bazar' });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    setProductForm({ ...product, price: product.price.toString(), stock: product.stock?.toString() || '0' });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const price = parseInt(productForm.price);
      const stock = parseInt(productForm.stock);
      const payload = { ...productForm, price, stock };
      delete payload.id;
      
      if (user?.role === 'subadmin') {
        const changePayload = productForm.id ? { ...payload } : { ...payload, rating: 5, reviews: 0 };
        await submitPendingChange({ 
          type: productForm.id ? 'edit_product' : 'add_product', 
          docId: productForm.id || null, 
          payload: changePayload, 
          submittedBy: user.id,
          submittedByName: user.name || 'Sub Admin'
        });
        alert('Product change submitted for admin approval.');
      } else {
        if (productForm.id) {
          await updateProduct(productForm.id, payload);
          setProducts(products.map(p => p.id === productForm.id ? { id: productForm.id, ...payload } : p));
        } else {
          const p = await addProduct({ ...payload, rating: 5, reviews: 0 });
          setProducts([...products, p]);
        }
      }
      setIsProductModalOpen(false);
    } catch(e) { console.error("Error saving product:", e); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      if (user?.role === 'subadmin') {
        await submitPendingChange({ type: 'delete_product', docId: id, submittedBy: user.id, submittedByName: user.name || 'Sub Admin' });
        alert('Product deletion submitted for admin approval.');
      } else {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      }
    } catch(e) { console.error(e); }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      if (user?.role === 'subadmin') {
        await submitPendingChange({ type: 'update_order', docId: id, payload: { status }, submittedBy: user.id, submittedByName: user.name || 'Sub Admin' });
        alert('Order status change submitted for admin approval.');
      } else {
        await updateOrderStatus(id, status);
        setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      }
    } catch(e) { console.error(e) }
  };

  // Custom Customer CRUD handlers
  const handleAddCustomer = () => {
    setCustomerForm({ id: '', name: '', email: '', orders: 0, status: 'Active' });
    setIsCustomerModalOpen(true);
  };

  const handleEditCustomer = (id: string) => {
    const cust = customers.find(c => c.id === id);
    if (!cust) return;
    setCustomerForm({ ...cust, orders: cust.orders?.toString() || '0' });
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ordersCount = parseInt(customerForm.orders) || 0;
      const payload = { ...customerForm, orders: ordersCount };
      if (customerForm.id) {
        await updateCustomer(customerForm.id, payload);
        setCustomers(customers.map(c => c.id === customerForm.id ? payload : c));
        alert("Customer updated successfully!");
      } else {
        const c = await addCustomer(payload);
        setCustomers([...customers, c]);
        alert("Customer added successfully!");
      }
      setIsCustomerModalOpen(false);
    } catch(e) {
      console.error("Error saving customer:", e);
      alert("Failed to save customer: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await deleteCustomer(id);
      setCustomers(customers.filter(c => c.id !== id));
      alert("Customer deleted successfully!");
    } catch(e) {
      console.error("Error deleting customer:", e);
      alert("Failed to delete customer: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  // Custom Order CRUD handlers
  const handleAddOrder = () => {
    setOrderForm({ id: '', date: new Date().toISOString().split('T')[0], customer: '', total: '150', status: 'Processing' });
    setIsOrderModalOpen(true);
  };

  const handleEditOrder = (id: string) => {
    const ord = orders.find(o => o.id === id);
    if (!ord) return;
    setOrderForm({ ...ord, total: ord.total?.toString() || '0' });
    setIsOrderModalOpen(true);
  };

  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const totalAmount = parseFloat(orderForm.total) || 0;
      const payload = { ...orderForm, total: totalAmount };
      if (orderForm.id) {
        await updateOrder(orderForm.id, payload);
        setOrders(orders.map(o => o.id === orderForm.id ? payload : o));
      } else {
        const o = await addOrder(payload);
        setOrders([...orders, o]);
      }
      setIsOrderModalOpen(false);
    } catch(e) { console.error("Error saving order:", e); }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(id);
      setOrders(orders.filter(o => o.id !== id));
    } catch(e) { console.error("Error deleting order:", e); }
  };

  const handleAddVoucher = async () => {
    const code = window.prompt("Enter voucher code (e.g. SALE20):");
    if (!code) return;
    const discount = parseInt(window.prompt("Enter discount amount/percent:") || "10");
    try {
      const v = await addVoucher({ code, discount, type: 'fixed', active: true });
      setVouchers([...vouchers, v]);
    } catch(e) { console.error(e) }
  };

  const handleEditVoucher = async (id: string) => {
    const v = vouchers.find(v => v.id === id);
    if (!v) return;
    const code = window.prompt("Enter new voucher code:", v.code);
    if (!code) return;
    const discount = parseInt(window.prompt("Enter discount amount/percent:", v.discount.toString()) || v.discount.toString());
    try {
      await updateVoucher(id, { code, discount });
      setVouchers(vouchers.map(vo => vo.id === id ? { ...vo, code, discount } : vo));
    } catch(e) { console.error(e) }
  };

  const handleDeleteVoucher = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteVoucher(id);
      setVouchers(vouchers.filter(v => v.id !== id));
    } catch(e) { console.error(e) }
  };

  const handleAddBanner = () => {
    setBannerForm({ id: '', title: '', description: '', link: '', image: '' });
    setIsBannerModalOpen(true);
  };

  const handleEditBanner = (id: string) => {
    const banner = banners.find(b => b.id === id);
    if (!banner) return;
    setBannerForm(banner);
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (bannerForm.id) {
        await updateBanner(bannerForm.id, bannerForm);
        setBanners(banners.map(b => b.id === bannerForm.id ? bannerForm : b));
      } else {
        const { id, ...data } = bannerForm;
        const b = await addBanner(data);
        setBanners([...banners, b]);
      }
      setIsBannerModalOpen(false);
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

  const handleAddPage = () => {
    const slug = window.prompt("Enter page slug (e.g., 'about'):");
    if (!slug) return;
    const title = window.prompt("Enter page title:");
    if (!title) return;
    addPage(slug, title, "");
    setEditingPageSlug(slug);
  };

  const handleDeletePage = () => {
    if (!editingPageSlug) return;
    if (window.confirm(`Are you sure you want to delete ${pages[editingPageSlug].title}?`)) {
      deletePage(editingPageSlug);
      setEditingPageSlug('');
      setPageContentTemp('');
    }
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPageSlug) {
      updatePage(editingPageSlug, pageContentTemp);
      alert('Content saved successfully!');
    }
  };

  const handleAddBrand = () => {
    setBrandForm({ id: '', name: '', image: '' });
    setIsBrandModalOpen(true);
  };

  const handleEditBrand = (id: string) => {
    const b = brands.find(b => b.id === id);
    if (!b) return;
    setBrandForm(b);
    setIsBrandModalOpen(true);
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (brandForm.id) {
        await updateBrandAPI(brandForm.id, brandForm);
        setBrands(brands.map(b => b.id === brandForm.id ? brandForm : b));
      } else {
        const { id, ...data } = brandForm;
        const b = await addBrand(data);
        setBrands([...brands, b]);
      }
      setIsBrandModalOpen(false);
    } catch(e) { console.error(e); }
  };

  const handleDeleteBrand = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteBrandAPI(id);
      setBrands(brands.filter(br => br.id !== id));
    } catch(e) { console.error(e); }
  };

  const handleSaveCompanyInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCompanyInfo(companyInfo);
      alert('Company info saved successfully!');
    } catch(e) { console.error(e); }
  };

  const handleAddSubadmin = () => {
    setSubAdminForm({ name: '', username: '', password: '', permissions: 'products,orders' });
    setIsSubAdminModalOpen(true);
  };

  const handleSaveSubadmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const permissions = subAdminForm.permissions ? subAdminForm.permissions.split(',').map((p: string) => p.trim()) : [];
      const sa = await addSubAdmin({ ...subAdminForm, permissions });
      setSubadmins([...subadmins, sa]);
      setIsSubAdminModalOpen(false);
    } catch (e) { console.error(e); }
  };

  const handleDeleteSubadmin = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this sub-admin?")) return;
    try {
      await deleteSubAdmin(id);
      setSubadmins(subadmins.filter(s => s.id !== id));
    } catch (e) { console.error(e); }
  };

  const handleAddCategory = () => {
    setCategoryForm({ id: '', name: '' });
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    setCategoryForm(category);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (categoryForm.id) {
        await updateCategory(categoryForm.id, categoryForm);
        setCategories(categories.map(c => c.id === categoryForm.id ? categoryForm : c));
        alert("Category updated successfully!");
      } else {
        const { id, ...data } = categoryForm;
        const c = await addCategory(data);
        setCategories([...categories, c]);
        alert("Category added successfully!");
      }
      setIsCategoryModalOpen(false);
    } catch(e) {
      console.error("Error saving category:", e);
      alert("Failed to save category: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      alert("Category deleted successfully!");
    } catch(e) {
      console.error("Error deleting category:", e);
      alert("Failed to delete category: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleResolveChange = async (id: string, action: 'approve' | 'reject', changeData: any) => {
    try {
      await resolvePendingChange(id, action, changeData);
      setPendingChanges(pendingChanges.filter(c => c.id !== id));
      
      // Update local state if approved
      if (action === 'approve') {
        if (changeData.type === 'add_product') {
          setProducts([...products, { id: changeData.docId || Date.now().toString(), ...changeData.payload }]);
        } else if (changeData.type === 'edit_product') {
          setProducts(products.map(p => p.id === changeData.docId ? { ...p, ...changeData.payload } : p));
        } else if (changeData.type === 'delete_product') {
          setProducts(products.filter(p => p.id !== changeData.docId));
        } else if (changeData.type === 'update_order') {
          setOrders(orders.map(o => o.id === changeData.docId ? { ...o, status: changeData.payload.status } : o));
        }
        alert('Change approved successfully!');
      }
    } catch(e) { console.error(e); }
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
          
          {(user.role === 'admin' || user.permissions?.includes('products')) && (
            <button onClick={() => setActiveTab('products')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'products' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
              <Package className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Products</span>
            </button>
          )}

          {(user.role === 'admin' || user.permissions?.includes('customers')) && (
             <button onClick={() => setActiveTab('customers')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'customers' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
               <Users className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Customers</span>
             </button>
          )}

          {(user.role === 'admin' || user.permissions?.includes('orders')) && (
            <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'orders' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
              <ShoppingCart className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Orders</span>
            </button>
          )}

          {(user.role === 'admin' || user.permissions?.includes('vouchers')) && (
            <button onClick={() => setActiveTab('vouchers')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'vouchers' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
              <Tag className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Vouchers</span>
            </button>
          )}
          {(user.role === 'admin' || user.permissions?.includes('banners')) && (
            <button onClick={() => setActiveTab('banners')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'banners' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
              <ImageIcon className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Banners</span>
            </button>
          )}
          {(user.role === 'admin' || user.permissions?.includes('brands')) && (
            <button onClick={() => setActiveTab('brands')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'brands' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
              <Star className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Brands</span>
            </button>
          )}
          {(user.role === 'admin' || user.permissions?.includes('company')) && (
            <button onClick={() => setActiveTab('company')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'company' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
              <Briefcase className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Company Info</span>
            </button>
          )}
          {(user.role === 'admin' || user.permissions?.includes('pages')) && (
            <button onClick={() => setActiveTab('pages')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'pages' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
              <FileText className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Pages</span>
            </button>
          )}
          {(user.role === 'admin' || user.permissions?.includes('settings')) && (
            <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'settings' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
              <SettingsIcon className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Settings</span>
            </button>
          )}
          
          <div className="w-full h-px bg-emerald-800 my-2 hidden md:block"></div>
          {(user.role === 'admin' || user.permissions?.includes('categories')) && (
            <button onClick={() => setActiveTab('categories')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'categories' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
              <Layers className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Categories</span>
            </button>
          )}
          {user.role === 'admin' && (
            <>
              <button onClick={() => setActiveTab('approvals')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'approvals' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
                <Clock className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Approvals <span className="ml-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingChanges.length}</span></span>
              </button>
              <button onClick={() => setActiveTab('subadmins')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 ${activeTab === 'subadmins' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-emerald-100'}`}>
                <Shield className="w-5 h-5 shrink-0" /> <span className="hidden md:inline">Sub Admins</span>
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
              {(user.role === 'admin' || user.permissions?.includes('orders')) && (
                <button onClick={handleAddOrder} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors text-sm">
                  <PlusCircle className="w-4 h-4" /> Add Order
                </button>
              )}
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
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                        <select 
                          className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-2 py-1 outline-none font-medium text-gray-700"
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        >
                          <option>Processing</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                        </select>
                        {(user.role === 'admin' || user.permissions?.includes('orders')) && (
                          <>
                            <button onClick={() => handleEditOrder(order.id)} className="text-emerald-600 hover:text-emerald-800 font-medium p-1 transition-colors"><Edit className="w-4 h-4 inline-block"/></button>
                            <button onClick={() => handleDeleteOrder(order.id)} className="text-red-600 hover:text-red-800 font-medium p-1 transition-colors"><Trash2 className="w-4 h-4 inline-block"/></button>
                          </>
                        )}
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
                        <button onClick={() => handleEditVoucher(v.id)} className="text-blue-600 hover:text-blue-800 font-medium mr-3"><Edit className="w-4 h-4 inline-block mb-1"/> Edit</button>
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

        {activeTab === 'brands' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Brand Management</h2>
              <button onClick={handleAddBrand} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors text-sm">
                <PlusCircle className="w-4 h-4" /> Add Brand
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {brands.map((brand) => (
                  <div key={brand.id} className="relative rounded-2xl overflow-hidden shadow-sm group border border-gray-100 bg-gray-50 flex flex-col items-center p-6 pb-4">
                    <img src={brand.image} alt={brand.name} className="w-24 h-24 object-contain mb-4 rounded-full bg-white shadow-sm" />
                    <h3 className="font-bold text-gray-900 truncate mb-4">{brand.name}</h3>
                    <div className="flex gap-2 w-full border-t border-gray-200 pt-4 justify-center">
                      <button onClick={() => handleEditBrand(brand.id)} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 hover:text-blue-700 transition-colors shrink-0">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteBrand(brand.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 hover:text-red-700 transition-colors shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
               ))}
               {brands.length === 0 && (
                 <div className="col-span-full py-12 text-center text-gray-500">No brands found.</div>
               )}
            </div>
          </div>
        )}

        {activeTab === 'company' && companyInfo && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Our Company Info</h2>
            </div>
            <div className="p-6 md:p-8">
              <form className="max-w-2xl space-y-6" onSubmit={handleSaveCompanyInfo}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Established Date/Year</label>
                    <input type="text" value={companyInfo.establishedDate} onChange={e => setCompanyInfo({...companyInfo, establishedDate: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">MD Name</label>
                    <input type="text" value={companyInfo.mdName} onChange={e => setCompanyInfo({...companyInfo, mdName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">MD Message</label>
                    <textarea value={companyInfo.mdMessage} onChange={e => setCompanyInfo({...companyInfo, mdMessage: e.target.value})} rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <ImageUploader 
                      label="MD Image URL"
                      recommendedSize="400x400 px"
                      maxKB={500}
                      value={companyInfo.mdImage} 
                      onChange={(url) => setCompanyInfo({...companyInfo, mdImage: url})} 
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company History</label>
                    <textarea value={companyInfo.history} onChange={e => setCompanyInfo({...companyInfo, history: e.target.value})} rows={6} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm">
                    Save Details
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Customer Management</h2>
              {(user.role === 'admin' || user.permissions?.includes('customers')) && (
                <button onClick={handleAddCustomer} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors text-sm">
                  <PlusCircle className="w-4 h-4" /> Add Customer
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Total Orders</th>
                    <th className="px-6 py-4">Status</th>
                    {(user.role === 'admin' || user.permissions?.includes('customers')) && <th className="px-6 py-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map(customer => (
                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                      <td className="px-6 py-4 text-gray-500">{customer.email}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{customer.orders}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${customer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                          {customer.status}
                        </span>
                      </td>
                      {(user.role === 'admin' || user.permissions?.includes('customers')) && (
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                          <button onClick={() => handleEditCustomer(customer.id)} className="text-emerald-600 hover:text-emerald-800 font-medium p-1 transition-colors"><Edit className="w-4 h-4 inline-block"/></button>
                          <button onClick={() => handleDeleteCustomer(customer.id)} className="text-red-600 hover:text-red-800 font-medium p-1 transition-colors"><Trash2 className="w-4 h-4 inline-block"/></button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {customers.length === 0 && (
                     <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No customers found.</td></tr>
                  )}
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
                <div className="flex gap-2 pb-2 items-center">
                 {Object.keys(pages).map(slug => (
                    <button 
                      key={slug} 
                      onClick={() => setEditingPageSlug(slug)}
                      className={`px-4 py-2 rounded-full font-medium transition-colors ${editingPageSlug === slug ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
                    >
                       {pages[slug].title}
                    </button>
                 ))}
                 <button onClick={handleAddPage} type="button" className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors">
                   <PlusCircle className="w-5 h-5" />
                 </button>
                </div>
              </div>

              {editingPageSlug && (
                <form onSubmit={handleSavePage} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-sm font-medium text-gray-700">Content for '{pages[editingPageSlug].title}'</label>
                      <button type="button" onClick={handleDeletePage} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1">
                        <Trash2 className="w-4 h-4" /> Delete Page
                      </button>
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
                    <input type="text" value={settings.storeName} onChange={e => updateSettings({ storeName: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                    <input type="email" value={settings.supportEmail} onChange={e => updateSettings({ supportEmail: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
                    <input type="text" value={settings.supportPhone} onChange={e => updateSettings({ supportPhone: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input type="text" value={settings.address} onChange={e => updateSettings({ address: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                    <input type="url" value={settings.facebookUrl} onChange={e => updateSettings({ facebookUrl: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                    <input type="url" value={settings.twitterUrl} onChange={e => updateSettings({ twitterUrl: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                    <input type="url" value={settings.instagramUrl} onChange={e => updateSettings({ instagramUrl: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
                    <input type="text" value={settings.copyrightText} onChange={e => updateSettings({ copyrightText: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2">
                    <Check className="w-5 h-5" /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {activeTab === 'approvals' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
            </div>
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-sm">
                    <th className="px-6 py-4 font-bold text-gray-700">Type</th>
                    <th className="px-6 py-4 font-bold text-gray-700">Submited By</th>
                    <th className="px-6 py-4 font-bold text-gray-700">Details</th>
                    <th className="px-6 py-4 font-bold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendingChanges.map((change: any) => (
                    <tr key={change.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize bg-blue-100 text-blue-800">
                           {change.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{change.submittedByName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-sm truncate">
                        {JSON.stringify(change.payload || change.docId)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleResolveChange(change.id, 'approve', change)} className="text-emerald-600 hover:text-emerald-800 font-medium mr-3"><Check className="w-4 h-4 inline-block mb-1"/> Approve</button>
                        <button onClick={() => handleResolveChange(change.id, 'reject', change)} className="text-red-600 hover:text-red-800 font-medium"><X className="w-4 h-4 inline-block mb-1"/> Reject</button>
                      </td>
                    </tr>
                  ))}
                  {pendingChanges.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No pending approvals.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'subadmins' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Manage Sub Admins</h2>
              <button onClick={handleAddSubadmin} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-700">
                <PlusCircle className="w-4 h-4" /> Add Sub Admin
              </button>
            </div>
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-sm">
                    <th className="px-6 py-4 font-bold text-gray-700">Name / Username</th>
                    <th className="px-6 py-4 font-bold text-gray-700">Permissions</th>
                    <th className="px-6 py-4 font-bold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subadmins.map((adm: any) => (
                    <tr key={adm.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{adm.name}</div>
                        <div className="text-sm text-gray-500">@{adm.username}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {adm.permissions?.map((p: string) => (
                            <span key={p} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium uppercase">{p}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteSubadmin(adm.id)} className="text-red-600 hover:text-red-800 font-medium"><Trash2 className="w-4 h-4 inline-block mb-1"/> Remove</button>
                      </td>
                    </tr>
                  ))}
                  {subadmins.length === 0 && (
                    <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No sub-admins found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'categories' && (user.role === 'admin' || user.permissions?.includes('categories')) && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Manage Categories</h2>
              <button onClick={handleAddCategory} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-700">
                <PlusCircle className="w-4 h-4" /> Add Category
              </button>
            </div>
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-sm">
                    <th className="px-6 py-4 font-bold text-gray-700">Category Name</th>
                    <th className="px-6 py-4 font-bold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((cat: any) => (
                    <tr key={cat.id || cat.name} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {cat.name}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {cat.id && (
                          <>
                            <button onClick={() => handleEditCategory(cat.id)} className="text-emerald-600 hover:text-emerald-800 font-medium mr-3"><Edit className="w-4 h-4 inline-block mb-1"/> Edit</button>
                            <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-600 hover:text-red-800 font-medium"><Trash2 className="w-4 h-4 inline-block mb-1"/> Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr><td colSpan={2} className="px-6 py-8 text-center text-gray-500">No categories found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Customer Modal */}
        {isCustomerModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{customerForm.id ? 'Edit Customer' : 'Add New Customer'}</h3>
                <button onClick={() => setIsCustomerModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSaveCustomer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input required type="text" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input required type="email" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Orders</label>
                  <input required type="number" min="0" value={customerForm.orders} onChange={e => setCustomerForm({...customerForm, orders: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={customerForm.status} onChange={e => setCustomerForm({...customerForm, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsCustomerModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Order Modal */}
        {isOrderModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{orderForm.id ? 'Edit Order' : 'Add New Order'}</h3>
                <button onClick={() => setIsOrderModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSaveOrder} className="space-y-4">
                {orderForm.id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1 font-mono text-xs">Order ID (readonly)</label>
                    <input disabled type="text" value={orderForm.id} className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 text-gray-500 font-mono text-sm outline-none" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                  <input required type="date" value={orderForm.date} onChange={e => setOrderForm({...orderForm, date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input required type="text" value={orderForm.customer} onChange={e => setOrderForm({...orderForm, customer: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total (৳)</label>
                  <input required type="number" step="0.01" value={orderForm.total} onChange={e => setOrderForm({...orderForm, total: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={orderForm.status} onChange={e => setOrderForm({...orderForm, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsOrderModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Category Modal */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{categoryForm.id ? 'Edit Category' : 'Add New Category'}</h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input required type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Product Modal */}
        {isProductModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{productForm.id ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => setIsProductModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input required type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none">
                      {categories.map((cat, idx) => <option key={idx} value={cat.name}>{cat.name}</option>)}
                      {!categories.some((c: any) => c.name === productForm.category) && productForm.category && <option value={productForm.category}>{productForm.category}</option>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (৳)</label>
                    <input required type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input required type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <select required value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none">
                      {brands.map((brand, idx) => <option key={idx} value={brand.name}>{brand.name}</option>)}
                      {!brands.some((b: any) => b.name === productForm.brand) && productForm.brand && <option value={productForm.brand}>{productForm.brand}</option>}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <ImageUploader 
                      label="Product Image"
                      recommendedSize="800x800 px"
                      maxKB={500}
                      value={productForm.image} 
                      onChange={(url) => setProductForm({...productForm, image: url})} 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700">Save Product</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Banner Modal */}
        {isBannerModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{bannerForm.id ? 'Edit Banner' : 'Add New Banner'}</h3>
                <button onClick={() => setIsBannerModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSaveBanner} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input required type="text" value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input type="text" value={bannerForm.description} onChange={e => setBannerForm({...bannerForm, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Promotional Link / URL</label>
                  <input type="text" value={bannerForm.link} onChange={e => setBannerForm({...bannerForm, link: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <ImageUploader 
                  label="Banner Image"
                  recommendedSize="1920x600 px"
                  maxKB={1024}
                  value={bannerForm.image} 
                  onChange={(url) => setBannerForm({...bannerForm, image: url})} 
                />
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsBannerModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700">Save Banner</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Brand Modal */}
        {isBrandModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{brandForm.id ? 'Edit Brand' : 'Add New Brand'}</h3>
                <button onClick={() => setIsBrandModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSaveBrand} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                  <input required type="text" value={brandForm.name} onChange={e => setBrandForm({...brandForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <ImageUploader 
                  label="Brand Image"
                  recommendedSize="400x400 px"
                  maxKB={300}
                  value={brandForm.image} 
                  onChange={(url) => setBrandForm({...brandForm, image: url})} 
                />
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsBrandModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700">Save Brand</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sub Admin Modal */}
        {isSubAdminModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Sub Admin</h3>
                <button onClick={() => setIsSubAdminModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSaveSubadmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input required type="text" value={subAdminForm.name} onChange={e => setSubAdminForm({...subAdminForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input required type="text" value={subAdminForm.username} onChange={e => setSubAdminForm({...subAdminForm, username: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input required type="password" value={subAdminForm.password} onChange={e => setSubAdminForm({...subAdminForm, password: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Permissions (comma-separated)</label>
                  <input type="text" placeholder="e.g., products,orders" value={subAdminForm.permissions} onChange={e => setSubAdminForm({...subAdminForm, permissions: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  <p className="text-xs text-gray-500 mt-1">Available permissions: products, orders, vouchers, customers, pages, etc.</p>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsSubAdminModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
