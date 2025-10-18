import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts";
import { CheckCircle, TrendingUp, BriefcaseIcon, Clock } from "lucide-react";

const monthlyData = [
  { month: "Jan", submissions: 65, matches: 40, efficiency: 62 },
  { month: "Feb", submissions: 85, matches: 55, efficiency: 65 },
  { month: "Mar", submissions: 95, matches: 68, efficiency: 72 },
  { month: "Apr", submissions: 120, matches: 88, efficiency: 73 },
  { month: "May", submissions: 150, matches: 115, efficiency: 77 },
  { month: "Jun", submissions: 180, matches: 142, efficiency: 79 },
];

const metrics = [
  {
    title: "Total CVs Processed",
    value: "695",
    change: "+12.5%",
    description: "From last month",
    icon: CheckCircle,
    color: "text-blue-500",
    trend: "up",
  },
  {
    title: "Average Match Rate",
    value: "78.3%",
    change: "+4.2%",
    description: "Compared to target",
    icon: TrendingUp,
    color: "text-green-500",
    trend: "up",
  },
  {
    title: "Active Positions",
    value: "24",
    change: "+3",
    description: "New this week",
    icon: BriefcaseIcon,
    color: "text-purple-500",
    trend: "up",
  },
  {
    title: "Time to Match",
    value: "20s",
    change: "-22%",
    description: "Average duration",
    icon: Clock,
    color: "text-orange-500",
    trend: "down",
  },
];

export default function DashboardContent() {
  return (
    <>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold">{metric.value}</h3>
                <p className="text-sm text-gray-500 mt-1">{metric.title}</p>
                <p className="text-xs text-gray-400 mt-1">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
            <CardDescription>CV processing and matching efficiency over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="submissions" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="matches" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="efficiency" stroke="#d97706" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 