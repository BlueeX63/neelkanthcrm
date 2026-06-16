"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Image as ImageIcon, Pencil, Download } from "lucide-react";
import Link from "next/link";
import Select from "./Select";
import ImageGalleryModal from "./ImageGalleryModal";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  title?: string;
  searchPlaceholder?: string;
  editPath?: string;
  getRowClass?: (row: any) => string;
  onDownload?: (row: any) => void;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export default function DataTable({ columns, data, title, searchPlaceholder = "Search records...", editPath, getRowClass, onDownload, selectable, selectedRows = [], onSelectionChange }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [galleryImages, setGalleryImages] = useState<string[] | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    const lowerTerm = searchTerm.toLowerCase();
    return columns.some((col) => {
      const val = row[col.key];
      if (val === null || val === undefined) return false;
      return String(val).toLowerCase().includes(lowerTerm);
    });
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getPaginationGroup = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full"
    >
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {title && <h2 className="text-xl font-semibold text-gray-900 tracking-tight">{title}</h2>}

        <div className="flex items-center gap-3 ml-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9 pr-4 py-2 w-64 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {selectable && (
                <th className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 w-[40px]">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                    checked={paginatedData.length > 0 && paginatedData.every(row => selectedRows.includes(row.id))}
                    onChange={(e) => {
                      if (!onSelectionChange) return;
                      if (e.target.checked) {
                        const newSelected = new Set([...selectedRows, ...paginatedData.map(r => r.id)]);
                        onSelectionChange(Array.from(newSelected));
                      } else {
                        const pageIds = paginatedData.map(r => r.id);
                        onSelectionChange(selectedRows.filter(id => !pageIds.includes(id)));
                      }
                    }}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  <div className="flex items-center gap-2 cursor-pointer group hover:text-gray-900 transition-colors">
                    {col.label}
                    {col.sortable && (
                      <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.map((row, i) => (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                key={row.id || i}
                className={`transition-colors group cursor-default ${getRowClass ? getRowClass(row) : 'hover:bg-gray-50/50'}`}
              >
                {selectable && (
                  <td className="px-6 py-4 border-b border-gray-50" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                      checked={selectedRows.includes(row.id)}
                      onChange={(e) => {
                        if (!onSelectionChange) return;
                        if (e.target.checked) {
                          onSelectionChange([...selectedRows, row.id]);
                        } else {
                          onSelectionChange(selectedRows.filter(id => id !== row.id));
                        }
                      }}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap border-b border-gray-50">
                    {col.render ? col.render(row) : col.key === "action" ? (
                      <div className="flex items-center gap-2">
                        {editPath ? (
                          <Link href={`${editPath}/${row.id}`} className="inline-flex items-center justify-center p-2 rounded-md bg-gray-50 text-gray-500 hover:text-brand-600 hover:bg-brand-50 border border-gray-200 hover:border-brand-200 transition-colors cursor-pointer group" title="Edit">
                            <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </Link>
                        ) : (
                          <button className="inline-flex items-center justify-center p-2 rounded-md bg-gray-50 text-gray-500 hover:text-brand-600 hover:bg-brand-50 border border-gray-200 hover:border-brand-200 transition-colors cursor-pointer group" title="Edit">
                            <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                        )}
                        {onDownload && (
                          <button onClick={() => onDownload(row)} className="inline-flex items-center justify-center p-2 rounded-md bg-gray-50 text-gray-500 hover:text-brand-600 hover:bg-brand-50 border border-gray-200 hover:border-brand-200 transition-colors cursor-pointer group" title="Download">
                            <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                        )}
                      </div>
                    ) : col.key === "photo" ? (
                      (() => {
                        // Extract all photo URLs from the row
                        const photos = [row.photo_1, row.photo_2, row.photo_3, row.photo_4].filter(Boolean);
                        // Fallback if they only have the old 'photo' field
                        if (photos.length === 0 && row.photo && row.photo !== "-") {
                          photos.push(row.photo);
                        }

                        if (photos.length === 0) {
                          return <span className="text-gray-400 text-xs font-medium italic">No Image</span>;
                        }

                        return (
                          <div
                            className="flex items-center -space-x-3 cursor-pointer group/photos"
                            onClick={(e) => {
                              e.stopPropagation();
                              setGalleryImages(photos);
                            }}
                          >
                            {photos.slice(0, 3).map((p, i) => (
                              <div
                                key={i}
                                className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-100 relative shadow-sm transition-transform duration-300 group-hover/photos:scale-105"
                                style={{ zIndex: 10 - i }}
                              >
                                <img src={p} alt={`Order Photo ${i + 1}`} className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {photos.length > 3 && (
                              <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-800 text-white flex items-center justify-center text-xs font-bold relative z-0 shadow-sm">
                                +{photos.length - 3}
                              </div>
                            )}
                          </div>
                        );
                      })()
                    ) : col.key === "status" ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${row[col.key] === "Active" || row[col.key] === "Delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" :
                          row[col.key] === "Inactive" || row[col.key] === "Cancelled" ? "bg-rose-50 text-rose-700 border-rose-200/50" :
                            row[col.key] === "Pending" || row[col.key] === "Order Confirmed" ? "bg-amber-50 text-amber-700 border-amber-200/50" :
                              row[col.key] === "Assigned Karigar" || row[col.key] === "Received from Karigar" ? "bg-blue-50 text-blue-700 border-blue-200/50" :
                                "bg-gray-50 text-gray-700 border-gray-200/50"
                        }`}>
                        {row[col.key]}
                      </span>
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 bg-gray-50/30">
        <div className="flex items-center gap-3">
          <span>
            Showing {filteredData.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
            {searchTerm && data.length !== filteredData.length ? ` (filtered from ${data.length} total)` : ""}
          </span>
          <Select
            value={String(itemsPerPage)}
            onChange={(val) => setItemsPerPage(Number(val))}
            options={[
              { value: "10", label: "10 per page" },
              { value: "30", label: "30 per page" },
              { value: "50", label: "50 per page" }
            ]}
            menuPosition="top"
            className="w-[120px]"
            buttonClassName="w-full flex items-center justify-between border border-gray-200 rounded-md px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm h-8"
          />
        </div>

        {filteredData.length > itemsPerPage && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1">
              {getPaginationGroup().map((page, i) => (
                <button
                  key={i}
                  disabled={page === "..."}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium transition-colors ${page === currentPage
                      ? "bg-black text-white shadow-sm"
                      : page === "..."
                        ? "text-gray-400 cursor-default"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {galleryImages && (
        <ImageGalleryModal
          images={galleryImages}
          onClose={() => setGalleryImages(null)}
        />
      )}
    </motion.div>
  );
}
