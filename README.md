# FastCart Admin Dashboard

A modern, fully animated admin dashboard for a fast-delivery grocery app (Blinkit-style for Egypt) built with Next.js, MongoDB, and Framer Motion.

## Features

- **Product Management**: Add, edit, delete, and search products with real-time MongoDB sync
- **Supplier Analytics**: Track supplier performance, margins, and pricing analysis
- **User Recommendations**: Manage customer product suggestions and feedback
- **Real-time Dashboard**: KPI cards, charts, and inventory analytics
- **Smooth Animations**: Framer Motion animations throughout the UI
- **Responsive Design**: Mobile-first design that works on all devices
- **MongoDB Integration**: Uses MongoDB client promise pattern for reliable connections

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Animations**: Framer Motion
- **Database**: MongoDB with native client (no ORM)
- **Charts**: Recharts
- **Icons**: Lucide React

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grocery_admin?retryWrites=true&w=majority
\`\`\`

Get your MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

All required dependencies are already in `package.json`:
- `mongodb` - MongoDB client
- `framer-motion` - Animations
- `recharts` - Charts
- `next` - Framework
- `tailwindcss` - Styling

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Database Setup

The MongoDB database will be automatically created when you first run the app. Collections created:
- `products` - Product inventory
- `recommendations` - User recommendations

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/[id]` - Get a specific product
- `PUT /api/products/[id]` - Update a product
- `DELETE /api/products/[id]` - Delete a product

### Recommendations

- `GET /api/recommendations` - Get all recommendations
- `POST /api/recommendations` - Create a new recommendation
- `DELETE /api/recommendations/[id]` - Delete a recommendation

## Project Structure

\`\`\`
app/
├── api/
│   ├── products/
│   │   ├── route.ts          # GET/POST products
│   │   └── [id]/route.ts     # GET/PUT/DELETE specific product
│   └── recommendations/
│       ├── route.ts          # GET/POST recommendations
│       └── [id]/route.ts     # DELETE specific recommendation
├── layout.tsx                # Root layout
├── page.tsx                  # Home page
└── globals.css               # Global styles

components/
├── dashboard.tsx             # Main dashboard with navigation
├── overview.tsx              # Dashboard overview with KPIs
├── product-management.tsx    # Product CRUD interface
├── supplier-analytics.tsx    # Supplier metrics and charts
└── recommendations.tsx       # User recommendations view

lib/
├── mongodb.ts                # MongoDB connection (clientPromise)
├── db.ts                     # Database operations
└── store.ts                  # Zustand store (legacy, can be removed)
\`\`\`

## Key Features Explained

### MongoDB Connection Pattern

Uses the `clientPromise` pattern for reliable MongoDB connections:

\`\`\`typescript
// lib/mongodb.ts
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // Reuse connection in development
  globalWithMongo._mongoClientPromise = client.connect()
}
\`\`\`

### API Routes

All API routes use the MongoDB client to perform CRUD operations:

\`\`\`typescript
// app/api/products/route.ts
export async function GET() {
  const products = await getProducts()
  return NextResponse.json(products)
}
\`\`\`

### Animations

Components use Framer Motion for smooth transitions:

\`\`\`typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  Content
</motion.div>
\`\`\`

## Product Schema

\`\`\`typescript
interface Product {
  _id: ObjectId
  name: string
  buy_cost: number
  sell_cost: number
  quantity_on_hand: number
  supplier: string
  category: string
  sku: string
  created_at: Date
  updated_at: Date
}
\`\`\`

## Recommendation Schema

\`\`\`typescript
interface Recommendation {
  _id: ObjectId
  user_name: string
  product_suggestion: string
  message: string
  created_at: Date
}
\`\`\`

## Performance Optimizations

- Server-side data fetching with client-side caching
- Optimized MongoDB queries with proper indexing
- Lazy loading of components
- Efficient animations with Framer Motion
- Responsive images and assets

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add `MONGODB_URI` to environment variables
4. Deploy

\`\`\`bash
vercel env add MONGODB_URI
vercel deploy
\`\`\`

### Deploy to Other Platforms

Ensure your platform supports:
- Node.js 18+
- Environment variables
- MongoDB connectivity

## Troubleshooting

### MongoDB Connection Issues

- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist includes your server
- Ensure database user has proper permissions

### API Errors

- Check browser console for error messages
- Verify MongoDB collections exist
- Check API route logs in terminal

### Animation Performance

- Reduce animation complexity on low-end devices
- Use `will-change` CSS property sparingly
- Profile with Chrome DevTools Performance tab

## Future Enhancements

- User authentication and role-based access
- Real-time updates with WebSockets
- Advanced filtering and sorting
- Bulk operations
- Export to CSV/Excel
- Mobile app
- Push notifications

## License

MIT

## Support

For issues or questions, please open an issue on GitHub or contact support.
\`\`\`

```env.example file=".env.example"
# MongoDB Connection String
# Get this from MongoDB Atlas: https://www.mongodb.com/cloud/atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grocery_admin?retryWrites=true&w=majority
