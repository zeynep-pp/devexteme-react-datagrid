import { HomePage, TasksPage, ProductPage, ProfilePage, SettingsPage } from './pages';
import { withNavigationWatcher } from './contexts/navigation';

const routes = [
    {
        path: '/tasks',
        element: TasksPage
    },    
    {
        path: '/product',
        element: ProductPage
    },
    {
        path: '/profile',
        element: ProfilePage
    },
    {
        path: '/home',
        element: HomePage
    },    
    {
        path: '/settings',
        element: SettingsPage
    },
];

export default routes.map(route => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path)
    };
});
