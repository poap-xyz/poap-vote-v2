const routes = [
  {
    path: '/',
    component: () => import('layouts/BaseLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('pages/Home.vue') },
      { name: 'create', path: '/create', component: () => import('pages/CreatePoll.vue') },
      { name: 'results', path: '/results/:id', component: () => import('pages/PollDetailsResults.vue') },
      { name: 'cast', path: '/poll/:id', component: () => import('pages/PollDetailsCast.vue') },
      { name: 'faq', path: '/faq', component: () => import('pages/Faq.vue') },
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
