import { Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Task from '../../../../models/Task';

const KanbanBoard = ({ taskList, onTaskUpdate  }) => {
    const [tasks, setTasks] = useState({
        pending: [],
        in_progress: [],
        completed: [],
    });


    useEffect(() => {

        const pendingTasks = taskList.filter(task => task.status === 'pending');
        const inProgressTasks = taskList.filter(task => task.status === 'in_progress');
        const completedTasks = taskList.filter(task => task.status === 'completed');

        setTasks({
            pending: pendingTasks,
            in_progress: inProgressTasks,
            completed: completedTasks,
        });

    }, [taskList]);


    const updateTaskStatus = async (taskId, updatedTask) => {
        try { 
           await Task.update(taskId, {...updatedTask });
           onTaskUpdate();
         } catch (error) {
            console.error('Unexpected error while updating Task.');
        } 
      };




    const onDragEnd = (result) => {
        const { source, destination } = result;
      
        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
            return;
        }
      
        const sourceList = Array.from(tasks[source.droppableId]);
        const [removed] = sourceList.splice(source.index, 1);
        const destList = Array.from(tasks[destination.droppableId]);
      
        destList.splice(destination.index, 0, removed);
      
        setTasks({
          ...tasks,
          [source.droppableId]: sourceList,
          [destination.droppableId]: destList,
        });
      
        // Update status
        if (source.droppableId !== destination.droppableId) {
          const updatedTask = {
            ...removed, // Retrieve existing task information
            status: destination.droppableId, // Update the status with the new status
          };

          const taskId = removed.id;

          updateTaskStatus(taskId,updatedTask);
        }
      };

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
      

    return (
        <div>
            <Typography variant="h4" align="center" gutterBottom>
                Kanban Board
            </Typography>
            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {Object.keys(tasks).map((column) => (
                        <Droppable key={column} droppableId={column}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{
                                        width: '300px',
                                        padding: '10px',
                                        background: '#f0f0f0',
                                        borderRadius: '5px',
                                        margin: '0 10px',
                                    }}
                                >
                                    <h2 style={{ textAlign: 'center' }} >{ getStatusReadable(column.charAt(0) + column.slice(1)) }</h2>
                                    {tasks[column].map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        padding: '10px',
                                                        margin: '5px 0',
                                                        background: '#fff',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '3px',
                                                        ...provided.draggableProps.style,
                                                    }}
                                                >
                                                    <p>{task.user.name}</p>
                                                    <p>{task.content || task.description}</p>
                                                    <p>Start Date:{task.start_date}</p>
                                                    <p>End Date:{task.end_date}</p>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
