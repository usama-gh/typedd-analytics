import useSWR from 'swr';
import { querySQL } from '../api';

async function getCurrentVisitors(projectId: string): Promise<number> {
  const sqlQuery = `
    SELECT uniq(session_id) AS visits FROM analytics_hits
    WHERE timestamp >= (now() - interval 5 minute) AND project_id = '${projectId}' FORMAT JSON
  `;

  const { data } = await querySQL<{ visits: number }>(sqlQuery);
  const [{ visits }] = data;
  return visits;
}

export default function useCurrentVisitors(projectId: string) {
  const { data } = useSWR('currentVisitors', () => getCurrentVisitors(projectId));
  return data ?? 0;
}
