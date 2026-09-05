// region Imports

// Import Package
import type { ReactNode } from 'react';

// Import Types
import type { ISpecification } from '@/types/product.types';

// Import Utils
import { cn } from '@/utils/cn';

// endregion

export interface ProductSpecsProps {
    specifications: ISpecification[];
    className?: string;
}

interface SpecGroup {
    group: string;
    specs: ISpecification[];
}

// Groups a flat list of specifications into ordered buckets keyed by each spec's group name
function groupSpecifications(specifications: ISpecification[]): SpecGroup[] {
    const groups: SpecGroup[] = [];
    const groupIndexByName = new Map<string, number>();

    for (const spec of specifications) {
        const existingIndex = groupIndexByName.get(spec.group);

        if (existingIndex === undefined) {
            groupIndexByName.set(spec.group, groups.length);
            groups.push({ group: spec.group, specs: [spec] });
        } else {
            groups[existingIndex].specs.push(spec);
        }
    }

    return groups;
}

// Renders product specifications as grouped label/value tables, one table per group
export function ProductSpecs({ specifications, className }: ProductSpecsProps): ReactNode {
    const groups = groupSpecifications(specifications);

    if (groups.length === 0) {
        return null;
    }

    return (
        <div className={cn('flex flex-col gap-5', className)}>
            {groups.map((group) => (
                <div key={group.group} className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-slate-900">{group.group}</p>
                    <div className="overflow-hidden rounded-xl border border-slate-200">
                        {group.specs.map((spec, index) => (
                            <div
                                key={`${spec.label}-${index}`}
                                className={cn(
                                    'grid grid-cols-2 gap-3 px-3.5 py-2.5 text-sm',
                                    index % 2 === 1 ? 'bg-slate-50' : 'bg-white',
                                )}
                            >
                                <span className="text-slate-500">{spec.label}</span>
                                <span className="font-medium text-slate-900">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
