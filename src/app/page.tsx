import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle, 
  Globe, 
  FileText, 
  Users, 
  Zap, 
  CreditCard, 
  Shield, 
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  BarChart3,
  Bitcoin,
  Check,
  MousePointer2,
  Lock,
  Search
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <header className="fixed top-0 w-full bg-white/70 backdrop-blur-xl z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                <FileText className="text-white h-6 w-6" />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">GrantWriter<span className="text-blue-600">AI</span></span>
            </div>
            <nav className="hidden lg:flex space-x-10 text-sm font-semibold text-slate-600">
              <a href="#features" className="hover:text-blue-600 transition-colors">Platform</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
              <a href="#case-studies" className="hover:text-blue-600 transition-colors">Case Studies</a>
              <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            </nav>
            <div className="flex items-center gap-5">
              <Link href="/auth/signin" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                Sign In
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md active:scale-95">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100/50 rounded-full blur-[120px]"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold mb-10 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span>Global Grant Intelligence at Your Fingertips</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tight mb-10 leading-[1.05]">
              Automate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">Grant Writing Success</span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-xl lg:text-2xl text-slate-600 leading-relaxed mb-14 font-medium">
              The only platform that combines a global grant database with AI-powered proposal generation. Tailored for <span className="text-slate-900 font-bold">NGOs</span>, <span className="text-slate-900 font-bold">Universities</span>, and <span className="text-slate-900 font-bold">Startups</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
              <Link href="/dashboard" className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 text-xl font-black rounded-2xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-300 hover:-translate-y-1 active:translate-y-0">
                Get Started Free <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
              <div className="flex flex-col items-center sm:items-start">
                 <div className="flex -space-x-3 mb-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 overflow-hidden`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white tracking-tighter">
                      +2k
                    </div>
                 </div>
                 <p className="text-sm font-bold text-slate-500">Joined by 2,000+ organizations</p>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100">
               <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">Trusted by institutions worldwide</p>
               <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                  <div className="text-2xl font-black tracking-tighter text-slate-900">UNITED NATIONS</div>
                  <div className="text-2xl font-black tracking-tighter text-slate-900">EUROPEAN UNION</div>
                  <div className="text-2xl font-black tracking-tighter text-slate-900">WORLD BANK</div>
                  <div className="text-2xl font-black tracking-tighter text-slate-900">USAID</div>
                  <div className="text-2xl font-black tracking-tighter text-slate-900">GATES FOUNDATION</div>
               </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Grid */}
        <section id="features" className="py-32 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <h2 className="text-blue-600 font-black text-sm uppercase tracking-[0.25em] mb-6">The Competitive Edge</h2>
              <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-8 tracking-tight">Write better proposals in 10% of the time.</h3>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">Our platform isn&apos;t just an editor. It&apos;s a complete grant-winning engine designed to displace legacy consulting services with pure AI efficiency.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { 
                  title: "Global Search Engine", 
                  desc: "Real-time scrapers monitoring EU, UN, government, and private foundation grants in 150+ countries.",
                  icon: Search,
                  color: "bg-blue-600"
                },
                { 
                  title: "1-Click Full Generator", 
                  desc: "Generate comprehensive, multi-section proposals (up to 200 pages) tailored to specific funder RFPs.",
                  icon: Zap,
                  color: "bg-amber-500"
                },
                { 
                  title: "AI Compliance Checker", 
                  desc: "Instant audit of your drafts against donor guidelines to ensure zero technical disqualifications.",
                  icon: Shield,
                  color: "bg-green-500"
                },
                { 
                  title: "Real-time Collaboration", 
                  desc: "Multi-user co-editing with cursor presence, versioning, and AI suggestions for your whole team.",
                  icon: Users,
                  color: "bg-purple-600"
                },
                { 
                  title: "Budget Justifier", 
                  desc: "AI-driven financial narratives that turn your numbers into compelling impact justifications.",
                  icon: BarChart3,
                  color: "bg-rose-500"
                },
                { 
                  title: "Success Analytics", 
                  desc: "Track win rates, historical feedback, and funding pipelines in one centralized dashboard.",
                  icon: TrendingUp,
                  color: "bg-indigo-600"
                }
              ].map((feature, idx) => (
                <div key={idx} className="group bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 hover:shadow-2xl hover:shadow-blue-100 transition-all hover:-translate-y-1">
                  <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-8 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h4>
                  <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-32 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex flex-col lg:flex-row items-center gap-20">
                <div className="lg:w-1/2">
                   <h2 className="text-blue-600 font-black text-sm uppercase tracking-[0.25em] mb-6 text-left">The Workflow</h2>
                   <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-10 tracking-tight leading-tight">From organization profile to successful submission.</h3>
                   
                   <div className="space-y-12">
                      {[
                        { step: "01", title: "Build Your Profile", desc: "Define your mission, sector, and financials once. Our AI uses this as the foundation for every proposal." },
                        { step: "02", title: "Find Matching Grants", desc: "Our database automatically surfaces open grants that match your organization&apos;s specific profile." },
                        { step: "03", title: "Generate & Co-Edit", desc: "Generate a full draft in one click, then refine it with your team in our collaborative AI editor." },
                        { step: "04", title: "Final Audit & Win", desc: "Run the compliance checker, export your finalized proposal, and track your success rate." }
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-8 group">
                           <div className="text-5xl font-black text-slate-100 group-hover:text-blue-600 transition-colors duration-500">{item.step}</div>
                           <div>
                              <h4 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h4>
                              <p className="text-slate-600 font-medium">{item.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="lg:w-1/2 relative">
                   <div className="relative rounded-[3rem] border-[12px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden aspect-[4/3] group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 z-10"></div>
                      <div className="p-8 bg-slate-800 h-full flex flex-col">
                         <div className="flex gap-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                         </div>
                         <div className="flex-1 bg-white rounded-2xl p-6 shadow-inner animate-pulse">
                            <div className="w-2/3 h-6 bg-slate-100 rounded mb-4"></div>
                            <div className="w-full h-4 bg-slate-50 rounded mb-2"></div>
                            <div className="w-full h-4 bg-slate-50 rounded mb-2"></div>
                            <div className="w-full h-4 bg-slate-50 rounded mb-2"></div>
                            <div className="w-1/2 h-4 bg-slate-50 rounded mb-8"></div>
                            
                            <div className="space-y-4">
                               <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3">
                                  <Sparkles className="h-5 w-5 text-blue-600" />
                                  <div className="flex-1 h-3 bg-blue-200 rounded"></div>
                               </div>
                               <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3">
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                  <div className="flex-1 h-3 bg-green-200 rounded"></div>
                               </div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur shadow-2xl p-6 rounded-3xl border border-white flex items-center gap-4 group-hover:scale-110 transition-transform z-20">
                         <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                            <MousePointer2 className="text-white h-6 w-6" />
                         </div>
                         <span className="text-lg font-black text-slate-900 whitespace-nowrap">Generate Proposal</span>
                      </div>
                   </div>
                   
                   {/* Floating Stats */}
                   <div className="absolute -bottom-10 -left-10 bg-white shadow-2xl p-8 rounded-[2rem] border border-slate-100 z-30 animate-bounce-slow">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                            <TrendingUp className="text-green-600 h-8 w-8" />
                         </div>
                         <div>
                            <div className="text-3xl font-black text-slate-900">84%</div>
                            <div className="text-sm font-bold text-slate-500">Success Rate</div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Case Studies */}
        <section id="case-studies" className="py-32 bg-slate-900 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/10 skew-x-[-20deg] translate-x-[20%]"></div>
           
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-10">
                 <div className="lg:w-2/3">
                    <h2 className="text-blue-400 font-black text-sm uppercase tracking-[0.25em] mb-6">Real Results</h2>
                    <h3 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-tight">Empowering impact-driven teams globally.</h3>
                 </div>
                 <Link href="/dashboard" className="text-blue-400 font-bold text-lg flex items-center gap-2 hover:gap-4 transition-all">
                    View more case studies <ArrowRight className="h-6 w-6" />
                 </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {[
                   {
                     tag: "Green Tech Startup",
                     title: "€2.5M Horizon Europe Innovation Grant",
                     quote: "We were struggling with the complex 100+ page requirements of EU grants. GrantWriter AI synthesized our tech into a perfect proposal in days.",
                     author: "Dr. Elena Rossi",
                     role: "CEO, H2Storage",
                     amount: "€2.5M secured"
                   },
                   {
                     tag: "International NGO",
                     title: "$1.2M USAID Global Health Initiative",
                     quote: "The compliance checker is a lifesaver. It identified missing risk mitigation plans that would have disqualified us immediately.",
                     author: "Marcus Thorne",
                     role: "Director, Global Reach",
                     amount: "$1.2M secured"
                   }
                 ].map((study, idx) => (
                   <div key={idx} className="bg-slate-800/50 backdrop-blur border border-slate-700 p-12 rounded-[3rem] hover:bg-slate-800 transition-colors">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-8">
                         <Award className="h-3 w-3" /> {study.tag}
                      </div>
                      <h4 className="text-3xl font-black mb-8 leading-tight">{study.title}</h4>
                      <p className="text-slate-400 text-lg italic mb-10 leading-relaxed">&ldquo;{study.quote}&rdquo;</p>
                      <div className="flex items-center justify-between border-t border-slate-700 pt-8">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-700"></div>
                            <div>
                               <div className="font-bold">{study.author}</div>
                               <div className="text-xs text-slate-500 font-bold">{study.role}</div>
                            </div>
                         </div>
                         <div className="text-blue-400 font-black text-xl">{study.amount}</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Prominent Pricing & Payment Section */}
        <section id="pricing" className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-blue-600 font-black text-sm uppercase tracking-[0.25em] mb-6">Simple Pricing</h2>
              <h3 className="text-4xl lg:text-6xl font-black text-slate-900 mb-8 tracking-tight leading-tight">Scale your funding.</h3>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">No hidden fees, no consulting markups. Just powerful AI for everyone.</p>
              
              {/* Payment Badge Section */}
              <div className="mt-12 inline-flex flex-wrap justify-center items-center gap-6 p-6 rounded-[2rem] bg-blue-50/50 border border-blue-100">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                  <CreditCard className="h-5 w-5 text-blue-600" /> Pay by Card (Visa/MC)
                </div>
                <div className="hidden sm:block w-px h-8 bg-blue-200"></div>
                <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                  <Bitcoin className="h-6 w-6 text-blue-600" /> Pay with USDT / BTC
                </div>
                <div className="w-full sm:w-auto text-[10px] font-black text-blue-600 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-blue-100">
                  Global Access in 150+ Countries
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  name: "Free",
                  price: "$0",
                  desc: "Perfect for exploring the database.",
                  features: ["1 proposal/month", "5 grant matches/month", "Standard AI Generator", "Email support"],
                  cta: "Get Started Free",
                  highlight: false
                },
                {
                  name: "Pro",
                  price: "$99",
                  desc: "Unlimited access for growing teams.",
                  features: ["Unlimited proposals", "Full global database access", "Advanced Compliance checker", "Word count optimizer", "Priority processing"],
                  cta: "Go Pro Now",
                  highlight: true
                },
                {
                  name: "Organization",
                  price: "$299",
                  desc: "Institutional power for large teams.",
                  features: ["Everything in Pro", "Real-time team collaboration", "API access for integrations", "Success rate analytics", "Dedicated account manager"],
                  cta: "Start Org Plan",
                  highlight: false
                }
              ].map((tier, idx) => (
                <div key={idx} className={`relative p-12 rounded-[3.5rem] border ${tier.highlight ? 'border-blue-600 shadow-2xl shadow-blue-200 ring-8 ring-blue-50' : 'border-slate-200'}`}>
                  {tier.highlight && (
                    <div className="absolute top-0 right-12 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-300">
                      Recommended
                    </div>
                  )}
                  <h4 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{tier.name}</h4>
                  <p className="text-slate-500 text-sm font-bold mb-8 leading-relaxed">{tier.desc}</p>
                  
                  <div className="flex items-baseline gap-2 mb-10">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">{tier.price}</span>
                    <span className="text-slate-400 font-bold">/ month</span>
                  </div>
                  
                  <ul className="space-y-6 mb-12">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex gap-4 text-sm font-semibold text-slate-600 leading-tight">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                           <Check className="h-3.5 w-3.5 text-blue-600 stroke-[4]" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/dashboard" className={`w-full inline-flex items-center justify-center px-8 py-4 rounded-2xl text-lg font-black transition-all ${tier.highlight ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200'}`}>
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global Reach / Trust Section */}
        <section className="py-24 bg-slate-50 border-y border-slate-100 overflow-hidden">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-3 mb-10">
                 <Globe className="h-10 w-10 text-blue-600" />
                 <h2 className="text-4xl font-black text-slate-900 tracking-tight">Built for a Borderless World.</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-4xl mx-auto">
                 <div>
                    <div className="text-4xl font-black text-blue-600 mb-2">150+</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Countries</div>
                 </div>
                 <div>
                    <div className="text-4xl font-black text-blue-600 mb-2">24/7</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">AI Monitoring</div>
                 </div>
                 <div>
                    <div className="text-4xl font-black text-blue-600 mb-2">98%</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Client CSAT</div>
                 </div>
                 <div>
                    <div className="text-4xl font-black text-blue-600 mb-2">$5B+</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Funding Goal</div>
                 </div>
              </div>
           </div>
        </section>

        {/* Final Global CTA */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600 z-[-2]"></div>
          <div className="absolute top-0 right-0 w-[50%] h-full bg-white/5 z-[-1] skew-x-[-15deg]"></div>
          
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-5xl lg:text-7xl font-black text-white mb-10 tracking-tight leading-tight">Stop writing. <br /> Start winning.</h2>
            <p className="text-blue-100 text-xl lg:text-2xl mb-14 font-medium leading-relaxed">Join thousands of researchers and organizations scaling their impact today with the world&apos;s most advanced grant writing engine.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link href="/dashboard" className="px-12 py-6 bg-white text-blue-600 rounded-[2rem] font-black text-2xl hover:bg-blue-50 transition-all shadow-2xl hover:-translate-y-1 active:translate-y-0">Create Your Free Account</Link>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-blue-200 text-sm font-bold uppercase tracking-widest">
               <div className="flex items-center gap-2"><Lock className="h-4 w-4" /> Bank-grade Security</div>
               <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> GDPR Compliant</div>
               <div className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> No Card Required</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
             <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2.5 mb-8">
                   <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <FileText className="text-white h-6 w-6" />
                   </div>
                   <span className="text-2xl font-bold text-slate-900 tracking-tight">GrantWriter AI</span>
                </div>
                <p className="text-slate-500 font-medium max-w-sm mb-10 leading-relaxed">
                   Revolutionizing the $150B grant writing market with high-compliance AI solutions for non-profits, academia, and the green energy sector.
                </p>
                <div className="flex gap-6">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors">
                        <Globe className="h-5 w-5" />
                     </div>
                   ))}
                </div>
             </div>
             <div>
                <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Product</h5>
                <ul className="space-y-4 text-sm font-bold text-slate-500">
                   <li><a href="#" className="hover:text-blue-600 transition-colors">Grant Database</a></li>
                   <li><a href="#" className="hover:text-blue-600 transition-colors">AI Generator</a></li>
                   <li><a href="#" className="hover:text-blue-600 transition-colors">Compliance Checker</a></li>
                   <li><a href="#" className="hover:text-blue-600 transition-colors">Budget Builder</a></li>
                </ul>
             </div>
             <div>
                <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Company</h5>
                <ul className="space-y-4 text-sm font-bold text-slate-500">
                   <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                   <li><a href="#" className="hover:text-blue-600 transition-colors">Global Impact</a></li>
                   <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
                   <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                </ul>
             </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-slate-100">
            <div className="flex gap-10 text-xs font-black text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
              <a href="#" className="hover:text-blue-600">Cookie Policy</a>
            </div>
            <div className="text-xs font-bold text-slate-400">
              © 2026 GrantWriter AI Inc. Operating in 150+ countries. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
