import React from 'react';
import useDeviceDetection from '../../hooks/useDeviceDetection';

const MobileOptimizedTable = ({ 
  headers, 
  data, 
  onEdit, 
  onDelete, 
  loading = false,
  emptyMessage = "No data available",
  cardMode = true // Enable card mode on mobile by default
}) => {
  const device = useDeviceDetection();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            {device.isMobile && cardMode ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ) : (
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  // Mobile Card View
  if (device.isMobile && cardMode) {
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div 
            key={item._id || item.id || index}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            {/* Primary info */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {item.title || item.name || item.email || 'Untitled'}
                </h3>
                {item.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center space-x-2 ml-4">
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Secondary info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {item.category && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Category:</span>
                  <span className="ml-1 text-gray-900 dark:text-white">
                    {typeof item.category === 'object' ? item.category.name : item.category}
                  </span>
                </div>
              )}
              {item.status && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Status:</span>
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                    item.status === 'active' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                  }`}>
                    {item.status}
                  </span>
                </div>
              )}
              {item.createdAt && (
                <div className="col-span-2">
                  <span className="text-gray-500 dark:text-gray-400">Created:</span>
                  <span className="ml-1 text-gray-900 dark:text-white">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop Table View
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((item, index) => (
            <tr key={item._id || item.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              {headers.map((header, headerIndex) => {
                const key = header.toLowerCase().replace(/\s+/g, '');
                let value = item[key] || item[header.toLowerCase()] || '';
                
                // Handle special cases
                if (header.toLowerCase().includes('date') && value) {
                  value = new Date(value).toLocaleDateString();
                } else if (header.toLowerCase().includes('category') && typeof value === 'object') {
                  value = value.name || '';
                } else if (header.toLowerCase().includes('status')) {
                  return (
                    <td key={headerIndex} className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        value === 'active' 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                      }`}>
                        {value}
                      </span>
                    </td>
                  );
                }
                
                return (
                  <td key={headerIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {String(value).slice(0, 50)}{String(value).length > 50 ? '...' : ''}
                  </td>
                );
              })}
              
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MobileOptimizedTable;
