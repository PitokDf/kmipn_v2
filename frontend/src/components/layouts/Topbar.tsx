'use client';

import { Menu, Bell, User, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ThemeToggle from '../theme-toogle';
import { SidebarTrigger } from '../ui/sidebar';
import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import LogOutButton from '../auth/LogoutButton';

interface TopbarProps {
    onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
    const user = useUser()
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur-sm px-4 lg:px-6 shadow-md">
            <div className="">
                <SidebarTrigger />
            </div>
            {/* Right section */}
            <div className="flex items-center space-x-2 lg:space-x-4">
                {/* Theme toggle */}
                <ThemeToggle />

                {/* User dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center space-x-2 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                                    {user?.name[0].toLocaleUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                                <p className="text-xs text-muted-foreground">{user?.role}</p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-background border border-border shadow-lg">
                        <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-destructive hover:bg-destructive/10 cursor-pointer font-medium">
                            <LogOutButton />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header >
    );
}
