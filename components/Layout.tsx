import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Bell, LayoutDashboard, Users, Calendar, Settings, CreditCard, LogOut, User as UserIcon, BookOpen, MessageCircle, ShieldAlert, BarChart2, Briefcase, Clock, PlusCircle, FileText, Tag, Edit, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from './UI';

// Centralized Navigation Configuration
export const NAVIGATION_LINKS = {
  user: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/user' },
    { name: 'Find Match', icon: Sparkles, path: '/onboarding' },
    { name: 'AI Companion', icon: MessageCircle, path: '/ai-companion' },
    { name: 'Mood Tracker', icon: BarChart2, path: '/mood-tracker' },
    { name: 'Journal', icon: Edit, path: '/journal' },
    { name: 'Challenges', icon: BarChart2, path: '/challenges' },
    { name: 'Content Library', icon: BookOpen, path: '/content-library' },
    { name: 'Sessions', icon: Calendar, path: '/dashboard/user/sessions' },
    { name: 'Experts', icon: Users, path: '/browse' },
    { name: 'Messages', icon: MessageCircle, path: '/messages' },
    { name: 'Resources', icon: BookOpen, path: '/resources' },
    { name: 'Settings', icon: Settings, path: '/dashboard/user/settings' },
  ],
  expert: [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard/expert' },
    { name: 'Bookings', icon: Calendar, path: '/dashboard/expert/bookings' },
    { name: 'Availability', icon: Clock, path: '/dashboard/expert/availability' },
    { name: 'Group Sessions', icon: Users, path: '/dashboard/expert/group-sessions' },
    { name: 'Clients', icon: Users, path: '/dashboard/expert/clients' },
    { name: 'Messages', icon: MessageCircle, path: '/messages' },
    { name: 'Earnings', icon: CreditCard, path: '/dashboard/expert/earnings' },
    { name: 'Profile', icon: UserIcon, path: '/dashboard/expert/profile' },
  ],
  company: [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard/company' },
    { name: 'Employees', icon: Users, path: '/dashboard/company/employees' },
    { name: 'Credit Usage', icon: CreditCard, path: '/dashboard/company/credits' },
    { name: 'Settings', icon: Settings, path: '/dashboard/company/settings' },
  ],
  super_admin: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/admin' },
    { name: 'Founder Metrics', icon: TrendingUp, path: '/dashboard/admin/founder' },
    { name: 'Experts', icon: Users, path: '/dashboard/admin/experts' },
    { name: 'Companies', icon: Briefcase, path: '/dashboard/admin/companies' },
    { name: 'Bookings', icon: Calendar, path: '/dashboard/admin/bookings' },
    { name: 'Commissions', icon: FileText, path: '/dashboard/admin/commissions' },
    { name: 'Payouts', icon: CreditCard, path: '/dashboard/admin/payouts' },
    { name: 'Disputes', icon: ShieldAlert, path: '/dashboard/admin/disputes' },
    { name: 'Promos', icon: Tag, path: '/dashboard/admin/promos' },
    { name: 'CMS', icon: Edit, path: '/dashboard/admin/cms' },
    { name: 'Settings', icon: Settings, path: '/dashboard/admin/settings' },
  ]
};

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const currentRoleLinks = user ? NAVIGATION_LINKS[user.role] : [];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background-light/80 backdrop-blur-sm border-b border-primary/20">
      <div className="container mx-auto px-6">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Serene</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/browse" className={`text-base font-medium transition-colors hover:text-primary ${location.pathname.includes('/browse') ? 'text-primary' : 'text-gray-600'}`}>
                Browse
              </Link>
              <Link to={isAuthenticated ? "/dashboard/company" : "/signup?role=company"} className={`text-base font-medium transition-colors hover:text-primary ${location.pathname.includes('/company') ? 'text-primary' : 'text-gray-600'}`}>
                For Teams
              </Link>
              <Link to="/resources" className={`text-base font-medium transition-colors hover:text-primary ${location.pathname.includes('/resources') ? 'text-primary' : 'text-gray-600'}`}>
                Resources
              </Link>
              <Link to="/blog" className={`text-base font-medium transition-colors hover:text-primary ${location.pathname.includes('/blog') ? 'text-primary' : 'text-gray-600'}`}>
                Blog
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-4 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 mr-2">
                  <CreditCard size={18} className="text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">{user.credits || 0} Credits</span>
                </div>
                <Link to="/messages" className="text-gray-400 hover:text-primary relative p-2">
                  <MessageCircle size={24} />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-primary/20">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</span>
                  </div>
                  <Link to={`/dashboard/${user.role.replace('super_', '')}`}>
                    <div
                      className="h-11 w-11 rounded-full bg-cover bg-center border-2 border-white shadow-sm ring-2 ring-emerald-50"
                      style={{ backgroundImage: `url(${user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name})` }}
                    ></div>
                  </Link>
                  <button onClick={logout} className="text-gray-400 hover:text-red-500 ml-2" title="Sign Out">
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-base font-medium text-gray-600 hover:text-primary">Log in</Link>
                <Link to="/onboarding" className="hidden sm:flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-11 px-6 bg-emerald-600 text-white hover:bg-emerald-500 text-sm font-bold transition-all shadow-lg shadow-emerald-200 hover:-translate-y-0.5">
                  Get Started
                </Link>
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-11 w-11 border-2 border-white shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCmICsffXsUGEwvktzsC2UK7l5XiGljDNZsy6pod4U67c0bJUodX4YWmf9dRRL0D2JHwgMph43a7al27DOK-t-UUYreyheobuw3sftscfw6JopVViOp3gsug184dl4erzbWp-rCIcDKGBqOGwuklQRaL4j4jNj1esZIEoD3cJwasUJdshqiCGj6nbtu7wlL-iu0FdQLxfRe32BLDnbi8XQS3tkZxCgzEDgFuK6If_q-pWuep727CT8AFa7-aJ5uc3Ilqp0kOiLkiyVd")' }}></div>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            {isAuthenticated && user && (
              <Link to={`/dashboard/${user.role.replace('super_', '')}`} className="mr-4">
                <img
                  className="h-8 w-8 rounded-full object-cover border border-gray-200"
                  src={user.avatar}
                  alt="User"
                />
              </Link>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-primary p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 pb-4 shadow-lg">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-primary hover:text-primary">Home</Link>
            <Link to="/browse" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-primary hover:text-primary">Browse Experts</Link>
            <Link to={isAuthenticated ? "/dashboard/company" : "/signup?role=company"} onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-primary hover:text-primary">For Teams</Link>
            <Link to="/resources" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-primary hover:text-primary">Resources</Link>
            <Link to="/blog" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-primary hover:text-primary">Blog</Link>

            {isAuthenticated && user ? (
              <>
                <div className="border-t border-gray-200 my-2 pt-2">
                  <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Dashboard</p>
                  {currentRoleLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${location.pathname === link.path ? 'border-primary text-primary bg-emerald-50' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center">
                        <link.icon size={16} className="mr-2" />
                        {link.name}
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-red-50 hover:border-red-500 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" /> Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-200 my-2 pt-2 space-y-2 px-3">
                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center py-2 border border-gray-300 rounded-lg text-gray-700 font-medium">Log in</Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="block w-full text-center py-2 bg-primary rounded-lg text-gray-900 font-bold">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export const DashboardSidebar: React.FC<{ type: 'user' | 'expert' | 'company' | 'super_admin' }> = ({ type }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const currentLinks = NAVIGATION_LINKS[type];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] hidden md:block flex-shrink-0">
      <div className="sticky top-20 flex flex-col h-full">
        <div className="flex-1 py-6 space-y-1">
          {currentLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${isActive
                  ? 'text-emerald-600 bg-emerald-50 border-r-4 border-primary'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <Icon size={18} className="mr-3" />
                {link.name}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-gray-100">
          <button onClick={logout} className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
            <LogOut size={18} className="mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-white border-t border-gray-100 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase">Platform</h3>
          <ul className="mt-4 space-y-4">
            <li><Link to="/browse" className="text-base text-gray-600 hover:text-primary">Browse Experts</Link></li>
            <li><Link to="/group-sessions" className="text-base text-gray-600 hover:text-primary">Group Sessions</Link></li>
            <li><Link to="/commission-split" className="text-base text-gray-600 hover:text-primary">Commission Split</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase">Company</h3>
          <ul className="mt-4 space-y-4">
            <li><a href="#" className="text-base text-gray-600 hover:text-primary">About</a></li>
            <li><a href="#" className="text-base text-gray-600 hover:text-primary">Careers</a></li>
            <li><Link to="/blog" className="text-base text-gray-600 hover:text-primary">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase">Support</h3>
          <ul className="mt-4 space-y-4">
            <li><a href="#" className="text-base text-gray-600 hover:text-primary">Help Center</a></li>
            <li><Link to="/refund-policy" className="text-base text-gray-600 hover:text-primary">Refund Policy</Link></li>
            <li><a href="#" className="text-base text-gray-600 hover:text-primary">Privacy</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase">Connect</h3>
          <p className="mt-4 text-sm text-gray-500">
            Join our newsletter for wellness tips.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <input type="email" placeholder="Enter your email" className="w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
            <button className="w-full sm:w-auto bg-primary text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-base text-gray-400 text-center md:text-left">&copy; 2024 Serene Wellbeing. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
