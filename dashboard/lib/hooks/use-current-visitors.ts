// import useSWR from 'swr'
// import { querySQL } from '../api'
// import { useRouter } from 'next/router'

// async function getCurrentVisitors(): Promise<number> {
//   const { data } = await querySQL<{ visits: number }>(
//     `SELECT uniq(session_id) AS visits FROM analytics_hits
//       WHERE timestamp >= (now() - interval 5 minute) AND project_id = {FROM URL} FORMAT JSON`
//   )
//   const [{ visits }] = data
//   return visits
// }

// export default function useCurrentVisitors() {
//   const router = useRouter()

//   // Get the query parameter from the URL
//   const { project_id } = router.query

//   const { data } = useSWR('currentVisitors', getCurrentVisitors)
//   console.log(data)

//   return data ?? 0
// }


import useSWR from 'swr'
import { querySQL } from '../api'
import { useRouter } from 'next/router'

async function getCurrentVisitors(): Promise<number> {
  const router = useRouter();
  const { query } = router;

  // Get the project_id from the query parameters in the URL
  const { project_id } = query;

  if (!project_id) {
    // Handle the case when project_id is not available in the URL
    return 0;
  }

  const sqlQuery = `
    SELECT uniq(session_id) AS visits
    FROM analytics_hits
    WHERE timestamp >= (now() - interval 5 minute) 
    AND project_id = ${project_id}
    FORMAT JSON
  `;

  const { data } = await querySQL<{ visits: number }>(sqlQuery);

  const [{ visits }] = data;
  return visits;
}

export default function useCurrentVisitors() {
  const { data } = useSWR('currentVisitors', getCurrentVisitors);
  console.log(data);

  return data ?? 0;
}
