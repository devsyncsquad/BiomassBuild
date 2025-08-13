'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button
} from '@mui/material';

const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://localhost:7084';
const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [editedEmails, setEditedEmails] = useState({});

  useEffect(() => {
    fetch(`${baseUrl}Company/GetCompanyList`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Adjust token storage if needed
      }
    })
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          //setCompanies(response.data);
          setCompanies(response.result);
        } else {
          console.error('Failed to fetch companies:', response.message);
        }
      })
      .catch(err => console.error('API Error:', err));
  }, []);

  const handleEmailChange = (id, email) => {
    setEditedEmails({ ...editedEmails, [id]: email });
  };

  const handleSave = (id) => {
    const email = editedEmails[id];
    if (!email) return;

    fetch(`${baseUrl}Company/UpdateEmail`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ cId: id, emailAddress: email })
    })
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          setCompanies(prev =>
            prev.map(c => (c.cId === id ? { ...c, emailAddress: email } : c))
          );
        } else {
          console.error('Update failed:', response.message);
        }
      })
      .catch(err => console.error('Update Error:', err));
  };
  const handleEmail = (id) => {
  const email = editedEmails[id];
  if (!email) return;

  fetch(`${baseUrl}Company/SendEmails`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify([
      {
        cId: id,
        emailAddress: email
      }
    ])
  })
    .then(res => res.json())
    .then(response => {
      console.log("Email send response:", response);
    })
    .catch(err => console.error('Email Send Error:', err));
};


  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Company Management
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Company Name</TableCell>
            <TableCell>Email Address</TableCell>
            <TableCell>Save</TableCell>
            <TableCell>Send Email</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {companies.map(company => (
            <TableRow key={company.cId}>
              <TableCell>{company.name}</TableCell>
              <TableCell>
                <TextField
                  size="small"
                  value={editedEmails[company.cId] ?? company.emailAddress ?? ''}
                  onChange={(e) => handleEmailChange(company.cId, e.target.value)}
                  placeholder="Enter email"
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleSave(company.cId)}
                >
                  Save
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleEmail(company.cId)}
                >
                  Email
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default CompanyManagement;
