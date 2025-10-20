const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// The gallery data with drive links
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

async function recreateGallery() {
  try {
    console.log('Deleting existing gallery items...');
    
    // Delete all existing gallery items
    await prisma.galleryImage.deleteMany({});
    
    console.log('Creating new gallery items with drive links...');
    
    for (const item of galleryData) {
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
    }
    
    console.log('Gallery recreation completed successfully!');
  } catch (error) {
    console.error('Error recreating gallery:', error);
  } finally {
    await prisma.$disconnect();
  }
}

recreateGallery();
