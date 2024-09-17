import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Dashboard = () => {
  const data = [
    {
      name: "Jan",
      high: 4000,
      low: 2400,
    },
    {
      name: "Feb",
      high: 5000,
      low: 1500,
    },
    {
      name: "Mar",
      high: 6000,
      low: 3000,
    },
    {
      name: "Apr",
      high: 6500,
      low: 4500,
    },
    {
      name: "May",
      high: 7000,
      low: 2200,
    },
    {
      name: "Jun",
      high: 8000,
      low: 3500,
    },
    {
      name: "Jul",
      high: 7400,
      low: 5500,
    },
  ];

  return (
    <div className="w-[80%] mx-auto h-[100vh] flex-col gap-5 flex justify-center items-center">
      <h1>Dashboard</h1>
      <Button variant="link">Click me</Button>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>High</TableHead>
            <TableHead>Low</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.high}</TableCell>
              <TableCell>{item.low}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Dashboard;
