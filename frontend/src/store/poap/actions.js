const jsonFetch = (url) => fetch(url).then((res) => res.json());

export async function getEvents({ commit }) {
  // Get all POAP events
  const events = await jsonFetch('https://api.poap.xyz/events');
  commit('setEvents', events);
}
