import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getFeedbackbyInterviewId, getInterviewByID } from '@/lib/actions/general.action';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

const FeedbackPage = async ({params}:RouteParams) => {
    const {id}=await params;
    const user=await getCurrentUser();
    const interview=await getInterviewByID(id);

    if(!interview) redirect("/");

    const feedback= await getFeedbackbyInterviewId({interviewId:id,userId:user?.id!});
    console.log(feedback?.id);
    const formattedDate=dayjs(feedback?.createdAt).format("MMM D, YYYY");
    const finalVerdict=(feedback?.totalScore>50)?((feedback?.totalScore>=75)?"Recommended":"Can be considered"):"Not Recommended";

    return (
        <>
            <div className='flex justify-center px-20 max-sm:px-5'>
                <div className='flex flex-col gap-6'>
                    <h2 className='text-center'>
                        Feedback of the interview - {interview.role} Interview
                    </h2>

                    <div className='flex justify-center'>
                        <div className='flex flex-row gap-6'>
                            <div className='flex gap-2'>
                                <Image src="/star.svg" alt="star" width={22} height={22}/>
                                <p>Overall impression : {feedback?.totalScore}/100</p>
                            </div>
                            <div className='flex gap-2'>
                                <Image src="/calendar.svg" alt="calendar" width={22} height={22}/>
                                <p>{formattedDate} - {feedback?.createdAt.split("T")[1].split(".")[0]}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p>{feedback?.finalAssessment}</p>
                    </div>

                    <h2>
                        Breakdown of Evaluation
                    </h2>

                    {feedback?.categoryScores.map((score,index)=>{
                        return <div key={index} className='flex flex-col gap-2'>
                                    <p className='font-bold text-[18px]'>{index+1}. {score.name} ({score.score}/100)</p>
                                    <p>{score.comment}</p>
                                </div>
                    })}
                    
                    <div className='flex flex-row gap-3 items-center'>
                        <p className='font-bold text-[20px]'>Final Verdict :</p>
                        <p className={`bg-dark-200 rounded-full px-4 py-2 font-bold ${finalVerdict==="Recommended"?"text-green-500":(finalVerdict==="Can be considered"?"text-yellow-500":"text-red-500")}`}>{finalVerdict}</p>
                    </div>

                    <h2>Strengths of the candidate</h2>

                    <div className='flex flex-row gap-2'>
                        <ul>
                        {feedback?.strengths.map(((strength,index)=>{
                           return <li key={index}>{strength}</li> 
                        }))}
                        </ul>
                    </div>

                    <h2>Areas for improvement</h2>

                    <div className='flex flex-row gap-2'>
                        <ul>
                        {feedback?.areasForImprovement.map(((area,index)=>{
                           return <li key={index}>{area}</li> 
                        }))}
                        </ul>
                    </div>

                    <div className='flex flex-row gap-3 max-sm:flex-col max-sm:gap-2'>
                        <Button className='w-1/2 rounded-full text-purple-400 bg-dark-200 max-sm:w-full'><Link href="/">Back to Dashboard</Link></Button>
                        <Button className='w-1/2 rounded-full bg-purple-400 max-sm:w-full'><Link href={`/interview/${feedback?.interviewId}`}>Retake Interview</Link></Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FeedbackPage