"use client";

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/general.action';

enum callStatus{
    INACTIVE="INACTIVE",
    CONNECTING="CONNECTING",
    ACTIVE="ACTIVE",
    FINISHED="FINISHED"
}

interface SavedMessage{
    role:'user'|'system'|'assistant';
    content:string;
}

const Agent = ({userName,userId,interviewId,questions,type}:AgentProps) => {
    console.log(userId);
    const router=useRouter();
    const [isSpeaking,setIsSpeaking]=useState(false);
    const [currentCallStatus, setCurrentCallStatus] = useState<callStatus>(callStatus.INACTIVE);
    const [messages,SetMessages]=useState<SavedMessage[]>([]);

    useEffect(()=>{
        const onCallStart=()=>setCurrentCallStatus(callStatus.ACTIVE);
        const onCallEnd=()=>setCurrentCallStatus(callStatus.FINISHED);

        const onMessage=(message:Message)=>{
            if(message.type==='transcript' && message.transcriptType==='final'){
                const newMessage={role:message.role,content:message.transcript};
                SetMessages((prev)=>[...prev,newMessage]);
            }
        }

        const onSpeechStart=()=>setIsSpeaking(true);
        const onSpeechEnd=()=>setIsSpeaking(false);

        const onError=(error:Error)=>console.log('error',error);

        vapi.on('call-start',onCallStart);
        vapi.on('call-end',onCallEnd);
        vapi.on('message',onMessage);
        vapi.on('speech-start',onSpeechStart);
        vapi.on('speech-end',onSpeechEnd);
        vapi.on('error',onError);

        return ()=>{
            vapi.off('call-start',onCallStart);
            vapi.off('call-end',onCallEnd);
            vapi.off('message',onMessage);
            vapi.off('speech-start',onSpeechStart);
            vapi.off('speech-end',onSpeechEnd);
            vapi.off('error',onError);
        }
    },[]);

    const handleGenerateFeedback=async (messages:SavedMessage[])=>{
        console.log("generate feedback");
        const {success,feedbackId}=await createFeedback({interviewId:interviewId!,userId:userId!,transcript:messages});
        
        if(success && feedbackId){
            router.push(`/interview/${feedbackId}/feedback`);
        }
        else{
            console.log(`Error saving feedback`);
            router.push("/");
        }
    }

    useEffect(()=>{
        if(currentCallStatus===callStatus.FINISHED){
            if(type==="generate"){
                router.push("/");
            }
            else{
                handleGenerateFeedback(messages);
            }
        }
    },[messages,currentCallStatus,,type,userId]);

    const handleCall=async()=>{
        setCurrentCallStatus(callStatus.CONNECTING);

        if(type==="generate"){
            await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,{
                variableValues:{
                    username:userName,
                    userid:userId
                },
            })
        }
        else{
            let formattedQuestions="";
            if(questions){
                formattedQuestions=questions.map((question)=>`- ${question}`).join("/n");
            }

            await vapi.start(interviewer,{variableValues:{questions:formattedQuestions}})
        }
        
    };

    const handleDisconnect=async()=>{
        setCurrentCallStatus(callStatus.FINISHED);
        vapi.stop();
    };

    const lastMessage=messages[messages.length-1]?.content;

    const isCallInactiveOrFinished=((currentCallStatus===callStatus.INACTIVE)||(currentCallStatus===callStatus.FINISHED));
    

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
            {(currentCallStatus!=='ACTIVE')?<Button className=' flex px-7 py-3 font-bold text-sm leading-5 text-white transition-colors duration-150 bg-success-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-success-200 hover:bg-success-200 min-w-28 cursor-pointer items-center justify-center overflow-visible' onClick={handleCall}>
                    <span className={cn('absolute animate-ping rounded-full opacity-75',currentCallStatus!=="CONNECTING" && "hidden")}/>
                    <span>
                        {isCallInactiveOrFinished?"Call":"..."}
                    </span>
                </Button>:
                <Button className='flex items-center px-7 py-3 text-sm font-bold leading-5 text-white transition-colors duration-150 bg-destructive-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-destructive-200 hover:bg-destructive-200 min-w-28' onClick={handleDisconnect}>
                    End
                </Button>}
        </div>
    </>
  )
}

export default Agent