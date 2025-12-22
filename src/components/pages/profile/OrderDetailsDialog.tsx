"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { Order } from "@/types/my-orders";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, X, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface OrderDetailsDialogProps {
    order: Order | null;
    orders?: Order[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onOrderChange?: (orderId: number) => void;
}

const getStatusBadge = (status: string) => {
    const statusConfig = {
        pending: {
            variant: "secondary" as const,
            className: "bg-yellow-100 text-yellow-800",
        },
        confirmed: {
            variant: "secondary" as const,
            className: "bg-green-100 text-green-800",
        },
        processing: {
            variant: "secondary" as const,
            className: "bg-blue-100 text-blue-800",
        },
        shipped: {
            variant: "secondary" as const,
            className: "bg-purple-100 text-purple-800",
        },
        delivered: {
            variant: "secondary" as const,
            className: "bg-green-100 text-green-800",
        },
        cancelled: {
            variant: "destructive" as const,
            className: "",
        },
    };

    const config =
        statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
        <Badge variant={config.variant} className={config.className}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
};

const getStatusPipeline = (currentStatus: string) => {
    const statuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
    ];
    const currentIndex = statuses.indexOf(currentStatus.toLowerCase());

    return statuses.map((status, index) => ({
        label:
            status === "pending"
                ? "Ordered"
                : status === "confirmed"
                    ? "Confirmed"
                    : status === "shipped"
                        ? "Shipped"
                        : status === "delivered"
                            ? "Delivered"
                            : "Processing",
        number: index + 1,
        active: index <= currentIndex,
        isLast: index === statuses.length - 1,
    }));
};

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
    order,
    orders = [],
    open,
    onOpenChange,
    onOrderChange,
}) => {
    const currentIndex = order && orders.length > 0 
        ? orders.findIndex(o => o.id === order.id) 
        : -1;

    const handlePrevious = useCallback(() => {
        if (currentIndex > 0 && onOrderChange) {
            onOrderChange(orders[currentIndex - 1].id);
        }
    }, [currentIndex, orders, onOrderChange]);

    const handleNext = useCallback(() => {
        if (currentIndex < orders.length - 1 && onOrderChange) {
            onOrderChange(orders[currentIndex + 1].id);
        }
    }, [currentIndex, orders, onOrderChange]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!open) return;
            if (event.key === "ArrowLeft") handlePrevious();
            if (event.key === "ArrowRight") handleNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, handlePrevious, handleNext]);

    if (!order) return null;

    const orderItems = order.order_items || [];
    const pipeline = getStatusPipeline(order.status);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl w-[95vw] md:w-full bg-white p-0 overflow-visible rounded-4xl md:rounded-3xl border-none shadow-2xl">
                {/* Desktop Navigation Arrows (Outside Dialog) */}
                {orders.length > 1 && (
                    <>
                        <div className="absolute top-1/2 -left-20 -translate-y-1/2 z-100 hidden lg:block">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                                className="h-14 w-14 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl hover:scale-110 active:scale-95 transition-all border-none ring-1 ring-black/5"
                            >
                                <ChevronLeft className="h-7 w-7 text-slate-900" />
                            </Button>
                        </div>
                        <div className="absolute top-1/2 -right-20 -translate-y-1/2 z-100 hidden lg:block">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleNext}
                                disabled={currentIndex === orders.length - 1}
                                className="h-14 w-14 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl hover:scale-110 active:scale-95 transition-all border-none ring-1 ring-black/5"
                            >
                                <ChevronRight className="h-7 w-7 text-slate-900" />
                            </Button>
                        </div>
                    </>
                )}

                <div className="relative max-h-[90vh] md:max-h-[85vh] w-full overflow-y-auto scrollbar-hide bg-white rounded-4xl md:rounded-3xl">
                    {/* Sticky Header with Mobile Navigation */}
                    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-5 py-4 md:p-6 flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                                <h2 className="text-[10px] md:text-sm font-black text-slate-900 uppercase tracking-widest">
                                    Order #{order.order_number}
                                </h2>
                                {orders.length > 1 && (
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-[9px] md:text-[10px] font-bold border-none px-1.5 h-4 md:h-5">
                                        {currentIndex + 1}/{orders.length}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {getStatusBadge(order.status)}
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 md:gap-3">
                            {/* Mobile Navigation Controls */}
                            {orders.length > 1 && (
                                <div className="flex items-center bg-slate-100 rounded-full p-1 lg:hidden">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handlePrevious}
                                        disabled={currentIndex === 0}
                                        className="h-7 w-7 md:h-8 md:w-8 rounded-full hover:bg-white text-slate-600 disabled:opacity-30"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="w-px h-3 bg-slate-200 mx-0.5" />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleNext}
                                        disabled={currentIndex === orders.length - 1}
                                        className="h-7 w-7 md:h-8 md:w-8 rounded-full hover:bg-white text-slate-600 disabled:opacity-30"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => onOpenChange(false)}
                                className="h-8 w-8 md:h-9 md:w-9 rounded-full hover:bg-slate-100 text-slate-400"
                            >
                                <X className="h-4 w-4 md:h-5 md:w-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="p-5 md:p-8">
                        {/* Status Pipeline */}
                        <div className="mb-10 flex items-center justify-between overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                            {pipeline.map((step) => (
                                <React.Fragment key={step.number}>
                                    <div className="flex flex-1 items-center min-w-fit last:flex-none">
                                        <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-2">
                                            <div
                                                className={cn(
                                                    "flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full text-[10px] md:text-xs font-black transition-colors shrink-0",
                                                    step.active
                                                        ? "bg-black text-white"
                                                        : "bg-gray-100 text-gray-500"
                                                )}
                                            >
                                                {step.number}
                                            </div>
                                            <span
                                                className={cn(
                                                    "text-[9px] md:text-sm whitespace-nowrap uppercase tracking-tighter md:tracking-normal",
                                                    step.active ? "font-bold text-gray-900" : "font-medium text-gray-400"
                                                )}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                        {!step.isLast && (
                                            <div
                                                className={cn(
                                                    "mx-2 md:mx-4 h-px md:h-0.5 flex-1 min-w-[12px] md:min-w-[20px]",
                                                    step.active ? "bg-black" : "bg-gray-100"
                                                )}
                                            />
                                        )}
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Order Info Grid - 2 Column Reference Style */}
                        <div className="mb-8 md:mb-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-4 text-sm border-t border-slate-100 pt-8">
                            <div className="space-y-4 md:space-y-4">
                                <section className="space-y-0.5 md:space-y-1">
                                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Order date</p>
                                    <p className="font-bold text-slate-900">{format(new Date(order.created_at), "MMMM d, yyyy")}</p>
                                </section>
                                <section className="space-y-0.5 md:space-y-1 text-wrap">
                                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Email</p>
                                    <p className="font-bold text-slate-900 break-all">{order.customer_email}</p>
                                </section>
                                <section className="space-y-1.5">
                                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Payment status</p>
                                    <Badge variant="secondary" className="bg-rose-50 text-rose-600 border-none font-black px-2.5 py-1 text-[10px] uppercase">Unpaid</Badge>
                                </section>
                                <section className="space-y-0.5 md:space-y-1">
                                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Shipping Address</p>
                                    <p className="font-bold text-slate-900 capitalize leading-relaxed">{order.shipping_address || order.customer_address}</p>
                                </section>
                            </div>

                            <div className="space-y-4 md:space-y-4">
                                <section className="space-y-0.5 md:space-y-1">
                                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</p>
                                    <p className="font-bold text-slate-900 capitalize">{order.customer_name}</p>
                                </section>
                                <section className="space-y-0.5 md:space-y-1">
                                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                                    <p className="font-bold text-slate-900">{order.customer_phone}</p>
                                </section>
                                <section className="space-y-1.5">
                                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Payment type</p>
                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none font-black px-2.5 py-1 text-[10px] uppercase">COD</Badge>
                                </section>
                                <section className="space-y-0.5 md:space-y-1">
                                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">City</p>
                                    <p className="font-bold text-slate-900 capitalize">Patna</p>
                                </section>
                            </div>
                        </div>

                        {/* Delivery Location - Reference Style */}
                        {order.latitude && order.longitude && (
                            <div className="mb-8 md:mb-10 pt-6 border-t border-slate-100">
                                <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                                    <MapPin className="w-3.5 h-3.5" />
                                    Delivery Location
                                </h3>
                                <div className="rounded-2xl md:rounded-3xl bg-emerald-50/50 border border-emerald-100 p-4 md:p-6">
                                    <div className="flex items-center gap-2 text-emerald-700 mb-4">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] md:text-xs font-black uppercase tracking-wider">Location Confirmed</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] md:text-xs">
                                            <span className="text-slate-500 font-bold uppercase tracking-wider">Latitude</span>
                                            <span className="font-mono font-bold text-slate-700">{order.latitude.toFixed(6)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] md:text-xs border-t border-emerald-100/50 pt-3">
                                            <span className="text-slate-500 font-bold uppercase tracking-wider">Longitude</span>
                                            <span className="font-mono font-bold text-slate-700">{order.longitude.toFixed(6)}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-emerald-100">
                                        <a
                                            href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] md:text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-wider flex items-center gap-1"
                                        >
                                            View on Google Maps
                                            <ChevronRight className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Items Ordered - Minimalist Reference Style */}
                        <div className="mb-8 md:mb-10 pt-6 border-t border-slate-100">
                            <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Items Ordered</h3>
                            <div className="space-y-6 md:space-y-8 px-1">
                                {orderItems.map((item, index) => {
                                    const displayImage = item.variant?.image || item.product?.thumbnail_image;
                                    const displayName = item.variant?.product?.name || item.product?.name || `Product #${item.product_id}`;
                                    
                                    return (
                                        <div key={item.id || index} className="flex gap-4 group">
                                            {displayImage && (
                                                <div className="relative h-20 w-20 md:h-24 md:w-24 overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                                                    <Image src={displayImage} alt={displayName} fill className="object-cover group-hover:scale-105 transition-transform" />
                                                </div>
                                            )}
                                            <div className="flex-1 flex flex-col md:flex-row md:justify-between py-1">
                                                <div className="space-y-2">
                                                    <p className="text-sm md:text-base font-black text-slate-900 leading-tight">{displayName}</p>
                                                    
                                                    {item.variant?.option_values && item.variant.option_values.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {item.variant.option_values.map(option => (
                                                                <span key={option.id} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                                                                    {option.value}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex items-center gap-3 text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">
                                                        <span>Qty: {item.quantity}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                        <span>Rs.{parseFloat(item.price).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-2 md:mt-0 md:text-right">
                                                    <p className="text-sm md:text-base font-black text-slate-900 whitespace-nowrap">
                                                        Rs.{(parseFloat(item.price) * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Summary Section - Reference Style */}
                        <div className="pt-8 border-t border-slate-100 space-y-4 px-1">
                            <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Pricing Summary</h3>
                            <div className="space-y-3 bg-slate-50/50 rounded-2xl md:rounded-3xl p-5 md:p-6 border border-slate-100">
                                <div className="flex justify-between items-center text-[11px] md:text-sm">
                                    <span className="text-slate-500 font-bold uppercase tracking-wider">Subtotal</span>
                                    <span className="font-black text-slate-900 tracking-tight">Rs. {parseFloat(order.total_amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-slate-200/50 pt-4">
                                    <span className="text-base md:text-lg font-black text-slate-900 uppercase tracking-wider">Total</span>
                                    <span className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter">Rs. {parseFloat(order.total_amount).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
