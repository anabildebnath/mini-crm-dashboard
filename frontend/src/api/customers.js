import { useState, useEffect } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../api/customers';
import { Dialog } from '@headlessui/react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [tagsFilter, setTagsFilter] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchData = () => {
    setLoading(true);
    getCustomers({ q: query, tags: tagsFilter }).then(res => {
      setCustomers(res.data);
      setLoading(false);
    });
  };

  useEffect(fetchData, [query, tagsFilter]);

  const handleSave = (data) => {
    const action = editing ? updateCustomer(editing.id, data) : createCustomer(data);
    action.then(() => { setModalOpen(false); fetchData(); });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this customer?')) {
      deleteCustomer(id).then(fetchData);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Customers</h1>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >+ New</button>
      </div>
      <div className="flex space-x-2 mb-4">
        <input
          placeholder="Search by name, email or phone"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        {/* Tag filter component placeholder */}
      </div>
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Company</th>
              <th className="p-2">Tags</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center p-4">Loading...</td></tr>
            ) : customers.length ? (
              customers.map(c => (
                <tr key={c.id} className="border-t">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.email}</td>
                  <td className="p-2">{c.phone}</td>
                  <td className="p-2">{c.company}</td>
                  <td className="p-2">{c.tags.join(', ')}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => { setEditing(c); setModalOpen(true); }} className="text-blue-500">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-500">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="text-center p-4">No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <Dialog.Title className="text-xl font-semibold mb-4">
            {editing ? 'Edit Customer' : 'New Customer'}
          </Dialog.Title>
          <CustomerForm initialData={editing} onSave={handleSave} onCancel={() => setModalOpen(false)} />
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}

function CustomerForm({ initialData = {}, onSave, onCancel }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', tags: [] });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="company" placeholder="Company" value={form.company} onChange={handleChange} className="w-full p-2 border rounded" />
      {/* Tag multi-select placeholder */}
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </div>
    </form>
  );
}