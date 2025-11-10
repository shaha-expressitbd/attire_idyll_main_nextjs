// app/page.js
import React, { Suspense } from 'react'
import { getProductsServer } from '@/lib/api/serverApi'


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
  const initialProducts = await getProductsServer()

  return (
    <div>
    </div>
  )
}
