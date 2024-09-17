import React, { HtmlHTMLAttributes } from 'react'
import {LucideIcon} from 'lucide-react'
import { cn } from '@/lib/utils';

export type CardProps={
    label:string,
    icons:LucideIcon,
    amount:string,
    descriptions:string

};
export const DashBoadCard = (props:CardProps) => {
  return (
    <CardContent>
      <section className='flex justify-between gap-2'>
        <p className='text-sm'>{props.label}</p>
        <props.icons className='h-4 w-4 text-gray-400'/>
      </section>
      <section className='flex flex-col gap-1'>
        <h3 className='text-2xl font-semibold'>{props.amount}</h3>
        <p className='text-xs text-gray-500'>{props.descriptions}</p>
      </section>
    </CardContent>
  )
}

export const CardContent = (props:React.HTMLAttributes<HTMLDivElement>) => {
  return <div
  {...props}
  className={cn("flex flex-col gap-3 w-full rounded-xl border p-5 shadow ",props.className)}
  />
}

