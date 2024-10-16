// app/settings/page.tsx
import { DataTable } from '@/components/DataTable';
import Title from '@/components/Title';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

// Define the Setting type
type Setting = {
  category: string;
  value: string;
};

// Example data for the settings
const data: Setting[] = [
  { category: "Site Name", value: "My Awesome Site" },
  { category: "Admin Email", value: "admin@example.com" },
  { category: "Default Language", value: "English" },
  { category: "Time Zone", value: "UTC" },
  { category: "Currency", value: "USD" },
  { category: "Maintenance Mode", value: "Off" },
  { category: "Theme", value: "Light" },
  { category: "Max Upload Size", value: "10MB" },
  { category: "Auto Backup", value: "Enabled" },
  { category: "Session Timeout", value: "30 minutes" },
  { category: "User Registration", value: "Open" },
  { category: "Google Analytics ID", value: "UA-XXXXXX-X" },
  { category: "SMTP Server", value: "smtp.example.com" },
  { category: "SMTP Port", value: "587" },
  { category: "Email Encryption", value: "TLS" },
];

// Define the columns for the table
const columns: ColumnDef<Setting>[] = [
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
];

// Create the SettingsPage component
const SettingsPage: React.FC = () => {
  return (
    <div className='flex flex-col gap-5 w-[85vw] pt-16 px-10'>
      <Title title="Settings" />
      <DataTable columns={columns} data={data} />
    </div>
  );
};

// Export the SettingsPage as default
export default SettingsPage;

// Optionally, export page metadata for Next.js if needed
export const metadata = {
  title: 'Settings',
  description: 'Manage application settings.',
};
