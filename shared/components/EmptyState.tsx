import React, { type ReactNode } from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Items Discovered",
  description = "There are currently no items matching your criteria in our reserve cellar.",
  action,
  icon,
}) => {
  return (
    <div className="bg-white rounded-2xl p-10 text-center max-w-md mx-auto my-8 flex flex-col items-center justify-center border border-[#E8D9CC] shadow-xs">
      <div className="w-14 h-14 rounded-full bg-[#602E31]/10 border border-[#602E31]/20 flex items-center justify-center mb-4 text-[#602E31]">
        {icon || <UtensilsCrossed className="w-7 h-7" />}
      </div>
      <h3 className="font-serif text-xl font-semibold text-[#241416] mb-2">{title}</h3>
      <p className="text-[#7E6568] text-sm leading-relaxed mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
