import React, { forwardRef, useState } from 'react';
import styled from 'styled-components';
import { Avatar } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbDownOffAltRoundedIcon from '@mui/icons-material/ThumbDownOffAltRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import LocalAtmRoundedIcon from '@mui/icons-material/LocalAtmRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Drawer from './Drawer';
// import ImageSlider from './ImageSlider.jsx';  // 여기서 'path_to_imageslider.jsx'는 실제 ImageSlider 컴포넌트가 있는 경로로 대체해야 합니다.


const Post = forwardRef(({ user, index, postImage, createDateTime, likeCnt: initialLikeCnt, contents, disLikeCnt: initialdisLikeCnt, commentcnt, avgPrice, recipeName }, ref) => {
    const [show, setShow] = useState(false);
    const [amount, setAmount] = useState('');
    const [amounts, setAmounts] = useState([]);
    const [averageAmount, setAverageAmount] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [reaction, setReaction] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likeCnt, setLikeCnt] = useState(initialLikeCnt); 
    const [disLikeCnt, setdisLikeCnt] = useState(initialdisLikeCnt);

    const handleIconClick = (type) => {
        // 좋아요 아이콘을 위한 로직
        if (type === 'like') {
            if (reaction === true) {
                // 이미 좋아요가 눌러져 있을 때 좋아요 아이콘을 다시 누르면 좋아요 개수 -1
                setLikeCnt(prevLikeCnt => prevLikeCnt - 1);
                setReaction(null);
            } else {
                // 좋아요가 안 눌러져 있을 때 좋아요 아이콘을 누르면 좋아요 개수 +1
                // 만약 이전에 싫어요가 눌러져 있었다면 싫어요 개수 -1
                setLikeCnt(prevLikeCnt => prevLikeCnt + 1);
                if (reaction === false) {
                    setdisLikeCnt(prevDislikeCnt => prevDislikeCnt - 1);
                }
                setReaction(true);
            }
        }
        // 싫어요 아이콘을 위한 로직
        else if (type === 'dislike') {
            if (reaction === false) {
                // 이미 싫어요가 눌러져 있을 때 싫어요 아이콘을 다시 누르면 싫어요 개수 -1
                setdisLikeCnt(prevDislikeCnt => prevDislikeCnt - 1);
                setReaction(null);
            } else {
                // 싫어요가 안 눌러져 있을 때 싫어요 아이콘을 누르면 싫어요 개수 +1
                // 만약 이전에 좋아요가 눌러져 있었다면 좋아요 개수 -1
                setdisLikeCnt(prevDislikeCnt => prevDislikeCnt + 1);
                if (reaction === true) {
                    setLikeCnt(prevLikeCnt => prevLikeCnt - 1);
                }
                setReaction(false);
            }
        }
    }
    



    const handleClose = () => {
        setShow(false);
        setAmount('');
    };

    const handleShow = () => setShow(true);

    const handleSave = () => {
        const newAmounts = [...amounts, parseFloat(amount)];
        setAmounts(newAmounts);

        const totalAmount = newAmounts.reduce((a, b) => a + b, 0);
        const avgAmount = (totalAmount / newAmounts.length).toFixed(0);
        setAverageAmount(avgAmount);

        handleClose();
    };

    return (
        <PostContainer ref={ref}>
            <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
            <PostHeader>
                <PostHeaderAuthor>
                    <Avatar className='m-2'/>
                    <div className="userInfo">
            <div>{user}</div>
            <span>{createDateTime}</span>
          </div>
                </PostHeaderAuthor>
            </PostHeader>
            <Contentstext>{contents}<b> #{recipeName}</b></Contentstext>
            <PostImage>
                <img src={postImage} alt="" />
            </PostImage>
            {/* <PostImage>
    <ImageSlider images={Array.isArray(postImage) ? postImage : [postImage]} />
</PostImage> */}

            <PostFooterIcons>
                <div className='post__iconsMain'>
                    <PostIcon>
                    <FavoriteBorderIcon 
    style={{ color: reaction === true ? 'red' : 'gray' }}
    onClick={() => handleIconClick('like')}
/>
                    </PostIcon>
                    <PostIcon>
                    <ThumbDownOffAltRoundedIcon 
    style={{ color: reaction === false ? 'blue' : 'gray' }}
    onClick={() => handleIconClick('dislike')}
/>
                    </PostIcon>
                    <PostIcon>
                        <ChatBubbleOutlineRoundedIcon onClick={() => setIsDrawerOpen(true)} />
                    </PostIcon>
                    <div><CountText><b>{likeCnt}</b>좋아요  <b>{disLikeCnt}</b>싫어요  <b>{commentcnt}</b>개의 댓글</CountText></div>
                </div>
                <div className='post__iconSave'>
                    <PostIcon onClick={handleShow}>
                        <LocalAtmRoundedIcon />
                        <div><CountText>{avgPrice}</CountText></div>
                    </PostIcon>
                    <PostIcon>
                        {isBookmarked ? 
                            <BookmarkIcon onClick={() => setIsBookmarked(false)} /> 
                            : 
                            <BookmarkBorderRoundedIcon onClick={() => setIsBookmarked(true)} />
                        }
                    </PostIcon>
                </div>
            </PostFooterIcons>

            {averageAmount && <div>평가된 금액의 평균: {averageAmount}원</div>}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton style={{ textAlign: 'center' }}>
                    <Modal.Title>금액 평가창</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: 'center' }}>
                    이 음식이 얼마처럼 보이나요???
                    <img src={postImage} alt="" style={{ maxWidth: '100%', borderRadius: '6px' }} />
                    <div>
                        <input
                            type="number"
                            value={amount}
                            placeholder="금액을 입력하세요"
                            onChange={(e) => setAmount(e.target.value)}
                            style={{ textAlign: 'center', width: '100%', padding: '10px', margin: '10px 0' }}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>닫기</Button>
                    <Button variant="primary" onClick={handleSave}>금액 평가 완료</Button>
                </Modal.Footer>
            </Modal>
        </PostContainer>
    );
});

export default Post;

const PostContainer = styled.div`
  // width: 550px;
  margin: 0px 40px 50px 40px;
`;

const PostHeader = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
`;

const PostHeaderAuthor = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: bolder;

  > .userInfo {
    margin-left: 5px;
    
    > div {
      color: black;
      font-size: 13px;
      margin: 0;
    }

    > span {
      color: gray;
      font-size: 10px;
      margin: 0;
    }
  }
`;


const PostImage = styled.div`
  img {
    width: 95%;
    border-radius: 6px;
    border: 0.6px solid rgba(128, 128, 128, 0.516);
    margin: 0 auto;
  }
`;

const PostFooterIcons = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const PostIcon = styled.div`
  display: inline-block; 
  padding: 7px;
  font-size: 30px;
  margin: 0px 10px auto;

    &:hover {
        cursor: pointer;
    }
`;


const CountText = styled.span`
    display: flex;
    font-size: 10px; // 원하는 크기로 조절하세요.
    
`;

const Contentstext = styled.span`
    display: flex;
    font-size: 15px; 
    
`;

const Recipetext = styled.span`
    display: flex;
    font-size: 15px; 
    color: #4545b1
`;

