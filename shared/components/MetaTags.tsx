import React, { useEffect } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title = "Tronx — Good Food Brighter Moods",
  description = "A premium dining experience crafted with passion, fresh ingredients, and unforgettable flavors.",
}) => {
  useEffect(() => {
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};
