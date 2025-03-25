import Agent from '@/components/Agent'
import React from 'react'

const InterviewPage = () => {
  return (
    <>
        <h3>Interview Generation</h3>
        <Agent userName="You" userID={1} type="generate"/>
    </>
  )
}

export default InterviewPage