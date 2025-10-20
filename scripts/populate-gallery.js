const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// The hardcoded gallery data from the original gallery page
const galleryData = [
  {
    title: "COMMUNION AND FIRST ORDAINED PASTORS THANKSGIVING SERVICE",
    imageUrl: "/gallery/CC.jpg",
    description: "Special communion service and ordination ceremony",
    category: "events",
    driveLink: "https://drive.google.com/drive/folders/15bdN6m3JhDkeTxHxiFriFFy8kotLS0Yu?usp=sharing",
    isActive: true,
    sortOrder: 1
  },
  {
    title: "Labourers Service",
    imageUrl: "/gallery/Labourer.jpg",
    description: "Annual labourers appreciation service",
    category: "events",
    driveLink: "https://drive.google.com/drive/folders/1pBKjPg997WwdgfCcd3n6uta5625t_J1y?usp=sharing",
    isActive: true,
    sortOrder: 2
  },
  {
    title: "THANKSGIVING AND ANNIVERSARY SERVICE",
    imageUrl: "/gallery/Thanksgiving service.jpg",
    description: "Church anniversary and thanksgiving celebration",
    category: "events",
    driveLink: "https://drive.google.com/drive/folders/1XiXlFB1ELRzssXtUE9EEJuJLEgnmMq9t?usp=sharing",
    isActive: true,
    sortOrder: 3
  },
  {
    title: "SEPTEMBER 2025 MEGA SERVICE",
    imageUrl: "/gallery/Mega Service 12.jpg",
    description: "Monthly mega service gathering",
    category: "events",
    driveLink: "https://drive.google.com/drive/folders/1E4hy9VD-WajZJ2I080B2yhCUsAfTZW7w?usp=sharing",
    isActive: true,
    sortOrder: 4
  }
];

async function populateGallery() {
  try {
    console.log('Populating gallery with existing data...');
    
    for (const item of galleryData) {
      try {
        const image = await prisma.galleryImage.create({
          data: {
            title: item.title,
            imageUrl: item.imageUrl,
            description: item.description,
            category: item.category,
            driveLink: item.driveLink,
            isActive: item.isActive,
            sortOrder: item.sortOrder,
            altText: item.title
          }
        });
        
        console.log(`Created gallery item: ${image.title}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`Gallery item already exists: ${item.title}`);
        } else {
          console.error(`Error creating gallery item ${item.title}:`, error);
        }
      }
    }
    
    console.log('Gallery population completed successfully!');
  } catch (error) {
    console.error('Error populating gallery:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateGallery();
