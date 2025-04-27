/* File: src/pages/Customers.jsx */
import React, { useState, useEffect } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../api/customers';
import { Dialog } from '@headlessui/react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchData = () => {
    setLoading(true);
    getCustomers({ q: query })
      .then(res => setCustomers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, [query]);

  const handleSave = data => {
    (editing ? updateCustomer(editing.id,data) : createCustomer(data))
      .then(()=>{ setModalOpen(false); fetchData(); });
  };
  const handleDelete = id=>{ if(window.confirm('Delete?')) deleteCustomer(id).then(fetchData); };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl">Customers</h1>
        <button onClick={()=>{setEditing(null);setModalOpen(true)}} className="bg-blue-600 text-white px-4 py-2 rounded">+ New</button>
      </div>
      <input placeholder="Search..." value={query} onChange={e=>setQuery(e.target.value)} className="w-full p-2 mb-4 border rounded"/>
      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-100"><tr><th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Tags</th><th>Actions</th></tr></thead>
        <tbody>
          {loading? <tr><td colSpan="6" className="p-4 text-center">Loading...</td></tr> :
            customers.length ? customers.map(c=>(
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.phone}</td>
                <td className="p-2">{c.company}</td>
                <td className="p-2">{c.tags?.join(', ')}</td>
                <td className="p-2 space-x-2">
                  <button onClick={()=>{setEditing(c);setModalOpen(true)}} className="text-blue-500">Edit</button>
                  <button onClick={()=>handleDelete(c.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            )) : <tr><td colSpan="6" className="p-4 text-center">No customers found</td></tr>
          }
        </tbody>
      </table>
      <Dialog open={modalOpen} onClose={()=>setModalOpen(false)} className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <Dialog.Title className="text-xl mb-4">{editing? 'Edit Customer':'New Customer'}</Dialog.Title>
          <CustomerForm initialData={editing} onSave={handleSave} onCancel={()=>setModalOpen(false)} />
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
function CustomerForm({ initialData={}, onSave, onCancel }) {
  const [form,setForm]=useState(initialData||{name:'',email:'',phone:'',company:'',tags:[]});
  useEffect(()=>{if(initialData)setForm(initialData)},[initialData]);
  const handleChange=e=>setForm({...form,[e.target.name]:e.target.value});
  return(
    <form onSubmit={e=>{e.preventDefault();onSave(form)}} className="space-y-4">
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="w-full p-2 border rounded" />
      <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required className="w-full p-2 border rounded" />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required className="w-full p-2 border rounded" />
      <input name="company" placeholder="Company" value={form.company} onChange={handleChange} className="w-full p-2 border rounded" />
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </div>
    </form>
  );
}