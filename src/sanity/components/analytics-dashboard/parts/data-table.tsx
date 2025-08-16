import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import Pagination from './pagination';

interface DataTableProps {
  title: string;
  description: string;
  data: Record<string, unknown>[];
  columns: {
    key: string;
    label: string;
    render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  }[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  description,
  data,
  columns,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(row => {
              // Try to find a unique identifier in the row data
              const uniqueId =
                (
                  row.id ||
                  row.sessionId ||
                  row.timestamp ||
                  row.url ||
                  `row-${Date.now()}-${Math.random()}`
                )?.toString() || `row-${Date.now()}-${Math.random()}`;
              return (
                <TableRow key={uniqueId}>
                  {columns.map(column => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </CardContent>
    </Card>
  );
};

export default DataTable;
