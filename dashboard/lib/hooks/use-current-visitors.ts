import useSWR from 'swr'
import { querySQL } from '../api'
import { useRouter } from 'next/router'

async function getCurrentVisitors(): Promise<number> {
  const { data } = await querySQL<{ visits: number }>(
    `SELECT uniq(session_id) AS visits FROM analytics_hits
      WHERE timestamp >= (now() - interval 5 minute) FORMAT JSON`
  )
  const [{ visits }] = data
  return visits
}

export default function useCurrentVisitors() {
  const router = useRouter()

  // Get the query parameter from the URL
  const { project_id } = router.query

  const { data } = useSWR('currentVisitors', getCurrentVisitors)
  console.log(data)

  return data ?? 0
}
