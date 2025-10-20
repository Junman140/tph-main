const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');

const prisma = new PrismaClient();

// You'll need to add your Supabase URL and anon key to your .env file
// SUPABASE_URL=your_supabase_url
// SUPABASE_ANON_KEY=your_supabase_anon_key

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Please add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migratePosts() {
  try {
    console.log('Migrating posts...');
    
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*');

    if (error) {
      console.error('Error fetching posts from Supabase:', error);
      return;
    }

    console.log(`Found ${posts.length} posts to migrate`);

    for (const post of posts) {
      try {
        await prisma.post.create({
          data: {
            id: post.id,
            title: post.title,
            content: post.content,
            published: post.published || false,
            slug: post.slug,
            excerpt: post.excerpt || null,
            tags: post.tags || [],
            readingTime: post.reading_time || null,
            authorName: post.author_name || null,
            authorImage: post.author_image || null,
            createdAt: new Date(post.created_at)
          }
        });
        console.log(`Migrated post: ${post.title}`);
      } catch (error) {
        console.error(`Error migrating post ${post.title}:`, error);
      }
    }

    console.log('Posts migration completed');
  } catch (error) {
    console.error('Error in posts migration:', error);
  }
}

async function migrateEventRegistrations() {
  try {
    console.log('Migrating event registrations...');
    
    const { data: registrations, error } = await supabase
      .from('event_registrations')
      .select('*');

    if (error) {
      console.error('Error fetching event registrations from Supabase:', error);
      return;
    }

    console.log(`Found ${registrations.length} event registrations to migrate`);

    for (const registration of registrations) {
      try {
        await prisma.eventRegistration.create({
          data: {
            id: registration.id,
            eventId: registration.event_id,
            fullName: registration.full_name,
            email: registration.email,
            phoneNumber: registration.phone_number,
            location: registration.location,
            notes: registration.notes || null,
            status: registration.status || 'pending',
            createdAt: new Date(registration.created_at)
          }
        });
        console.log(`Migrated registration: ${registration.full_name}`);
      } catch (error) {
        console.error(`Error migrating registration ${registration.full_name}:`, error);
      }
    }

    console.log('Event registrations migration completed');
  } catch (error) {
    console.error('Error in event registrations migration:', error);
  }
}

async function migratePrayers() {
  try {
    console.log('Migrating prayers...');
    
    const { data: prayers, error } = await supabase
      .from('prayers')
      .select('*');

    if (error) {
      console.error('Error fetching prayers from Supabase:', error);
      return;
    }

    console.log(`Found ${prayers.length} prayers to migrate`);

    for (const prayer of prayers) {
      try {
        await prisma.prayer.create({
          data: {
            id: prayer.id,
            title: prayer.title,
            content: prayer.content,
            category: prayer.category,
            isPrivate: prayer.is_private || false,
            status: prayer.status || 'pending',
            answeredAt: prayer.answered_at ? new Date(prayer.answered_at) : null,
            tags: prayer.tags || [],
            prayerCount: prayer.prayer_count || 0,
            supportingVerses: prayer.supporting_verses || [],
            verseReference: prayer.verse_reference || null,
            createdAt: new Date(prayer.created_at)
          }
        });
        console.log(`Migrated prayer: ${prayer.title}`);
      } catch (error) {
        console.error(`Error migrating prayer ${prayer.title}:`, error);
      }
    }

    console.log('Prayers migration completed');
  } catch (error) {
    console.error('Error in prayers migration:', error);
  }
}

async function migrateTestimonies() {
  try {
    console.log('Migrating testimonies...');
    
    const { data: testimonies, error } = await supabase
      .from('testimonies')
      .select('*');

    if (error) {
      console.error('Error fetching testimonies from Supabase:', error);
      return;
    }

    console.log(`Found ${testimonies.length} testimonies to migrate`);

    for (const testimony of testimonies) {
      try {
        await prisma.testimony.create({
          data: {
            id: testimony.id,
            title: testimony.title,
            content: testimony.content,
            category: testimony.category,
            isApproved: testimony.is_approved || false,
            tags: testimony.tags || [],
            createdAt: new Date(testimony.created_at)
          }
        });
        console.log(`Migrated testimony: ${testimony.title}`);
      } catch (error) {
        console.error(`Error migrating testimony ${testimony.title}:`, error);
      }
    }

    console.log('Testimonies migration completed');
  } catch (error) {
    console.error('Error in testimonies migration:', error);
  }
}

async function migrateSubscriptions() {
  try {
    console.log('Migrating subscriptions...');
    
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*');

    if (error) {
      console.error('Error fetching subscriptions from Supabase:', error);
      return;
    }

    console.log(`Found ${subscriptions.length} subscriptions to migrate`);

    for (const subscription of subscriptions) {
      try {
        await prisma.subscription.create({
          data: {
            id: subscription.id,
            email: subscription.email,
            name: subscription.name || null,
            isActive: subscription.is_active !== false, // Default to true
            createdAt: new Date(subscription.created_at)
          }
        });
        console.log(`Migrated subscription: ${subscription.email}`);
      } catch (error) {
        console.error(`Error migrating subscription ${subscription.email}:`, error);
      }
    }

    console.log('Subscriptions migration completed');
  } catch (error) {
    console.error('Error in subscriptions migration:', error);
  }
}

async function main() {
  console.log('Starting Supabase to Prisma migration...');
  
  try {
    await migratePosts();
    await migrateEventRegistrations();
    await migratePrayers();
    await migrateTestimonies();
    await migrateSubscriptions();
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
