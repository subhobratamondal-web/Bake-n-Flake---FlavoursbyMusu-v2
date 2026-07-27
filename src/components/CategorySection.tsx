import React from 'react';
import * as Icons from 'lucide-react';
import { FAQCategory, Language } from '../types';
import { FAQItem } from './FAQItem';
import { HelpCircle } from 'lucide-react';

interface CategorySectionProps {
  category: FAQCategory;
  language: Language;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ category, language }) => {
  return (
    <div className="space-y-4">
      {category.faqs.map((faq) => (
        <FAQItem key={faq.id} faq={faq} language={language} />
      ))}
    </div>
  );
};
