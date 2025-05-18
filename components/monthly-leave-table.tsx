import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const monthlyData = [
  { month: "一月", annual: 5, sick: 3, personal: 2, public: 1, total: 11 },
  { month: "二月", annual: 3, sick: 4, personal: 1, public: 0, total: 8 },
  { month: "三月", annual: 2, sick: 2, personal: 3, public: 0, total: 7 },
  { month: "四月", annual: 4, sick: 1, personal: 2, public: 1, total: 8 },
  { month: "五月", annual: 6, sick: 2, personal: 1, public: 1, total: 10 },
  { month: "六月", annual: 8, sick: 3, personal: 2, public: 0, total: 13 },
  { month: "七月", annual: 10, sick: 2, personal: 3, public: 0, total: 15 },
  { month: "八月", annual: 7, sick: 4, personal: 2, public: 0, total: 13 },
  { month: "九月", annual: 5, sick: 5, personal: 1, public: 0, total: 11 },
  { month: "十月", annual: 3, sick: 6, personal: 2, public: 1, total: 12 },
  { month: "十一月", annual: 4, sick: 3, personal: 3, public: 0, total: 10 },
  { month: "十二月", annual: 8, sick: 2, personal: 4, public: 2, total: 16 },
]

export function MonthlyLeaveTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>月份</TableHead>
            <TableHead className="text-right">年假</TableHead>
            <TableHead className="text-right">病假</TableHead>
            <TableHead className="text-right">事假</TableHead>
            <TableHead className="text-right">國定假日</TableHead>
            <TableHead className="text-right">總計</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {monthlyData.map((row) => (
            <TableRow key={row.month}>
              <TableCell className="font-medium">{row.month}</TableCell>
              <TableCell className="text-right">{row.annual}</TableCell>
              <TableCell className="text-right">{row.sick}</TableCell>
              <TableCell className="text-right">{row.personal}</TableCell>
              <TableCell className="text-right">{row.public}</TableCell>
              <TableCell className="text-right font-medium">{row.total}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="font-bold">總計</TableCell>
            <TableCell className="text-right font-bold">
              {monthlyData.reduce((sum, row) => sum + row.annual, 0)}
            </TableCell>
            <TableCell className="text-right font-bold">
              {monthlyData.reduce((sum, row) => sum + row.sick, 0)}
            </TableCell>
            <TableCell className="text-right font-bold">
              {monthlyData.reduce((sum, row) => sum + row.personal, 0)}
            </TableCell>
            <TableCell className="text-right font-bold">
              {monthlyData.reduce((sum, row) => sum + row.public, 0)}
            </TableCell>
            <TableCell className="text-right font-bold">
              {monthlyData.reduce((sum, row) => sum + row.total, 0)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
