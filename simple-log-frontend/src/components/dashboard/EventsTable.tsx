
import { useState } from "react";
import { DownloadCloud, Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock event data
const eventData = [
  {
    id: "evt_1",
    type: "page_view",
    source: "web",
    path: "/products",
    timestamp: "2025-04-10T10:30:00Z",
    properties: { referrer: "google.com" },
  },
  {
    id: "evt_2",
    type: "click",
    source: "web",
    path: "/products/123",
    timestamp: "2025-04-10T10:32:15Z",
    properties: { element: "add_to_cart_button" },
  },
  {
    id: "evt_3",
    type: "purchase",
    source: "ios",
    path: "/checkout",
    timestamp: "2025-04-10T10:45:22Z",
    properties: { amount: 49.99, currency: "USD" },
  },
  {
    id: "evt_4",
    type: "login",
    source: "android",
    path: "/auth",
    timestamp: "2025-04-10T11:15:00Z",
    properties: { method: "google" },
  },
  {
    id: "evt_5",
    type: "error",
    source: "web",
    path: "/api/users",
    timestamp: "2025-04-10T11:22:45Z",
    properties: { code: 500, message: "Internal server error" },
  },
];

export const EventsTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const filteredEvents = eventData.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.source.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      eventTypeFilter === "all" || event.type === eventTypeFilter;

    return matchesSearch && matchesType;
  });

  const eventTypes = Array.from(new Set(eventData.map((event) => event.type)));

  return (
    <Card className="overflow-hidden border border-border/30">
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>Recent Events</span>
          <Button variant="outline" size="sm">
            <DownloadCloud className="mr-2 h-4 w-4" />
            Export
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-6 pb-4 border-b border-border/30 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-64 flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={eventTypeFilter}
              onValueChange={setEventTypeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="max-h-[400px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 border-b bg-accent/50 backdrop-blur">
              <TableRow>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="w-[160px]">Time</TableHead>
                <TableHead>Properties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            event.type === "error"
                              ? "bg-destructive"
                              : event.type === "purchase"
                              ? "bg-green-500"
                              : "bg-primary"
                          }`}
                        />
                        {event.type}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {event.path}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-secondary">
                        {event.source}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(event.timestamp)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {JSON.stringify(event.properties)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No events found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
