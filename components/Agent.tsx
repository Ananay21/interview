import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

enum callStatus{
    INACTIVE="INACTIVE",
    CONNECTING="CONNECTING",
    ACTIVE="ACTIVE",
    FINISHED="FINISHED"
}

const Agent = ({userName}:AgentProps) => {
    const isSpeaking=true;
    const currentCall=callStatus.CONNECTING
    const messages=["What's your name?","My Name is Giovanni Georgio"]

    const lastMessage=messages[messages.length-1]
  return (
    <>
        <div className='call-view'>
            <div className='card-interviewer'>
                <div className='avatar'>
                    <Image src="/ai-avatar.png" alt="vapi" width={65} height={54} className='object-cover'/>
                    {isSpeaking && <span className='animate-speak'></span>}
                </div>
                <h3>AI interviewer</h3>
            </div>

            <div className='card-border'>   
                <div className='card-content'>
                    <Image src="/user-avatar.png" alt="user" width={540} height={540} className='rounded-full object-cover size-[120px]'/>
                    <h3>{userName}</h3>
                </div>
            </div>
        </div>

        {messages.length>0 && 
            <div className='transcript-border'>
                <div className='transcript'>
                    <p key={lastMessage} className={cn("transition-opacity duration-500 opacity-0","animate-fadeIn opacity-100")}>
                        {lastMessage}
                    </p>
                </div>
            </div>
        }

        <div className='w-full flex justify-center'>
            {(currentCall!=='ACTIVE')?<Button className=' flex px-7 py-3 font-bold text-sm leading-5 text-white transition-colors duration-150 bg-success-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-success-200 hover:bg-success-200 min-w-28 cursor-pointer items-center justify-center overflow-visible'>
                    <span className={cn('absolute animate-ping rounded-full opacity-75',callStatus!=="CONNECTING" & "hidden")}/>
                    <span>
                        {(currentCall==="INACTIVE"||currentCall==="FINISHED")?"Call":"..."}
                    </span>
                </Button>:
                <Button className='flex items-center px-7 py-3 text-sm font-bold leading-5 text-white transition-colors duration-150 bg-destructive-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-destructive-200 hover:bg-destructive-200 min-w-28'>
                    End
                </Button>}
        </div>
    </>
  )
}

export default Agent