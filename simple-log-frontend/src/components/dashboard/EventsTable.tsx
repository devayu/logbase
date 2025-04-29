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
import { Event } from "@/hooks/useEvents";
import { cn } from "@/lib/utils";
import { Export } from "@/components/dashboard/ExportBtn";

const getColorForEventType = (eventType: string) => {
  if (eventType.includes("error")) {
    return "bg-destructive";
  }
  if (
    eventType.includes("view") ||
    eventType.includes("page") ||
    eventType.includes("submit")
  ) {
    return "bg-green-500";
  }
  if (eventType.includes("route")) {
    return "bg-blue-500";
  }
  return "bg-gray-500";
};
export const EventsTable = ({
  events = [],
  count,
}: {
  events: Event[] | undefined;
  count?: number | undefined;
}) => {
  const eventsToShow = count ? events.slice(0, count) : events;
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

  const filteredEvents = eventsToShow.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.metadata.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.metadata.source.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      eventTypeFilter === "all" || event.type === eventTypeFilter;

    return matchesSearch && matchesType;
  });

  const eventTypes = Array.from(
    new Set(eventsToShow.map((event) => event.type))
  );
  const generateExportFileName = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    return `${eventTypeFilter}_events_${formattedDate}.csv`;
  };

  return (
    <Card className="overflow-hidden border border-border/30 gap-2">
      <CardHeader className="px-6">
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>Recent Events</span>
          <Export
            data={filteredEvents}
            fileName={generateExportFileName()}
          ></Export>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4  flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
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
        <div className="max-h-[400px] overflow-auto px-4">
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
                          className={cn(
                            `w-2 h-2 rounded-full`,
                            getColorForEventType(event.type)
                          )}
                        />
                        {event.type}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {event.metadata.path && event.metadata.path}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-secondary">
                        {event.metadata.source ?? "unknown"}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(event.timestamp)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {JSON.stringify(event.metadata)}
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
