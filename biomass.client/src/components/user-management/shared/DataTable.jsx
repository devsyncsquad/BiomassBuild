import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";

const DataTable = ({
  columns,
  rows,
  renderRow,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [25, 50, 100],
  size = "small",
}) => {
  const pagedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <TableContainer>
        <Table size={size}>
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell
                  key={idx}
                  sx={{ fontWeight: 600, color: "primary.main" }}
                  padding={col.padding || "normal"}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  No data
                </TableCell>
              </TableRow>
            ) : (
              pagedRows.map(renderRow)
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        count={rows.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={rowsPerPageOptions}
        sx={{
          "& .MuiTablePagination-selectIcon": { color: "primary.main" },
          "& .MuiTablePagination-select": { color: "primary.main" },
          "& .MuiTablePagination-actions button": { color: "primary.main" },
        }}
      />
    </>
  );
};

export default DataTable;
