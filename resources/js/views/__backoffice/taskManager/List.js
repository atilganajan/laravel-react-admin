import React, { useState, useEffect, useCallback } from 'react';
import { AppContext } from '../../../AppContext';
import { Master as MasterLayout } from '../layouts';
import * as NavigationUtils from '../../../helpers/Navigation';
import { Table, TableBody, TableCell, Typography, TablePagination, TableHead, TableRow, Paper, Button } from '@material-ui/core';
import Task from '../../../models/Task';

function List(props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({});
  const { ...childProps } = props;
  const [tasks, setTasks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const { history } = props;

  const fetchTasks = async (page = 0, rowsPerPage = 10) => {
    setLoading(true);
    const res = await Task.paginated({ page: page + 1, per_page: rowsPerPage });
    setTasks(res.data);
    setTotalCount(res.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks(page, rowsPerPage);
  }, [page, rowsPerPage]);

  // Delete task
  const handleDelete = useCallback(async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await Task.destroy(taskId);
      fetchTasks();
      setMessage({
        type: 'success',
        body: 'Task deleted successfully.',
      });
    }
  }, []);

  // get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'gray';
      case 'in_progress':
        return 'orange';
      case 'completed':
        return 'green';
    }
  };

  // get readable status
  const getStatusReadable = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
    }
  };

  // Will be called when page changes
  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
  };

  // Will be called when the number of rows changes 
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page when number of rows changes
  };

  return (
    <MasterLayout
      {...childProps}
      loading={loading}
      pageTitle="Task List"
      message={message}
    >
      <div style={{ padding: '20px', width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Task List
        </Typography>
  
        <Paper elevation={3} style={{ maxWidth: '90%', margin: '0 auto', padding: '20px' }}>
          {/* Scrollable table container */}
          <div style={{ overflowX: 'auto' }}>
            <Table style={{ minWidth: '600px' }}>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Assigned User</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Start Date</strong></TableCell>
                  <TableCell><strong>End Date</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks && tasks.length > 0 ? (
                  tasks.map(task => (
                    <TableRow key={task.id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>{task.user.name}</TableCell>
                      <TableCell>
                        <Typography
                          style={{
                            color: getStatusColor(task.status),
                            fontWeight: 'bold',
                          }}
                        >
                          {getStatusReadable(task.status)}
                        </Typography>
                      </TableCell>
                      <TableCell style={{minWidth:"150px"}}>{task.start_date}</TableCell>
                      <TableCell style={{minWidth:"150px"}}>{task.end_date}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            history.push(NavigationUtils.route('backoffice.task-manager.edit', { id: task.id }));
                          }}
                          style={{ marginRight: '10px' }}
                          size="small"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDelete(task.id)}
                          size="small"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No Task found to list...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage} 
            onChangeRowsPerPage={handleChangeRowsPerPage}
            style={{ marginTop: '10px' }}
          />
        </Paper>
      </div>
    </MasterLayout>
  );
  
  
  
}

export default List;
