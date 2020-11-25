const routes = [
  {
    path: '/',
    component: () => import('layouts/BaseLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('pages/Home.vue') },
      { name: 'create', path: '/create', component: () => import('pages/CreatePoll.vue') },
      { name: 'results', path: '/:id/results', component: () => import('pages/PollDetailsResults.vue') },
      { name: 'cast', path: '/:id/cast', component: () => import('pages/PollDetailsCast.vue') },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    name: 'Error404',
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
