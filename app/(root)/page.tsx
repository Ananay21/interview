import InterviewCard from '@/components/InterviewCard';
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const dummyInterviewCards=[
  {
    interviewId:"1",
    userId:"1",
    role:"React developer",
    techstack:["React","React-native","JavaScript"],
    type:"Mixed",
    createdAt:Date.now().toString(),
  }
  ,
  {
    interviewId:"2",
    userId:"2",
    role:"Backend Developer",
    techstack:["Express","MongoDB","JavaScript"],
    type:"Technical",
    createdAt:Date.now().toString()
  }
  ];

const page = () => {
  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get interview ready with AI-powered Practice and Feedback</h2>
          <p className='text-lg'>
            Practice on real interview questions and get instant feedback
          </p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href="/interview">Start an interview</Link>
          </Button>
        </div>
        <Image src="/robot.png" alt="robot" width={400} height={400} className='max-sm:hidden'/>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>
          Your Past interviews
        </h2>
        <div className='interviews-section'>
          {dummyInterviewCards.map((interview)=>(
            <InterviewCard {...interview} key={interview.interviewId}/>
          ))}
          {/* <p>You haven&apos;t taken any interviews yet</p> */}
        </div>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an interview</h2>
        <div className='interviews-section'>
          {dummyInterviewCards.map((interview)=>(
              <InterviewCard {...interview} key={interview.interviewId}/>
            ))}

          {/* <p>There are no interviews available</p> */}
        </div>
      </section>
    </>
  )
}

export default page