import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link 
            to="/" 
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </li>
        
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-slate-400" />
            {item.href ? (
              <Link 
                to={item.href}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 font-semibold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
