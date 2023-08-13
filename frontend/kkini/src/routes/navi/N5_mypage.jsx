import React, { useEffect, useState } from 'react';
import { ProfileUserDetails } from '../../components/mypage/ProfileUserDetails';
import ReqUserPostPart from '../../components/mypage/ReqUserPostPart';
import { useParams } from 'react-router-dom'

function N5_mypage() {
  window.scrollTo(0, 0);
  const { userId = "" } = useParams();
  const [ mine, setMine ] = useState(1);

  useEffect(()=> {
    if ( userId !== "" ) {
    setMine(0);
  }
    console.log('mypage')
  // console.log(mine)

  }, [userId, mine]);
  

  return (
    <div>
      {/* 프로필 */}
      <div className='w-full'>
        <div className=''>        
          <ProfileUserDetails 내것 = {mine} memid={ userId }></ProfileUserDetails>
        </div>
        <div>
          <ReqUserPostPart 내것 = {mine} memid={ userId }></ReqUserPostPart>
        </div>
      </div>
    </div>
  );
}

export default N5_mypage;
