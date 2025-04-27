import React, { useEffect, useState } from 'react';
import { AppSidebar } from '../components/app-sidebar.jsx';
import { SiteHeader } from '../components/site-header.jsx';
import { SidebarInset, SidebarProvider } from '../components/ui/sidebar.jsx';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '../components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../api/customers';

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    tags: [],
  });

  const allTags = ['Lead', 'Prospect', 'Client', 'VIP'];

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  }

  // combined filter: search + tag‐filter
  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.company?.toLowerCase().includes(q);
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => c.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  async function saveCustomer() {
    try {
      if (isEditMode) {
        await updateCustomer(currentCustomer.id, currentCustomer);
      } else {
        await createCustomer(currentCustomer);
      }
      resetForm();
      loadCustomers();
    } catch (err) {
      console.error('Error saving customer:', err);
    }
  }

  async function deleteCust(id) {
    await deleteCustomer(id);
    loadCustomers();
  }

  function editCust(c) {
    setCurrentCustomer(c);
    setIsEditMode(true);
  }

  function resetForm() {
    setCurrentCustomer({
      id: '',
      name: '',
      email: '',
      phone: '',
      company: '',
      tags: [],
    });
    setIsEditMode(false);
  }

  function toggleFilterTag(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-4 flex-1">
          <h1 className="text-2xl font-semibold mb-4">
            Customer Management
          </h1>

          {/* Search box */}
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone or company…"
            className="border p-2 mb-4 w-full rounded"
          />

          {/* Tag‐filter section */}
          <div className="mb-6">
            <h2 className="font-medium mb-2">Filter by Tags:</h2>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleFilterTag(tag)}
                    className={`px-3 py-1 rounded-full border ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add / Edit form */}
          <div className="bg-white p-4 rounded shadow mb-6 w-full md:w-3/4">
            <h2 className="font-semibold mb-4">
              {isEditMode ? 'Edit Customer' : 'Add Customer'}
            </h2>
            {['name', 'email', 'phone', 'company'].map((field) => (
              <div key={field} className="mb-3">
                <label className="block mb-1 capitalize">{field}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={currentCustomer[field] || ''}
                  onChange={(e) =>
                    setCurrentCustomer((p) => ({
                      ...p,
                      [field]: e.target.value,
                    }))
                  }
                  className="border p-2 w-full rounded"
                />
              </div>
            ))}

            {/* Tags selector */}
            <div className="mb-4">
              <label className="block mb-1">Tags</label>
              <Select
                value=""
                onValueChange={(value) => {
                  if (!currentCustomer.tags.includes(value)) {
                    setCurrentCustomer((p) => ({
                      ...p,
                      tags: [...p.tags, value],
                    }));
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select tag…" />
                </SelectTrigger>
                <SelectContent>
                  {allTags
                    .filter((t) => !currentCustomer.tags.includes(t))
                    .map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentCustomer.tags.map((t) => (
                  <span
                    key={t}
                    onClick={() =>
                      setCurrentCustomer((p) => ({
                        ...p,
                        tags: p.tags.filter((x) => x !== t),
                      }))
                    }
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full cursor-pointer text-sm"
                  >
                    {t} ×
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={saveCustomer}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {isEditMode ? 'Save Changes' : 'Add Customer'}
            </button>
          </div>

          {/* Results table */}
          <Table>
            <TableHeader>
              <TableRow>
                {['Name', 'Email', 'Phone', 'Company', 'Tags', 'Actions'].map(
                  (h) => (
                    <TableHead key={h}>{h}</TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>{c.company}</TableCell>
                    <TableCell>{c.tags.join(', ')}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => editCust(c)}
                        className="text-blue-500 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCust(c.id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-600">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
