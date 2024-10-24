import { Home } from '../views/__backoffice';
import * as Settings from '../views/__backoffice/settings';
import * as Users from '../views/__backoffice/users';
import * as TaskManager from '../views/__backoffice/taskManager';

const resources = [
    {
        name: 'users.index',
        path: '/users',
        component: Users.List,
    },

    {
        name: 'users.create',
        path: '/users/create',
        component: Users.Create,
    },

    {
        name: 'users.edit',
        path: '/users/:id/edit',
        component: Users.Edit,
    },
].map(route => {
    route.name = `resources.${route.name}`;
    route.path = `/resources${route.path}`;

    return route;
});

// Task manager route definitions
const taskManagerRoutes = [
    {
        name: 'task-manager.index',
        path: '/task-manager',
        component: TaskManager.List,
    },

    {
        name: 'task-manager.create',
        path: '/task-manager/create',
        component: TaskManager.Create,
    },

    {
        name: 'task-manager.edit',
        path: '/task-manager/:id/edit',
        component: TaskManager.Edit,
    },
].map(route => ({
    ...route,
    name: `${route.name}`,
    path: `/task-manager${route.path}`,
}));


export default [
    {
        name: 'home',
        path: '/',
        component: Home,
    },

    {
        name: 'settings.profile',
        path: '/settings/profile',
        component: Settings.Profile,
    },

    {
        name: 'settings.account',
        path: '/settings/account',
        component: Settings.Account,
    },

    ...resources,
    ...taskManagerRoutes
].map(route => {
    route.name = `backoffice.${route.name}`;
    route.auth = true;

    return route;
});

