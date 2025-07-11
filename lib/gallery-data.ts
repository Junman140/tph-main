export interface GalleryItem {
  id: string
  src: string
  alt: string
  description: string
  category: 'featured' | 'ministry' | 'community' | 'worship' | 'events' | 'leadership'
}

export const GALLERY_ITEMS: GalleryItem[] = [
  // Featured/Highlights
  {
    id: "understanding",
    src: "/gallery/understanding.png",
    alt: "Season of Understanding",
    description: "Our current season theme - Understanding God's ways",
    category: "featured"
  },
  {
    id: "understanding2",
    src: "/gallery/understanding2.png",
    alt: "Season of Understanding Banner",
    description: "Embracing wisdom and understanding in our walk with God",
    category: "featured"
  },
  {
    id: "breakforth",
    src: "/gallery/BREAKFORTH.jpg",
    alt: "Break Forth Event",
    description: "Special moments from our Break Forth event",
    category: "events"
  },
  {
    id: "call-for-support",
    src: "/gallery/call for support.jpg",
    alt: "Call for Support",
    description: "Community coming together in support and prayer",
    category: "community"
  },

  // Auditorium/Sanctuary
  {
    id: "aud3",
    src: "/gallery/aud3.jpg",
    alt: "Church Auditorium",
    description: "Our beautiful sanctuary where we gather to worship",
    category: "featured"
  },
  {
    id: "aud2",
    src: "/gallery/aud2.jpg",
    alt: "Church Service",
    description: "Experiencing God's presence together in worship",
    category: "worship"
  },
  {
    id: "aud",
    src: "/gallery/aud.jpg",
    alt: "Main Auditorium",
    description: "The heart of our church - where miracles happen",
    category: "worship"
  },

  // Leadership
  {
    id: "daddy5",
    src: "/gallery/daddy5.jpg",
    alt: "Pastor Leading Worship",
    description: "Spiritual leadership in action",
    category: "leadership"
  },
  {
    id: "daddy4",
    src: "/gallery/daddy4.jpg",
    alt: "Pastor Ministering",
    description: "Delivering God's word with power and authority",
    category: "leadership"
  },
  {
    id: "pst-isiah",
    src: "/gallery/pst-isiah.jpg",
    alt: "Pastor Isaiah",
    description: "Words of wisdom from Pastor Isaiah",
    category: "leadership"
  },
  {
    id: "pst-inem1",
    src: "/gallery/pst-inem1.jpg",
    alt: "Pastor Inem",
    description: "Pastor Inem sharing God's message",
    category: "leadership"
  },
  {
    id: "pst-inem",
    src: "/gallery/pst-inem.jpg",
    alt: "Pastor Inem Ministering",
    description: "Spiritual guidance and leadership",
    category: "leadership"
  },
  {
    id: "caleb",
    src: "/gallery/caleb.jpg",
    alt: "Pastor Caleb",
    description: "Pastor Caleb in ministry",
    category: "leadership"
  },

  // Ministry Teams
  {
    id: "dance",
    src: "/gallery/dance.jpg",
    alt: "Praise Dance",
    description: "Expressing worship through dance ministry",
    category: "ministry"
  },
  {
    id: "dance1",
    src: "/gallery/dance1.jpg",
    alt: "Dance Ministry",
    description: "Moving in the Spirit through dance",
    category: "ministry"
  },
  {
    id: "drama",
    src: "/gallery/drama.jpg",
    alt: "Drama Ministry",
    description: "Creative expressions through our drama ministry",
    category: "ministry"
  },
  {
    id: "media",
    src: "/gallery/media.jpg",
    alt: "Media Team",
    description: "Our dedicated media team in action",
    category: "ministry"
  },
  {
    id: "media1",
    src: "/gallery/media1.jpg",
    alt: "Media Ministry",
    description: "Capturing and sharing God's work",
    category: "ministry"
  },
  {
    id: "media2",
    src: "/gallery/media2.jpg",
    alt: "Media Team Working",
    description: "Technical excellence in ministry",
    category: "ministry"
  },

  // Community Life
  {
    id: "smile",
    src: "/gallery/smile.jpg",
    alt: "Community Joy",
    description: "Sharing joy and fellowship together",
    category: "community"
  },
  {
    id: "lp-favor",
    src: "/gallery/lp-favor.jpg",
    alt: "Sister Favor",
    description: "Sister Favor in ministry",
    category: "community"
  },
  {
    id: "lp-mfon",
    src: "/gallery/lp-mfon.jpg",
    alt: "Sister Mfon",
    description: "Sister Mfon serving in ministry",
    category: "community"
  },
  {
    id: "lp-ofon",
    src: "/gallery/lp-ofon.jpg",
    alt: "Sister Ofon",
    description: "Sister Ofon in worship",
    category: "community"
  },

  // Fresh Series
  {
    id: "fresh1",
    src: "/gallery/fresh1.jpg",
    alt: "Fresh Start",
    description: "New beginnings in Christ",
    category: "worship"
  },
  {
    id: "fresh2",
    src: "/gallery/fresh2.jpg",
    alt: "Fresh Anointing",
    description: "Experiencing fresh anointing",
    category: "worship"
  },
  {
    id: "fresh3",
    src: "/gallery/fresh3.jpg",
    alt: "Fresh Fire",
    description: "Burning with fresh fire for God",
    category: "worship"
  },
  {
    id: "fresh4",
    src: "/gallery/fresh4.jpg",
    alt: "Fresh Grace",
    description: "Walking in fresh grace",
    category: "worship"
  },
  {
    id: "fresh5",
    src: "/gallery/fresh5.jpg",
    alt: "Fresh Power",
    description: "Operating in fresh power",
    category: "worship"
  },
  {
    id: "fresh6",
    src: "/gallery/fresh6.jpg",
    alt: "Fresh Vision",
    description: "Seeing with fresh vision",
    category: "worship"
  },
  {
    id: "fresh7",
    src: "/gallery/fresh7.jpg",
    alt: "Fresh Word",
    description: "Receiving fresh revelation",
    category: "worship"
  },
  {
    id: "fresh8",
    src: "/gallery/fresh8.jpg",
    alt: "Fresh Worship",
    description: "Worshipping with fresh zeal",
    category: "worship"
  },
  {
    id: "fresh9",
    src: "/gallery/fresh9.jpg",
    alt: "Fresh Praise",
    description: "Praising with fresh joy",
    category: "worship"
  },
  {
    id: "fresh10",
    src: "/gallery/fresh10.jpg",
    alt: "Fresh Spirit",
    description: "Moving in fresh Spirit",
    category: "worship"
  },
  {
    id: "fresh11",
    src: "/gallery/fresh11.jpg",
    alt: "Fresh Life",
    description: "Living fresh life in Christ",
    category: "worship"
  },
  {
    id: "fresh12",
    src: "/gallery/fresh12.jpg",
    alt: "Fresh Hope",
    description: "Holding onto fresh hope",
    category: "worship"
  },
  {
    id: "fresh13",
    src: "/gallery/fresh13.jpg",
    alt: "Fresh Moment",
    description: "Powerful worship experience",
    category: "worship"
  }
]

// Helper functions to get items by category
export function getItemsByCategory(category: GalleryItem['category']): GalleryItem[] {
  return GALLERY_ITEMS.filter(item => item.category === category)
}

export function getFeaturedItems(): GalleryItem[] {
  return getItemsByCategory('featured')
}

export function getMinistryItems(): GalleryItem[] {
  return getItemsByCategory('ministry')
}

export function getCommunityItems(): GalleryItem[] {
  return getItemsByCategory('community')
}

export function getWorshipItems(): GalleryItem[] {
  return getItemsByCategory('worship')
}

export function getLeadershipItems(): GalleryItem[] {
  return getItemsByCategory('leadership')
}

export function getEventItems(): GalleryItem[] {
  return getItemsByCategory('events')
}

// Get all items for the main gallery grid
export function getAllGalleryItems(): GalleryItem[] {
  return GALLERY_ITEMS
} 