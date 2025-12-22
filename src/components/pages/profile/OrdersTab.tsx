"use client";

import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMyOrders } from "@/hooks/my-order";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import { Order } from "@/types/my-orders";

const OrderStatusBadge = ({ status }: { status: string }) => {
    let colorClass = "bg-gray-100 text-gray-600";
    let icon = <Clock className="w-3.5 h-3.5" />;
  
    switch (status.toLowerCase()) {
      case "pending":
        colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200";
        icon = <Clock className="w-3.5 h-3.5" />;
        break;
      case "confirmed":
      case "processing":
        colorClass = "bg-blue-100 text-blue-700 border-blue-200";
        icon = <Package className="w-3.5 h-3.5" />;
        break;
      case "shipped":
        colorClass = "bg-purple-100 text-purple-700 border-purple-200";
        icon = <Truck className="w-3.5 h-3.5" />;
        break;
      case "delivered":
        colorClass = "bg-green-100 text-green-700 border-green-200";
        icon = <CheckCircle className="w-3.5 h-3.5" />;
        break;
      case "cancelled":
        colorClass = "bg-red-100 text-red-700 border-red-200";
        icon = <XCircle className="w-3.5 h-3.5" />;
        break;
    }
  
    return (
      <span className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", colorClass)}>
        {icon}
        <span className="capitalize">{status}</span>
      </span>
    );
};

export const OrdersTab = () => {
    const router = useRouter();
    const { data: ordersData, isLoading, isError } = useMyOrders({ page_size: 10 });
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
    };

    if (isLoading) {
        return (
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
            >
                <div className="flex items-center justify-between mb-2">
                     <div>
                        <p className="text-sm text-muted-foreground animate-pulse">Loading your orders...</p>
                    </div>
                </div>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 rounded-2xl bg-secondary/30 animate-pulse" />
                ))}
            </motion.div>
        );
    }

    if (isError) {
        return (
            <div className="p-8 rounded-2xl bg-destructive/5 border border-destructive/20 text-center">
                <p className="text-destructive font-medium mb-2">Unable to load orders</p>
                <Button variant="outline" onClick={() => window.location.reload()} size="sm">Try Again</Button>
            </div>
        );
    }

     // Sort orders by created_at descending (newest first)
    const sortedOrders = ordersData?.results ? [...ordersData.results].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : [];

    const hasOrders = sortedOrders.length > 0;

    return (
        <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {!hasOrders ? (
                <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/20 p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-background rounded-full shadow-soft flex items-center justify-center mb-4">
                        <Package className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="font-medium text-lg mb-2">No orders yet</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">Looks like you haven&apos;t placed an order yet. Explore our collection and find something you love.</p>
                    <Button onClick={() => router.push('/products')} className="min-w-[150px]">Start Shopping</Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {sortedOrders.map((order) => (
                        <div 
                            key={order.id} 
                            onClick={() => handleViewDetails(order)}
                            className="group block rounded-xl border border-border/50 bg-card hover:bg-secondary/20 hover:border-secondary transition-all duration-300 overflow-hidden cursor-pointer"
                        >
                            <div className="p-5 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                                {/* Order Info */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-medium text-base">Order #{order.order_number}</h3>
                                        <OrderStatusBadge status={order.status} />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Placed on {format(new Date(order.created_at), "MMMM d, yyyy")}
                                    </p>
                                </div>

                                {/* Order Stats */}
                                <div className="flex items-center gap-8 text-sm">
                                    <div className="hidden border-r border-border/50 pr-8 md:block">
                                        <p className="text-muted-foreground text-xs mb-0.5">Total</p>
                                        <p className="font-medium">Rs. {parseFloat(order.total_amount).toLocaleString()}</p>
                                    </div>
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="gap-2 group-hover:border-primary/50 group-hover:text-primary transition-colors"
                                        onClick={() => handleViewDetails(order)}
                                    >
                                        View Details <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Quick Preview of Items (Optional - showing first few items) */}
                             <div className="px-5 pb-5 pt-0 flex gap-2 overflow-x-auto hide-scrollbar">
                                {order.order_items.map((item) => (
                                    <div key={item.id} className="relative w-12 h-12 rounded-md border border-border bg-white shrink-0 overflow-hidden" title={item.product.name}>
                                         {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={item.product.thumbnail_image} alt={item.product.name} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                {order.order_items.length > 5 && (
                                     <div className="w-12 h-12 rounded-md border border-dashed border-border bg-secondary/30 flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                                        +{order.order_items.length - 5}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <OrderDetailsDialog 
                order={selectedOrder} 
                orders={sortedOrders}
                open={isDetailsOpen} 
                onOpenChange={setIsDetailsOpen} 
                onOrderChange={(orderId) => {
                    const newOrder = sortedOrders.find(o => o.id === orderId);
                    if (newOrder) setSelectedOrder(newOrder);
                }}
            />
        </motion.div>
    );
}
