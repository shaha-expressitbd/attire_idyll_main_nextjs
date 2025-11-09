# attireIdyll

A modern e-commerce application built with Next.js, featuring a responsive design, dynamic product listings, and a smooth user experience.

## Features

- E-commerce platform with product catalog and individual product pages
- Product search and filtering
- Shopping cart and wishlist functionality with persistent state
- User authentication and business profile management
- Checkout process with delivery information and payment integration
- Payment gateways: bKash (mobile wallet) and SSLCommerz (online payment)
- Flash deals, campaigns, new arrivals, and pre-order functionality
- Video content integration (YouTube shorts, video gallery)
- Responsive design with theme support (light/dark mode)
- Notification system and recently viewed products
- Support pages (privacy policy, terms of service, shipping info, support)
- Admin/business features with sidebar navigation and menu management

## Tech Stack

- **Framework**: Next.js 15.3.2
- **Frontend**: React 19.0.0, TypeScript 5.8.3
- **State Management**: Redux Toolkit 2.8.2, Redux Persist 6.0.0
- **Styling**: Tailwind CSS 3.4.17, Tailwind Merge 3.3.0, PostCSS
- **UI/Animations**: Framer Motion 12.23.12, Swiper 11.2.8, React Icons 5.4.0
- **Utilities**: Lodash 4.17.21, UUID 11.1.0, Sonner 2.0.5
- **Testing**: Vitest 3.1.4, Playwright 1.52.0
- **Development**: ESLint 9, Cross-Env 7.0.3, Bundle Analyzer

## Prerequisites

- Node.js (version 22 or higher recommended)
- npm or yarn package manager
- Docker (for containerized deployment)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd attireIdyll
   ```

2. Install dependencies:

   ### For Development

   Use `npm install` to install all dependencies including devDependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

   ### For Production

   Use `npm ci --omit=dev` or `npm install --omit=dev` to install only production dependencies, excluding devDependencies:

   ```bash
   npm ci --omit=dev
   # or
   npm install --omit=dev
   ```

3. Set up environment variables (see Environment Variables section).

## Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

- `NEXT_PUBLIC_SITE_URL`: Base URL for the site (e.g., `http://localhost:3000`)
- `NEXT_PUBLIC_API_BASE_URL`: Backend API endpoint (e.g., `https://public.calquick.app/v2/api`)
- `NEXT_PUBLIC_OWNER_ID`: Owner identifier (e.g., `682ad002c20c6404b3e2a884`)
- `NEXT_PUBLIC_BUSINESS_ID`: Business identifier (e.g., `682ad06cc20c6404b3e2a898`)
- `NEXT_PUBLIC_IMAGE_URL`: CDN URL for image files (e.g., `https://cloudecalquick.xyz/v2/api/files`)
- `NEXT_PUBLIC_VIDEO_URL`: CDN URL for video files (e.g., `https://cloudecalquick.xyz/v2/api/files`)
- `NEXT_PUBLIC_IA_BASE_URL`: IA service URL (e.g., `https://bikobazaar.xyz/ia`)
- `SSLCOMMERZ_STORE_ID`: SSLCommerz store ID
- `SSLCOMMERZ_STORE_PASSWORD`: SSLCommerz store password
- `SSLCOMMERZ_SUCCESS_URL`: SSLCommerz success callback URL
- `SSLCOMMERZ_FAIL_URL`: SSLCommerz failure callback URL
- `SSLCOMMERZ_CANCEL_URL`: SSLCommerz cancel callback URL
- `SSLCOMMERZ_INIT_URL`: SSLCommerz initialization URL
- `SSLCOMMERZ_IS_LIVE`: SSLCommerz live/sandbox mode (true/false)
- `ALLOWED_HOSTS`: Comma-separated list of allowed host domains
- `NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION`: Facebook domain verification code (optional)
- `NEXT_PUBLIC_GTM_ID`: Google Tag Manager ID (optional)
- `NEXT_PUBLIC_TAG_SERVER`: Tag server URL (optional)

## Build Instructions

To build the application for production:

```bash
npm run build
```

## Run Instructions

### Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production

To start the production server:

```bash
npm start
```

## Docker Build Instructions

To build the Docker image:

```bash
docker build -t attireIdyll .
```

## Docker Run Instructions

To run the containerized application:

```bash
docker run -p 3000:3000 attireIdyll
```

The application will be accessible at `http://localhost:3000`.

## Available Scripts

- `npm run dev`: Start the development server with Turbopack
- `npm run debug`: Start the development server in debug mode with Turbopack
- `npm run build`: Build the application for production
- `npm start`: Start the production server
- `npm run lint`: Run ESLint for code linting
- `npm run build:tokens`: Build design tokens using Style Dictionary
- `npm run analyze`: Build the application with bundle analysis enabled

## Project Structure

- `src/`: Source code directory
  - `app/`: Next.js app router pages and layouts
  - `components/`: Reusable UI components
  - `config/`: Configuration files
  - `hooks/`: Custom React hooks
  - `lib/`: Library utilities and providers
  - `utils/`: Utility functions
- `public/`: Static assets (images, fonts, etc.)
- `Dockerfile`: Docker build configuration
- `package.json`: Dependencies and scripts

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
