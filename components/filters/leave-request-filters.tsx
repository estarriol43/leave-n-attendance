"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { format, isValid } from "date-fns"
import { cn, formatName } from "@/lib/utils"
import { useEffect, useState, useRef } from "react"
import { DateRange } from "react-day-picker"

// Import types
import { TeamLeaveRequestFilters } from "@/lib/services/leave-request"
import { TeamMember, getTeamMembers } from "@/lib/services/team"

// Extend TeamLeaveRequestFilters with UI-specific fields
export interface UIFilters extends TeamLeaveRequestFilters {
  leave_type_id?: number;
  employee_id?: number;
  [key: string]: any; // Allow dynamic property access
}

interface LeaveType {
  id: number
  name: string
  color_code?: string
}

interface LeaveRequestFiltersProps {
  type: "my-requests" | "pending-approval" | "team-requests";
  filters: UIFilters;
  leaveTypes: LeaveType[];
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
  onClose: () => void;
}

export function LeaveRequestFilters({ 
  type, 
  filters, 
  leaveTypes, 
  onFilterChange, 
  onResetFilters,
  onClose
}: LeaveRequestFiltersProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // 使用 ref 來避免初始化和更新時的無限迴圈
  const initializedRef = useRef(false);
  
  // 初始化日期範圍選擇器值
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    (filters.start_date || filters.end_date) ? {
      from: filters.start_date ? new Date(filters.start_date) : undefined,
      to: filters.end_date ? new Date(filters.end_date) : undefined
    } : undefined
  );

  // 獲取團隊成員用於篩選
  useEffect(() => {
    if (type === 'pending-approval' || type === 'team-requests') {
      fetchTeamMembers();
    }
  }, [type]);

  // 只在日期範圍變更時更新過濾條件，避免與父組件的過濾條件相互觸發
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    
    // 更新開始日期
    if (range?.from && isValid(range.from)) {
      onFilterChange('start_date', format(range.from, "yyyy-MM-dd"));
    } else {
      onFilterChange('start_date', '');
    }
    
    // 更新結束日期
    if (range?.to && isValid(range.to)) {
      onFilterChange('end_date', format(range.to, "yyyy-MM-dd"));
      
      // 當完整選擇了範圍後，自動關閉日期選擇器
      if (range.from) {
        setTimeout(() => {
          setIsCalendarOpen(false);
        }, 300);
      }
    } else {
      onFilterChange('end_date', '');
    }
  };

  // 在過濾條件從外部變更時同步日期範圍
  useEffect(() => {
    // 避免初始化時觸發
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    
    // 檢查日期與現有日期範圍是否不同，避免無限迴圈
    const currentFromStr = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : '';
    const currentToStr = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : '';
    
    if (filters.start_date !== currentFromStr || filters.end_date !== currentToStr) {
      setDateRange({
        from: filters.start_date ? new Date(filters.start_date) : undefined,
        to: filters.end_date ? new Date(filters.end_date) : undefined
      });
    }
  }, [filters.start_date, filters.end_date]);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const data = await getTeamMembers();
      setTeamMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium">假別</h4>
        <Select
          value={filters.leave_type_id?.toString() || "all"}
          onValueChange={(value) => onFilterChange('leave_type_id', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="所有假別" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有假別</SelectItem>
            {leaveTypes && leaveTypes.map((leaveType) => (
              <SelectItem key={leaveType.id} value={leaveType.id.toString()}>
                {leaveType.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {type !== 'pending-approval' && (
        <div className="space-y-2">
          <h4 className="font-medium">狀態</h4>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => onFilterChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="所有狀態" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有狀態</SelectItem>
              <SelectItem value="pending">審核中</SelectItem>
              <SelectItem value="approved">已核准</SelectItem>
              <SelectItem value="rejected">已拒絕</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <h4 className="font-medium">時間期間</h4>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange?.from && !dateRange?.to && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "yyyy-MM-dd")} - {format(dateRange.to, "yyyy-MM-dd")}
                  </>
                ) : (
                  format(dateRange.from, "yyyy-MM-dd")
                )
              ) : (
                "選擇時間期間"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0" 
            align="start"
          >
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeChange}
              initialFocus
              className="rdp-calendar"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {(type === 'pending-approval' || type === 'team-requests') && (
        <div className="space-y-2">
          <h4 className="font-medium">員工</h4>
          <Select
            value={filters.employee_id?.toString() || "all"}
            onValueChange={(value) => onFilterChange('employee_id', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "載入中..." : "所有員工"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有員工</SelectItem>
              {teamMembers.map((member) => (
                <SelectItem key={member.id} value={member.id.toString()}>
                  {formatName(member)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={onResetFilters}>
          重設
        </Button>
        <Button size="sm" onClick={onClose}>
          套用篩選
        </Button>
      </div>
    </div>
  );
} 