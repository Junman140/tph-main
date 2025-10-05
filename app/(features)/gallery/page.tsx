"use client" 
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Filter, Users, Handshake, Heart } from 'lucide-react';

export default function GalleryPage() {
  const galleryItems = [
    { id: 1, image: "/gallery/CC.jpg", title: "COMMUNION AND FIRST ORDAINED PASTORS THANKSGIVING SERVICE", date: "OCTOBER 5TH", driveLink: "https://drive.google.com/drive/folders/15bdN6m3JhDkeTxHxiFriFFy8kotLS0Yu?usp=sharing"  },
    { id: 2, image: "/gallery/Labourer.jpg", title: "Labourers Servie", date: "September 21st", driveLink: "https://drive.google.com/drive/folders/1pBKjPg997WwdgfCcd3n6uta5625t_J1y?usp=sharing" },
    { id: 3, image: "/gallery/Thanksgiving service.jpg", title: "THANKSGIVING AND ANNIVERSARY SERVICE", date: "September 14th", driveLink: "https://drive.google.com/drive/folders/1XiXlFB1ELRzssXtUE9EEJuJLEgnmMq9t?usp=sharing" }, 
    { id: 4, image: "/gallery/Mega Service 12.jpg", title: "SEPTEMBER 2025 MEGA SERVICE", date: "September 28th", driveLink: "https://drive.google.com/drive/folders/1E4hy9VD-WajZJ2I080B2yhCUsAfTZW7w?usp=sharing"},
    // { id: 5, image: "/gallery/fresh1.jpg", title: "AUGUST COMMUNION SERVICE", date: "August", driveLink: "https://drive.google.com/drive/folders/1uTxPQohX0o5JLythow5Fw2Z49EZIXB85?usp=drive_link" },
    // { id: 6, image: "/gallery/fresh1.jpg", title: "AUGUST COMMUNION SERVICE", date: "August", driveLink: "https://drive.google.com/drive/folders/1b9Ne_HJixcg0Jtq3LgpwVWEjOiK5odHG?usp=drive_link" }, 
    // { id: 7, image: "/gallery/fresh1.jpg", title: "AUGUST COMMUNION SERVICE", date: "August", driveLink: "https://drive.google.com/drive/folders/1b9Ne_HJixcg0Jtq3LgpwVWEjOiK5odHG?usp=drive_link" },
    // { id: 8, image: "/gallery/fresh1.jpg", title: "AUGUST COMMUNION SERVICE", date: "August", driveLink: "https://drive.google.com/drive/folders/1b9Ne_HJixcg0Jtq3LgpwVWEjOiK5odHG?usp=drive_link" },
    // { id: 9, image: "/gallery/fresh1.jpg", title: "AUGUST COMMUNION SERVICE", date: "August", driveLink: "https://drive.google.com/drive/folders/1b9Ne_HJixcg0Jtq3LgpwVWEjOiK5odHG?usp=drive_link" },
    // { id: 10, image: "/gallery/fresh1.jpg", title: "AUGUST COMMUNION SERVICE", date: "August", driveLink: "https://drive.google.com/drive/folders/1b9Ne_HJixcg0Jtq3LgpwVWEjOiK5odHG?usp=drive_link" },
    // { id: 11, image: "/gallery/fresh1.jpg", title: "AUGUST COMMUNION SERVICE", date: "August", driveLink: "https://drive.google.com/drive/folders/1b9Ne_HJixcg0Jtq3LgpwVWEjOiK5odHG?usp=drive_link" },
    // { id: 12, image: "/gallery/fresh1.jpg", title: "AUGUST COMMUNION SERVICE", date: "August", driveLink: "https://drive.google.com/drive/folders/1b9Ne_HJixcg0Jtq3LgpwVWEjOiK5odHG?usp=drive_link" },
  ];

  const involvementItems = [
      { icon: Users, title: "Service pictures", description: "Welcome to TPH gallery, where everything beautiful is found", buttonText: "Fellowship with us today", href: "/#" },
      { icon: Handshake, title: "Partner with us", description: "Collaborate to expand our reach.", buttonText: "Partner with us", href: "https://tph-global.com/donate" },
      { icon: Heart, title: "Donate", description: "Support welfare, and reaching the unreached", buttonText: "Donate", href: "https://tph-global.com//donate" },
  ];

  return (
      <main>
        <div className="max-w-7xl mx-auto">
                    <div className="py-16 text-center md:text-left">
            <h1 className="text-5xl font-bold"> TPH Gallery</h1>
            <p className="text-lg text-gray-400 mt-2">Let the photos speaketh...</p>
          </div>

          <div className="flex justify-between items-center mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="search"
                placeholder="Search..."
                className="bg-background border-none pl-10 w-full rounded-full"
              />
            </div>
            <Button variant="outline" className="bg-background border-none rounded-full">
              <Filter size={16} className="mr-2" />
              Filter
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryItems.map((item) => (
                            <Card key={item.id} className="bg-[#1E1E1E] border border-gray-800 rounded-lg overflow-hidden group flex flex-col">
                <div className="aspect-w-1 aspect-h-1">
                   <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                                <div className="p-4 mt-auto">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.date}</p>
                    </div>
                    <a href={item.driveLink} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-[#1676e49a] text-black rounded-full px-4 py-1 h-auto text-sm hover:bg-slate-950">View</Button>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>

                    <section className="mt-24 mb-16 bg-[#06010ed8] border border-gray-800 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-2">Get Involved</h2>
                <p className="text-gray-400 mb-8">You can be part of this life-changing Community!</p>
                <div className="space-y-6">
                  {involvementItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="bg-[#1676e49a] p-2 rounded-full text-black">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img src="/BREAKFORTH.jpg" alt="Get Involved" className="rounded-lg object-cover" />
              </div>
            </div>
             <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
                {involvementItems.map((item, index) => (
                    <a href={item.href} key={index}>
                        <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-8 py-3">
                            {item.buttonText}
                        </Button>
                    </a>
                ))}
            </div>
          </section>
        </div>
      </main>
  )
}
