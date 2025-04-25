import React, { useState, useEffect } from 'react';
import CustomerList from '../components/CustomerList';
import AddCustomerForm from '../components/AddCustomerForm';
import { fetchCustomers, deleteCustomer } from '../api/customers';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  
  useEffect(() => {
    const loadCustomers = async () => {
      const customersData = await fetchCustomers();
      setCustomers(customersData);
    };
    loadCustomers();
  }, []);
  
  const handleDelete = async (id) => {
    await deleteCustomer(id);
    setCustomers(customers.filter(customer => customer.id !== id));
  };

  return (
    <div>
      <h1>Customers</h1>
      <AddCustomerForm setCustomers={setCustomers} />
      <CustomerList customers={customers} onDelete={handleDelete} />
    </div>
  );
};

export default Customers;
