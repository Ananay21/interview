import Agent from '@/components/Agent';
import DisplayTechItems from '@/components/DisplayTechItems';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getInterviewByID } from '@/lib/actions/general.action';
import { getRandomInterviewCover } from '@/lib/utils';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'

const InterviewPage = async ({params}:RouteParams) => {
    const {id} = await params;
    const interview=await getInterviewByID(id);

    const user=await getCurrentUser();

    if(!interview) redirect('/');

    return (
        <>
            <div className='flex flex-row gap-4 justify-between'>
                <div className='flex flex-row gap-4 items-center max-sm:flex-col'>
                    <div className='flex flex-row gap-4 items-center'>
                        <Image src={getRandomInterviewCover()} alt="Interview image" width={40} height={40} className='rounded-full object-cover size-[40px]'/>
                        <h3 className='capitalize'>{interview.role}</h3>
                    </div>

                    <DisplayTechItems techStack={interview.techstack}/>

                </div>

                <p className='bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize'>{interview.type}</p>

            </div>

            <Agent userName={user?.name} interviewId={id} type="interview" questions={interview.questions}/>
        </>
    )
}

export default InterviewPage