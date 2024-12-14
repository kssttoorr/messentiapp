import React from 'react';
import { Star, Trash2, Edit2, UserCircle2, Calendar } from 'lucide-react';
import { Contact } from '../../types/Contact';

interface ContactTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onAddEvent: (contact: Contact) => void;
}

export function ContactTable({
  contacts = [],
  onEdit,
  onDelete,
  onToggleFavorite,
  onAddEvent,
}: ContactTableProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {contact.avatar ? (
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle2 className="h-10 w-10 text-gray-400" />
                  )}
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                    <div className="text-sm text-gray-500">
                      {(contact.events || []).length} events
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{contact.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{contact.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onToggleFavorite(contact.id)}
                    className={`p-2 rounded-full ${
                      contact.favorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-500'
                    }`}
                  >
                    <Star className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onAddEvent(contact)}
                    className="p-2 rounded-full text-green-500 hover:text-green-600"
                  >
                    <Calendar className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onEdit(contact)}
                    className="p-2 rounded-full text-blue-500 hover:text-blue-600"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(contact.id)}
                    className="p-2 rounded-full text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(!contacts || contacts.length === 0) && (
        <div className="text-center py-12">
          <UserCircle2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new contact.</p>
        </div>
      )}
    </div>
  );
}