'use server'

import React from 'react'
import { publicApi } from '@/lib/api/publicApi'
import { makeStore } from '@/lib/store'
import { Product } from '@/types/product'
import MainCategoryPage from './components/MainCategoryPage'
import { div } from 'framer-motion/client'

const createSlug = (name: string): string =>
    name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')

export default async function MainCategoryPageServer({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams?: { [key: string]: string | string[] | undefined }
}) {
    const store = makeStore()

    const page = Number(searchParams?.page) || 1
    const limit = Number(searchParams?.limit) || 20

    try {
        const [businessRes, productsRes] = await Promise.all([
            store.dispatch(publicApi.endpoints.getBusiness.initiate(undefined, { forceRefetch: true })),
            store.dispatch(publicApi.endpoints.getProducts.initiate({ page: 1, limit: 1000 }, { forceRefetch: true })),
        ])

        let business = null
        let mainCategory = null
        let mainCategoryId = null

        if (businessRes.data) {
            const data = Array.isArray(businessRes.data) ? businessRes.data[0] : businessRes.data
            business = data

            if (business?.categories) {
                mainCategory = business.categories.find(
                    (c: any) => createSlug(c.name) === params.slug.toLowerCase()
                )
                if (mainCategory) mainCategoryId = mainCategory._id
            }
        }

        const products: Product[] = Array.isArray(productsRes.data)
            ? JSON.parse(JSON.stringify(productsRes.data))
            : []

        return (
            <div className='mt-10'>  <MainCategoryPage
                business={business}
                initialProducts={products}
                mainCategory={mainCategory}
                mainCategoryId={mainCategoryId}
                page={page}
                limit={limit}
            /></div>
        )
    } catch (err) {
        console.error(err)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Error loading category.</p>
            </div>
        )
    }
}