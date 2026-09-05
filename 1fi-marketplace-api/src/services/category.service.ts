// region Imports

// Import Models
import { CategoryModel } from '@/models/category.model';

// Import Interfaces
import { ICategoryDocument } from '@/interfaces/category.interface';

// endregion

// Fetches all active categories, sorted alphabetically by name
export async function listActive(): Promise<ICategoryDocument[]> {
    return CategoryModel.find({ isActive: true }).sort({ name: 1 });
}
