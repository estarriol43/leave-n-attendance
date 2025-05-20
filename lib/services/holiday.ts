import api from "@/lib/api"

export interface Holiday {
  id: number
  name: string
  date: string
  description?: string
}

/**
 * Fetches upcoming holidays
 * @param limit Number of holidays to fetch
 * @returns Array of upcoming holidays
 */
export async function getUpcomingHolidays(limit: number = 5): Promise<Holiday[]> {
  try {
    const response = await api.get<{ holidays: Holiday[] }>("/holidays/upcoming", {
      params: { limit }
    })
    return response.data.holidays
  } catch (error) {
    console.error("Failed to fetch upcoming holidays:", error)
    
    // Return mock data for now
    return getMockHolidays()
  }
}

/**
 * Returns mock holiday data (will be replaced by actual API later)
 */
function getMockHolidays(): Holiday[] {
  const today = new Date()
  const year = today.getFullYear()
  
  return [
    {
      id: 1,
      name: "中秋節",
      date: `${year}-09-17`,
      description: "中秋節是傳統的團圓佳節"
    },
    {
      id: 2,
      name: "國慶日",
      date: `${year}-10-10`,
      description: "中華民國國慶日"
    },
    {
      id: 3,
      name: "聖誕節",
      date: `${year}-12-25`,
      description: "聖誕節假期"
    },
    {
      id: 4, 
      name: "元旦",
      date: `${year + 1}-01-01`,
      description: "新年第一天"
    },
    {
      id: 5,
      name: "農曆新年",
      date: `${year + 1}-02-10`,
      description: "農曆新年假期"
    }
  ]
} 