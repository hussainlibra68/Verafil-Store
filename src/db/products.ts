import { db, withDbRetry } from './index.ts';
import { products } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export interface ProductData {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  longDescription?: string;
  price: number;
  category: string;
  imageUrl: string;
  gallery?: string[]; // at least 4 images
  videos?: string[];  // at least 2 videos
  features?: string[];
  inStock?: boolean;
}

export async function getAllProducts() {
  try {
    const rows = await withDbRetry(() => 
      db.select().from(products).orderBy(desc(products.createdAt))
    );
    return rows.map(r => ({
      ...r,
      gallery: r.gallery ? JSON.parse(r.gallery) : [],
      videos: r.videos ? JSON.parse(r.videos) : [],
      features: r.features ? JSON.parse(r.features) : [],
    }));
  } catch (error) {
    console.error('Failed to get products:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getProductById(id: string) {
  try {
    const rows = await withDbRetry(() =>
      db.select().from(products).where(eq(products.id, id))
    );
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      ...r,
      gallery: r.gallery ? JSON.parse(r.gallery) : [],
      videos: r.videos ? JSON.parse(r.videos) : [],
      features: r.features ? JSON.parse(r.features) : [],
    };
  } catch (error) {
    console.error(`Failed to get product ${id}:`, error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function createProduct(data: ProductData) {
  try {
    const [inserted] = await withDbRetry(() =>
      db.insert(products).values({
        id: data.id,
        name: data.name,
        tagline: data.tagline || '',
        description: data.description,
        longDescription: data.longDescription || data.description,
        price: data.price,
        category: data.category,
        imageUrl: data.imageUrl,
        gallery: JSON.stringify(data.gallery || []),
        videos: JSON.stringify(data.videos || []),
        features: JSON.stringify(data.features || []),
        inStock: data.inStock ?? true,
      }).returning()
    );

    return {
      ...inserted,
      gallery: inserted.gallery ? JSON.parse(inserted.gallery) : [],
      videos: inserted.videos ? JSON.parse(inserted.videos) : [],
      features: inserted.features ? JSON.parse(inserted.features) : [],
    };
  } catch (error) {
    console.error('Failed to create product:', error);
    throw new Error('Failed to create product in database.', { cause: error });
  }
}

export async function updateProduct(id: string, data: Partial<ProductData>) {
  try {
    const updateValues: Record<string, any> = {
      updatedAt: new Date(),
    };
    if (data.name !== undefined) updateValues.name = data.name;
    if (data.tagline !== undefined) updateValues.tagline = data.tagline;
    if (data.description !== undefined) updateValues.description = data.description;
    if (data.longDescription !== undefined) updateValues.longDescription = data.longDescription;
    if (data.price !== undefined) updateValues.price = data.price;
    if (data.category !== undefined) updateValues.category = data.category;
    if (data.imageUrl !== undefined) updateValues.imageUrl = data.imageUrl;
    if (data.gallery !== undefined) updateValues.gallery = JSON.stringify(data.gallery);
    if (data.videos !== undefined) updateValues.videos = JSON.stringify(data.videos);
    if (data.features !== undefined) updateValues.features = JSON.stringify(data.features);
    if (data.inStock !== undefined) updateValues.inStock = data.inStock;

    const [updated] = await withDbRetry(() =>
      db.update(products)
        .set(updateValues)
        .where(eq(products.id, id))
        .returning()
    );

    if (!updated) return null;
    return {
      ...updated,
      gallery: updated.gallery ? JSON.parse(updated.gallery) : [],
      videos: updated.videos ? JSON.parse(updated.videos) : [],
      features: updated.features ? JSON.parse(updated.features) : [],
    };
  } catch (error) {
    console.error(`Failed to update product ${id}:`, error);
    throw new Error('Failed to update product in database.', { cause: error });
  }
}

export async function deleteProduct(id: string) {
  try {
    const [deleted] = await withDbRetry(() =>
      db.delete(products).where(eq(products.id, id)).returning()
    );
    return deleted || null;
  } catch (error) {
    console.error(`Failed to delete product ${id}:`, error);
    throw new Error('Failed to delete product from database.', { cause: error });
  }
}

