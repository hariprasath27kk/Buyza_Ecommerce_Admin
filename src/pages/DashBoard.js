import React from 'react'

const DashBoard = ({profile}) => {
  return (
    <div className=' d-flex justify-content-start p-5'>
      {profile &&
       <h1>Wellcome back , {profile.username} </h1>
       }
        
        
    </div>
  )
}

export default DashBoard