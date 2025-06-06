"use client";

import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';

import Link from 'next/link';

export default function EventCard({name, id}:any) {
    return (
        <Card className="w-80 h-50">
            <Link className='h-full' href={`/eventinfo/${id}`}>
                <CardContent className='h-full text-3xl'>
                    {name}
                </CardContent>
            </Link>
        </Card>
    )
}