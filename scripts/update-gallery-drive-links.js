const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Drive links mapping for existing gallery items
const driveLinksMap = {
  "COMMUNION AND FIRST ORDAINED PASTORS THANKSGIVING SERVICE": "https://drive.google.com/drive/folders/15bdN6m3JhDkeTxHxiFriFFy8kotLS0Yu?usp=sharing",
  "Labourers Service": "https://drive.google.com/drive/folders/1pBKjPg997WwdgfCcd3n6uta5625t_J1y?usp=sharing",
  "THANKSGIVING AND ANNIVERSARY SERVICE": "https://drive.google.com/drive/folders/1XiXlFB1ELRzssXtUE9EEJuJLEgnmMq9t?usp=sharing",
  "SEPTEMBER 2025 MEGA SERVICE": "https://drive.google.com/drive/folders/1E4hy9VD-WajZJ2I080B2yhCUsAfTZW7w?usp=sharing"
};

async function updateDriveLinks() {
  try {
    console.log('Updating drive links for existing gallery items...');
    
    for (const [title, driveLink] of Object.entries(driveLinksMap)) {
      try {
        const updated = await prisma.galleryImage.updateMany({
          where: { title },
          data: { driveLink }
        });
        
        if (updated.count > 0) {
          console.log(`Updated drive link for: ${title}`);
        } else {
          console.log(`No item found with title: ${title}`);
        }
      } catch (error) {
        console.error(`Error updating ${title}:`, error);
      }
    }
    
    console.log('Drive links update completed!');
  } catch (error) {
    console.error('Error updating drive links:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateDriveLinks();
