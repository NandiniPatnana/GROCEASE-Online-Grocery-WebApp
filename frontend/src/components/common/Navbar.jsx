import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ShoppingCart, User, Menu, X, LogOut, LogIn, Home, Info, Package, PhoneCall, Search } from "lucide-react";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const userMenuRef = useRef(null);
    const searchInputRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        setIsLoggedIn(!!token);
        
        // Reset user menu when login state changes
        if (!token) {
            setIsUserMenuOpen(false);
        }
    }, [location.pathname]); // Re-run when route changes

    useEffect(() => {
        const userEmail = sessionStorage.getItem('userEmail');
        const userRole = sessionStorage.getItem('userRole');
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        if (userEmail) {
            setIsAdmin(userRole === 'admin');
        }
        
        // Update cart count
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
        
        // Close mobile menu when route changes
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
    }, [location.pathname]);

    // Close user menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Focus search input when search is opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('isAdmin');
        setIsLoggedIn(false);
        setIsUserMenuOpen(false);
        window.location.href = '/login';
    };

    const getHomeRoute = () => {
        const isAdminUser = sessionStorage.getItem('isAdmin') === 'true';
        return isAdminUser ? '/admin' : '/customer';
    };

    const getProductsRoute = () => {
        const isAdminUser = sessionStorage.getItem('isAdmin') === 'true';
        return isAdminUser ? '/admin/products' : '/customer';
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        // Close other menus when mobile menu is toggled
        setIsUserMenuOpen(false);
        setIsSearchOpen(false);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
            setSearchQuery("");
            setIsSearchOpen(false);
        }
    };

    const isActive = (path) => {
        return location.pathname === path ? "text-green-600 font-medium" : "text-gray-600";
    };

    const getOrdersLink = () => {
        const isAdminUser = sessionStorage.getItem('isAdmin') === 'true';
        return isAdminUser ? '/admin/orders' : '/customer/orders';
    };

    return (
        <nav className="bg-white shadow-md fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <a href={getHomeRoute()} className="flex items-center">
                            <span className="text-2xl font-bold text-green-600 tracking-wider">GROCEASE</span>
                        </a>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className={`hidden md:flex items-center transition-all duration-300 ${isSearchOpen ? 'w-1/3' : 'w-0'}`}>
                        {isSearchOpen && (
                            <form onSubmit={handleSearch} className="w-full">
                                <div className="relative w-full">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="w-full pl-3 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <button 
                                        type="submit" 
                                        className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-green-600"
                                    >
                                        <Search size={18} />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button onClick={toggleSearch} className="text-gray-600 hover:text-green-600 transition-colors duration-300">
                            <Search size={20} />
                        </button>
                        
                        <a
                            href={getHomeRoute()}
                            className={`flex items-center space-x-1 hover:text-green-600 transition-colors duration-300 ${isActive(getHomeRoute()) ? 'text-green-600' : ''}`}
                        >
                            <Home size={22} />
                            <span>Home</span>
                        </a>
                        
                        <a
                            href={getProductsRoute()}
                            className={`flex items-center space-x-1 hover:text-green-600 transition-colors duration-300 ${isActive(getProductsRoute()) ? 'text-green-600' : ''}`}
                        >
                            <Package size={22} />
                            <span>Products</span>
                        </a>
                        
                        <a href="/about" className={`hover:text-green-600 transition-colors duration-300 flex items-center ${isActive('/about')}`}>
                            <Info size={18} className="mr-1" />
                            <span>About</span>
                        </a>
                        
                        <a href="/contact" className={`hover:text-green-600 transition-colors duration-300 flex items-center ${isActive('/contact')}`}>
                            <PhoneCall size={18} className="mr-1" />
                            <span>Contact</span>
                        </a>
                        
                        {sessionStorage.getItem('isAdmin') !== 'true' && (
                            <a href="customer/cart" className="relative hover:text-green-600 transition-colors duration-300">
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </a>
                        )}
                        
                        {isLoggedIn ? (
                            <div className="relative" ref={userMenuRef}>
                                <button 
                                    onClick={toggleUserMenu}
                                    className="flex items-center text-gray-600 hover:text-green-600 transition-colors duration-300"
                                >
                                    <User size={22} />
                                    <span className="ml-1">Account</span>
                                </button>
                                
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                        <a href={getOrdersLink()} className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                                            My Orders
                                        </a>
                                        {isAdmin && (
                                            <a href="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                                                Admin Dashboard
                                            </a>
                                        )}
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button 
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                        >
                                            <div className="flex items-center">
                                                <LogOut size={16} className="mr-2" />
                                                <span>Sign Out</span>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <a href="/login">
                                <button className="flex items-center bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors duration-300">
                                    <LogIn size={18} className="mr-1" />
                                    <span>Sign In</span>
                                </button>
                            </a>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        {sessionStorage.getItem('isAdmin') !== 'true' && (
                            <a href="/cart" className="relative text-gray-600 hover:text-green-600">
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </a>
                        )}
                        
                        <button 
                            onClick={toggleMobileMenu}
                            className="text-gray-600 hover:text-green-600 focus:outline-none p-1"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} md:hidden transition-all duration-300 ease-in-out overflow-hidden`}>
                    {/* Search in mobile menu */}
                    <div className="px-3 pt-3">
                        <form onSubmit={handleSearch}>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full pl-3 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <button 
                                    type="submit" 
                                    className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-green-600"
                                >
                                    <Search size={18} />
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <a
                            href={getHomeRoute()}
                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isActive(getHomeRoute()) ? 'text-green-600' : ''}`}
                            onClick={toggleMobileMenu}
                        >
                            Home
                        </a>
                        <a
                            href={getProductsRoute()}
                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isActive(getProductsRoute()) ? 'text-green-600' : ''}`}
                            onClick={toggleMobileMenu}
                        >
                            Products
                        </a>
                        
                        <a href="/about" className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isActive('/about')}`} onClick={toggleMobileMenu}>
                            About
                        </a>
                        
                        <a href="/contact" className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isActive('/contact')}`} onClick={toggleMobileMenu}>
                            Contact
                        </a>
                        
                        {isLoggedIn && (
                            <>
                                <div className="border-t border-gray-200 my-2"></div>
                                <a href={getOrdersLink()} className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors duration-300">
                                    <Package size={18} className="mr-2" />
                                    <span>My Orders</span>
                                </a>
                                
                                {isAdmin && (
                                    <>
                                        <div className="border-t border-gray-200 my-2"></div>
                                        <div className="px-3 py-1 text-xs font-semibold text-gray-500">
                                            ADMIN
                                        </div>
                                        
                                        <a href="/admin/dashboard" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors duration-300">
                                            <span>Dashboard</span>
                                        </a>
                                        
                                        <a href="/admin/orders" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors duration-300">
                                            <span>Manage Orders</span>
                                        </a>
                                        
                                        <a href="/admin/products" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors duration-300">
                                            <span>Manage Products</span>
                                        </a>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    
                    {isLoggedIn ? (
                        <div className="px-3 pb-3">
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors duration-300"
                            >
                                <LogOut size={18} className="mr-2" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    ) : (
                        <div className="px-3 pb-3">
                            <a href="/login" className="block w-full">
                                <button className="w-full flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors duration-300">
                                    <LogIn size={18} className="mr-2" />
                                    <span>Sign In</span>
                                </button>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;