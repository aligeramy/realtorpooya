import HeroSection from "@/components/hero-section"
import FeaturedListings from "@/components/featured-listings"
import AboutAgent from "@/components/about-agent"
import TestimonialSection from "@/components/testimonial-section"
import SuccessVideoSection from "@/components/success-video-section"
import RealEstateJourney from "@/components/real-estate-journey"
import BlogSection from "@/components/blog-section"
import InteractiveContact from "@/components/interactive-contact"
import SiteFooter from "@/components/site-footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <section id="home">
        <HeroSection />
      </section>
      <section id="listings">
        <FeaturedListings />
      </section>
      <section id="about">
        <AboutAgent />
        <TestimonialSection />
        <SuccessVideoSection />
        <RealEstateJourney />
      </section>
      <section id="resources">
        <BlogSection />
      </section>
      <section id="contact">
        <InteractiveContact />
      </section>
      <SiteFooter />
    </main>
  )
}
