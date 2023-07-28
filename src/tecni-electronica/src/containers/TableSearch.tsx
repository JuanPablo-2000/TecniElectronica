import React from 'react'

import Paper from '@mui/material/Paper';
import { 
  Table, 
  TableHead, 
  TableRow, 
  TableBody,
  TablePagination
} from '@mui/material';

export const TableSearch = () => {
  return (
    <>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>

            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>

            </TableRow>
          </TableBody>
        </Table>
        {/* <TablePagination 
          rowsPerPageOptions={[10]}
          defaultValue=""
          component="div"
          count={totalRegister}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Paper>
    </>
  )
}
