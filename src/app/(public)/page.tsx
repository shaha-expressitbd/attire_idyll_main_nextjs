// app/page.js
import React from 'react'
import BrandText from '@/components/BrandText'
import HeroSection from '@/components/HeroSection'


export async function generateMetadata() {
  return {
    title: "AttireIdyll - Best Online Shopping Platform",
    description:
      "Discover amazing deals and shop for your favorite products on AttireIdyll.",
    openGraph: {
      title: "AttireIdyll - Best Online Shopping Platform",
      description:
        "Discover amazing deals and shop for your favorite products on AttireIdyll.",
      url: 'https://attireIdyll.com/',
      type: 'website'
    }
  } as const
}

export default async function LandingPage() {


  return (
    <div>
      <HeroSection />
      <BrandText />
    </div>
  )
}
