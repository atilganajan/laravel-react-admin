import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, withStyles, MenuItem } from '@material-ui/core';
import { LinearIndeterminate } from '../../../ui/Loaders';
import { Master as MasterLayout } from '../layouts';
import { DatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { User } from '../../../models';
import Task from '../../../models/Task';
import * as NavigationUtils from '../../../helpers/Navigation';
import moment from 'moment';

function Edit(props) {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    start_date: new Date(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 1)),
  });
  const [message, setMessage] = useState({});
  const [userList, setUserList] = useState([]);
  const { history } = props;
  const [task, setTask] = useState({});

  const statuslist = [
    { name: 'Pending', value: 'pending' },
    { name: 'In Progress', value: 'in_progress' },
    { name: 'Completed', value: 'completed' },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleDateChange = (name) => (date) => {
    const updatedValues = {
      ...formValues,
      [name]: date,
    };

    // If start_date is today's date, end_date is set to the next day
    if (name === 'start_date') {
      const tomorrow = new Date(date);
      tomorrow.setDate(tomorrow.getDate() + 1);
      updatedValues.end_date = tomorrow;
    }

    setFormValues(updatedValues);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Change date formats to YYYY-MM-DD
    const formattedValues = {
      ...formValues,
      start_date: moment(formValues.start_date).format('YYYY-MM-DD'),
      end_date: moment(formValues.end_date).format('YYYY-MM-DD'),
    };

    try {
      const response = await Task.update(task.id,formattedValues);

      if (response.status === 200) {
        setMessage({
          type: 'success',
          body: 'Task updated successfully.',
        });
        history.push(NavigationUtils.route('backoffice.task-manager.index'));
      } else {
        setMessage({
          type: 'error',
          body: 'Task update failed.',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        body: 'An error occurred while updating the task.',
      });
    } finally {
      setLoading(false);
    }
  };

  const { classes, ...other } = props;

  const fetchUsers = async () => {
    const response = await User.paginated();
    setUserList(response.data);
  };

  const getTask = async (id) => {
     try {
     const task = await Task.show(id);
     
      setTask(task);

      setFormValues({...task});

     } catch (error) {
      setMessage({
        type: 'error',
        body: 'An error occurred while fetching the task.',
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    const { params } = props.match;
    if (params.id) {
      getTask(params.id);
    }
  }, []);

  return (
    <MasterLayout
      {...other}
      pageTitle="Edit Task"
      message={message}
    >
      <div className={classes.pageContentWrapper}>
        {loading && <LinearIndeterminate />}
        <Paper>
          <div className={classes.pageContent}>
            <Typography
              component="h1"
              variant="h4"
              align="center"
              gutterBottom
            >
              Edit Task
            </Typography>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Title"
                  name="title"
                  value={formValues.title || ''}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Description"
                  name="description"
                  value={formValues.description || ''}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  multiline
                  rows={4}
                />
                <TextField
                  label="User"
                  name="user_id"
                  select
                  value={formValues.user_id || ''}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                >
                  {userList.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Status"
                  name="status"
                  select
                  value={formValues.status || ''}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                >
                  {statuslist.map((status, key) => (
                    <MenuItem key={key} value={status.value}>
                      {status.name}
                    </MenuItem>
                  ))}
                </TextField>
                <DatePicker
                  label="Start Date"
                  name="start_date"
                  value={formValues.start_date}
                  onChange={handleDateChange('start_date')}
                  format="DD/MM/YYYY"
                  fullWidth
                  margin="normal"
                  required
                />
                <DatePicker
                  label="End Date"
                  name="end_date"
                  value={formValues.end_date}
                  onChange={handleDateChange('end_date')}
                  format="DD/MM/YYYY"
                  fullWidth
                  margin="normal"
                  required
                  minDate={moment(formValues.start_date).add(1, 'day')}  // Set minimum date to start_date
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Edit Task
                </Button>
              </form>
            </MuiPickersUtilsProvider>
          </div>
        </Paper>
      </div>
    </MasterLayout>
  );
}

const styles = (theme) => ({
  pageContentWrapper: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    minHeight: '75vh',
    overflowX: 'auto',
  },

  pageContent: {
    padding: theme.spacing.unit * 3,
  },
});

export default withStyles(styles)(Edit);
