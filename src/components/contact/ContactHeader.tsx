import React from 'react';
import { UserPlus, Star, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ContactHeaderProps {
  onAddClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
}

export function ContactHeader({
  onAddClick,
  searchQuery,
  onSearchChange,
  showFavorites,
  onToggleFavorites,
}: ContactHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-64">
            <Input
              label=""
              id="search"
              type="search"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              icon={Search}
            />
          </div>
          <button
            onClick={onToggleFavorites}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
              showFavorites ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Favorites</span>
          </button>
        </div>
        <Button icon={UserPlus} onClick={onAddClick}>
          Add Contact
        </Button>
      </div>
    </div>
  );
}