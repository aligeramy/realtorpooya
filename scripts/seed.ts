import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample properties
  const property1 = await prisma.property.create({
    data: {
      title: 'Luxury Waterfront Penthouse',
      address: '88 Harbour Street',
      city: 'Toronto',
      province: 'ON',
      postal_code: 'M5J 2G2',
      property_type: 'CONDO',
      price: 4800000,
      bedrooms: 3,
      bathrooms: 3.5,
      square_feet: 2800,
      year_built: 2018,
      status: 'FOR_SALE',
      featured: true,
      description: 'Exceptional penthouse offering unparalleled luxury and breathtaking panoramic views of Lake Ontario and the Toronto skyline. This magnificent 2,800 square foot residence features floor-to-ceiling windows, premium finishes throughout, and an expansive private terrace perfect for entertaining.',
      mls_id: 'C5123456',
      agent_owner_id: 'pooya-pirayesh',
      listing_date: new Date('2024-01-15'),
      hero_image: '/properties/1/hero.jpg',
      
      images: {
        create: Array.from({ length: 15 }, (_, i) => ({
          url: `/properties/1/${i + 1}.jpg`,
          alt_text: `Property image ${i + 1}`,
          order: i,
          is_hero: i === 0,
        }))
      },
      
      features: {
        create: [
          { name: 'Panoramic lake and city views' },
          { name: 'Floor-to-ceiling windows' },
          { name: 'Private elevator access' },
          { name: 'Gourmet kitchen with premium appliances' },
          { name: 'Master suite with walk-in closet' },
          { name: 'Spa-like ensuite bathroom' },
          { name: 'Private terrace with outdoor kitchen' },
          { name: 'Concierge services' },
          { name: 'Fitness center and pool access' },
          { name: 'Prime waterfront location' },
        ]
      },
      
      tags: {
        create: [
          { name: 'Luxury' },
          { name: 'Waterfront' },
          { name: 'Downtown' },
          { name: 'Penthouse' },
        ]
      }
    }
  })

  const property2 = await prisma.property.create({
    data: {
      title: 'Modern Executive Townhouse',
      address: '45 Forest Hill Road',
      city: 'Toronto',
      province: 'ON',
      postal_code: 'M4V 2L2',
      property_type: 'TOWNHOUSE',
      price: 3500000,
      bedrooms: 4,
      bathrooms: 4.5,
      square_feet: 3200,
      year_built: 2020,
      status: 'FOR_SALE',
      featured: true,
      description: 'Stunning executive townhouse in prestigious Forest Hill featuring contemporary design, premium finishes, and sophisticated living spaces. This 3,200 square foot home offers the perfect blend of luxury and functionality for modern family living.',
      mls_id: 'C5234567',
      agent_owner_id: 'pooya-pirayesh',
      listing_date: new Date('2024-01-20'),
      hero_image: '/properties/2/hero.jpg',
      
      images: {
        create: Array.from({ length: 30 }, (_, i) => ({
          url: `/properties/2/${i + 1}.jpg`,
          alt_text: `Property image ${i + 1}`,
          order: i,
          is_hero: i === 0,
        }))
      },
      
      features: {
        create: [
          { name: 'Contemporary open-concept design' },
          { name: 'Gourmet kitchen with waterfall island' },
          { name: 'Hardwood floors throughout' },
          { name: 'Master suite with private balcony' },
          { name: 'Finished basement with recreation room' },
          { name: 'Private garden and patio' },
          { name: 'Attached two-car garage' },
          { name: 'Smart home technology' },
          { name: 'Walking distance to top schools' },
          { name: 'Close to subway and amenities' },
        ]
      },
      
      tags: {
        create: [
          { name: 'Executive' },
          { name: 'Forest Hill' },
          { name: 'Family Home' },
          { name: 'Modern' },
        ]
      }
    }
  })

  const property3 = await prisma.property.create({
    data: {
      title: 'Heritage Mansion Estate',
      address: '123 Rosedale Valley Road',
      city: 'Toronto',
      province: 'ON',
      postal_code: 'M4W 2P1',
      property_type: 'HOUSE',
      price: 7200000,
      bedrooms: 6,
      bathrooms: 7,
      square_feet: 6500,
      year_built: 1925,
      status: 'FOR_SALE',
      featured: false,
      description: 'Magnificent heritage mansion estate offering timeless elegance and modern luxury. This exceptional 6,500 square foot residence sits on a private ravine lot in prestigious Rosedale, featuring original architectural details beautifully preserved and enhanced with contemporary amenities.',
      mls_id: 'C5345678',
      agent_owner_id: 'pooya-pirayesh',
      listing_date: new Date('2024-01-25'),
      hero_image: '/placeholder.jpg',
      
      images: {
        create: [
          {
            url: '/placeholder.jpg',
            alt_text: 'Heritage mansion exterior',
            order: 0,
            is_hero: true,
          }
        ]
      },
      
      features: {
        create: [
          { name: 'Historic heritage designation' },
          { name: 'Private ravine setting' },
          { name: 'Original architectural details' },
          { name: 'Gourmet chef\'s kitchen' },
          { name: 'Grand formal dining room' },
          { name: 'Library with built-in shelving' },
          { name: 'Master suite with sitting area' },
          { name: 'Wine cellar' },
          { name: 'Manicured gardens' },
          { name: 'Three-car garage' },
        ]
      },
      
      tags: {
        create: [
          { name: 'Heritage' },
          { name: 'Rosedale' },
          { name: 'Estate' },
          { name: 'Mansion' },
        ]
      }
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log(`Created properties:`)
  console.log(`- ${property1.title} (${property1.id})`)
  console.log(`- ${property2.title} (${property2.id})`)
  console.log(`- ${property3.title} (${property3.id})`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 