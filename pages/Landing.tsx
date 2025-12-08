import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle, Flower2, Clock, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/UI';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/browse?search=${searchTerm}`);
  };

  return (
    <div className="font-display">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCk0feXimzsBmebsODyyKMdQKV7Z8g9SN6yp2mTZGCPVexWbNh6p_uZZeunoAQmQZoFyDs288kvvpCGyx5rNzUD0BVmdywAr5m4fn7RUaTvA-ZK0gDNW9_iHAJmWe8_fO1wXAqxYJloQtVLTfLSadkFlQj6PNAoViIr6uTxWbIxqfWwFmJATIdwGejFqdEGl6hhW2ABwsYqVMBKwkFReNhzSktTVkPnzrwBtBCkAJKwervW1spDWzNe-reqtOHBp0NsBkhV7OjFXeNb")' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-light via-background-light/50 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Find your wellbeing expert today
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 font-medium">
            Connect with certified professionals to enhance your personal and professional wellbeing.
          </p>
          
          <div className="mt-10 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                className="w-full h-16 pl-12 pr-36 rounded-xl border border-primary/30 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-gray-800 placeholder-gray-400 transition-shadow shadow-soft focus:shadow-lg text-lg outline-none" 
                placeholder="Search for experts, categories, or keywords" 
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute inset-y-0 right-0 flex items-center justify-center rounded-r-xl h-full px-8 bg-primary text-gray-900 font-bold text-lg hover:bg-primary/90 transition-colors">
                Search
              </button>
            </form>
          </div>

          <div className="mt-8 flex justify-center items-center gap-x-8 gap-y-2 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <CheckCircle className="h-5 w-5 text-primary fill-current bg-white rounded-full" /> Verified Experts
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <ShieldCheck className="h-5 w-5 text-primary fill-current bg-white rounded-full" /> Secure Payments
            </div>
          </div>
        </div>
      </section>

      {/* Explore Wellbeing Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Explore Wellbeing</h2>
            <p className="mt-2 text-lg text-gray-600">Discover trending topics and popular categories.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Trending Topics */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Trending Topics</h3>
              <div className="space-y-4">
                <div onClick={() => navigate('/browse?filter=Mindfulness')} className="flex items-center bg-pastel-green/30 p-4 rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 cursor-pointer group border border-transparent hover:border-primary/20">
                  <div className="w-16 h-16 bg-pastel-green rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Flower2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Mindfulness</h4>
                    <p className="text-gray-600">Stay present and reduce stress.</p>
                  </div>
                </div>
                
                <div onClick={() => navigate('/browse?filter=Productivity')} className="flex items-center bg-lavender/30 p-4 rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 cursor-pointer group border border-transparent hover:border-indigo-200">
                  <div className="w-16 h-16 bg-lavender rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Clock className="h-8 w-8 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Time Management</h4>
                    <p className="text-gray-600">Boost your productivity and focus.</p>
                  </div>
                </div>

                <div onClick={() => navigate('/browse?filter=Emotional')} className="flex items-center bg-pastel-green/30 p-4 rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 cursor-pointer group border border-transparent hover:border-primary/20">
                  <div className="w-16 h-16 bg-pastel-green rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Emotional Health</h4>
                    <p className="text-gray-600">Navigate your feelings with support.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Categories */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Popular Categories</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Stress & Anxiety', 'Career Coaching', 'Relationships', 'Nutrition', 'Fitness', 'Sleep'].map((cat) => (
                  <div 
                    key={cat}
                    onClick={() => navigate(`/browse?filter=${cat}`)}
                    className="bg-white p-6 rounded-xl shadow-soft text-center hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-100 hover:-translate-y-1"
                  >
                    <h4 className="font-bold text-lg text-gray-900">{cat}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 bg-primary/5">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Community Says</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                {
                    text: "I found the perfect expert to help me manage stress and improve my work-life balance.",
                    name: "Sarah L.",
                    role: "Individual User",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAArkrkvq9xQniWowfH3cFXU_gVSDmZ-8iR601ZnIZFbdL5nttjQGKZU0jAGG7Q9q-oSVMqfbTDhYSf0qRztViKseRor3VnUSy32EeGli1XRS9EDHocfRrVX9qE7_8_bnCkKo9zYetY4s-LhJm4q2gQb4C0KZpVqWWIiOfryUxTGaQsY3aDj8bnPhQFgH1DUtUsJdTolkZ5B6ctdWEXTVyQsvpD2wJ3Pr9S5VqBHFXSARcDDoEQWC4HcTEE7li3lCZvZWT2ToMLzuTV"
                },
                {
                    text: "The platform is easy to use, and the experts are highly qualified. A game-changer for our team's wellbeing.",
                    name: "Emily R.",
                    role: "HR Manager",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAu09NUIn978z_JKHnfrKueOdjdH8v6NUYxm3ns-5ySYFsoB4jwir954yDJwidTTZwNIPAb0bVtigPIU4R9Y7MoyiX37tlAZIMgaYX3prY7pXT7-csniVIG6x3ebycEXL0wnYz8tTkpEEplupcNMMahAKG-SaMO6e7xSLoBwa5Fbq3lUqc7ujub4KOcA5pqa4bBjscBzx9zJMxbh6hQQ_SShgxRkf8KJTuBfrhc2Vkt0GrF1Gf72TEx6i_YCAcj4IjvKGDRbuv7m1jG"
                },
                {
                    text: "I've seen significant improvements in my focus and productivity. Highly recommend.",
                    name: "Mark C.",
                    role: "Individual User",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnNEm17fv9Ton_80XUBCpXVtLoqSC1AQf5ltBwz99oUFKNN5gh91bXOqE0iua5mv2BJy9zDB08oyFQjzOyuGZdPmDXvYjKJKlbbJnMQuyB7UJuFnaKqqBZqSiDBiY1G8ZaBSraOAp4V3IccAQ1le8QK3DJ5tgYYTAHMZgpq0nAFUttVJzEbXX9k88pOnHcUApl98E9lS5Fu7z1KyZo7MPxKs0bDK8mqq3K--qrMBTXCU5_ZuxqdWJX6CKUuE8TJTv2bOAxi6QHpMFY"
                }
            ].map((testimonial, i) => (
                <div key={i} className="bg-white p-8 rounded-xl shadow-lg border border-primary/10">
                    <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-cover bg-center mr-4 shadow-sm" style={{ backgroundImage: `url("${testimonial.img}")` }}></div>
                        <div>
                            <p className="font-bold text-gray-900">{testimonial.name}</p>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experts */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Featured Experts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
                { name: 'Olivia Bennett', title: 'Mindfulness Coach', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO_bUq7Lv_hGe2fB8DVEuxfdsc4JyxR4J0VAhJSZHFM6ODSsf7n1hKMhiovUnkScJgYFMnADuE0srJNyxZ4vY3IM8D_auKiBCPh8RHzAIik_czF7b9NuDFU9WPKsKwV2Y1GeITCgSLSqEZncwqTuXtpKEDY6wlza2q9kED33BRLKhN1iDq5ZurtgYaQRg3J4yeytG--L9m_u1KLu6Ciu5PvEAmPfLGlW4LkqNR7-QzkmEEMKtf8OqsEuWmjeXqyWeBO1wRM4uuDVSB', id: '1' },
                { name: 'Ethan Carter', title: 'Stress Management Consultant', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnbglXd71t-oB74Ss2xX1EXPyhTWEE05_lFxBDjiLQz4F_2XbRJ415xK_4bExZq_HwlXwyIQBvRLTOVEj8C4JJhRjPFMlQ9ODpYJp11y3SUOoHqB99sp8_d7BNUkH0hsnA1QXeLU-7ZpQSiPaDpCTfVvYFYp1vq1BtmRh6tVlV4JSJ6HvSwo00HrLSGfyG029xbrsflK-Em9Xg04za1CjPMzM29KV3pfc1SbQuLJVkQJ77729rJBZeoRm-VVu2cVAxQkOwp3Zpj8S2', id: '2' },
                { name: 'Sophia Hayes', title: 'Corporate Wellbeing Specialist', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnzvnVZbrmVi1GLKJc2WpvYr18EA3Gc2fxVv83OGJ3zo5DrZWnifcxQoU2Q4lmMdlRCp9o79Mdg1076SVwoqxhEKQNoHxaoXXPwuj3gFGb0Qx_UGTsYpikfr_Le_g2LygONbMkbKrxKKZ0T3qGdbr7KoZefkdiaMDwgun6LNrhvwCxrrUMYSaUwru1EAXqxx86hzmsohe1IGIj7zDWlmQc_kkrz6aYzmbKJsuqv8pfnW3jjaZmUwQPOeANcD-HR550Xnwc1LhRltbV', id: '5' }
            ].map((expert) => (
                <div key={expert.id} className="group overflow-hidden rounded-xl bg-white shadow-lg border border-primary/10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer" onClick={() => navigate(`/expert/${expert.id}`)}>
                    <div className="w-full h-64 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url("${expert.img}")` }}></div>
                    <div className="p-6 relative bg-white">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{expert.name}</h3>
                        <p className="text-emerald-600 font-medium mt-1">{expert.title}</p>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate CTA */}
      <section className="py-16 sm:py-24 bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-primary/10">
            <div className="text-center md:text-left max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Wellbeing solutions for your team</h2>
              <p className="mt-4 text-lg text-gray-600">Boost productivity and employee satisfaction with our tailored corporate wellbeing programs.</p>
            </div>
            <div className="flex-shrink-0">
              <button onClick={() => navigate('/dashboard/company')} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-primary text-gray-900 text-lg font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                <span className="truncate">Explore For Teams</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;