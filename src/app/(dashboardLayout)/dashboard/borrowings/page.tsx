"use client";

import { useEffect, useState } from "react";
import { Borrowing, borrowingApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DashboardLoading } from "@/components/layout/DashboardLoading";

export default function BorrowingsPage() {
    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBorrowings();
    }, []);

    const fetchBorrowings = async () => {
        try {
            const response = await borrowingApi.getAll();
            const data = Array.isArray(response) ? response : ((response as any)?.data || []);
            setBorrowings(data);
        } catch (error) {
            toast.error("Failed to fetch borrowings");
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (id: string) => {
        try {
            await borrowingApi.returnBook(id);
            toast.success("Book returned successfully");
            fetchBorrowings(); // Refresh the list
        } catch (error) {
            toast.error("Failed to return book");
        }
    };

    if (loading) {
        return <DashboardLoading />;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Borrowings Management</h1>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Book</TableHead>
                            <TableHead>Borrow Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {borrowings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    No borrowings found
                                </TableCell>
                            </TableRow>
                        ) : (
                            borrowings.map((borrowing) => (
                                <TableRow key={borrowing.id}>
                                    <TableCell>
                                        {borrowing.user?.name} <br />
                                        <span className="text-sm text-muted-foreground">
                                            {borrowing.user?.email}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {borrowing.book?.title} <br />
                                        <span className="text-sm text-muted-foreground">
                                            by {borrowing.book?.author}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(borrowing.borrowDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(borrowing.dueDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                borrowing.status === "BORROWED"
                                                    ? "default"
                                                    : borrowing.status === "RETURNED"
                                                        ? "secondary"
                                                        : "destructive"
                                            }
                                        >
                                            {borrowing.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {borrowing.status === "BORROWED" && (
                                            <Button
                                                onClick={() => handleReturn(borrowing.id)}
                                                size="sm"
                                                variant="outline"
                                            >
                                                Return Book
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}